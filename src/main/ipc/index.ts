import { ipcMain } from "electron";

import {
  copyFiles,
  deleteFile,
  getFilesInMediaFolder,
  openMediaFolder,
  selectFiles,
} from "./media";
import { getLocalIp } from "./network";

// media ipc handlers
ipcMain.handle("get-files-in-media-folder", getFilesInMediaFolder);
ipcMain.handle("open-media-folder", openMediaFolder);
ipcMain.handle("select-files", selectFiles);
ipcMain.handle("copy-to-media-folder", copyFiles);
ipcMain.handle("delete-file", deleteFile);

// network ipc handlers
ipcMain.handle("get-local-ip", getLocalIp);
