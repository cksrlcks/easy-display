import { LocalDevice } from "@shared/types";
import dgram from "dgram";
import { ipcMain } from "electron";

import { state } from ".";

let socket: dgram.Socket | null = null;
let intervalTimer: NodeJS.Timeout | null = null;

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
  if (socket || !state.config) return;

  socket = dgram.createSocket("udp4");

  // 1. binding
  socket.bind(state.config.udpPort, "0.0.0.0");

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

    console.log(`Discovered TV: ${tvId} at ${rinfo.address}`);
    discoveredTVs.set(tvId, { tvId, tvName, ip: rinfo.address, message, lastSeen: Date.now() });

    if (!socket || !state.config) return;

    const reply = Buffer.from(
      JSON.stringify({
        type: "pc-response",
        displayUrl: "/screen",
        displayUrlPort: state.config.mediaServerPort,
      }),
    );
    console.log(`📡 Sending reply to ${rinfo.address}:${rinfo.port}`);
    socket.send(reply, rinfo.port, rinfo.address);
  });
}

function startSendingDiscoveredDevices() {
  intervalTimer = setInterval(() => sendDiscoveredDevices(discoveredTVs), 2000);
}

function stopSendingDiscoveredDevices() {
  if (intervalTimer) {
    clearInterval(intervalTimer);
    intervalTimer = null;
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
  startDeviceDiscovery();

  ipcMain.handle("socket:start-discovery", () => startSendingDiscoveredDevices());
  ipcMain.handle("socket:stop-discovery", () => stopSendingDiscoveredDevices());
}
