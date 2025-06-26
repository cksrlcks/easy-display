import { LocalDevice } from "@shared/types";
import dgram from "dgram";
import { ipcMain } from "electron";

import { state } from ".";

let socket: dgram.Socket | null = null;
let intervalTimer: NodeJS.Timeout | null = null;

const PORT = 41234;
const discoveredTVs = new Map<string, LocalDevice & { message: string; lastSeen: number }>();

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

function startDeviceDiscovery() {
  if (socket) return;

  socket = dgram.createSocket("udp4");

  // 1. binding
  socket.bind(PORT);

  // 2. listening
  socket.on("listening", () => {
    if (!socket) return;

    const address = socket.address();
    socket.setBroadcast(true);
    console.log(`UDP Server listening on ${address.address}:${address.port}`);
  });

  // 3. message
  socket.on("message", (msg, rinfo) => {
    const message = msg.toString("utf-8");
    const parsedInfo = parseTV(message);
    if (!parsedInfo) return;

    const { tvId, tvName } = parsedInfo;

    console.log(`✅ Discovered TV: ${tvId} at ${rinfo.address}`);
    discoveredTVs.set(tvId, { tvId, tvName, ip: rinfo.address, message, lastSeen: Date.now() });
  });

  intervalTimer = setInterval(() => sendDiscoveredDevices(discoveredTVs), 2000);
}

function stopDeviceDiscovery() {
  console.log("Stopping TV discovery");

  if (intervalTimer) {
    clearInterval(intervalTimer);
    intervalTimer = null;
  }

  if (socket) {
    socket.close();
    socket = null;
  }
}

function sendDiscoveredDevices(
  discoveredDevices: Map<string, LocalDevice & { message: string; lastSeen: number }>,
) {
  if (!state.mainWindow) return;

  const now = Date.now();
  const activeDevices = [...discoveredDevices.entries()]
    .filter(([, { lastSeen }]) => now - lastSeen < 15000)
    .map(([tvId, { tvName, ip, message }]) => ({ tvId, tvName, ip, message }));

  state.mainWindow.webContents.send("socket:discovered-devices", activeDevices);
}

export function initializeSocket() {
  ipcMain.handle("socket:start-discovery", () => startDeviceDiscovery());
  ipcMain.handle("socket:stop-discovery", () => stopDeviceDiscovery());
}
