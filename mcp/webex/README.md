# Webex MCP Server for Cursor

An [MCP](https://modelcontextprotocol.io) (Model Context Protocol) server that exposes Webex messaging via the Webex REST API.

**→ For a full walkthrough, see [USER_GUIDE.md](USER_GUIDE.md).** Use it from **Cursor** to list spaces, get messages, and send messages to people or spaces.

## Features

- **List spaces** – List rooms/spaces the authenticated user is in (direct and group), with optional filters.
- **Get messages** – Retrieve messages from a space (by `roomId`) or a direct conversation (by `personId`).
- **Send message** – Send a message to a space (`roomId`) or directly to a person (`personId`).
- **One-click pending follow-ups** – Scan recent direct spaces in one tool call and return likely pending actions with confidence and suggested replies.
- **Auth status** – Check OAuth token health (expiry, auto-refresh state) from within Cursor.

## Prerequisites

- **Node.js** 18+
- **Webex authentication** — choose one:
  - **OAuth (recommended):** Register a Webex Integration once, then tokens auto-refresh (~90 days hands-free).
  - **Personal Access Token:** [Create one here](https://developer.webex.com/docs/getting-your-personal-access-token) (expires every 12 hours).

## Install and build

```bash
cd /path/to/WebexMCP
npm install
npm run build
```

## Authentication

### Option 1: OAuth (recommended — set up once, auto-refreshes)

OAuth access tokens last **14 days** and refresh tokens last **90 days**. The server auto-refreshes transparently, so you effectively never re-authenticate as long as you use it at least once per quarter.

#### Step 1: Register a Webex Integration (one-time)

1. Go to [developer.webex.com/my-apps/new](https://developer.webex.com/my-apps/new) and create an **Integration**.
2. Set **Redirect URI** to: `http://localhost:11424/callback`
3. Select scopes: `spark:rooms_read`, `spark:messages_read`, `spark:messages_write`, `spark:people_read`
4. Note your **Client ID** and **Client Secret**.

#### Step 2: Save credentials

```bash
node dist/index.js auth setup --client-id=YOUR_CLIENT_ID --client-secret=YOUR_CLIENT_SECRET
```

Credentials are saved to `~/.webex-mcp/config.json` (owner-only `0600` permissions).

#### Step 3: Authorize in browser

```bash
node dist/index.js auth login
```

Your browser opens → sign in to Webex → click Allow → tokens saved automatically.

#### Step 4: Configure Cursor (no token in config!)

```json
{
  "mcpServers": {
    "webex": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/dist/index.js"]
    }
  }
}
```

That's it. The server reads tokens from `~/.webex-mcp/tokens.json` and refreshes automatically.

#### Check token health

```bash
node dist/index.js auth status
```

Or use the `webex_auth_status` MCP tool from within Cursor.

---

### Option 2: Personal Access Token (manual, expires every 12 hours)

The server accepts a Webex access token via CLI args, per-tool message, or env var.

**In the command (flag):**
```json
{
  "mcpServers": {
    "webex": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/dist/index.js", "--webex-token=YOUR_TOKEN"]
    }
  }
}
```

**In the command (positional):**
```json
{
  "mcpServers": {
    "webex": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/dist/index.js", "YOUR_TOKEN"]
    }
  }
}
```

**In the message:** Don't put a token in config. When you use a Webex tool, the AI will ask for your token; paste it in chat.

**Security:** Never commit your token.

---

### Token resolution priority

When the server needs a token, it checks in this order:

1. **Per-tool override** — `webexAccessToken` passed in the tool call
2. **CLI argument** — `--webex-token=TOKEN` or positional arg
3. **OAuth stored token** — from `~/.webex-mcp/tokens.json`, auto-refreshed
4. **Environment variable** — `WEBEX_ACCESS_TOKEN`

## Use with Cursor

1. **Build the server** (see above).
2. **Authenticate** using OAuth (recommended) or a personal access token.
3. **Add the MCP server in Cursor**
   Open **Cursor Settings → Features → MCP** and add a server, or edit the MCP config file directly.

   Config file locations:
   - **macOS:** `~/.cursor/mcp.json`
   - **Windows:** `%APPDATA%\Cursor\mcp.json`

4. **Restart Cursor** (or reload MCP) so it picks up the new server.

5. **Use in chat**
   - List my Webex spaces
   - Get the latest messages from a space or person
   - Send a message to a space or person
   - Check my Webex auth status

## Tools (for Cursor / MCP clients)

| Tool | Description |
|------|-------------|
| `webex_list_spaces` | List spaces (rooms). Optional: `max`, `type` (direct/group), `sortBy` (lastactivity/created). |
| `webex_get_messages` | Get messages. Requires `roomId` **or** `personId`. Optional: `max`, `beforeMessage`. |
| `webex_get_pending_followups` | One-click scan of recent direct spaces/messages to identify follow-ups you likely owe. Optional: `maxSpaces`, `messagesPerSpace`. |
| `webex_send_message` | Send a message. Requires `roomId` **or** `personId`, and `text`. Optional: `markdown`. |
| `webex_auth_status` | Check OAuth token health — whether tokens are valid, when they expire, and whether auto-refresh is active. |

### Anthropic configuration (for `webex_get_pending_followups`)

Set an API key in the server environment:

- `ANTHROPIC_API_KEY` (required for follow-up analysis)
- `ANTHROPIC_MODEL` (optional default model override)

If not set, the tool falls back to an internal default model string. You can also pass `model` directly in the tool input.

IDs:
- **roomId** – From "list spaces" or the Webex app (room/space details).
- **personId** – Webex user ID (e.g. from people search or direct space membership). Use `"me"` for the current user in direct context where the API supports it.

## CLI reference

```bash
# OAuth setup (one-time)
node dist/index.js auth setup --client-id=CID --client-secret=CSECRET

# OAuth browser login
node dist/index.js auth login

# Check token health
node dist/index.js auth status

# Run as MCP server (default — used by Cursor)
node dist/index.js
node dist/index.js --webex-token=TOKEN   # with manual token
```

## API reference

The server uses the official Webex REST API:

- Base URL: `https://webexapis.com/v1`
- Auth: `Authorization: Bearer <token>`
- [Webex for Developers](https://developer.webex.com/) – Rooms, Messages, and REST API basics.

## License

MIT
