const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const {
  normalizeRecurrence,
  isRecurring,
  initialScheduledAt,
} = require("./recurrence");

/** Execution records older than this are removed on load and when appending new runs. */
const RUN_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

class SchedulerStore {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.filePath = path.join(baseDir, "scheduler-data.json");
    this.data = {
      jobs: [],
      runs: [],
    };
  }

  load() {
    fs.mkdirSync(this.baseDir, { recursive: true });
    if (!fs.existsSync(this.filePath)) {
      this.save();
      return;
    }
    const raw = fs.readFileSync(this.filePath, "utf8");
    this.data = JSON.parse(raw);
    if (!Array.isArray(this.data.jobs)) this.data.jobs = [];
    if (!Array.isArray(this.data.runs)) this.data.runs = [];
    let migrated = false;
    for (const job of this.data.jobs) {
      if (job.outputDestination == null || job.outputDestination === "") {
        job.outputDestination = "scheduler";
        migrated = true;
      }
      if (job.recurrence == null) {
        job.recurrence = { mode: "once" };
        migrated = true;
      } else if (
        job.recurrence.mode === "weekly" &&
        !job.recurrence.weekdays &&
        job.recurrence.weekday != null
      ) {
        job.recurrence.weekdays = [job.recurrence.weekday];
        delete job.recurrence.weekday;
        migrated = true;
      }
    }
    if (migrated) this.save();
    this.pruneExpiredRuns();
  }

  pruneExpiredRuns() {
    const cutoff = Date.now() - RUN_RETENTION_MS;
    const before = this.data.runs.length;
    this.data.runs = this.data.runs.filter((run) => {
      const t = Date.parse(run.startedAt);
      return !Number.isNaN(t) && t >= cutoff;
    });
    if (this.data.runs.length !== before) {
      this.save();
    }
  }

  save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), "utf8");
  }

  getJobs() {
    return [...this.data.jobs].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  }

  getRuns(limit = 200) {
    this.pruneExpiredRuns();
    return [...this.data.runs]
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
      .slice(0, limit);
  }

  getJobById(jobId) {
    return this.data.jobs.find((job) => job.id === jobId);
  }

  /** Most recent run for a job by `startedAt` (ISO string). */
  getLatestRunForJob(jobId) {
    this.pruneExpiredRuns();
    let best = null;
    for (const run of this.data.runs) {
      if (run.jobId !== jobId) continue;
      if (!best || run.startedAt > best.startedAt) best = run;
    }
    return best;
  }

  createJob(payload) {
    const now = new Date().toISOString();
    const model =
      payload.model != null && String(payload.model).trim() !== ""
        ? String(payload.model).trim()
        : null;
    let recurrence;
    try {
      recurrence = normalizeRecurrence(payload.recurrence);
    } catch (_err) {
      recurrence = { mode: "once" };
    }
    let scheduledAt = payload.scheduledAt;
    if (isRecurring(recurrence)) {
      scheduledAt = initialScheduledAt(recurrence, new Date()).toISOString();
    }
    const outputDestination =
      payload.outputDestination === "webex" ? "webex" : "scheduler";
    const job = {
      id: crypto.randomUUID(),
      commandId: payload.commandId,
      commandName: payload.commandName,
      commandFilePath: payload.commandFilePath,
      userInput: payload.userInput || "",
      model,
      outputDestination,
      recurrence,
      scheduledAt,
      enabled: payload.enabled ?? true,
      permissionMode: payload.permissionMode || "allow-always",
      status: "scheduled",
      createdAt: now,
      updatedAt: now,
      lastRunAt: null,
    };
    this.data.jobs.push(job);
    this.save();
    return job;
  }

  updateJob(jobId, updates) {
    const job = this.getJobById(jobId);
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }
    const next = { ...updates };
    if (next.outputDestination !== undefined) {
      next.outputDestination = next.outputDestination === "webex" ? "webex" : "scheduler";
    }
    if (next.recurrence !== undefined) {
      try {
        next.recurrence = normalizeRecurrence(next.recurrence);
      } catch (_err) {
        next.recurrence = { mode: "once" };
      }
      if (isRecurring(next.recurrence)) {
        next.scheduledAt = initialScheduledAt(next.recurrence, new Date()).toISOString();
      }
    }
    Object.assign(job, next, { updatedAt: new Date().toISOString() });
    this.save();
    return job;
  }

  deleteJob(jobId) {
    this.data.jobs = this.data.jobs.filter((job) => job.id !== jobId);
    this.save();
  }

  appendRun(run) {
    this.pruneExpiredRuns();
    this.data.runs.push(run);
    this.save();
  }
}

module.exports = {
  SchedulerStore,
};
