const path = require("path");
const fs = require("fs");
const { app, BrowserWindow, ipcMain, dialog, shell, powerSaveBlocker, net } = require("electron");
const { loadCommandCatalog } = require("./lib/commandCatalog");
const { SchedulerStore } = require("./lib/schedulerStore");
const { AcpRunner } = require("./lib/acpRunner");
const { SchedulerEngine } = require("./lib/schedulerEngine");
const { normalizeRecurrence, isRecurring, initialScheduledAt } = require("./lib/recurrence");
const { sendWebexDirectMessage, formatRunMarkdown } = require("./lib/webexNotify");

let mainWindow = null;
let schedulerStore = null;
let schedulerEngine = null;
let commandCatalog = [];
let commandSource = {
  commandsRoot: "",
  sourceType: "unknown",
};

/** Stream chunks for Webex jobs (renderer also gets streams; this copy is for the DM body). */
const webexStreamBuffers = new Map();

function pickLongestText(...parts) {
  let best = "";
  for (const p of parts) {
    const s = p == null ? "" : String(p);
    if (s.length > best.length) best = s;
  }
  return best;
}

/** @type {number | null} */
let powerSaveBlockerId = null;

function applyPreventSleepPreference(enabled) {
  if (enabled) {
    if (powerSaveBlockerId == null) {
      powerSaveBlockerId = powerSaveBlocker.start("prevent-app-suspension");
    }
  } else if (powerSaveBlockerId != null) {
    powerSaveBlocker.stop(powerSaveBlockerId);
    powerSaveBlockerId = null;
  }
}

function getConfigPath() {
  return path.join(app.getPath("userData"), "scheduler-config.json");
}

