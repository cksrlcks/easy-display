import fs from "fs";
import path from "path";
import os from "os";
import { net, protocol } from "electron";
import { pathToFileURL } from "url";
import express from "express";
import { getLocalIp } from "./lib/network";

const MEDIA_FOLDER = path.join(os.homedir(), "Documents", "easy-display", "media");

function ensureMediaFolderExists(): string {
  const documentsPath = path.join(os.homedir(), "Documents");
  const mediaPath = path.join(documentsPath, "easy-display", "media");

  if (!fs.existsSync(mediaPath)) {
    fs.mkdirSync(mediaPath, { recursive: true });
  }

  return mediaPath;
}

function handleMediaProtocol(request: Request) {
  const urlPath = decodeURI(request.url.replace(/^media:\/\//, ""));

  const filePath = path.join(MEDIA_FOLDER, urlPath);

  return net.fetch(pathToFileURL(filePath).toString());
}

function startMediaServer() {
  const app = express();
  app.use("/media", express.static(MEDIA_FOLDER));
  app.listen(3000, () => {
    console.log(`🟢 Media server: http://${getLocalIp()}:3000/media/`);
  });
}

export function initializeMedia() {
  ensureMediaFolderExists();
  startMediaServer();
  protocol.handle("media", handleMediaProtocol);
}

export async function getFilesInMediaFolder() {
  const files = await fs.promises.readdir(MEDIA_FOLDER);

  return files.map((file) => {
    const fullPath = path.join(MEDIA_FOLDER, file);
    const ext = path.extname(file).toLowerCase();
    return {
      name: file,
      path: fullPath,
      ext,
    };
  });
}
