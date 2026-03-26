const state = {
  commands: [],
  jobs: [],
  runs: [],
  config: null,
  streamBufferByJobId: {},
  activeJobId: null,
  showDebugLogs: false,
  editingJobId: null,
};

const elements = {
  viewDashboard: document.getElementById("view-dashboard"),
  viewHistory: document.getElementById("view-history"),
  viewSettings: document.getElementById("view-settings"),
  navBack: document.getElementById("nav-back"),
  appTitle: document.getElementById("app-title"),
  btnHistory: document.getElementById("btn-history"),
  btnSettings: document.getElementById("btn-settings"),
  taskGrid: document.getElementById("task-grid"),
  dashboardEmpty: document.getElementById("dashboard-empty"),
  modalOverlay: document.getElementById("modal-overlay"),
  modalClose: document.getElementById("modal-close"),
  modalTaskTitle: document.getElementById("modal-task-title"),
  fabCreate: document.getElementById("fab-create"),
  scheduleSubmit: document.getElementById("schedule-submit"),
  commandSearch: document.getElementById("command-search"),
  commandList: document.getElementById("command-list"),
  commandSelect: document.getElementById("command-select"),
  scheduleForm: document.getElementById("schedule-form"),
  userInput: document.getElementById("user-input"),
  scheduledAt: document.getElementById("scheduled-at"),
  frequencySelect: document.getElementById("frequency-select"),
  recurrenceOnce: document.getElementById("recurrence-once"),
  recurrenceDaily: document.getElementById("recurrence-daily"),
  recurrenceWeekly: document.getElementById("recurrence-weekly"),
  recurrenceTimeDaily: document.getElementById("recurrence-time-daily"),
  recurrenceTimeWeekly: document.getElementById("recurrence-time-weekly"),
  weekdayToggleRow: document.getElementById("weekday-toggle-row"),
  recurrenceIntervalRow: document.getElementById("recurrence-interval-row"),
  recurrenceIntervalWeeks: document.getElementById("recurrence-interval-weeks"),
  recurrencePreview: document.getElementById("recurrence-preview"),
  permissionMode: document.getElementById("permission-mode"),
  outputDestinationSelect: document.getElementById("output-destination-select"),
  modelSelect: document.getElementById("model-select"),
  modelHint: document.getElementById("model-hint"),
  logs: document.getElementById("logs"),
  debugLogsWrap: document.getElementById("debug-logs-wrap"),
  executionHistoryBody: document.getElementById("execution-history-body"),
  historyEmpty: document.getElementById("history-empty"),
  debugToggle: document.getElementById("debug-toggle"),
  outputModalOverlay: document.getElementById("output-modal-overlay"),
  outputModalClose: document.getElementById("output-modal-close"),
  outputModalCommand: document.getElementById("output-modal-command"),
  outputModalStatus: document.getElementById("output-modal-status"),
  outputModalTime: document.getElementById("output-modal-time"),
  outputModalText: document.getElementById("output-modal-text"),
  commandsSourceBtn: document.getElementById("commands-source-btn"),
  commandsSourcePath: document.getElementById("commands-source-path"),
  stayAwakeSwitch: document.getElementById("stay-awake-switch"),
  settingsCommandsPath: document.getElementById("settings-commands-path"),
  settingsPickFolder: document.getElementById("settings-pick-folder"),
  settingsWebexRoom: document.getElementById("settings-webex-room"),
  settingsWebexEmail: document.getElementById("settings-webex-email"),
  settingsWebexToken: document.getElementById("settings-webex-token"),
  settingsWebexTokenHint: document.getElementById("settings-webex-token-hint"),
  settingsSave: document.getElementById("settings-save"),
  settingsTestWebex: document.getElementById("settings-test-webex"),
  settingsSaveStatus: document.getElementById("settings-save-status"),
};

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text == null ? "" : String(text);
  return div.innerHTML;
}

function truncateText(s, max) {
  const str = s == null ? "" : String(s);
  if (str.length <= max) return str;
  return `${str.slice(0, max - 1)}…`;
}

function appendLog(line) {
  if (!elements.logs) return;
  const timestamp = new Date().toISOString();
  elements.logs.textContent += `[${timestamp}] ${line}\n`;
  elements.logs.scrollTop = elements.logs.scrollHeight;
}

