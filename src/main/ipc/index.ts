import { ipcMain } from "electron";

import {
  createScreen,
  deleteScreen,
  getScreenById,
  getScreenList,
  updateScreen,
  updateScreenSlides,
} from "./db";
import { quitApp } from "./general";
import {
  copyFiles,
  deleteFile,
  getFilesInMediaFolder,
  openFile,
  openMediaFolder,
  selectFiles,
} from "./media";
import { getLocalIp } from "./network";

// general ipc handlers
ipcMain.handle("quit-app", quitApp);

// media ipc handlers
ipcMain.handle("get-files-in-media-folder", getFilesInMediaFolder);
ipcMain.handle("open-media-folder", openMediaFolder);
ipcMain.handle("select-files", selectFiles);
ipcMain.handle("copy-to-media-folder", copyFiles);
ipcMain.handle("open-file", openFile);
ipcMain.handle("delete-file", deleteFile);

// network ipc handlers
ipcMain.handle("get-local-ip", getLocalIp);

// db
ipcMain.handle("get-screen-list", getScreenList);
ipcMain.handle("create-screen", createScreen);
ipcMain.handle("update-screen", updateScreen);
ipcMain.handle("delete-screen", deleteScreen);
ipcMain.handle("get-screen-by-id", getScreenById);
ipcMain.handle("update-screen-slides", updateScreenSlides);
