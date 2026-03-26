/**
 * Local-wall-clock recurrence (same mental model as datetime-local).
 * DST edge cases are acceptable for v1.
 *
 * Weekly: `weekdays` is a sorted list of JS day indices (0=Sun … 6=Sat).
 * Legacy persisted jobs may use single `weekday`; normalize maps to `weekdays: [weekday]`.
 * `intervalWeeks` > 1 is only meaningful with exactly one weekday; otherwise forced to 1.
 */

function parseTimeLocal(s) {
  if (s == null || typeof s !== "string") {
    throw new Error("timeLocal must be a string");
  }
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) {
    throw new Error("timeLocal must be HH:mm");
  }
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (!Number.isFinite(hh) || !Number.isFinite(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
    throw new Error("Invalid timeLocal");
  }
  return { h: hh, m: mm };
}

function parseWeekdays(raw) {
  if (Array.isArray(raw.weekdays) && raw.weekdays.length > 0) {
    const ws = [
      ...new Set(
        raw.weekdays.map(Number).filter((w) => Number.isInteger(w) && w >= 0 && w <= 6),
      ),
    ].sort((a, b) => a - b);
    if (ws.length > 0) return ws;
  }
  if (raw.weekday != null && raw.weekday !== "") {
    const wd = Number(raw.weekday);
    if (Number.isInteger(wd) && wd >= 0 && wd <= 6) return [wd];
  }
  return null;
}

function normalizeRecurrence(raw) {
  if (raw == null || raw === "" || raw.mode === "once" || raw.mode == null) {
    return { mode: "once" };
  }
  if (raw.mode === "daily") {
    const timeLocal = String(raw.timeLocal || "").trim();
    parseTimeLocal(timeLocal);
    return { mode: "daily", timeLocal };
  }
  if (raw.mode === "weekly") {
    const weekdays = parseWeekdays(raw);
    if (!weekdays || weekdays.length === 0) {
      throw new Error("Select at least one day of the week");
    }
    const timeLocal = String(raw.timeLocal || "").trim();
    parseTimeLocal(timeLocal);
    let intervalWeeks = Number(raw.intervalWeeks);
    if (!Number.isFinite(intervalWeeks)) intervalWeeks = 1;
    intervalWeeks = Math.max(1, Math.min(8, Math.floor(intervalWeeks)));
    if (weekdays.length > 1) {
      intervalWeeks = 1;
    }
    return { mode: "weekly", weekdays, timeLocal, intervalWeeks };
  }
  return { mode: "once" };
}

function isRecurring(recurrence) {
  const r = recurrence && recurrence.mode;
  return r === "daily" || r === "weekly";
}

/**
 * Next instant on one of `weekdays` at `timeLocal`, strictly after `from`.
 */
function nextWeeklySlotAfter(from, weekdays, timeLocal) {
  const { h, m } = parseTimeLocal(timeLocal);
  const afterMs = from.getTime();
  const daySet = new Set(weekdays);
  const base = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (let add = 0; add < 400; add++) {
    const d = new Date(base);
    d.setDate(base.getDate() + add);
    d.setHours(h, m, 0, 0);
    d.setSeconds(0, 0);
    d.setMilliseconds(0);
    if (daySet.has(d.getDay()) && d.getTime() > afterMs) {
      return d;
    }
  }
  throw new Error("Could not find next weekly occurrence");
}

/**
 * First run at or after the recurrence rule, strictly after `from`.
 */
function initialScheduledAt(recurrence, from = new Date()) {
  const norm = normalizeRecurrence(recurrence);
  if (!isRecurring(norm)) {
    return null;
  }
  return nextOccurrenceAfter(norm, from);
}

/**
 * Next instant matching the rule, strictly after `from`.
 */
function nextOccurrenceAfter(recurrence, from) {
  const norm = normalizeRecurrence(recurrence);
  if (norm.mode === "daily") {
    const { h, m } = parseTimeLocal(norm.timeLocal);
    const d = new Date(from.getTime());
    d.setMilliseconds(0);
    d.setSeconds(0, 0);
    d.setHours(h, m, 0, 0);
    if (d.getTime() <= from.getTime()) {
      d.setDate(d.getDate() + 1);
      d.setHours(h, m, 0, 0);
    }
    return d;
  }
  if (norm.mode === "weekly") {
    return nextWeeklySlotAfter(from, norm.weekdays, norm.timeLocal);
  }
  return null;
}

/**
 * Next automatic run after a job fired at `due` (the scheduledAt that triggered).
 */
function nextScheduledAfterRun(recurrence, due) {
  const norm = normalizeRecurrence(recurrence);
  if (norm.mode === "daily") {
    const { h, m } = parseTimeLocal(norm.timeLocal);
    const d = new Date(due.getTime());
    d.setDate(d.getDate() + 1);
    d.setHours(h, m, 0, 0);
    d.setSeconds(0, 0);
    d.setMilliseconds(0);
    return d;
  }
  if (norm.mode === "weekly") {
    const { h, m } = parseTimeLocal(norm.timeLocal);
    if (norm.weekdays.length === 1 && (norm.intervalWeeks || 1) > 1) {
      const add = 7 * (norm.intervalWeeks || 1);
      const d = new Date(due.getTime());
      d.setDate(d.getDate() + add);
      d.setHours(h, m, 0, 0);
      d.setSeconds(0, 0);
      d.setMilliseconds(0);
      return d;
    }
    return nextWeeklySlotAfter(due, norm.weekdays, norm.timeLocal);
  }
  return null;
}

module.exports = {
  parseTimeLocal,
  normalizeRecurrence,
  isRecurring,
  initialScheduledAt,
  nextOccurrenceAfter,
  nextScheduledAfterRun,
};