function openOutputModal(fields, options = {}) {
  const { commandName, statusLabel, timeLabel, outputText } = fields;
  elements.outputModalCommand.textContent = commandName || "—";
  elements.outputModalStatus.textContent = statusLabel || "—";
  elements.outputModalTime.textContent = timeLabel || "—";
  elements.outputModalText.value = outputText || "";
  if (options.liveJobId) {
    elements.outputModalOverlay.dataset.liveJobId = options.liveJobId;
  } else {
    delete elements.outputModalOverlay.dataset.liveJobId;
  }
  elements.outputModalOverlay.classList.remove("hidden");
  elements.outputModalOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeOutputModal() {
  delete elements.outputModalOverlay.dataset.liveJobId;
  elements.outputModalOverlay.classList.add("hidden");
  elements.outputModalOverlay.setAttribute("aria-hidden", "true");
  if (elements.modalOverlay.classList.contains("hidden")) {
    document.body.classList.remove("modal-open");
  }
}

function refreshLiveOutputModal() {
  const liveId = elements.outputModalOverlay.dataset.liveJobId;
  if (!liveId || elements.outputModalOverlay.classList.contains("hidden")) return;
  if (state.activeJobId !== liveId) return;
  elements.outputModalText.value = state.streamBufferByJobId[liveId] || "";
}

function runOutputText(run) {
  if (!run) return "";
  const o = run.output != null ? String(run.output) : "";
  if (run.status === "failed" && run.error) {
    return o ? `${o}\n\n---\nError: ${run.error}` : `Error: ${run.error}`;
  }
  return o || "";
}

function toDateTimeLocal(isoString) {
  const date = new Date(isoString || Date.now() + 60000);
  const pad = (n) => `${n}`.padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function jobWeekdays(r) {
  if (r.weekdays && r.weekdays.length > 0) return [...r.weekdays].sort((a, b) => a - b);
  if (r.weekday != null && r.weekday !== "") return [Number(r.weekday)];
  return [];
}

function recurrenceSummary(job) {
  const r = job.recurrence && job.recurrence.mode != null ? job.recurrence : { mode: "once" };
  if (r.mode === "daily") return `Daily · ${r.timeLocal || "—"}`;
  if (r.mode === "weekly") {
    const letters = ["S", "M", "T", "W", "T", "F", "S"];
    const days = jobWeekdays(r);
    const dayPart = days.map((d) => letters[d] ?? "?").join(" · ");
    const t = r.timeLocal || "—";
    if (days.length > 1) return `${dayPart} · ${t}`;
    if (days.length === 1 && r.intervalWeeks > 1) return `Every ${r.intervalWeeks} wk · ${dayPart} · ${t}`;
    if (days.length === 1) return `Weekly · ${dayPart} · ${t}`;
    return `Weekly · ${t}`;
  }
  return "Once";
}

function getSelectedWeekdays() {
  if (!elements.weekdayToggleRow) return [];
  const out = [];
  elements.weekdayToggleRow.querySelectorAll(".weekday-toggle").forEach((btn) => {
    if (btn.getAttribute("aria-pressed") === "true") {
      out.push(Number(btn.dataset.weekday));
    }
  });
  return [...new Set(out)].sort((a, b) => a - b);
}

function setWeekdaySelection(weekdayIds) {
  if (!elements.weekdayToggleRow) return;
  const set = new Set(weekdayIds);
  elements.weekdayToggleRow.querySelectorAll(".weekday-toggle").forEach((btn) => {
    const wd = Number(btn.dataset.weekday);
    btn.setAttribute("aria-pressed", set.has(wd) ? "true" : "false");
  });
}

function buildRecurrenceFromForm() {
  const freq = elements.frequencySelect.value;
  if (freq === "once") return { mode: "once" };
  if (freq === "daily") {
    return { mode: "daily", timeLocal: (elements.recurrenceTimeDaily.value || "").trim() };
  }
  if (freq === "weekly") {
    const weekdays = getSelectedWeekdays();
    const intervalWeeks =
      weekdays.length === 1
        ? Math.max(1, Math.min(8, Number(elements.recurrenceIntervalWeeks.value) || 1))
        : 1;
    return {
      mode: "weekly",
      weekdays,
      timeLocal: (elements.recurrenceTimeWeekly.value || "").trim(),
      intervalWeeks,
    };
  }
  return { mode: "once" };
}

async function refreshRecurrencePreview() {
  if (!elements.recurrencePreview) return;
  const freq = elements.frequencySelect.value;
  if (freq === "once") {
    elements.recurrencePreview.classList.add("hidden");
    elements.recurrencePreview.textContent = "";
    return;
  }
  if (typeof window.schedulerApi.previewSchedule !== "function") {
    elements.recurrencePreview.classList.add("hidden");
    return;
  }
  const rec = buildRecurrenceFromForm();
  if (freq === "daily" && !rec.timeLocal) {
    elements.recurrencePreview.classList.add("hidden");
    return;
  }
  if (
    freq === "weekly" &&
    (!rec.timeLocal || !rec.weekdays || rec.weekdays.length === 0)
  ) {
    elements.recurrencePreview.classList.add("hidden");
    return;
  }
  const res = await window.schedulerApi.previewSchedule(rec);
  if (!res.ok) {
    elements.recurrencePreview.textContent = res.error;
    elements.recurrencePreview.classList.remove("hidden");
    return;
  }
  elements.recurrencePreview.textContent = `Next run: ${new Date(res.scheduledAt).toLocaleString()}`;
  elements.recurrencePreview.classList.remove("hidden");
}

function syncRecurrenceUI() {
  const freq = elements.frequencySelect.value;
  elements.recurrenceOnce.classList.toggle("hidden", freq !== "once");
  elements.recurrenceDaily.classList.toggle("hidden", freq !== "daily");
  elements.recurrenceWeekly.classList.toggle("hidden", freq !== "weekly");

  if (elements.scheduledAt) elements.scheduledAt.required = freq === "once";
  if (elements.recurrenceTimeDaily) elements.recurrenceTimeDaily.required = freq === "daily";
  if (elements.recurrenceTimeWeekly) elements.recurrenceTimeWeekly.required = freq === "weekly";

  const weeklySelected = getSelectedWeekdays();
  const showInterval = freq === "weekly" && weeklySelected.length === 1;
  if (elements.recurrenceIntervalRow) {
    elements.recurrenceIntervalRow.classList.toggle("hidden", !showInterval);
  }
  if (!showInterval && elements.recurrenceIntervalWeeks) {
    elements.recurrenceIntervalWeeks.value = "1";
  }
  if (elements.recurrenceIntervalWeeks) {
    elements.recurrenceIntervalWeeks.required = showInterval;
  }

  refreshRecurrencePreview().catch(() => {});
}

function showView(name) {
  if (name === "dashboard") {
    elements.viewDashboard.classList.add("view--active");
    elements.viewHistory.classList.remove("view--active");
    if (elements.viewSettings) elements.viewSettings.classList.remove("view--active");
    elements.navBack.hidden = true;
    elements.btnHistory.hidden = false;
    if (elements.btnSettings) elements.btnSettings.hidden = false;
    elements.appTitle.textContent = "CCPM-OS Scheduler";
    elements.fabCreate.hidden = false;
  } else if (name === "settings" && elements.viewSettings) {
    elements.viewDashboard.classList.remove("view--active");
    elements.viewHistory.classList.remove("view--active");
    elements.viewSettings.classList.add("view--active");
    elements.navBack.hidden = false;
    elements.btnHistory.hidden = true;
    if (elements.btnSettings) elements.btnSettings.hidden = true;
    elements.appTitle.textContent = "Settings";
    elements.fabCreate.hidden = true;
  } else {
    elements.viewDashboard.classList.remove("view--active");
    elements.viewHistory.classList.add("view--active");
    if (elements.viewSettings) elements.viewSettings.classList.remove("view--active");
    elements.navBack.hidden = false;
    elements.btnHistory.hidden = true;
    if (elements.btnSettings) elements.btnSettings.hidden = true;
    elements.appTitle.textContent = "Execution history";
    elements.fabCreate.hidden = true;
  }
}

function openTaskModal() {
  elements.modalOverlay.classList.remove("hidden");
  elements.modalOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeTaskModal() {
  state.editingJobId = null;
  elements.modalOverlay.classList.add("hidden");
  elements.modalOverlay.setAttribute("aria-hidden", "true");
  if (elements.outputModalOverlay.classList.contains("hidden")) {
    document.body.classList.remove("modal-open");
  }
}

function openCreateModal() {
  state.editingJobId = null;
  elements.modalTaskTitle.textContent = "New scheduled task";
  elements.scheduleSubmit.textContent = "Create task";
  elements.scheduleForm.reset();
  if (elements.outputDestinationSelect) elements.outputDestinationSelect.value = "scheduler";
  elements.frequencySelect.value = "once";
  if (elements.recurrenceTimeDaily) elements.recurrenceTimeDaily.value = "09:00";
  if (elements.recurrenceTimeWeekly) elements.recurrenceTimeWeekly.value = "09:00";
  if (elements.recurrenceIntervalWeeks) elements.recurrenceIntervalWeeks.value = "1";
  setWeekdaySelection([1]);
  if (!elements.scheduledAt.value) {
    elements.scheduledAt.value = toDateTimeLocal();
  }
  syncRecurrenceUI();
  renderCommandSelect();
  openTaskModal();
}

function openEditModal(job) {
  state.editingJobId = job.id;
  elements.modalTaskTitle.textContent = "Edit task";
  elements.scheduleSubmit.textContent = "Save changes";
  renderCommandSelect();
  elements.commandSelect.value = job.commandId;
  elements.userInput.value = job.userInput || "";
  const r = job.recurrence && job.recurrence.mode != null ? job.recurrence : { mode: "once" };
  if (r.mode === "daily") {
    elements.frequencySelect.value = "daily";
    if (elements.recurrenceTimeDaily) elements.recurrenceTimeDaily.value = r.timeLocal || "09:00";
  } else if (r.mode === "weekly") {
    elements.frequencySelect.value = "weekly";
    const wds = jobWeekdays(r);
    setWeekdaySelection(wds.length > 0 ? wds : [1]);
    if (elements.recurrenceTimeWeekly) elements.recurrenceTimeWeekly.value = r.timeLocal || "09:00";
    if (elements.recurrenceIntervalWeeks) {
      elements.recurrenceIntervalWeeks.value = String(Math.min(8, Math.max(1, r.intervalWeeks || 1)));
    }
  } else {
    elements.frequencySelect.value = "once";
    elements.scheduledAt.value = toDateTimeLocal(job.scheduledAt);
  }
  syncRecurrenceUI();
  if (r.mode !== "once") {
    elements.scheduledAt.value = toDateTimeLocal(job.scheduledAt);
  }
  elements.permissionMode.value = job.permissionMode || "allow-always";
  if (elements.outputDestinationSelect) {
    elements.outputDestinationSelect.value = jobOutputDestination(job) === "webex" ? "webex" : "scheduler";
  }
  const modelVal = job.model || "";
  elements.modelSelect.value = modelVal;
  if (modelVal && !Array.from(elements.modelSelect.options).some((o) => o.value === modelVal)) {
    const opt = document.createElement("option");
    opt.value = modelVal;
    opt.textContent = modelVal;
    elements.modelSelect.appendChild(opt);
    elements.modelSelect.value = modelVal;
  }
  openTaskModal();
}

function renderCommandList() {
  const query = elements.commandSearch.value.trim().toLowerCase();
  const filtered = state.commands.filter((command) => {
    if (!query) return true;
    return (
      command.commandName.toLowerCase().includes(query) ||
      command.description.toLowerCase().includes(query) ||
      command.title.toLowerCase().includes(query)
    );
  });

  elements.commandList.innerHTML = "";
  for (const command of filtered) {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${escapeHtml(command.commandName)}</strong><br />
      <span>${escapeHtml(command.description || "(no description)")}</span><br />
      <small>${escapeHtml(command.filePath)}</small>
    `;
    li.addEventListener("click", () => {
      elements.commandSelect.value = command.id;
    });
    elements.commandList.appendChild(li);
  }
}

function renderCommandSelect() {
  elements.commandSelect.innerHTML = "";
  const groups = new Map();
  for (const command of state.commands) {
    const label = command.folderGroup || command.category || "General";
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(command);
  }
  const sortedLabels = [...groups.keys()].sort((a, b) => a.localeCompare(b));
  for (const label of sortedLabels) {
    const cmds = groups.get(label).slice().sort((a, b) => a.commandName.localeCompare(b.commandName));
    const optgroup = document.createElement("optgroup");
    optgroup.label = label;
    for (const command of cmds) {
      const option = document.createElement("option");
      option.value = command.id;
      option.textContent = `${command.commandName} - ${command.description}`;
      optgroup.appendChild(option);
    }
    elements.commandSelect.appendChild(optgroup);
  }
}

function modelLabelForJob(job) {
  if (job.model) return job.model;
  return "Default model";
}

function formatLastRun(job) {
  if (!job.lastRunAt) return "Never";
  return new Date(job.lastRunAt).toLocaleString();
}

function getLatestRunForJob(jobId) {
  let best = null;
  for (const run of state.runs) {
    if (run.jobId !== jobId) continue;
    if (!best || run.startedAt > best.startedAt) best = run;
  }
  return best;
}

function statusShowsLastRunFailed(job) {
  if (job.status === "failed") return true;
  const run = getLatestRunForJob(job.id);
  return Boolean(run && run.status === "failed");
}

/** CSS modifier for task-card status line (whitelist only). */
function taskCardStatusModifier(status) {
  if (status === "scheduled" || status === "running" || status === "completed" || status === "failed") {
    return ` task-card__meta--status-${status}`;
  }
  return "";
}

function jobOutputDestination(job) {
  return job.outputDestination === "webex" ? "webex" : "scheduler";
}

/** Inline SVG for task card: output stays in app (opens modal). */
const ICON_OUTPUT_SCHEDULER = `<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 6h16v12H4V6zm2 2v8h12V8H6zm2 14h8v-2H8v2z"/></svg>`;

/** Webex badge: PNG in `src/assets/` (fits inside task icon circle). */
const WEBEX_OUTPUT_BADGE = `<span class="task-card__output-dest task-card__output-dest--webex" role="img" aria-label="Output sent to Webex" title="Output is sent to Webex"><img src="./assets/webex-logo.png" alt="" class="task-card__webex-logo" width="20" height="20" decoding="async" /></span>`;

function renderTaskGrid() {
  elements.taskGrid.innerHTML = "";
  if (state.jobs.length === 0) {
    elements.dashboardEmpty.classList.remove("hidden");
    return;
  }
  elements.dashboardEmpty.classList.add("hidden");

  for (const job of state.jobs) {
    const active = Boolean(job.enabled);
    const dest = jobOutputDestination(job);
    const args = (job.userInput || "").trim();
    const argsLine = args
      ? `Args: ${escapeHtml(truncateText(args, 200))}`
      : `Args: <span class="task-card__args-none">None</span>`;
    const argsTitleAttr = args ? escapeHtml(args) : "";

    const statusFailedClass = statusShowsLastRunFailed(job) ? " task-card__meta--status-failed" : "";

    const outputControl =
      dest === "webex"
        ? WEBEX_OUTPUT_BADGE
        : `<button type="button" data-action="view-output" data-id="${escapeHtml(job.id)}" class="task-card__icon-btn task-card__icon-btn--output-scheduler" aria-label="View output in app" title="View output">${ICON_OUTPUT_SCHEDULER}</button>`;

    const card = document.createElement("article");
    card.className = "task-card";
    card.innerHTML = `
      <div class="task-card__header">
        <span class="status-dot ${active ? "status-dot--active" : "status-dot--paused"}" title="${active ? "Active" : "Paused"}"></span>
        <div class="task-card__header-main">
          <h3 class="task-card__title">${escapeHtml(job.commandName)}</h3>
          <span class="task-card__model-pill" title="${escapeHtml(modelLabelForJob(job))}">${escapeHtml(modelLabelForJob(job))}</span>
          <p class="task-card__meta task-card__meta--status${taskCardStatusModifier(job.status)}${statusFailedClass}">${escapeHtml(job.status)}</p>
        </div>
      </div>
      <p class="task-card__args" title="${argsTitleAttr}">${argsLine}</p>
      <p class="task-card__timing">Last run: ${escapeHtml(formatLastRun(job))}</p>
      <p class="task-card__timing">Next run: ${escapeHtml(new Date(job.scheduledAt).toLocaleString())}</p>
      <p class="task-card__meta task-card__meta--foot">${escapeHtml(recurrenceSummary(job))}</p>
      <div class="task-card__actions">
        <div class="task-card__actions-icons">
          <button type="button" data-action="toggle" data-id="${escapeHtml(job.id)}" class="task-card__icon-btn task-card__icon-btn--toggle" aria-label="${active ? "Pause task" : "Resume task"}" title="${active ? "Pause" : "Resume"}">
            ${
              active
                ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
                : `<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`
            }
          </button>
          <button type="button" data-action="edit" data-id="${escapeHtml(job.id)}" class="task-card__icon-btn task-card__icon-btn--edit" aria-label="Edit task" title="Edit">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          ${outputControl}
          <button type="button" data-action="delete" data-id="${escapeHtml(job.id)}" class="task-card__icon-btn task-card__icon-btn--delete" aria-label="Delete task" title="Delete">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </div>
    `;
    elements.taskGrid.appendChild(card);
  }
}

function renderExecutionHistoryTable() {
  if (!elements.executionHistoryBody || !elements.historyEmpty) return;
  elements.executionHistoryBody.innerHTML = "";
  const runs = [...state.runs].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  if (runs.length === 0) {
    elements.historyEmpty.classList.remove("hidden");
    return;
  }
  elements.historyEmpty.classList.add("hidden");
  for (const run of runs) {
    const tr = document.createElement("tr");
    const ok = run.status === "completed";
    const statusClass = ok ? "execution-status--success" : "execution-status--fail";
    const statusText = ok ? "Success" : "Failed";
    tr.innerHTML = `
      <td>${escapeHtml(run.commandName)}</td>
      <td class="${statusClass}">${escapeHtml(statusText)}</td>
      <td>${escapeHtml(new Date(run.startedAt).toLocaleString())}</td>
      <td class="execution-actions">
        <button type="button" class="secondary" data-action="view-run-output" data-run-id="${escapeHtml(run.id)}">View details</button>
      </td>
    `;
    elements.executionHistoryBody.appendChild(tr);
  }
}

function syncStayAwakeSwitch() {
  if (!elements.stayAwakeSwitch) return;
  const on = !!(state.config && state.config.preventSystemSleep);
  elements.stayAwakeSwitch.setAttribute("aria-checked", on ? "true" : "false");
}

function renderConfig() {
  if (!state.config) return;
  const root = state.config.commandsRoot || "";
  const sourceType = state.config.sourceType || "unknown";
  const count = state.config.commandCount ?? state.commands.length;
  const hasPath = Boolean(root && root !== "(unknown)");
  const tip = hasPath ? `${root}\n${sourceType} · ${count} commands` : "";

  if (elements.commandsSourcePath) {
    elements.commandsSourcePath.textContent = hasPath ? root : "No commands folder set";
    elements.commandsSourcePath.title = tip || "Set the commands folder in Settings";
    elements.commandsSourcePath.classList.toggle("commands-source-path--empty", !hasPath);
  }

  if (elements.commandsSourceBtn) {
    elements.commandsSourceBtn.disabled = !hasPath;
    elements.commandsSourceBtn.title = hasPath ? `Open in file manager: ${root}` : "Set a folder in Settings first";
    elements.commandsSourceBtn.setAttribute(
      "aria-label",
      hasPath ? `Open commands folder: ${root}` : "Open commands folder (set a path first)"
    );
  }

  syncStayAwakeSwitch();
}

function refreshAll() {
  renderCommandList();
  renderCommandSelect();
  renderTaskGrid();
  renderExecutionHistoryTable();
  renderConfig();
}

async function reloadState() {
  const result = await window.schedulerApi.getState();
  state.jobs = result.jobs;
  state.runs = result.runs;
  renderTaskGrid();
  renderExecutionHistoryTable();
}

async function populateModelSelect() {
  if (!elements.modelSelect || !elements.modelHint) return;
  if (typeof window.schedulerApi.getModelOptions !== "function") {
    elements.modelHint.textContent =
      "Model list requires a current build (preload exposes getModelOptions). Rebuild or run from source.";
    appendLog("getModelOptions is missing — update the scheduler app.");
    return;
  }

  elements.modelSelect.innerHTML = "";
  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "Default (agent chooses)";
  elements.modelSelect.appendChild(defaultOpt);

  const res = await window.schedulerApi.getModelOptions();
  if (!res.ok) {
    elements.modelHint.textContent = `Could not load models from Cursor agent: ${res.error}. You can still schedule with Default.`;
    appendLog(`Model list unavailable: ${res.error}`);
    return;
  }
  elements.modelHint.textContent =
    res.options.length > 0
      ? res.usedCliFallback
        ? "Choose a model. List from the Cursor CLI (`agent models`); ACP did not return model options."
        : "Choose which model runs this task. Pulled from the Cursor agent."
      : "No model list from the agent; using Default is recommended.";

  for (const opt of res.options) {
    const option = document.createElement("option");
    option.value = opt.value;
    const label = opt.description ? `${opt.name} — ${opt.description}` : opt.name;
    option.textContent = label;
    elements.modelSelect.appendChild(option);
  }

  if (res.defaultValue) {
    const match = Array.from(elements.modelSelect.options).find((o) => o.value === res.defaultValue);
    if (match) elements.modelSelect.value = res.defaultValue;
  }
}

async function initialize() {
  state.config = await window.schedulerApi.getConfig();
  state.commands = await window.schedulerApi.getCommands();
  const snapshot = await window.schedulerApi.getState();
  state.jobs = snapshot.jobs;
  state.runs = snapshot.runs;

  if (!elements.scheduledAt.value) {
    elements.scheduledAt.value = toDateTimeLocal();
  }
  syncRecurrenceUI();

  refreshAll();
  appendLog(`Loaded ${state.commands.length} commands.`);

  populateModelSelect().catch((err) => {
    appendLog(`Model list error: ${err.message}`);
    if (elements.modelHint) {
      elements.modelHint.textContent = `Could not load models: ${err.message}`;
    }
  });
}

elements.commandSearch.addEventListener("input", renderCommandList);

async function pickCommandsFolderAndReload() {
  const result = await window.schedulerApi.pickCommandsFolder();
  if (!result.ok) {
    if (!result.canceled) appendLog(`Failed to set commands folder: ${result.error}`);
    return;
  }
  appendLog(`Switched commands folder to ${result.commandsRoot}`);
  state.config = await window.schedulerApi.getConfig();
  state.commands = await window.schedulerApi.getCommands();
  await populateModelSelect();
  refreshAll();
}

if (elements.stayAwakeSwitch) {
  elements.stayAwakeSwitch.addEventListener("click", async () => {
    if (typeof window.schedulerApi.setPreventSystemSleep !== "function") {
      appendLog("setPreventSystemSleep is not available — rebuild the app.");
      return;
    }
    const current = elements.stayAwakeSwitch.getAttribute("aria-checked") === "true";
    const next = !current;
    try {
      const res = await window.schedulerApi.setPreventSystemSleep(next);
      if (!res.ok) {
        appendLog(`Stay awake: ${res.error || "failed"}`);
        return;
      }
      state.config = { ...state.config, preventSystemSleep: res.preventSystemSleep };
      syncStayAwakeSwitch();
    } catch (err) {
      appendLog(`Stay awake: ${err.message}`);
    }
  });
}

if (elements.commandsSourceBtn) {
  elements.commandsSourceBtn.addEventListener("click", async () => {
    if (typeof window.schedulerApi.openCommandsFolder !== "function") {
      appendLog("openCommandsFolder is not available — rebuild the app.");
      return;
    }
    const res = await window.schedulerApi.openCommandsFolder();
    if (!res.ok) {
      appendLog(`Open folder: ${res.error}`);
      if (res.path) {
        window.alert(`${res.error}\n\n${res.path}`);
      } else {
        window.alert(res.error);
      }
    }
  });
}
elements.debugToggle.addEventListener("change", () => {
  state.showDebugLogs = elements.debugToggle.checked;
  if (elements.debugLogsWrap) {
    elements.debugLogsWrap.classList.toggle("hidden", !state.showDebugLogs);
  }
  appendLog(`Debug logs ${state.showDebugLogs ? "enabled" : "disabled"}.`);
});

elements.btnHistory.addEventListener("click", () => showView("history"));
elements.navBack.addEventListener("click", () => showView("dashboard"));

async function openSettingsView() {
  if (!elements.viewSettings) return;
  state.config = await window.schedulerApi.getConfig();
  if (elements.settingsCommandsPath) {
    elements.settingsCommandsPath.textContent = state.config.commandsRoot || "—";
  }
  if (elements.settingsWebexRoom) {
    elements.settingsWebexRoom.value = state.config.webexRoomId || "";
  }
  if (elements.settingsWebexEmail) {
    elements.settingsWebexEmail.value = state.config.webexRecipientEmail || "";
  }
  if (elements.settingsWebexToken) elements.settingsWebexToken.value = "";
  if (elements.settingsWebexTokenHint) {
    elements.settingsWebexTokenHint.textContent = state.config.webexTokenConfigured
      ? "A token is saved. Paste a new value only to replace it."
      : "No token saved yet. Paste your Webex access token.";
  }
  if (elements.settingsSaveStatus) elements.settingsSaveStatus.textContent = "";
  showView("settings");
}

if (elements.btnSettings) {
  elements.btnSettings.addEventListener("click", () => {
    openSettingsView().catch((err) => appendLog(`Settings: ${err.message}`));
  });
}

if (elements.settingsPickFolder) {
  elements.settingsPickFolder.addEventListener("click", () => {
    pickCommandsFolderAndReload()
      .then(async () => {
        state.config = await window.schedulerApi.getConfig();
        if (elements.settingsCommandsPath) {
          elements.settingsCommandsPath.textContent = state.config.commandsRoot || "—";
        }
      })
      .catch((err) => appendLog(`Folder picker: ${err.message}`));
  });
}

if (elements.settingsSave) {
  elements.settingsSave.addEventListener("click", async () => {
    if (typeof window.schedulerApi.saveSettings !== "function") {
      appendLog("saveSettings is not available — rebuild the app.");
      return;
    }
    const room = elements.settingsWebexRoom ? elements.settingsWebexRoom.value.trim() : "";
    const email = elements.settingsWebexEmail ? elements.settingsWebexEmail.value.trim() : "";
    const token = elements.settingsWebexToken ? elements.settingsWebexToken.value.trim() : "";
    const payload = { webexRecipientEmail: email, webexRoomId: room };
    if (token) payload.webexAccessToken = token;
    const res = await window.schedulerApi.saveSettings(payload);
    if (!res.ok) {
      if (elements.settingsSaveStatus) {
        elements.settingsSaveStatus.textContent = res.error || "Save failed.";
      }
      appendLog(`Settings save failed: ${res.error || "unknown"}`);
      return;
    }
    if (elements.settingsWebexToken) elements.settingsWebexToken.value = "";
    state.config = await window.schedulerApi.getConfig();
    if (elements.settingsWebexTokenHint) {
      elements.settingsWebexTokenHint.textContent = state.config.webexTokenConfigured
        ? "A token is saved. Paste a new value only to replace it."
        : "No token saved yet. Paste your Webex access token.";
    }
    if (elements.settingsSaveStatus) elements.settingsSaveStatus.textContent = "Saved.";
    appendLog("Settings saved.");
  });
}

if (elements.settingsTestWebex) {
  elements.settingsTestWebex.addEventListener("click", async () => {
    if (typeof window.schedulerApi.testWebex !== "function") {
      window.alert("Rebuild the app so the Webex test action is available.");
      return;
    }
    elements.settingsTestWebex.disabled = true;
    try {
      const res = await window.schedulerApi.testWebex();
      if (res.ok) {
        window.alert("Test message sent. Check Webex (the space or DM you configured).");
        appendLog("Webex test message sent.");
      } else {
        window.alert(`Webex test failed:\n\n${res.error || "Unknown error"}`);
        appendLog(`Webex test failed: ${res.error}`);
      }
    } catch (err) {
      window.alert(`Webex test failed:\n\n${err.message}`);
      appendLog(`Webex test error: ${err.message}`);
    } finally {
      elements.settingsTestWebex.disabled = false;
    }
  });
}

elements.fabCreate.addEventListener("click", () => openCreateModal());
elements.modalClose.addEventListener("click", () => closeTaskModal());
elements.modalOverlay.addEventListener("click", (event) => {
  if (event.target === elements.modalOverlay) closeTaskModal();
});

elements.outputModalClose.addEventListener("click", () => closeOutputModal());
elements.outputModalOverlay.addEventListener("click", (event) => {
  if (event.target === elements.outputModalOverlay) closeOutputModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!elements.outputModalOverlay.classList.contains("hidden")) {
    closeOutputModal();
    return;
  }
  if (!elements.modalOverlay.classList.contains("hidden")) {
    closeTaskModal();
    return;
  }
  if (elements.viewSettings?.classList.contains("view--active")) {
    showView("dashboard");
  }
});

elements.scheduleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const command = state.commands.find((item) => item.id === elements.commandSelect.value);
  if (!command) return;

  const freq = elements.frequencySelect.value;
  const recurrence = buildRecurrenceFromForm();

  if (freq === "once") {
    if (!elements.scheduledAt.value) {
      appendLog("Choose a date and time for a one-time task.");
      return;
    }
  } else if (freq === "daily") {
    if (!elements.recurrenceTimeDaily.value) {
      appendLog("Choose a time of day for daily recurrence.");
      return;
    }
  } else if (freq === "weekly") {
    if (getSelectedWeekdays().length === 0) {
      appendLog("Select at least one day of the week.");
      return;
    }
    if (!elements.recurrenceTimeWeekly.value) {
      appendLog("Choose a time for weekly recurrence.");
      return;
    }
  }

  let scheduledAt;
  if (freq === "once") {
    scheduledAt = new Date(elements.scheduledAt.value).toISOString();
  } else {
    if (typeof window.schedulerApi.previewSchedule !== "function") {
      appendLog("previewSchedule is missing — update the scheduler app.");
      return;
    }
    const prev = await window.schedulerApi.previewSchedule(recurrence);
    if (!prev.ok) {
      appendLog(`Schedule: ${prev.error}`);
      return;
    }
    scheduledAt = prev.scheduledAt;
  }

  const modelRaw = (elements.modelSelect && elements.modelSelect.value.trim()) || "";
  const outputDestination =
    elements.outputDestinationSelect && elements.outputDestinationSelect.value === "webex" ? "webex" : "scheduler";
  const payload = {
    commandId: command.id,
    commandName: command.commandName,
    commandFilePath: command.filePath,
    userInput: elements.userInput.value.trim(),
    scheduledAt,
    recurrence,
    permissionMode: elements.permissionMode.value,
    model: modelRaw || null,
    outputDestination,
  };

  if (state.editingJobId) {
    const job = state.jobs.find((j) => j.id === state.editingJobId);
    if (!job) return;
    await window.schedulerApi.updateJob(state.editingJobId, {
      ...payload,
      enabled: job.enabled,
    });
    appendLog(`Updated job ${state.editingJobId}`);
  } else {
    await window.schedulerApi.createJob({ ...payload, enabled: true });
    appendLog(`Created job for ${command.commandName} — next ${new Date(scheduledAt).toLocaleString()}`);
  }

  elements.userInput.value = "";
  closeTaskModal();
  await reloadState();
});

elements.frequencySelect.addEventListener("change", () => syncRecurrenceUI());
[
  elements.recurrenceTimeDaily,
  elements.recurrenceTimeWeekly,
  elements.recurrenceIntervalWeeks,
].forEach((el) => {
  if (el) el.addEventListener("input", () => syncRecurrenceUI());
});

if (elements.weekdayToggleRow) {
  elements.weekdayToggleRow.addEventListener("click", (event) => {
    const btn = event.target.closest(".weekday-toggle");
    if (!btn || !elements.weekdayToggleRow.contains(btn)) return;
    const pressed = btn.getAttribute("aria-pressed") === "true";
    btn.setAttribute("aria-pressed", pressed ? "false" : "true");
    syncRecurrenceUI();
  });
}

elements.taskGrid.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const action = button.dataset.action;
  const jobId = button.dataset.id;
  const job = state.jobs.find((item) => item.id === jobId);
  if (!job) return;

  if (action === "toggle") {
    await window.schedulerApi.updateJob(job.id, {
      enabled: !job.enabled,
      status: job.enabled ? "disabled" : "scheduled",
    });
    appendLog(`${job.enabled ? "Paused" : "Resumed"} job ${job.id}`);
    await reloadState();
  } else if (action === "delete") {
    await window.schedulerApi.deleteJob(job.id);
    appendLog(`Deleted job ${job.id}`);
    await reloadState();
  } else if (action === "edit") {
    openEditModal(job);
  } else if (action === "view-output") {
    const runningHere = job.status === "running" && state.activeJobId === job.id;
    if (runningHere) {
      openOutputModal(
        {
          commandName: job.commandName,
          statusLabel: "Running",
          timeLabel: job.lastRunAt ? new Date(job.lastRunAt).toLocaleString() : "—",
          outputText: state.streamBufferByJobId[job.id] || "(Waiting for output…)",
        },
        { liveJobId: job.id }
      );
      return;
    }
    const latest = getLatestRunForJob(job.id);
    if (!latest) {
      openOutputModal({
        commandName: job.commandName,
        statusLabel: "—",
        timeLabel: "—",
        outputText: "No saved output yet. It appears here after a run finishes.",
      });
      return;
    }
    const ok = latest.status === "completed";
    openOutputModal({
      commandName: latest.commandName,
      statusLabel: ok ? "Success" : "Failed",
      timeLabel: new Date(latest.startedAt).toLocaleString(),
      outputText: runOutputText(latest),
    });
  }
});

