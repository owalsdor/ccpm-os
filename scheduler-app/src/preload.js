const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("schedulerApi", {
  getCommands: () => ipcRenderer.invoke("scheduler:getCommands"),
  getConfig: () => ipcRenderer.invoke("scheduler:getConfig"),
  getState: () => ipcRenderer.invoke("scheduler:getState"),
  createJob: (payload) => ipcRenderer.invoke("scheduler:createJob", payload),
  updateJob: (id, updates) => ipcRenderer.invoke("scheduler:updateJob", { id, updates }),
  deleteJob: (jobId) => ipcRenderer.invoke("scheduler:deleteJob", jobId),
  runNow: (jobId) => ipcRenderer.invoke("scheduler:runNow", jobId),
  getModelOptions: () => ipcRenderer.invoke("scheduler:getModelOptions"),
  pickCommandsFolder: () => ipcRenderer.invoke("scheduler:pickCommandsFolder"),
  openCommandsFolder: () => ipcRenderer.invoke("scheduler:openCommandsFolder"),
  previewSchedule: (recurrence) => ipcRenderer.invoke("scheduler:previewSchedule", recurrence),
  setPreventSystemSleep: (enabled) =>
    ipcRenderer.invoke("scheduler:setPreventSystemSleep", { enabled }),
  saveSettings: (payload) => ipcRenderer.invoke("scheduler:saveSettings", payload),
  testWebex: () => ipcRenderer.invoke("scheduler:testWebex"),
  onEvent: (listener) => {
    const wrapped = (_event, payload) => listener(payload);
    ipcRenderer.on("scheduler:event", wrapped);
    return () => ipcRenderer.removeListener("scheduler:event", wrapped);
  },
});
