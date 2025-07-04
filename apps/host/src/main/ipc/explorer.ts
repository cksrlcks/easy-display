import { ExplorerItem, IPCResponse } from "@shared/types";
import { dialog, ipcMain, shell } from "electron";
import fs from "fs";
import fsPromise from "fs/promises";
import path from "path";

import { COMMON_MESSAGE, MEDIA_FOLDER } from "../constants";

const MESSAGE = {
  NOT_A_DIRECTORY: "지정된 경로는 디렉토리가 아닙니다.",
  SUCCESS_TO_OPEN: "파일 또는 폴더를 성공적으로 열었습니다.",
  FAIL_TO_OPEN: "파일 또는 폴더를 여는 데 실패했습니다.",
  NOT_FOUND: "지정된 파일 또는 폴더를 찾을 수 없습니다.",
  SUCCESS_TO_COPY: "파일을 성공적으로 복사했습니다.",
  SUCCESS_TO_DELETE: "파일을 성공적으로 삭제했습니다.",
};

const realPath = (filePath: string) => path.join(MEDIA_FOLDER, filePath);
const getUniqueDestinationInMediaFolder = (fileName: string): string => {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);

  let counter = 1;
  let destination = path.join(MEDIA_FOLDER, fileName);

  while (fs.existsSync(destination)) {
    destination = path.join(MEDIA_FOLDER, `${base} (${counter})${ext}`);
    counter++;
  }

  return destination;
};

ipcMain.handle("explorer:list", async (_, folderPath: string): IPCResponse<ExplorerItem[]> => {
  try {
    const stat = fs.statSync(realPath(folderPath));

    if (!stat.isDirectory()) {
      return {
        success: false,
        message: MESSAGE.NOT_A_DIRECTORY,
      };
    }

    const entries = fs.readdirSync(realPath(folderPath), { withFileTypes: true });

    const items = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(realPath(folderPath), entry.name);
        const stat = await fsPromise.stat(fullPath);

        return {
          isDirectory: stat.isDirectory(),
          name: entry.name,
          size: stat.isFile() ? stat.size : 0,
          ext: entry.isFile() ? path.extname(entry.name).slice(1).toLowerCase() : undefined,
          path: path.join(folderPath, entry.name),
        };
      }),
    );

    return {
      success: true,
      message: MESSAGE.SUCCESS_TO_OPEN,
      data: items,
    };
  } catch (error) {
    console.error("Failed to list directory:", error);

    return {
      success: false,
      message: COMMON_MESSAGE.UNKNOWN_ERROR,
    };
  }
});

ipcMain.handle("explorer:open", async (_, filePath: string): IPCResponse<void> => {
  try {
    const fullPath = realPath(filePath);
    const isExists = fs.existsSync(fullPath);

    if (!isExists) {
      return {
        success: false,
        message: MESSAGE.NOT_FOUND,
      };
    }

    const result = await shell.openPath(fullPath);

    if (result === "") {
      return {
        success: true,
        message: MESSAGE.SUCCESS_TO_OPEN,
      };
    } else {
      return {
        success: false,
        message: MESSAGE.FAIL_TO_OPEN,
      };
    }
  } catch (error) {
    console.error("Failed to open file:", error);

    return {
      success: false,
      message: COMMON_MESSAGE.UNKNOWN_ERROR,
    };
  }
});

ipcMain.handle("explorer:delete", async (_, filePath: string): IPCResponse<void> => {
  try {
    const fullPath = realPath(filePath);
    const isExists = fs.existsSync(fullPath);

    if (!isExists) {
      return {
        success: false,
        message: MESSAGE.NOT_FOUND,
      };
    }

    if (fs.statSync(fullPath).isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }

    return {
      success: true,
      message: MESSAGE.SUCCESS_TO_DELETE,
    };
  } catch (error) {
    console.error("Failed to delete file:", error);

    return {
      success: false,
      message: COMMON_MESSAGE.UNKNOWN_ERROR,
    };
  }
});

ipcMain.handle("explorer:select", async (): IPCResponse<string[]> => {
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

    return {
      success: false,
      message: COMMON_MESSAGE.UNKNOWN_ERROR,
    };
  }
});

ipcMain.handle("explorer:copy", async (_, filePaths: string[]): IPCResponse<string[]> => {
  try {
    const results: string[] = [];

    for (const filePath of filePaths) {
      const fileName = path.basename(filePath);
      const destination = getUniqueDestinationInMediaFolder(fileName);

      fs.copyFileSync(filePath, destination);
      results.push(destination);
    }

    return {
      success: true,
      message: MESSAGE.SUCCESS_TO_COPY,
      data: results,
    };
  } catch (error) {
    console.error("Failed to copy files:", error);

    return {
      success: false,
      message: COMMON_MESSAGE.UNKNOWN_ERROR,
    };
  }
});