elements.executionHistoryBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.dataset.action !== "view-run-output") return;
  const run = state.runs.find((item) => item.id === button.dataset.runId);
  if (!run) return;
  const ok = run.status === "completed";
  openOutputModal({
    commandName: run.commandName,
    statusLabel: ok ? "Success" : "Failed",
    timeLabel: new Date(run.startedAt).toLocaleString(),
    outputText: runOutputText(run),
  });
});

window.schedulerApi.onEvent((event) => {
  if (event.type === "webex-notify-skipped") {
    appendLog(
      `Webex: output not sent for job ${event.payload.jobId} (${event.payload.reason}). Check Settings — token plus room ID (bots) or email.`
    );
    return;
  }
  if (event.type === "webex-notify-failed") {
    appendLog(`Webex: send failed for job ${event.payload.jobId}: ${event.payload.message}`);
    return;
  }
  if (event.type === "stream") {
    const jobId = event.payload.jobId;
    state.activeJobId = jobId;
    state.streamBufferByJobId[jobId] = (state.streamBufferByJobId[jobId] || "") + (event.payload.text || "");
    refreshLiveOutputModal();
    if (state.showDebugLogs) {
      appendLog(`STREAM ${jobId}: ${event.payload.text}`);
    }
    return;
  }
  if (event.type === "stderr") {
    appendLog(`ACP STDERR ${event.payload.jobId}: ${event.payload.text}`);
    return;
  }
  if (event.type === "permission") {
    appendLog(`Permission decision for ${event.payload.jobId}: ${event.payload.optionId}`);
    return;
  }
  if (event.type === "run-started") {
    state.activeJobId = event.payload.jobId;
    state.streamBufferByJobId[event.payload.jobId] = "";
    refreshLiveOutputModal();
    appendLog(`Run started for ${event.payload.jobId}`);
    reloadState();
    return;
  }
  if (event.type === "run-completed") {
    const completedJobId = event.payload.jobId;
    const finalOutput =
      state.streamBufferByJobId[completedJobId] || event.payload.result?.output || "";
    if (elements.outputModalOverlay.dataset.liveJobId === completedJobId) {
      elements.outputModalStatus.textContent = "Success";
      elements.outputModalText.value = finalOutput;
      delete elements.outputModalOverlay.dataset.liveJobId;
    }
    if (state.activeJobId === completedJobId) {
      state.activeJobId = null;
    }
    appendLog(`Run completed for ${completedJobId}`);
    reloadState();
    return;
  }
  if (event.type === "run-failed") {
    const failedJobId = event.payload.jobId;
    const partial = state.streamBufferByJobId[failedJobId] || "";
    const msg = event.payload.message || "Unknown error";
    if (elements.outputModalOverlay.dataset.liveJobId === failedJobId) {
      elements.outputModalStatus.textContent = "Failed";
      elements.outputModalText.value = partial
        ? `${partial}\n\n---\nError: ${msg}`
        : `Error: ${msg}`;
      delete elements.outputModalOverlay.dataset.liveJobId;
    }
    if (state.activeJobId === failedJobId) {
      state.activeJobId = null;
    }
    appendLog(`Run failed for ${failedJobId}: ${msg}`);
    reloadState();
    return;
  }
  if (event.type === "commands-reloaded") {
    appendLog(`Commands reloaded from ${event.payload.commandsRoot} (${event.payload.count} commands).`);
    window.schedulerApi
      .getConfig()
      .then((config) => {
        state.config = config;
        return window.schedulerApi.getCommands();
      })
      .then((commands) => {
        state.commands = commands;
        refreshAll();
      });
    return;
  }
  if (!state.showDebugLogs) {
    if (event.type === "job-created" || event.type === "job-updated" || event.type === "job-deleted") {
      reloadState();
      return;
    }
  }
  appendLog(`${event.type}: ${JSON.stringify(event.payload)}`);
  reloadState();
});

initialize().catch((err) => {
  appendLog(`Initialization error: ${err.message}`);
});
