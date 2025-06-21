import { app, BrowserWindow, ipcMain, Tray } from "electron";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { initializeTray } from "./tray";
import { createWindow } from "./window";
import {
  copyFiles,
  deleteFile,
  getFilesInMediaFolder,
  initializeMedia,
  openMediaFolder,
  selectFiles,
} from "./media";
import { getLocalIp } from "./lib/network";

export type State = {
  mainWindow: BrowserWindow | null;
  tray: Tray | null;
  isQuitting: boolean;
};

const state: State = {
  mainWindow: null,
  tray: null,
  isQuitting: false,
};

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Initialize media folder and server
  initializeMedia();

  // Create the main window
  state.mainWindow = createWindow(state);

  // Set Dock icon for macOS
  app.dock?.setIcon(icon);

  // Initialize Tray
  state.tray = initializeTray(state);

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(state);
    } else {
      state.mainWindow?.show();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (state.tray) {
    state.tray.destroy();
    state.tray = null;
  }

  state.isQuitting = true;
});

/**
 * ipcMain handlers collection
 */

ipcMain.handle("get-files-in-media-folder", getFilesInMediaFolder);
ipcMain.handle("open-media-folder", openMediaFolder);
ipcMain.handle("select-files", selectFiles);
ipcMain.handle("copy-to-media-folder", copyFiles);
ipcMain.handle("delete-file", deleteFile);

ipcMain.handle("get-local-ip", getLocalIp);
