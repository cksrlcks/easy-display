import { Client, ClientMessage, HostMessage } from "@repo/types";
import dgram from "dgram";
import { eq } from "drizzle-orm";
import { ipcMain } from "electron";

import { state } from ".";
import { db } from "./db/client";
import { devices } from "./db/schema";

let socket: dgram.Socket | null = null;
let intervalTimer: NodeJS.Timeout | null = null;

const discoveredTVs = new Map<string, Client & { lastSeen: number }>();

function startDeviceDiscovery() {
  if (socket || !state.config) return;

  socket = dgram.createSocket("udp4");

  // 1. binding
  socket.bind(state.config.udpPort, () => {
    socket?.setBroadcast(true);
  });

  // 2. listening
  socket.on("listening", () => {
    if (!socket) return;

    const address = socket.address();
    socket.setBroadcast(true);
    console.log(`UDP Server listening on ${address.address}:${address.port}`);
  });

  // 3. message
  socket.on("message", async (msg, rinfo) => {
    const data = JSON.parse(msg.toString("utf-8")) as ClientMessage;
    console.log("Received message:", data);

    if (data.name !== "easy-display" || data.type !== "discovery-ping") return;

    const { deviceId, deviceName = "device" } = data;

    console.log(`Discovered Device: ${deviceId} at ${rinfo.address}`);
    discoveredTVs.set(deviceId, {
      deviceId,
      deviceName,
      ip: rinfo.address,
      lastSeen: Date.now(),
    });

    if (!socket || !state.config) return;

    const deviceInfo = await db.query.devices.findFirst({
      where: eq(devices.deviceId, deviceId),
    });

    const replyMessage = {
      name: "easy-display",
      type: "host-response",
      port: state.config.mediaServerPort,
      hostName: state.config.hostName,
      deviceId,
      screenId: deviceInfo?.screenId || null,
    } as HostMessage;

    const reply = Buffer.from(JSON.stringify(replyMessage));
    console.log(`Sending reply to ${rinfo.address}:${rinfo.port}`);
    socket.send(reply, rinfo.port, rinfo.address);
  });
}

function startSendingDiscoveredDevices() {
  intervalTimer = setInterval(() => sendDiscoveredDevices(discoveredTVs), 3000);
}

function stopSendingDiscoveredDevices() {
  if (intervalTimer) {
    clearInterval(intervalTimer);
    intervalTimer = null;
  }
}

function sendDiscoveredDevices(discoveredDevices: Map<string, Client & { lastSeen: number }>) {
  if (!state.mainWindow) return;

  const now = Date.now();
  const activeDevices = [...discoveredDevices.entries()]
    .filter(([, { lastSeen }]) => now - lastSeen < 3000)
    .map(([deviceId, { deviceName, ip }]) => ({ deviceId, deviceName, ip }));

  state.mainWindow.webContents.send("socket:discovered-devices", activeDevices);
}

export function initializeSocket() {
  startDeviceDiscovery();

  ipcMain.handle("socket:start-discovery", () => startSendingDiscoveredDevices());
  ipcMain.handle("socket:stop-discovery", () => stopSendingDiscoveredDevices());
}
