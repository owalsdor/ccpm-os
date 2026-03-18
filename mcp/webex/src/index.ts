#!/usr/bin/env node
/**
 * Webex MCP Server for Cursor
 *
 * Token resolution (highest priority first):
 * 1. Per-tool: pass webexAccessToken in the tool call (e.g. paste token when the AI asks)
 * 2. CLI arg:  --webex-token=TOKEN or positional TOKEN
 * 3. OAuth:    stored tokens from `auth login` (auto-refreshes)
 * 4. Env:      WEBEX_ACCESS_TOKEN
 *
 * CLI subcommands:
 *   auth setup  --client-id=CID --client-secret=CSECRET  Save OAuth client credentials
 *   auth login                                            Browser-based OAuth login
 *   auth status                                           Show token health
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  listRooms,
  listMessages,
  createMessage,
} from "./webex-client.js";
import { analyzePendingFollowups } from "./pending-actions.js";
import { authorize, getTokenStatus } from "./oauth.js";
import { saveClientConfig, getStoreDir } from "./token-store.js";

// ---------------------------------------------------------------------------
// CLI: handle `auth` subcommand before starting the MCP server
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);

if (argv[0] === "auth") {
  const sub = argv[1];

  if (sub === "setup") {
    let clientId = "";
    let clientSecret = "";
    let redirectUri = "http://localhost:11424/callback";
    let scopes = "spark:rooms_read spark:messages_read spark:messages_write spark:people_read";

    for (const arg of argv.slice(2)) {
      if (arg.startsWith("--client-id=")) clientId = arg.slice("--client-id=".length).trim();
      else if (arg.startsWith("--client-secret=")) clientSecret = arg.slice("--client-secret=".length).trim();
      else if (arg.startsWith("--redirect-uri=")) redirectUri = arg.slice("--redirect-uri=".length).trim();
      else if (arg.startsWith("--scopes=")) scopes = arg.slice("--scopes=".length).trim();
    }

    if (!clientId || !clientSecret) {
      console.error("Usage: node dist/index.js auth setup --client-id=CID --client-secret=CSECRET");
      process.exit(1);
    }

    saveClientConfig({ client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, scopes });
    console.log(`OAuth client credentials saved to ${getStoreDir()}/config.json`);
    console.log("Next step: node dist/index.js auth login");
    process.exit(0);
  }

  if (sub === "login") {
    try {
      await authorize();
    } catch (err) {
      console.error("Authorization failed:", err instanceof Error ? err.message : err);
      process.exit(1);
    }
    process.exit(0);
  }

  if (sub === "status") {
    const status = getTokenStatus();
    console.log(JSON.stringify(status, null, 2));
    process.exit(0);
  }

  console.error("Unknown auth subcommand. Usage: node dist/index.js auth [setup|login|status]");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Parse token from CLI flags (legacy / manual mode)
// ---------------------------------------------------------------------------
for (const arg of argv) {
  if (arg.startsWith("--webex-token=")) {
    process.env.WEBEX_ACCESS_TOKEN = arg.slice("--webex-token=".length).trim();
    break;
  }
  if (arg.startsWith("--token=")) {
    process.env.WEBEX_ACCESS_TOKEN = arg.slice("--token=".length).trim();
    break;
  }
}
if (!process.env.WEBEX_ACCESS_TOKEN && argv.length === 1 && !argv[0].startsWith("-")) {
  process.env.WEBEX_ACCESS_TOKEN = argv[0].trim();
}

const server = new McpServer({
  name: "webex-mcp-server",
  version: "1.0.0",
});

// Token can be passed in the message (per tool) or via the command; optional here
const webexTokenSchema = z
  .string()
  .optional()
  .describe(
    "Webex Personal Access Token. Pass it here (e.g. when the user pastes it in chat), or start the server with the token in the command (e.g. node dist/index.js --webex-token=TOKEN)."
  );

// --- List spaces (rooms) ---
server.registerTool(
  "webex_list_spaces",
  {
    title: "List Webex Spaces",
    description:
      "List Webex spaces (rooms) the authenticated user is in. Optionally filter by type (direct/group) and limit count.",
    inputSchema: z.object({
      webexAccessToken: webexTokenSchema,
      max: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("Max number of spaces to return (default 50)"),
      type: z
        .enum(["direct", "group"])
        .optional()
        .describe("Filter by space type: direct (1:1) or group"),
      sortBy: z
        .enum(["lastactivity", "created"])
        .optional()
        .describe("Sort by lastactivity or created"),
    }),
  },
  async ({ webexAccessToken, max, type, sortBy }) => {
    try {
      const result = await listRooms(webexAccessToken, { max, type, sortBy });
      const items = result.items ?? [];
      const text =
        items.length === 0
          ? "No spaces found."
          : JSON.stringify(
              items.map((r) => ({
                id: r.id,
                title: r.title,
                type: r.type,
                lastActivity: r.lastActivity,
                created: r.created,
              })),
              null,
              2
            );
      return { content: [{ type: "text" as const, text }] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// --- Get messages from a space or person ---
server.registerTool(
  "webex_get_messages",
  {
    title: "Get Webex Messages",
    description:
      "Retrieve messages from a Webex space (room) or direct conversation with a person. Provide either roomId or personId (use 'me' for the current user's 1:1 with someone).",
    inputSchema: z.object({
      webexAccessToken: webexTokenSchema,
      roomId: z
        .string()
        .optional()
        .describe("Space (room) ID to list messages from"),
      personId: z
        .string()
        .optional()
        .describe(
          "Person ID for direct messages (e.g. 'me' or the other person's Webex ID)"
        ),
      max: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("Max messages to return (default 50)"),
      beforeMessage: z
        .string()
        .optional()
        .describe("List messages before this message ID (pagination)"),
    }),
  },
  async ({ webexAccessToken, roomId, personId, max, beforeMessage }) => {
    try {
      const result = await listMessages(webexAccessToken, {
        roomId,
        personId,
        max,
        beforeMessage,
      });
      const items = result.items ?? [];
      const text =
        items.length === 0
          ? "No messages found."
          : JSON.stringify(
              items.map((m) => ({
                id: m.id,
                roomId: m.roomId,
                personId: m.personId,
                personEmail: m.personEmail,
                text: m.text,
                created: m.created,
              })),
              null,
              2
            );
      return { content: [{ type: "text" as const, text }] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// --- One-click pending follow-ups across recent direct spaces ---
server.registerTool(
  "webex_get_pending_followups",
  {
    title: "Get Pending Webex Follow-Ups",
    description:
      "Fetch recent direct-message spaces and recent messages per space (Webex data only, no LLM analysis).",
    inputSchema: z.object({
      webexAccessToken: webexTokenSchema,
      maxSpaces: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe("Max number of direct spaces to scan (default 25)"),
      messagesPerSpace: z
        .number()
        .int()
        .min(1)
        .max(50)
        .optional()
        .describe("Messages to inspect per space (default 10)"),
      includeSuggestedReply: z
        .boolean()
        .optional()
        .describe("Unused in data-only mode; kept for backwards compatibility."),
      timeZone: z
        .string()
        .optional()
        .describe("Unused in data-only mode; kept for backwards compatibility."),
      model: z
        .string()
        .optional()
        .describe("Unused in data-only mode; kept for backwards compatibility."),
    }),
  },
  async ({ webexAccessToken, maxSpaces, messagesPerSpace, includeSuggestedReply, timeZone, model }) => {
    try {
      const result = await analyzePendingFollowups(webexAccessToken, {
        maxSpaces: maxSpaces ?? 25,
        messagesPerSpace: messagesPerSpace ?? 10,
        includeSuggestedReply: includeSuggestedReply ?? true,
        timeZone: timeZone || "America/New_York",
        model,
      });
      const text = JSON.stringify(result, null, 2);
      return { content: [{ type: "text" as const, text }] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// --- Send message to a space or person ---
server.registerTool(
  "webex_send_message",
  {
    title: "Send Webex Message",
    description:
      "Send a message to a Webex space (room) or directly to a person. Provide either roomId or personId.",
    inputSchema: z.object({
      webexAccessToken: webexTokenSchema,
      roomId: z.string().optional().describe("Space (room) ID to send the message to"),
      personId: z
        .string()
        .optional()
        .describe("Person ID to send a direct message to"),
      text: z.string().min(1).describe("Plain text message content"),
      markdown: z
        .string()
        .optional()
        .describe("Optional markdown version of the message"),
    }),
  },
  async ({ webexAccessToken, roomId, personId, text, markdown }) => {
    try {
      const message = await createMessage(webexAccessToken, {
        roomId,
        personId,
        text,
        markdown,
      });
      const summary = `Message sent. id: ${message.id}, roomId: ${message.roomId}, created: ${message.created}`;
      return { content: [{ type: "text" as const, text: summary }] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// --- Auth status ---
server.registerTool(
  "webex_auth_status",
  {
    title: "Webex Auth Status",
    description:
      "Check the health of Webex OAuth tokens — whether they're valid, when they expire, and whether auto-refresh is active. No token parameter needed.",
    inputSchema: z.object({}),
  },
  async () => {
    try {
      const status = getTokenStatus();
      return { content: [{ type: "text" as const, text: JSON.stringify(status, null, 2) }] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: "text" as const, text: `Error: ${message}` }],
        isError: true,
      };
    }
  }
);

// Run over stdio for Cursor
const transport = new StdioServerTransport();
await server.connect(transport);
