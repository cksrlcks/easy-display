import { net, protocol } from "electron";
import fs from "fs";
import os from "os";
import path from "path";
import { pathToFileURL } from "url";

import { MEDIA_FOLDER } from "./constants";

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

export function initializeMedia() {
  ensureMediaFolderExists();
  protocol.handle("media", handleMediaProtocol);
}
