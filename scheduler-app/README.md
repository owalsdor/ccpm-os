# CCPM Scheduler App (Mock-up)

Desktop scheduler UI for PM OS commands, with execution through Cursor ACP.

## What it does

- Loads command templates from `../commands`.
- Lets you create **one-time** or **recurring** jobs (daily, or weekly on one or more days at a shared time). With **one** day selected you can set “every N weeks”; with **multiple** days, it runs every week on those days. The next run time is computed in the app; after each automatic run, recurring jobs reschedule (failures advance too so the cadence keeps going).
- Each job can pin a **model** (from the Cursor agent’s ACP `configOptions`) or use the agent default.
- Executes jobs via `agent acp`.
- Handles ACP permission requests programmatically (`allow-always`, `allow-once`, `reject-once`).
- Persists jobs and run history in Electron user data storage.
- **MCP:** Loads MCP servers from Cursor-style config — `~/.cursor/mcp.json` plus `<runner cwd>/.cursor/mcp.json`, merged (project entries override global by name). Values support `${env:VAR}`, `${userHome}`, `${workspaceFolder}`, etc., like Cursor. Stdio (`command` / `args` / `env` / `envFile`) and remote (`url` / `headers`, optional `type: "sse"` or streamable HTTP as `http`) entries are converted to ACP `session/new` format. Team/dashboard MCP is not available in ACP (Cursor limitation).

## Run locally

```bash
npm install
npm start
```

## Build a clickable app

```bash
npm run pack
```

This creates an unpacked app at:

- `dist/mac-arm64/CCPM Scheduler.app` (on Apple Silicon)

For a distributable DMG:

```bash
npm run dist
```

## Notes on approvals

- The scheduler responds to ACP `session/request_permission` messages automatically based on each job's selected permission mode.
- Cursor's own docs describe permission auto-approval as best-effort, so some environments may still require manual intervention.
