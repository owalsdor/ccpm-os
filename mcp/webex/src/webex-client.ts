/**
 * Minimal Webex REST API client.
 * Base URL: https://webexapis.com/v1 (current Webex API host)
 * Auth: Bearer token (Personal Access Token or OAuth).
 *
 * Token resolution priority:
 *   1. Per-tool override (webexAccessToken passed in message)
 *   2. CLI argument (--webex-token=TOKEN)
 *   3. OAuth stored token (auto-refreshes transparently)
 *   4. WEBEX_ACCESS_TOKEN env var
 */

import { getValidAccessToken } from "./oauth.js";

const WEBEX_BASE = "https://webexapis.com/v1";

export type WebexRoom = {
  id: string;
  title: string;
  type: "direct" | "group";
  isLocked?: boolean;
  lastActivity?: string;
  created: string;
};

export type WebexMessage = {
  id: string;
  roomId: string;
  roomType: "direct" | "group";
  personId: string;
  personEmail?: string;
  text?: string;
  markdown?: string;
  created: string;
};

export type WebexPersonMe = {
  id: string;
  emails?: string[];
  displayName?: string;
  nickName?: string;
};

export type ListRoomsParams = {
  max?: number;
  type?: "direct" | "group";
  sortBy?: "lastactivity" | "created";
};

export type ListMessagesParams = {
  roomId?: string;
  personId?: string;
  before?: string;
  beforeMessage?: string;
  max?: number;
};

export type CreateMessageParams = {
  roomId?: string;
  personId?: string;
  text: string;
  markdown?: string;
};

let cachedOAuthToken: string | null = null;

async function resolveToken(override?: string): Promise<string> {
  // 1. Per-tool override (user pasted token in chat)
  if (override && override.trim()) return override.trim();

  // 2. CLI argument (set into env by index.ts on startup)
  if (process.env.WEBEX_ACCESS_TOKEN?.trim()) {
    return process.env.WEBEX_ACCESS_TOKEN.trim();
  }

  // 3. OAuth stored token (auto-refresh)
  const oauthToken = await getValidAccessToken();
  if (oauthToken) {
    cachedOAuthToken = oauthToken;
    return oauthToken;
  }

  // 4. Cached OAuth token from earlier in this session
  if (cachedOAuthToken) return cachedOAuthToken;

  throw new Error(
    "Webex access token is required. Options:\n" +
      "  • OAuth (recommended): node dist/index.js auth setup && node dist/index.js auth login\n" +
      "  • CLI flag: node dist/index.js --webex-token=TOKEN\n" +
      "  • In message: pass webexAccessToken when calling the tool"
  );
}

async function webexFetch<T>(
  token: string,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${WEBEX_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    let message = `Webex API error ${res.status}: ${res.statusText}`;
    try {
      const json = JSON.parse(body);
      if (json.message) message = json.message;
    } catch {
      if (body) message += ` — ${body.slice(0, 200)}`;
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function listRooms(
  tokenOverride: string | undefined,
  params: ListRoomsParams = {}
): Promise<{ items: WebexRoom[] }> {
  const token = await resolveToken(tokenOverride);
  const sp = new URLSearchParams();
  if (params.max != null) sp.set("max", String(params.max));
  if (params.type) sp.set("type", params.type);
  if (params.sortBy) sp.set("sortBy", params.sortBy);
  const qs = sp.toString();
  const path = qs ? `/rooms?${qs}` : "/rooms";
  return webexFetch<{ items: WebexRoom[] }>(token, path);
}

export async function listMessages(
  tokenOverride: string | undefined,
  params: ListMessagesParams
): Promise<{ items: WebexMessage[] }> {
  const token = await resolveToken(tokenOverride);
  if (!params.roomId && !params.personId) {
    throw new Error("Either roomId or personId is required to list messages.");
  }
  const sp = new URLSearchParams();
  if (params.roomId) sp.set("roomId", params.roomId);
  if (params.personId) sp.set("personId", params.personId);
  if (params.before) sp.set("before", params.before);
  if (params.beforeMessage) sp.set("beforeMessage", params.beforeMessage);
  if (params.max != null) sp.set("max", String(params.max));
  const path = `/messages?${sp.toString()}`;
  return webexFetch<{ items: WebexMessage[] }>(token, path);
}

export async function createMessage(
  tokenOverride: string | undefined,
  params: CreateMessageParams
): Promise<WebexMessage> {
  const token = await resolveToken(tokenOverride);
  if (!params.roomId && !params.personId) {
    throw new Error("Either roomId or personId is required to send a message.");
  }
  if (!params.text || params.text.trim() === "") {
    throw new Error("Message text is required.");
  }
  const body: Record<string, string> = { text: params.text.trim() };
  if (params.roomId) body.roomId = params.roomId;
  if (params.personId) body.personId = params.personId;
  if (params.markdown) body.markdown = params.markdown;
  return webexFetch<WebexMessage>(token, "/messages", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getMe(
  tokenOverride: string | undefined
): Promise<WebexPersonMe> {
  const token = await resolveToken(tokenOverride);
  return webexFetch<WebexPersonMe>(token, "/people/me");
}
