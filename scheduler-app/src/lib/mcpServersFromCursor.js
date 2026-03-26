const fs = require("fs");
const path = require("path");

function readJsonIfExists(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (_err) {
    return null;
  }
}

function buildInterpolationContext(workspaceFolder) {
  const userHome = process.env.HOME || process.env.USERPROFILE || "";
  const resolved = path.resolve(workspaceFolder || ".");
  return {
    workspaceFolder: resolved,
    workspaceFolderBasename: path.basename(resolved),
    userHome,
    pathSeparator: path.sep,
  };
}

function interpolateString(str, ctx) {
  if (typeof str !== "string") return str;
  let out = str;
  out = out.replace(/\$\{userHome\}/g, ctx.userHome);
  out = out.replace(/\$\{workspaceFolder\}/g, ctx.workspaceFolder);
  out = out.replace(/\$\{workspaceFolderBasename\}/g, ctx.workspaceFolderBasename);
  out = out.replace(/\$\{pathSeparator\}/g, ctx.pathSeparator);
  out = out.replace(/\$\{\/\}/g, ctx.pathSeparator);
  out = out.replace(/\$\{env:([^}]+)\}/g, (_, name) => {
    const key = name.trim();
    return process.env[key] !== undefined ? process.env[key] : "";
  });
  return out;
}

function interpolateValue(v, ctx) {
  if (typeof v === "string") return interpolateString(v, ctx);
  if (Array.isArray(v)) return v.map((x) => interpolateValue(x, ctx));
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const o = {};
    for (const [k, val] of Object.entries(v)) {
      o[k] = interpolateValue(val, ctx);
    }
    return o;
  }
  return v;
}

function parseEnvFile(contents) {
  const out = {};
  for (const line of contents.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[k] = v;
  }
  return out;
}

function loadEnvFileMerged(envFileField, ctx, jsonEnv) {
  const base = jsonEnv && typeof jsonEnv === "object" ? { ...jsonEnv } : {};
  if (!envFileField || typeof envFileField !== "string") return base;
  const rel = interpolateString(envFileField, ctx);
  const resolved = path.isAbsolute(rel) ? rel : path.join(ctx.workspaceFolder, rel);
  try {
    if (!fs.existsSync(resolved)) return base;
    const raw = fs.readFileSync(resolved, "utf8");
    const fromFile = parseEnvFile(raw);
    return { ...fromFile, ...base };
  } catch (_err) {
    return base;
  }
}

function envObjectToAcpArray(envObj) {
  if (!envObj || typeof envObj !== "object") return [];
  const out = [];
  for (const [name, value] of Object.entries(envObj)) {
    if (value == null) continue;
    out.push({ name, value: String(value) });
  }
  return out;
}

function headersObjectToAcpArray(headersObj) {
  if (!headersObj || typeof headersObj !== "object") return [];
  const out = [];
  for (const [name, value] of Object.entries(headersObj)) {
    if (value == null) continue;
    out.push({ name, value: String(value) });
  }
  return out;
}

function mergeMcpServerMaps(globalConfig, projectConfig) {
  const g = globalConfig?.mcpServers;
  const p = projectConfig?.mcpServers;
  const merged = {};
  if (g && typeof g === "object" && !Array.isArray(g)) Object.assign(merged, g);
  if (p && typeof p === "object" && !Array.isArray(p)) Object.assign(merged, p);
  return merged;
}

function cursorEntryToAcpServer(name, entry, ctx) {
  if (!entry || typeof entry !== "object") return null;

  const entryI = interpolateValue(entry, ctx);

  if (typeof entryI.url === "string" && entryI.url.length > 0) {
    const transport = entryI.type === "sse" ? "sse" : "http";
    const server = {
      type: transport,
      name,
      url: entryI.url,
      headers: headersObjectToAcpArray(entryI.headers),
    };
    if (entryI.auth && typeof entryI.auth === "object") {
      server.auth = entryI.auth;
    }
    return server;
  }

  if (typeof entryI.command === "string" && entryI.command.length > 0) {
    const mergedEnv = loadEnvFileMerged(entryI.envFile, ctx, entryI.env);
    return {
      name,
      command: entryI.command,
      args: Array.isArray(entryI.args) ? entryI.args.map(String) : [],
      env: envObjectToAcpArray(mergedEnv),
    };
  }

  return null;
}

/**
 * Builds the `mcpServers` array for ACP `session/new` from Cursor-style
 * `~/.cursor/mcp.json` and `<workspace>/.cursor/mcp.json` (project overrides global by name).
 *
 * @param {string} workspaceFolder - Same as ACP session `cwd` (absolute recommended)
 * @returns {object[]}
 */
function resolveMcpServersForAcp(workspaceFolder) {
  const ctx = buildInterpolationContext(workspaceFolder);
  const globalPath = path.join(ctx.userHome, ".cursor", "mcp.json");
  const projectPath = path.join(ctx.workspaceFolder, ".cursor", "mcp.json");

  const globalConfig = readJsonIfExists(globalPath);
  const projectConfig = readJsonIfExists(projectPath);
  const merged = mergeMcpServerMaps(globalConfig, projectConfig);

  const list = [];
  for (const [serverName, spec] of Object.entries(merged)) {
    const server = cursorEntryToAcpServer(serverName, spec, ctx);
    if (server) list.push(server);
  }
  return list;
}

module.exports = {
  resolveMcpServersForAcp,
  mergeMcpServerMaps,
  buildInterpolationContext,
  interpolateString,
};
