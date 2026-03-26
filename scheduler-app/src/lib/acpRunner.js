const fs = require("fs");
const path = require("path");
const { spawn, spawnSync } = require("child_process");
const { resolveMcpServersForAcp } = require("./mcpServersFromCursor");

function resolveAgentCommand() {
  const fromEnv = process.env.CURSOR_AGENT_PATH || process.env.AGENT_BIN;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;

  const pathLookup = spawnSync("which", ["agent"], { encoding: "utf8" });
  if (pathLookup.status === 0) {
    const resolved = (pathLookup.stdout || "").trim();
    if (resolved) return resolved;
  }

  const candidates = [
    "/opt/homebrew/bin/agent",
    "/usr/local/bin/agent",
    path.join(process.env.HOME || "", ".local", "bin", "agent"),
  ];
  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) return candidate;
  }
  return "agent";
}

/**
 * Parses `agent models` stdout ("id - Label" lines). Used when ACP session/new
 * omits model configOptions (common) but the CLI still knows the account's models.
 */
function parseAgentModelsStdout(stdout) {
  const options = [];
  let defaultValue = null;
  if (!stdout || typeof stdout !== "string") return { options, defaultValue };

  for (const line of stdout.split("\n")) {
    const trimmed = line.trim();
    if (
      !trimmed ||
      trimmed === "Available models" ||
      trimmed.startsWith("Tip:")
    ) {
      continue;
    }
    const m = trimmed.match(/^(.+?)\s+-\s+(.+)$/);
    if (!m) continue;
    const value = m[1].trim();
    let name = m[2].trim();
    if (/\(current,\s*default\)/i.test(name)) {
      defaultValue = value;
      name = name.replace(/\s*\(current,\s*default\)\s*$/i, "").trim();
    }
    options.push({ value, name, description: undefined });
  }
  return { options, defaultValue };
}

function fetchModelsFromAgentCli() {
  const agentCommand = resolveAgentCommand();
  try {
    const result = spawnSync(agentCommand, ["models"], {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
      timeout: 25_000,
    });
    if (result.error) return { options: [], defaultValue: null };
    if (result.status !== 0) return { options: [], defaultValue: null };
    return parseAgentModelsStdout(result.stdout || "");
  } catch (_err) {
    return { options: [], defaultValue: null };
  }
}

class AcpRunner {
  constructor({ workingDirectory, onStream }) {
    this.workingDirectory = workingDirectory;
    this.onStream = onStream || (() => {});
  }

