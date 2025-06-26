import "./ipc";
import "./db/client";

import { electronApp, optimizer } from "@electron-toolkit/utils";
import dgram from "dgram";
import { app, BrowserWindow, Tray } from "electron";

import icon from "../../resources/icon.png?asset";
import { initializeMedia } from "./media";
import { startServer } from "./server";
import { initializeTray } from "./tray";
import { createWindow } from "./window";

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

  // Initialize media folder and media protocol
  initializeMedia();

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

  // display
  const PORT = 41234;
  const socket = dgram.createSocket("udp4");
  const discoveredTVs = new Map<
    string,
    { tvName: string; ip: string; message: string; lastSeen: number }
  >();

  function parseTV(message: string): { tvId: string; tvName: string } | null {
    if (!message.startsWith("easy-display:")) return null;
    const parsed = Object.fromEntries(
      message
        .replace("easy-display:", "")
        .split(";")
        .map((s) => s.split("=")),
    );
    if (!parsed.tvId || parsed.status !== "discover") return null;
    return { tvId: parsed.tvId, tvName: parsed.tvName || "Device" };
  }

  // 1. binding
  socket.bind(PORT);

  // 2. listening
  socket.on("listening", () => {
    const address = socket.address();
    console.log(`UDP Server listening on ${address.address}:${address.port}`);
    socket.setBroadcast(true);
  });

  // 3. message
  socket.on("message", (msg, rinfo) => {
    const message = msg.toString("utf-8");
    const parsedInfo = parseTV(message);
    if (!parsedInfo) return;

    const { tvId, tvName } = parsedInfo;

    console.log(`✅ Discovered TV: ${tvId} at ${rinfo.address}`);
    discoveredTVs.set(tvId, { tvName, ip: rinfo.address, message, lastSeen: Date.now() });
  });

  function sendDiscoveredTvs() {
    if (!state.mainWindow) return;

    const now = Date.now();
    const activeTvs = [...discoveredTVs.entries()]
      .filter(([, { lastSeen }]) => now - lastSeen < 15000)
      .map(([tvId, { tvName, ip, message }]) => ({ tvId, tvName, ip, message }));

    state.mainWindow.webContents.send("discovered-tvs", activeTvs);
  }

  setInterval(sendDiscoveredTvs, 2000);
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
