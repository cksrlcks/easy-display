import { dialog, shell } from "electron";
import fs from "fs";
import path from "path";
import { InternalFile, IPCResponse } from "src/shared/types";

import { MEDIA_FOLDER, MESSAGE } from "../constants";

export async function getFilesInMediaFolder(): IPCResponse<InternalFile[]> {
  try {
    const files = await fs.promises.readdir(MEDIA_FOLDER);

    const data = files.map((file) => {
      const fullPath = path.join(MEDIA_FOLDER, file);
      const ext = path.extname(file).toLowerCase().slice(1);

      return {
        base: path.parse(file).base,
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
      message: MESSAGE.FAIL_TO_READ_MEDIA_FOLDER,
    };
  }
}

export async function openMediaFolder(): IPCResponse<void> {
  const result = await shell.openPath(MEDIA_FOLDER);

  if (result === "") {
    return { success: true };
  } else {
    return { success: false, message: MESSAGE.FAILT_TO_OPEN_MEDIA_FOLDER };
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
    return { success: false, message: MESSAGE.FAIL_TO_SELECT_FILES };
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
      message: MESSAGE.FAIL_TO_COPY_FILES,
    };
  }
}

export async function openFile(_, filePath: string): IPCResponse<void> {
  try {
    const fullPath = path.join(MEDIA_FOLDER, filePath);
    console.log(fullPath);

    if (!fs.existsSync(fullPath)) {
      return { success: false, message: MESSAGE.FAIL_TO_FIND_MEDIA_FILE };
    }

    shell.openPath(fullPath);

    return { success: true, message: "File opened successfully" };
  } catch (error) {
    console.error("Failed to open file:", error);
    return { success: false, message: MESSAGE.FAIL_TO_OPEN_MEDIA_FILE };
  }
}

export async function deleteFile(_, filePath: string): IPCResponse<void> {
  try {
    const fullPath = path.join(MEDIA_FOLDER, filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error("File not found");
    }

    fs.unlinkSync(fullPath);

    return { success: true, message: MESSAGE.SUCCESS_TO_DELETE_FILE };
  } catch (error) {
    console.error("Failed to delete file:", error);
    return { success: false, message: MESSAGE.FAIL_TO_DELETE_FILE };
  }
}
