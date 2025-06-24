import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";

const api = {
  getFilesInMediaFolder: () => ipcRenderer.invoke("get-files-in-media-folder"),
  getLocalIp: () => ipcRenderer.invoke("get-local-ip"),
  openMediaFolder: () => ipcRenderer.invoke("open-media-folder"),
  selectFiles: () => ipcRenderer.invoke("select-files"),
  copyToMediaFolder: (filePaths: string[]) => ipcRenderer.invoke("copy-to-media-folder", filePaths),
  openFile: (filePath: string) => ipcRenderer.invoke("open-file", filePath),
  deleteFile: (filePath: string) => ipcRenderer.invoke("delete-file", filePath),
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
