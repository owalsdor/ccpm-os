# Webex MCP user guide

The Webex MCP server lets Codex read Webex spaces and messages and prepare follow-up work. Sending remains an explicit user-approved action.

## Normal use

Ask Codex to:

- List recent direct-message spaces.
- Show recent messages from a named space or person.
- Identify follow-ups you may owe.
- Draft a reply without sending it.
- Send an approved message to a confirmed recipient.
- Check Webex authentication status.

Codex starts the server through `~/.codex/config.toml` or the equivalent configuration created by `codex mcp add`.

## Authentication

OAuth tokens are stored under `~/.webex-mcp/`. Run these commands from `tools/mcp/webex/` when setup or reauthorization is needed:

```bash
node dist/index.js auth setup --client-id=YOUR_CLIENT_ID --client-secret=YOUR_CLIENT_SECRET
node dist/index.js auth login
node dist/index.js auth status
```

## Sending boundary

Reading messages or drafting a response does not authorize a send. Before calling `webex_send_message`, confirm the recipient, the final text, and the user's explicit instruction to send.

## Troubleshooting

- Missing tools: run `codex mcp list`, confirm the server path, then restart Codex.
- Build error: run `npm ci` followed by `npm run build`.
- Authentication error: run `node dist/index.js auth status`.
- Expired authorization: run `node dist/index.js auth login`.
- Wrong server path: use an absolute path to `dist/index.js` in the Codex configuration.
