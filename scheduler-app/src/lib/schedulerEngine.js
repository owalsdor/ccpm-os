const crypto = require("crypto");
const {
  normalizeRecurrence,
  isRecurring,
  nextScheduledAfterRun,
} = require("./recurrence");
const { isInternetReachable } = require("./internetReachable");

class SchedulerEngine {
  constructor({ store, runner, commandCatalog, onEvent }) {
    this.store = store;
    this.runner = runner;
    this.commandCatalog = commandCatalog;
    this.onEvent = onEvent || (() => {});
    this.intervalRef = null;
    this.runningJobs = new Set();
  }

  start() {
    this.stop();
    this.intervalRef = setInterval(() => {
      this.tick().catch((err) => {
        this.onEvent({ type: "scheduler-error", payload: { message: err.message } });
      });
    }, 30_000);
  }

  stop() {
    if (this.intervalRef) clearInterval(this.intervalRef);
    this.intervalRef = null;
  }

  rebuild() {
    // No-op for v1. The tick loop always reads store state.
  }

  async tick() {
    if (!(await isInternetReachable())) {
      return;
    }
    const now = Date.now();
    const jobs = this.store.getJobs();
    for (const job of jobs) {
      if (!job.enabled) continue;
      if (this.runningJobs.has(job.id)) continue;
      if (new Date(job.scheduledAt).getTime() <= now) {
        this.runJob(job.id, false).catch((err) => {
          this.onEvent({
            type: "run-error",
            payload: { jobId: job.id, message: err.message },
          });
        });
      }
    }
  }

  async runNow(jobId) {
    return this.runJob(jobId, true);
  }

  findCommand(job) {
    return this.commandCatalog.find((command) => command.id === job.commandId);
  }

  async runJob(jobId, manualTrigger) {
    const job = this.store.getJobById(jobId);
    if (!job) throw new Error(`Job not found: ${jobId}`);
    const command = this.findCommand(job);
    if (!command) throw new Error(`Command not found for job ${jobId}`);
    if (this.runningJobs.has(job.id)) return { ok: false, reason: "already-running" };

    if (!(await isInternetReachable())) {
      return {
        ok: false,
        error: "No network connection; try again when online.",
      };
    }

    const dueScheduledAt = job.scheduledAt;
    let recurrenceNorm;
    try {
      recurrenceNorm = normalizeRecurrence(job.recurrence);
    } catch (_err) {
      recurrenceNorm = { mode: "once" };
    }
    const recurring = isRecurring(recurrenceNorm);

    this.runningJobs.add(job.id);
    const startedAt = new Date().toISOString();
    this.store.updateJob(job.id, {
      status: "running",
      lastRunAt: startedAt,
    });

    this.onEvent({ type: "run-started", payload: { jobId: job.id, manualTrigger } });

    try {
      const result = await this.runner.execute({ job, command });
      const finishedAt = new Date().toISOString();
      if (recurring) {
        const patch = {
          status: "scheduled",
          enabled: true,
          updatedAt: finishedAt,
        };
        if (!manualTrigger) {
          const nextAt = nextScheduledAfterRun(recurrenceNorm, new Date(dueScheduledAt));
          patch.scheduledAt = nextAt.toISOString();
        }
        this.store.updateJob(job.id, patch);
      } else {
        this.store.updateJob(job.id, {
          status: "completed",
          enabled: false,
          updatedAt: finishedAt,
        });
      }

      this.store.appendRun({
        id: crypto.randomUUID(),
        jobId: job.id,
        commandName: command.commandName,
        startedAt,
        finishedAt,
        status: "completed",
        stopReason: result.stopReason,
        permissionRequests: result.permissionRequests,
        output: result.output,
      });

      this.onEvent({
        type: "run-completed",
        payload: { jobId: job.id, result },
      });
      return { ok: true, result };
    } catch (err) {
      const finishedAt = new Date().toISOString();
      if (recurring) {
        const patch = {
          status: "scheduled",
          enabled: true,
          updatedAt: finishedAt,
        };
        if (!manualTrigger) {
          const nextAt = nextScheduledAfterRun(recurrenceNorm, new Date(dueScheduledAt));
          patch.scheduledAt = nextAt.toISOString();
        }
        this.store.updateJob(job.id, patch);
      } else {
        this.store.updateJob(job.id, {
          status: "failed",
          enabled: false,
          updatedAt: finishedAt,
        });
      }
      const partialOut =
        err && typeof err.partialOutput === "string" ? err.partialOutput : "";
      this.store.appendRun({
        id: crypto.randomUUID(),
        jobId: job.id,
        commandName: command.commandName,
        startedAt,
        finishedAt,
        status: "failed",
        stopReason: "error",
        permissionRequests: 0,
        output: partialOut,
        error: err.message,
      });
      this.onEvent({
        type: "run-failed",
        payload: {
          jobId: job.id,
          message: err.message,
          partialOutput: err.partialOutput || "",
        },
      });
      return { ok: false, error: err.message };
    } finally {
      this.runningJobs.delete(job.id);
    }
  }
}

module.exports = {
  SchedulerEngine,
};