  async execute({ job, command }) {
    const permissionMode = job.permissionMode || "allow-always";
    const agentCommand = resolveAgentCommand();
    const cwd = path.resolve(this.workingDirectory || ".");
    const mcpServers = resolveMcpServersForAcp(cwd);
    const acp = spawn(agentCommand, ["acp"], {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let nextId = 1;
    let stdoutBuffer = "";
    const pending = new Map();
    const chunks = [];
    const stderrLines = [];
    let permissionRequests = 0;
    let childProcessError = null;

    const emit = (type, payload) => {
      this.onStream({
        type,
        payload: {
          jobId: job.id,
          ...payload,
        },
      });
    };

    const sendRaw = (message) => {
      acp.stdin.write(`${JSON.stringify(message)}\n`);
    };

    const send = (method, params) => {
      const id = nextId;
      nextId += 1;
      sendRaw({ jsonrpc: "2.0", id, method, params });
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
      });
    };

    const resolvePending = (message) => {
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message || "ACP error"));
      else request.resolve(message.result);
    };

    const buildPrompt = () => {
      return [
        `Execute the PM OS command template below.`,
        `Command: ${command.commandName}`,
        `User input/context:`,
        job.userInput || "(none)",
        "",
        "Template:",
        command.template,
      ].join("\n");
    };

    const permissionOption = () => {
      if (permissionMode === "allow-once") return "allow-once";
      if (permissionMode === "reject-once") return "reject-once";
      return "allow-always";
    };

    const handleNotification = (message) => {
      if (message.method === "session/update") {
        const update = message.params?.update;
        if (update?.sessionUpdate === "agent_message_chunk" && update.content?.text) {
          chunks.push(update.content.text);
          emit("stream", { text: update.content.text });
        }
      }
    };

    const handlePermissionRequest = (message) => {
      permissionRequests += 1;
      const optionId = permissionOption();
      emit("permission", { optionId });
      sendRaw({
        jsonrpc: "2.0",
        id: message.id,
        result: { outcome: { outcome: "selected", optionId } },
      });
    };

    const handleLine = (line) => {
      if (!line.trim()) return;
      let message;
      try {
        message = JSON.parse(line);
      } catch (_err) {
        emit("acp-parse-warning", { line });
        return;
      }

      if (message.id && (Object.prototype.hasOwnProperty.call(message, "result") || Object.prototype.hasOwnProperty.call(message, "error"))) {
        resolvePending(message);
        return;
      }

      if (message.method === "session/request_permission") {
        handlePermissionRequest(message);
        return;
      }

      handleNotification(message);
    };

    acp.stdout.on("data", (chunk) => {
      stdoutBuffer += chunk.toString("utf8");
      const lines = stdoutBuffer.split("\n");
      stdoutBuffer = lines.pop() || "";
      for (const line of lines) handleLine(line);
    });

    acp.stderr.on("data", (chunk) => {
      const text = chunk.toString("utf8");
      stderrLines.push(text);
      emit("stderr", { text });
    });

    acp.on("error", (err) => {
      childProcessError = err;
      emit("runner-error", {
        message: err.message,
        code: err.code || "UNKNOWN",
        attemptedCommand: agentCommand,
      });
      for (const pendingRequest of pending.values()) {
        pendingRequest.reject(err);
      }
      pending.clear();
    });

    const runSession = async () => {
      await send("initialize", {
        protocolVersion: 1,
        clientCapabilities: {
          fs: { readTextFile: false, writeTextFile: false },
          terminal: false,
        },
        clientInfo: { name: "ccpm-scheduler-app", version: "0.1.0" },
      });

      await send("authenticate", { methodId: "cursor_login" });
      const sessionNewResult = await send("session/new", {
        cwd,
        mcpServers,
      });
      const { sessionId } = sessionNewResult;

      const modelValue = (job.model && String(job.model).trim()) || "";
      if (modelValue) {
        let modelConfigId = "model";
        if (Array.isArray(sessionNewResult?.configOptions)) {
          const modelOpt = sessionNewResult.configOptions.find(
            (o) => o && (o.id === "model" || o.category === "model")
          );
          if (modelOpt?.id) modelConfigId = modelOpt.id;
        }
        await send("session/set_config_option", {
          sessionId,
          configId: modelConfigId,
          value: modelValue,
        });
      }

      const promptResult = await send("session/prompt", {
        sessionId,
        prompt: [{ type: "text", text: buildPrompt() }],
      });

      return {
        stopReason: promptResult.stopReason || "unknown",
        output: chunks.join(""),
        permissionRequests,
      };
    };

    const result = await runSession().catch((err) => {
      const partial = chunks.join("");
      if (partial) {
        err.partialOutput = partial;
      }
      if (childProcessError && childProcessError.code === "ENOENT") {
        const e = new Error(
          `Cursor agent CLI was not found. Install/login the Cursor agent CLI and ensure it is on PATH, or set CURSOR_AGENT_PATH to the agent binary. Attempted command: ${agentCommand}`
        );
        if (partial) e.partialOutput = partial;
        throw e;
      }
      throw err;
    }).finally(() => {
      try {
        acp.stdin.end();
      } catch (_err) {}
      acp.kill();
    });

    if (stderrLines.length && !result.output) {
      throw new Error(stderrLines.join("\n"));
    }

    return result;
  }

  /**
   * Opens a short-lived ACP session to read model options from session/new (configOptions).
   */
  async fetchModelOptions() {
    const agentCommand = resolveAgentCommand();
    const cwd = path.resolve(this.workingDirectory || ".");
    const mcpServers = resolveMcpServersForAcp(cwd);
    const acp = spawn(agentCommand, ["acp"], {
      cwd,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let nextId = 1;
    let stdoutBuffer = "";
    const pending = new Map();

    const sendRaw = (message) => {
      acp.stdin.write(`${JSON.stringify(message)}\n`);
    };

    const send = (method, params) => {
      const id = nextId;
      nextId += 1;
      sendRaw({ jsonrpc: "2.0", id, method, params });
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
      });
    };

    const resolvePending = (message) => {
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message || "ACP error"));
      else request.resolve(message.result);
    };

    const handleLine = (line) => {
      if (!line.trim()) return;
      let message;
      try {
        message = JSON.parse(line);
      } catch (_err) {
        return;
      }

      if (
        message.id &&
        (Object.prototype.hasOwnProperty.call(message, "result") ||
          Object.prototype.hasOwnProperty.call(message, "error"))
      ) {
        resolvePending(message);
        return;
      }

      if (message.method === "session/request_permission") {
        sendRaw({
          jsonrpc: "2.0",
          id: message.id,
          result: { outcome: { outcome: "selected", optionId: "allow-always" } },
        });
      }
    };

    acp.stdout.on("data", (chunk) => {
      stdoutBuffer += chunk.toString("utf8");
      const lines = stdoutBuffer.split("\n");
      stdoutBuffer = lines.pop() || "";
      for (const line of lines) handleLine(line);
    });

    acp.on("error", (err) => {
      for (const pendingRequest of pending.values()) {
        pendingRequest.reject(err);
      }
      pending.clear();
    });

    try {
      await send("initialize", {
        protocolVersion: 1,
        clientCapabilities: {
          fs: { readTextFile: false, writeTextFile: false },
          terminal: false,
        },
        clientInfo: { name: "ccpm-scheduler-app", version: "0.1.0" },
      });

      await send("authenticate", { methodId: "cursor_login" });
      const sessionNewResult = await send("session/new", {
        cwd,
        mcpServers,
      });

      let modelOption = null;
      if (Array.isArray(sessionNewResult?.configOptions)) {
        modelOption = sessionNewResult.configOptions.find(
          (o) => o && (o.id === "model" || o.category === "model")
        );
      }

      let options = (modelOption?.options || []).map((o) => ({
        value: o.value,
        name: o.name || o.value,
        description: o.description,
      }));
      let defaultValue = modelOption?.currentValue ?? null;
      let usedCliFallback = false;

      if (options.length === 0) {
        const cli = fetchModelsFromAgentCli();
        if (cli.options.length > 0) {
          options = cli.options;
          defaultValue = defaultValue || cli.defaultValue;
          usedCliFallback = true;
        }
      }

      return {
        ok: true,
        defaultValue,
        options,
        usedCliFallback,
      };
    } catch (err) {
      const cli = fetchModelsFromAgentCli();
      if (cli.options.length > 0) {
        return {
          ok: true,
          defaultValue: cli.defaultValue,
          options: cli.options,
          usedCliFallback: true,
        };
      }
      if (err && err.code === "ENOENT") {
        return {
          ok: false,
          error: `Cursor agent CLI was not found. Set CURSOR_AGENT_PATH or install the agent on PATH. Attempted: ${agentCommand}`,
        };
      }
      return { ok: false, error: err.message || String(err) };
    } finally {
      try {
        acp.stdin.end();
      } catch (_err) {}
      acp.kill();
    }
  }
}

module.exports = {
  AcpRunner,
};
