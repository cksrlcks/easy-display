import { electronApp, optimizer } from "@electron-toolkit/utils";
import { GlobalConfig } from "@shared/types";
import { BrowserWindow, Tray, app } from "electron";
import log from "electron-log/main";

import icon from "../../resources/icon.png?asset";
import { initializeConfig } from "./config";
import "./db/client";
import "./ipc";
import { initializeMedia } from "./media";
import { startServer } from "./server";
import { initializeSocket } from "./socket";
import { initializeTray } from "./tray";
import { createWindow } from "./window";

export type State = {
  mainWindow: BrowserWindow | null;
  tray: Tray | null;
  isQuitting: boolean;
  config: GlobalConfig | null;
  localIp: string | null;
};

export const state: State = {
  mainWindow: null,
  tray: null,
  isQuitting: false,
  config: null,
  localIp: null,
};

log.initialize();

log.info("Log from the main process");

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Initialize media folder and media protocol
  initializeMedia();

  // Initialize config
  state.config = initializeConfig();

  // start express server for external display
  startServer();

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

  initializeSocket();
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
