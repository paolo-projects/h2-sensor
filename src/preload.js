// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  saveData: (data) => ipcRenderer.invoke("save-data", data),
  openTable: (data) => ipcRenderer.invoke("open-table", data),
});
