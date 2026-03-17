/**
 * Minimal Webex REST API client.
 * Base URL: https://webexapis.com/v1 (current Webex API host)
 * Auth: Bearer token (Personal Access Token or OAuth).
 */

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

function getToken(override?: string): string {
  const token = override ?? process.env.WEBEX_ACCESS_TOKEN;
  if (!token || typeof token !== "string" || token.trim() === "") {
    throw new Error(
      "Webex access token is required. Pass it in the message (webexAccessToken when calling the tool) or in the command (e.g. node dist/index.js --webex-token=YOUR_TOKEN or node dist/index.js YOUR_TOKEN)."
    );
  }
  return token.trim();
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
  const token = getToken(tokenOverride);
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
  const token = getToken(tokenOverride);
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
  const token = getToken(tokenOverride);
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
  const token = getToken(tokenOverride);
  return webexFetch<WebexPersonMe>(token, "/people/me");
}
