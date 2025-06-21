import { dialog, net, protocol, shell } from "electron";
import express from "express";
import fs from "fs";
import os from "os";
import path from "path";
import { pathToFileURL } from "url";

import { InternalFile, IPCResponse } from "../types";
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
  console.log(filePath);
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

export async function getFilesInMediaFolder(): IPCResponse<InternalFile[]> {
  try {
    const files = await fs.promises.readdir(MEDIA_FOLDER);

    const data = files.map((file) => {
      const fullPath = path.join(MEDIA_FOLDER, file);
      const ext = path.extname(file).toLowerCase().slice(1);

      return {
        name: path.parse(file).name,
        size: fs.statSync(fullPath).size,
        path: fullPath,
        ext,
      };
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Failed to read media folder:", error);
    return {
      success: false,
      error: "Failed to read media folder",
    };
  }
}

export async function openMediaFolder(): IPCResponse<void> {
  const result = await shell.openPath(MEDIA_FOLDER);
  if (result === "") {
    return { success: true };
  } else {
    return { success: false, error: result };
  }
}

export async function selectFiles(): IPCResponse<string[]> {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openFile", "multiSelections"],
    });
    return {
      success: true,
      data: canceled ? [] : filePaths,
    };
  } catch (error) {
    console.error("Failed to select files:", error);
    return { success: false, error: "Failed to select files" };
  }
}

export async function copyFiles(_, filePaths: string[]): IPCResponse<string[]> {
  function getUniqueDestination(fileName: string): string {
    const ext = path.extname(fileName);
    const base = path.basename(fileName, ext);

    let counter = 1;
    let destination = path.join(MEDIA_FOLDER, fileName);

    while (fs.existsSync(destination)) {
      destination = path.join(MEDIA_FOLDER, `${base} (${counter})${ext}`);
      counter++;
    }

    return destination;
  }

  const results: string[] = [];

  try {
    for (const filePath of filePaths) {
      const fileName = path.basename(filePath);
      const destination = getUniqueDestination(fileName);

      fs.copyFileSync(filePath, destination);
      results.push(destination);
    }
    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error("Failed to copy files:", error);
    return {
      success: false,
      error: "Failed to copy files",
    };
  }
}

export async function deleteFile(_, filePath: string): IPCResponse<void> {
  try {
    const fullPath = path.join(MEDIA_FOLDER, filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error("File not found");
    }

    fs.unlinkSync(fullPath);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete file:", error);
    return { success: false, error: "Failed to delete file" };
  }
}