function readConfig() {
  const configPath = getConfigPath();
  if (!fs.existsSync(configPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (_err) {
    return {};
  }
}

function writeConfig(config) {
  const configPath = getConfigPath();
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
}

function resolveCommandsRoot() {
  const config = readConfig();
  if (config.commandsRoot && fs.existsSync(config.commandsRoot)) {
    return { commandsRoot: config.commandsRoot, sourceType: "custom" };
  }

  if (app.isPackaged) {
    return {
      commandsRoot: path.join(process.resourcesPath, "commands"),
      sourceType: "bundled",
    };
  }

  return {
    commandsRoot: path.resolve(__dirname, "..", "..", "commands"),
    sourceType: "workspace",
  };
}

function updateCommandSource(commandsRoot, sourceType) {
  commandCatalog = loadCommandCatalog(commandsRoot);
  commandSource = {
    commandsRoot,
    sourceType,
  };
  if (schedulerEngine) {
    schedulerEngine.commandCatalog = commandCatalog;
    schedulerEngine.rebuild();
  }
  forwardSchedulerEvent({
    type: "commands-reloaded",
    payload: {
      count: commandCatalog.length,
      commandsRoot,
      sourceType,
    },
  });
}

function computeRunnerCwd() {
  const commandsRoot = commandSource.commandsRoot || "";
  if (!commandsRoot) return path.resolve(__dirname, "..", "..");
  if (path.basename(commandsRoot) === "commands") return path.dirname(commandsRoot);
  return commandsRoot;
}

function sendToRenderer(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
}

function webexFetch(url, init) {
  if (typeof net.fetch === "function") {
    return net.fetch(url, init);
  }
  return globalThis.fetch(url, init);
}

function showWebexAlert(title, message, detail) {
  const focused = BrowserWindow.getFocusedWindow();
  const win =
    focused && !focused.isDestroyed()
      ? focused
      : mainWindow && !mainWindow.isDestroyed()
        ? mainWindow
        : null;
  if (!win) return;
  dialog
    .showMessageBox(win, {
      type: "warning",
      title,
      message,
      detail: detail || "",
      buttons: ["OK"],
    })
    .catch(() => {});
}

async function maybeNotifyWebexAfterRun(event) {
  if (event.type !== "run-completed" && event.type !== "run-failed") return;
  if (!schedulerStore) return;
  const jobId = event.payload.jobId;
  const job = schedulerStore.getJobById(jobId);
  const dest = job?.outputDestination || "scheduler";
  if (dest !== "webex") return;

  const cfg = readConfig();
  const token = cfg.webexAccessToken && String(cfg.webexAccessToken).trim();
  const email = cfg.webexRecipientEmail && String(cfg.webexRecipientEmail).trim();
  const roomId = cfg.webexRoomId && String(cfg.webexRoomId).trim();
  if (!token) {
    sendToRenderer("scheduler:event", {
      type: "webex-notify-skipped",
      payload: { jobId, reason: "missing-token" },
    });
    showWebexAlert(
      "Webex not configured",
      "No Webex access token is saved.",
      "Open Settings, paste your token, and save. Bot tokens usually need a Room ID (add the bot to a space and paste that room ID)."
    );
    return;
  }
  if (!email && !roomId) {
    sendToRenderer("scheduler:event", {
      type: "webex-notify-skipped",
      payload: { jobId, reason: "missing-destination" },
    });
    showWebexAlert(
      "Webex destination missing",
      "Add a recipient email or a room ID in Settings.",
      "Bots often cannot DM by email until the user messages the bot first. Creating a Webex space with you + the bot, then pasting the space’s Room ID here is the most reliable option."
    );
    return;
  }

  const run = schedulerStore.getLatestRunForJob(jobId);
  if (!run) return;

  const buffered = webexStreamBuffers.get(jobId) || "";
  webexStreamBuffers.delete(jobId);

  const fromResult =
    event.type === "run-completed" && event.payload?.result
      ? String(event.payload.result.output ?? "")
      : "";
  const fromFailedEvent =
    event.type === "run-failed" ? String(event.payload?.partialOutput ?? "") : "";

  const fromRun = run.output != null ? String(run.output) : "";
  const mergedOutput = pickLongestText(fromRun, buffered, fromResult, fromFailedEvent);
  const runForWebex = { ...run, output: mergedOutput };

  try {
    const markdown = formatRunMarkdown(job, runForWebex);
    await sendWebexDirectMessage({
      accessToken: token,
      roomId: roomId || undefined,
      toPersonEmail: roomId ? undefined : email,
      markdown,
      fetchImpl: webexFetch,
    });
    console.log(`[scheduler] Webex: sent run summary for job ${jobId} (${mergedOutput.length} chars output)`);
  } catch (err) {
    const msg = err.message || String(err);
    console.error(`[scheduler] Webex: send failed for job ${jobId}:`, msg);
    showWebexAlert("Webex delivery failed", "The run finished in the app, but Webex rejected the message.", msg);
    sendToRenderer("scheduler:event", {
      type: "webex-notify-failed",
      payload: { jobId, message: msg },
    });
  }
}

function forwardSchedulerEvent(event) {
  if (event.type === "run-started" && event.payload?.jobId) {
    webexStreamBuffers.delete(event.payload.jobId);
  }

  if (event.type === "stream" && event.payload?.jobId != null && event.payload.text != null) {
    const jid = event.payload.jobId;
    const job = schedulerStore?.getJobById(jid);
    if (job && (job.outputDestination || "scheduler") === "webex") {
      const prev = webexStreamBuffers.get(jid) || "";
      webexStreamBuffers.set(jid, prev + String(event.payload.text));
    }
  }

  maybeNotifyWebexAfterRun(event).catch((err) => {
    console.error("[scheduler] Webex notify error:", err.message || err);
  });
  sendToRenderer("scheduler:event", event);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
}

async function bootstrapServices() {
  const resolved = resolveCommandsRoot();
  updateCommandSource(resolved.commandsRoot, resolved.sourceType);

  schedulerStore = new SchedulerStore(app.getPath("userData"));
  schedulerStore.load();

  const runner = new AcpRunner({
    workingDirectory: computeRunnerCwd(),
    onStream: (event) => forwardSchedulerEvent(event),
  });

  schedulerEngine = new SchedulerEngine({
    store: schedulerStore,
    runner,
    commandCatalog,
    onEvent: (event) => forwardSchedulerEvent(event),
  });
  schedulerEngine.start();
}

function registerIpcHandlers() {
  ipcMain.handle("scheduler:getCommands", async () => commandCatalog);
  ipcMain.handle("scheduler:getConfig", async () => {
    const cfg = readConfig();
    return {
      ...commandSource,
      commandCount: commandCatalog.length,
      preventSystemSleep: !!cfg.preventSystemSleep,
      webexRecipientEmail: cfg.webexRecipientEmail || "",
      webexRoomId: cfg.webexRoomId || "",
      webexTokenConfigured: Boolean(cfg.webexAccessToken && String(cfg.webexAccessToken).trim()),
    };
  });

  ipcMain.handle("scheduler:setPreventSystemSleep", async (_event, { enabled }) => {
    const next = Boolean(enabled);
    writeConfig({ ...readConfig(), preventSystemSleep: next });
    applyPreventSleepPreference(next);
    return { ok: true, preventSystemSleep: next };
  });

  ipcMain.handle("scheduler:saveSettings", async (_event, payload = {}) => {
    try {
      const cur = readConfig();
      const next = { ...cur };
      if (payload.webexRecipientEmail !== undefined) {
        next.webexRecipientEmail = String(payload.webexRecipientEmail || "").trim();
      }
      if (payload.webexRoomId !== undefined) {
        next.webexRoomId = String(payload.webexRoomId || "").trim();
      }
      if (payload.webexAccessToken !== undefined) {
        const t = String(payload.webexAccessToken || "").trim();
        if (t !== "") next.webexAccessToken = t;
      }
      writeConfig(next);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || String(err) };
    }
  });

  ipcMain.handle("scheduler:testWebex", async () => {
    const cfg = readConfig();
    const token = cfg.webexAccessToken && String(cfg.webexAccessToken).trim();
    const email = cfg.webexRecipientEmail && String(cfg.webexRecipientEmail).trim();
    const roomId = cfg.webexRoomId && String(cfg.webexRoomId).trim();
    if (!token) return { ok: false, error: "Save an access token in Settings first." };
    if (!email && !roomId) {
      return { ok: false, error: "Add a room ID and/or recipient email in Settings." };
    }
    try {
      await sendWebexDirectMessage({
        accessToken: token,
        roomId: roomId || undefined,
        toPersonEmail: roomId ? undefined : email,
        markdown:
          "**CCPM Scheduler — connection test**\n\nIf you see this message, Webex delivery from the scheduler is working.",
        fetchImpl: webexFetch,
      });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || String(err) };
    }
  });

  ipcMain.handle("scheduler:getState", async () => ({
    jobs: schedulerStore.getJobs(),
    runs: schedulerStore.getRuns(),
  }));

  ipcMain.handle("scheduler:createJob", async (_event, payload) => {
    const job = schedulerStore.createJob(payload);
    schedulerEngine.rebuild();
    forwardSchedulerEvent({ type: "job-created", payload: job });
    return job;
  });

  ipcMain.handle("scheduler:updateJob", async (_event, payload) => {
    const job = schedulerStore.updateJob(payload.id, payload.updates);
    schedulerEngine.rebuild();
    forwardSchedulerEvent({ type: "job-updated", payload: job });
    return job;
  });

  ipcMain.handle("scheduler:deleteJob", async (_event, jobId) => {
    schedulerStore.deleteJob(jobId);
    schedulerEngine.rebuild();
    forwardSchedulerEvent({ type: "job-deleted", payload: { jobId } });
    return { ok: true };
  });

  ipcMain.handle("scheduler:runNow", async (_event, jobId) => {
    return schedulerEngine.runNow(jobId);
  });

  ipcMain.handle("scheduler:getModelOptions", async () => {
    if (!schedulerEngine?.runner) {
      return { ok: false, error: "Scheduler not ready" };
    }
    return schedulerEngine.runner.fetchModelOptions();
  });

  ipcMain.handle("scheduler:previewSchedule", async (_event, recurrencePayload) => {
    try {
      const r = normalizeRecurrence(recurrencePayload);
      if (!isRecurring(r)) {
        return { ok: false, error: "Select a recurring frequency" };
      }
      const dt = initialScheduledAt(r, new Date());
      return { ok: true, scheduledAt: dt.toISOString() };
    } catch (err) {
      return { ok: false, error: err.message || String(err) };
    }
  });

  ipcMain.handle("scheduler:openCommandsFolder", async () => {
    const root = commandSource.commandsRoot;
    if (!root || root === "") {
      return { ok: false, error: "No commands folder is set.", path: "" };
    }
    if (!fs.existsSync(root)) {
      return { ok: false, error: "Folder no longer exists on disk.", path: root };
    }
    const errMsg = await shell.openPath(root);
    if (errMsg) {
      return { ok: false, error: errMsg, path: root };
    }
    return { ok: true, path: root };
  });

  ipcMain.handle("scheduler:pickCommandsFolder", async () => {
    const result = await dialog.showOpenDialog({
      title: "Select PM OS commands folder",
      properties: ["openDirectory"],
    });
    if (result.canceled || !result.filePaths.length) {
      return { ok: false, canceled: true };
    }
    const selectedPath = result.filePaths[0];
    const loaded = loadCommandCatalog(selectedPath);
    if (loaded.length === 0) {
      return {
        ok: false,
        canceled: false,
        error: "No command markdown files found in selected folder.",
      };
    }
    writeConfig({ ...readConfig(), commandsRoot: selectedPath });
    updateCommandSource(selectedPath, "custom");
    if (schedulerEngine?.runner) {
      schedulerEngine.runner.workingDirectory = computeRunnerCwd();
    }
    return { ok: true, commandsRoot: selectedPath, commandCount: loaded.length };
  });
}

app.whenReady().then(async () => {
  await bootstrapServices();
  registerIpcHandlers();
  if (readConfig().preventSystemSleep === true) {
    applyPreventSleepPreference(true);
  }
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("before-quit", () => {
  applyPreventSleepPreference(false);
});

app.on("window-all-closed", () => {
  schedulerEngine?.stop();
  if (process.platform !== "darwin") app.quit();
});
