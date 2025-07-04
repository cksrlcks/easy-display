import { is } from "@electron-toolkit/utils";
import cors from "cors";
import { eq } from "drizzle-orm";
import express from "express";
import os from "os";
import path from "path";

import { state } from "..";
import { MEDIA_FOLDER } from "../constants";
import { db } from "../db/client";
import { devices, screens } from "../db/schema";

/**
 * 외부 display용 서버 (tv app의 webview에서 바라볼 서버)
 */

export let mediaServerUrl: string | null = null;

export function startServer() {
  const app = express();
  app.use(cors());

  const interfaces = os.networkInterfaces();

  for (const name in interfaces) {
    for (const iface of interfaces[name]!) {
      if (iface.family === "IPv4" && !iface.internal) state.localIp = iface.address;
    }
  }

  mediaServerUrl = `http://${state.localIp}:${state.config?.mediaServerPort || 3000}`;

  app.get("/screen", (req, res) => {
    const deviceId = req.query.deviceId as string;

    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      res.redirect(process.env["ELECTRON_RENDERER_URL"] + "/screen?deviceId=" + deviceId);
    } else {
      res.sendFile(path.join(__dirname, "../renderer/screen.html"));
    }
  });

  app.get("/get-screen-data", async (req, res) => {
    const deviceId = req.query.deviceId as string;
    console.log("Received request for screen data for device ID:", deviceId);

    if (!deviceId) {
      res.status(400).json({ error: "Device ID is required" });
      return;
    }

    const deviceData = await db.query.devices.findFirst({
      where: eq(devices.deviceId, deviceId),
      columns: { screenId: true },
    });

    if (!deviceData) {
      res.status(404).json({ error: "해당 디바이스ID로 조회된 데이터가 없습니다." });
      return;
    } else {
      if (!deviceData.screenId) {
        res
          .status(404)
          .json({ error: "해당 디바이스는 화면이 할당되지 않았습니다. HOST에서 설정해주세요" });
        return;
      }

      const screenData = await db.query.screens.findFirst({
        where: eq(screens.id, deviceData.screenId),
        with: {
          slides: {
            orderBy: (slides, { asc }) => [asc(slides.order)],
          },
        },
      });

      if (!screenData) {
        res.status(404).json({ error: "해당 디바이스ID로 조회된 데이터가 없습니다." });
        return;
      }

      res.json({
        success: true,
        data: screenData,
      });
    }
  });

  app.get("/media", (req, res) => {
    const encoded = req.query.path as string;
    const decoded = decodeURIComponent(encoded);
    const filePath = path.join(MEDIA_FOLDER, decoded);

    res.sendFile(filePath);
  });
  app.use(express.static(path.join(__dirname, "../renderer")));

  app.listen(state.config?.mediaServerPort || 3000, () => {
    console.log(`Media server is running on port ${state.config?.mediaServerPort || 3000}`);
  });
}
