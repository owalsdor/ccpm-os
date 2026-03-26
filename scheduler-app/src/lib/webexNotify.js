/**
 * Send a message via Webex REST API.
 * Use either roomId (typical for bots) or toPersonEmail — not both (API rule).
 * @see https://developer.webex.com/docs/api/v1/messages/create-a-message
 */

const WEBEX_MAX_MARKDOWN = 6800;
const WEBEX_MAX_TEXT = 7439;

function markdownToPlain(md) {
  return String(md || "")
    .replace(/```[\s\S]*?```/g, "\n")
    .replace(/`+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s?/g, "")
    .trim();
}

function formatWebexError(data, status) {
  if (data && typeof data.message === "string" && data.message) return data.message;
  if (Array.isArray(data?.errors)) {
    const e = data.errors[0];
    if (typeof e === "string") return e;
    if (e && typeof e.description === "string") return e.description;
    if (e && typeof e.message === "string") return e.message;
    try {
      return JSON.stringify(e);
    } catch (_err) {
      return String(e);
    }
  }
  if (data && typeof data.trackingId === "string") {
    return `Webex error (${status}). trackingId: ${data.trackingId}`;
  }
  return `Webex request failed (HTTP ${status})`;
}

/**
 * @param {object} opts
 * @param {string} opts.accessToken
 * @param {string} [opts.toPersonEmail]
 * @param {string} [opts.roomId]
 * @param {string} opts.markdown
 * @param {(url: string, init?: RequestInit) => Promise<Response>} [opts.fetchImpl] — use Electron net.fetch in main process
 */
async function sendWebexDirectMessage({ accessToken, toPersonEmail, roomId, markdown, fetchImpl }) {
  const token = String(accessToken || "").trim();
  const room = String(roomId || "").trim();
  const email = String(toPersonEmail || "").trim();
  if (!token) throw new Error("Webex access token is not configured");
  if (!room && !email) {
    throw new Error("Configure either a Webex room ID (for bots) or recipient email in Settings");
  }

  let md = String(markdown || "");
  if (md.length > WEBEX_MAX_MARKDOWN) {
    md = `${md.slice(0, WEBEX_MAX_MARKDOWN - 40)}\n\n… _(truncated)_`;
  }

  const plain = markdownToPlain(md).slice(0, WEBEX_MAX_TEXT);

  const body = {
    markdown: md,
    text: plain || "(see markdown)",
  };
  if (room) {
    body.roomId = room;
  } else {
    body.toPersonEmail = email;
  }

  const fetchFn = fetchImpl || globalThis.fetch;
  if (typeof fetchFn !== "function") {
    throw new Error("HTTP client (fetch) is not available");
  }

  const res = await fetchFn("https://webexapis.com/v1/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(formatWebexError(data, res.status));
  }
  return data;
}

/** Avoid breaking markdown fences when echoing command output. */
function escapeTripleBackticks(s) {
  return String(s).replace(/```/g, "`\u200b``");
}

function outputBlock(label, body) {
  const raw = body != null ? String(body) : "";
  if (!raw.trim()) return `**${label}**\n\n_(none)_\n`;
  return `**${label}**\n\n\`\`\`\n${escapeTripleBackticks(raw)}\n\`\`\`\n`;
}

function formatRunMarkdown(job, run) {
  const ok = run.status === "completed";
  const cmd = job.commandName || "Task";
  const when = run.startedAt ? new Date(run.startedAt).toLocaleString() : "—";
  let text = `**CCPM Scheduler**\n\n**Task:** ${cmd}\n**Status:** ${ok ? "Success" : "Failed"}\n**Run at:** ${when}\n\n`;
  if (ok) {
    text += outputBlock("Output", run.output);
  } else {
    const err = run.error != null ? String(run.error) : "Unknown error";
    text += `**Error:** ${err}\n\n`;
    text += outputBlock("Partial output", run.output);
  }
  return text;
}

module.exports = {
  sendWebexDirectMessage,
  formatRunMarkdown,
};
