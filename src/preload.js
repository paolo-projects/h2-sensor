// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

console.log("preload script gets executed");
contextBridge.exposeInMainWorld("electronAPI", {
  devicesList: () => ipcRenderer.invoke("devices-list"),
});
