import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import { InternalFile, Screen, Slide } from "src/shared/types";

const api = {
  quitApp: () => ipcRenderer.invoke("quit-app"),
  getFilesInMediaFolder: () => ipcRenderer.invoke("get-files-in-media-folder"),
  getLocalIp: () => ipcRenderer.invoke("get-local-ip"),
  openMediaFolder: () => ipcRenderer.invoke("open-media-folder"),
  selectFiles: () => ipcRenderer.invoke("select-files"),
  copyToMediaFolder: (filePaths: string[]) => ipcRenderer.invoke("copy-to-media-folder", filePaths),
  openFile: (filePath: string) => ipcRenderer.invoke("open-file", filePath),
  deleteFile: (filePath: string) => ipcRenderer.invoke("delete-file", filePath),
  getScreenList: () => ipcRenderer.invoke("get-screen-list"),
  createScreen: (data: Pick<Screen, "alias" | "direction">) =>
    ipcRenderer.invoke("create-screen", data),
  updateScreen: (data: Pick<Screen, "id" | "alias" | "direction">) =>
    ipcRenderer.invoke("update-screen", data),
  deleteScreen: (data: Pick<Screen, "id">) => ipcRenderer.invoke("delete-screen", data),
  getScreenById: (data: Pick<Screen, "id">) => ipcRenderer.invoke("get-screen-by-id", data),
  updateScreenSlides: (data: {
    screenId: Screen["id"];
    slides: (Pick<Slide, "duration" | "show"> & { file: InternalFile })[];
  }) => ipcRenderer.invoke("update-screen-slides", data),
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
