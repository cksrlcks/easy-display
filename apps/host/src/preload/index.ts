import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import { Device, LocalDevice, Screen, Slide } from "src/shared/types";

const api = {
  // general
  quitApp: () => ipcRenderer.invoke("quit-app"),

  // explorer
  explorerList: (folderPath: string) => ipcRenderer.invoke("explorer:list", folderPath),
  explorerOpen: (filePath: string) => ipcRenderer.invoke("explorer:open", filePath),
  explorerDelete: (filePath: string) => ipcRenderer.invoke("explorer:delete", filePath),
  explorerSelect: () => ipcRenderer.invoke("explorer:select"),
  explorerCopy: (filePaths: string[]) => ipcRenderer.invoke("explorer:copy", filePaths),

  // network
  networkGetIp: () => ipcRenderer.invoke("network:get-ip"),

  // screen
  screenList: () => ipcRenderer.invoke("screen:list"),
  screenGet: (data: Pick<Screen, "id">) => ipcRenderer.invoke("screen:get", data),
  screenCreate: (data: Partial<Screen>) => ipcRenderer.invoke("screen:create", data),
  screenUpdate: (data: Partial<Screen>) => ipcRenderer.invoke("screen:update", data),
  screenDelete: (data: Pick<Screen, "id">) => ipcRenderer.invoke("screen:delete", data),
  screenUpdateSlides: (data: { screenId: Screen["id"]; slides: Partial<Slide>[] }) =>
    ipcRenderer.invoke("screen:update-slides", data),

  // device
  deviceList: () => ipcRenderer.invoke("device:list"),
  deviceGet: (data: Pick<Device, "id">) => ipcRenderer.invoke("device:get", data),
  deviceCreate: (data: Partial<Device>) => ipcRenderer.invoke("device:create", data),
  deviceUpdate: (data: Partial<Device>) => ipcRenderer.invoke("device:update", data),
  deviceDelete: (data: Pick<Device, "id">) => ipcRenderer.invoke("device:delete", data),

  // socket
  socketStartDiscovery: () => ipcRenderer.invoke("socket:start-discovery"),
  socketStopDiscovery: () => ipcRenderer.invoke("socket:stop-discovery"),
  socketDiscoveredDevices: (callback: (data: LocalDevice[]) => void) =>
    ipcRenderer.on("socket:discovered-devices", (_, data) => callback(data)),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
