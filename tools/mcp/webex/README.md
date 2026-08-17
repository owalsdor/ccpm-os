# Webex MCP server for Codex

Local Model Context Protocol server that exposes Webex spaces and messages to Codex.

## Capabilities

- List direct and group spaces.
- Retrieve recent messages.
- Send a message after explicit user approval.
- Collect recent direct-message data for follow-up analysis.
- Check OAuth token health.

## Build

```bash
npm ci
npm run build
```

Node.js 18 or newer is required.

## Authentication

OAuth is recommended.

1. Create a Webex Integration with redirect URI `http://localhost:11424/callback`.
2. Grant `spark:rooms_read`, `spark:messages_read`, `spark:messages_write`, and `spark:people_read`.
3. Save the integration credentials:

   ```bash
   node dist/index.js auth setup --client-id=YOUR_CLIENT_ID --client-secret=YOUR_CLIENT_SECRET
   ```

4. Authorize:

   ```bash
   node dist/index.js auth login
   ```

5. Check token health:

   ```bash
   node dist/index.js auth status
   ```

Credentials and tokens are stored under `~/.webex-mcp/` with owner-only permissions.

## Codex configuration

Register the server with the Codex CLI:

```bash
codex mcp add webex -- node /absolute/path/to/ccpm-os/tools/mcp/webex/dist/index.js
```

You can also copy [codex-config.example.toml](codex-config.example.toml) into `~/.codex/config.toml` and replace the example path. Restart Codex after changing MCP configuration.

## Tools

| Tool | Purpose |
|---|---|
| `webex_list_spaces` | List accessible Webex spaces. |
| `webex_get_messages` | Retrieve messages from a space or direct conversation. |
| `webex_get_pending_followups` | Return recent direct-message data for follow-up analysis. |
| `webex_send_message` | Send a message after explicit user authorization. |
| `webex_auth_status` | Check OAuth token validity and refresh state. |

## Security

- Never commit tokens or client secrets.
- Keep external sends behind explicit user approval.
- Use stored OAuth tokens or environment variables instead of inline configuration.
- Review the recipient and final text before sending.

See [USER_GUIDE.md](USER_GUIDE.md) for normal use and troubleshooting.
