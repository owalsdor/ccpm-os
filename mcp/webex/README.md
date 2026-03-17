# Webex MCP Server for Cursor

An [MCP](https://modelcontextprotocol.io) (Model Context Protocol) server that exposes Webex messaging via the Webex REST API.

**→ For a full walkthrough (what it is, install, use, token warnings and 12-hour lifetime), see [USER_GUIDE.md](USER_GUIDE.md).** Use it from **Cursor** to list spaces, get messages, and send messages to people or spaces—all driven by a Webex Personal Access Token.

## Features

- **List spaces** – List rooms/spaces the authenticated user is in (direct and group), with optional filters.
- **Get messages** – Retrieve messages from a space (by `roomId`) or a direct conversation (by `personId`).
- **Send message** – Send a message to a space (`roomId`) or directly to a person (`personId`).
- **One-click pending follow-ups** – Scan recent direct spaces in one tool call and return likely pending actions with confidence and suggested replies.

## Prerequisites

- **Node.js** 18+
- **Webex Personal Access Token** – [Create one here](https://developer.webex.com/docs/getting-your-personal-access-token) (sign in with your Webex account).

## Install and build

```bash
cd /path/to/WebexMCP
npm install
npm run build
```

## Token (no Cursor MCP config env needed)

The server needs a Webex access token. You can provide it in either of these ways (no need to put it in Cursor’s MCP config):

1. **In the command**  
   Pass the token when Cursor starts the server, via the MCP server’s `args`:
   - **Flag:** `node /path/to/dist/index.js --webex-token=YOUR_TOKEN` or `--token=YOUR_TOKEN`
   - **Positional:** `node /path/to/dist/index.js YOUR_TOKEN` (single argument = token)

2. **In the message**  
   Any tool accepts an optional `webexAccessToken` argument. When the AI asks for your token, paste it in chat; the AI will pass it to the tool.

**Security:** Never commit your token. Prefer the command so the token isn’t stored in chat history.

## Use with Cursor

1. **Build the server** (see above).

2. **Add the MCP server in Cursor**  
   Open **Cursor Settings → Features → MCP** and add a server, or edit the MCP config file directly.

   Config file locations:
   - **macOS:** `~/.cursor/mcp.json`
   - **Windows:** `%APPDATA%\Cursor\mcp.json`

3. **Add the Webex server entry**  
   Use the command that runs the built server. Pass the token **in the command** (not in env):

   **Option A – token as a flag (recommended):**
   ```json
   {
     "mcpServers": {
       "webex": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/WebexMCP/dist/index.js", "--webex-token=YOUR_WEBEX_TOKEN"]
       }
     }
   }
   ```

   **Option B – token as single positional arg:**
   ```json
   {
     "mcpServers": {
       "webex": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/WebexMCP/dist/index.js", "YOUR_WEBEX_TOKEN"]
       }
     }
   }
   ```

   Replace:
   - `"/ABSOLUTE/PATH/TO/WebexMCP/dist/index.js"` with the real path to your `WebexMCP` project.
   - `YOUR_WEBEX_TOKEN` with your Webex Personal Access Token.

   **Option C – no token in config:**  
   Don’t put the token in the config. When you use a Webex tool, the AI will ask for your token; paste it in the message and it will be sent as `webexAccessToken`.

4. **Restart Cursor** (or reload MCP) so it picks up the new server.

5. **Use in chat**  
   In Cursor, you can ask to:
   - List my Webex spaces
   - Get the latest messages from a space or person (you’ll need the `roomId` or `personId`, which you can get from “list spaces” or Webex)
   - Send a message to a space or person (by `roomId` or `personId`)

## Tools (for Cursor / MCP clients)

| Tool | Description |
|------|-------------|
| `webex_list_spaces` | List spaces (rooms). Optional: `max`, `type` (direct/group), `sortBy` (lastactivity/created). |
| `webex_get_messages` | Get messages. Requires `roomId` **or** `personId`. Optional: `max`, `beforeMessage`. |
| `webex_get_pending_followups` | One-click scan of recent direct spaces/messages to identify follow-ups you likely owe. Optional: `maxSpaces`, `messagesPerSpace`, `includeSuggestedReply`, `timeZone`, `model`. |
| `webex_send_message` | Send a message. Requires `roomId` **or** `personId`, and `text`. Optional: `markdown`. |

### Anthropic configuration (for `webex_get_pending_followups`)

Set an API key in the server environment:

- `ANTHROPIC_API_KEY` (required for follow-up analysis)
- `ANTHROPIC_MODEL` (optional default model override)

If not set, the tool falls back to an internal default model string. You can also pass `model` directly in the tool input.

IDs:
- **roomId** – From “list spaces” or the Webex app (room/space details).
- **personId** – Webex user ID (e.g. from people search or direct space membership). Use `"me"` for the current user in direct context where the API supports it.

## Example Cursor MCP config (snippet)

If your `~/.cursor/mcp.json` already has other servers, add the `webex` block inside `mcpServers`. Token in the command (no env):

```json
{
  "mcpServers": {
    "webex": {
      "command": "node",
      "args": ["/Users/stevenabraham/Documents/AI For Product Managers/projects/WebexMCP/dist/index.js", "--webex-token=YOUR_TOKEN_HERE"]
    }
  }
}
```

Or omit the token and pass it in the message when the AI asks for it.

## API reference

The server uses the official Webex REST API:

- Base URL: `https://api.webex.com/v1`
- Auth: `Authorization: Bearer <token>`
- [Webex for Developers](https://developer.webex.com/) – Rooms, Messages, and REST API basics.

## License

MIT
