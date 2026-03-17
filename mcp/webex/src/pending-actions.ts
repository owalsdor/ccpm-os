import { getMe, listMessages, listRooms, type WebexMessage, type WebexRoom } from "./webex-client.js";

const MAX_MESSAGE_CHARS = 800;

export type PendingFollowupResult = {
  scannedSpacesCount: number;
  directSpaces: SpaceMessagePack[];
  mode: "webex_data_only";
  note: string;
};

export type PendingFollowupOptions = {
  maxSpaces: number;
  messagesPerSpace: number;
  includeSuggestedReply: boolean;
  timeZone: string;
  model?: string;
};

export type SpaceMessagePack = {
  roomId: string;
  title: string;
  lastActivity?: string;
  messages: Array<{
    id?: string;
    created: string;
    senderEmail: string;
    senderRole: "me" | "other" | "unknown";
    text: string;
  }>;
};

function redactSensitiveText(input: string): string {
  return input
    .replace(/\b(?:sk-ant-[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{20,})\b/g, "[REDACTED_TOKEN]")
    .replace(/\b[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/g, "[REDACTED_JWT]")
    .replace(/(-----BEGIN [A-Z ]+-----)([\s\S]*?)(-----END [A-Z ]+-----)/g, "$1[REDACTED_KEY]$3");
}

function clipText(input: string, maxChars: number): string {
  if (input.length <= maxChars) return input;
  return `${input.slice(0, maxChars - 1)}…`;
}

function normalizeText(message: WebexMessage): string {
  const raw = String(message.text || message.markdown || "").trim();
  if (!raw) return "";
  return clipText(redactSensitiveText(raw), MAX_MESSAGE_CHARS);
}

function sortRoomsByActivityDesc(rooms: WebexRoom[]): WebexRoom[] {
  return rooms
    .slice()
    .sort((a, b) => {
      const aTime = a.lastActivity ? Date.parse(a.lastActivity) : Date.parse(a.created);
      const bTime = b.lastActivity ? Date.parse(b.lastActivity) : Date.parse(b.created);
      return (Number.isFinite(bTime) ? bTime : 0) - (Number.isFinite(aTime) ? aTime : 0);
    });
}

async function collectMessagesForRoom(
  tokenOverride: string | undefined,
  room: WebexRoom,
  myEmail: string,
  messagesPerSpace: number
): Promise<SpaceMessagePack> {
  const result = await listMessages(tokenOverride, { roomId: room.id, max: messagesPerSpace });
  const items = (result.items || [])
    .map((m) => {
      const text = normalizeText(m);
      if (!text) return null;
      const senderEmail = String(m.personEmail || "").toLowerCase();
      const senderRole: "me" | "other" | "unknown" = !senderEmail
        ? "unknown"
        : senderEmail === myEmail
          ? "me"
          : "other";
      return {
        id: m.id,
        created: m.created,
        senderEmail,
        senderRole,
        text,
      };
    })
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .reverse(); // oldest -> newest to preserve conversational flow for model

  return {
    roomId: room.id,
    title: room.title || "Direct Message",
    lastActivity: room.lastActivity,
    messages: items,
  };
}

export async function analyzePendingFollowups(
  tokenOverride: string | undefined,
  options: PendingFollowupOptions
): Promise<PendingFollowupResult> {
  const me = await getMe(tokenOverride);
  const myEmail = String(me.emails?.[0] || "").toLowerCase();

  const roomResult = await listRooms(tokenOverride, {
    type: "direct",
    sortBy: "lastactivity",
    max: options.maxSpaces,
  });

  const rooms = sortRoomsByActivityDesc(roomResult.items || []).slice(0, options.maxSpaces);
  const packs = await Promise.all(
    rooms.map((room) =>
      collectMessagesForRoom(tokenOverride, room, myEmail, options.messagesPerSpace)
    )
  );
  const filteredPacks = packs.filter((pack) => pack.messages.length > 0);

  return {
    scannedSpacesCount: rooms.length,
    directSpaces: filteredPacks,
    mode: "webex_data_only",
    note: "Returned Webex direct-message data only (no LLM analysis).",
  };
}
