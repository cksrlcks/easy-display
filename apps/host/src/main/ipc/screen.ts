import { Screen, ScreenData, Slide } from "@repo/types";
import { IPCResponse, ScreenWithFileBasedSlides } from "@shared/types";
import { eq } from "drizzle-orm";
import { ipcMain } from "electron";
import fs from "fs";
import { nanoid } from "nanoid";
import path from "path";

import { MEDIA_FOLDER } from "../constants";
import { db } from "../db/client";
import { screens, slides } from "../db/schema";
import { getFileType } from "../lib";

const MESSAGE = {
  SUCCESS_TO_CREATE_SCREEN_: "화면을 성공적으로 생성했습니다.",
  FAIL_TO_CREATE_SCREEN: "화면 생성에 실패했습니다.",
  SCREEN_ALIAS_ALREADY_EXISTS: "이미 존재하는 화면 별칭입니다.",
  SUCCESS_TO_UPDATE_SCREEN: "화면을 성공적으로 업데이트했습니다.",
  FAIL_TO_UPDATE_SCREEN: "화면 업데이트에 실패했습니다.",
  SUCCESS_TO_DELETE_SCREEN: "화면을 성공적으로 삭제했습니다.",
  FAIL_TO_DELETE_SCREEN: "화면 삭제에 실패했습니다.",
  SUCCESS_TO_GET_SCREEN_BY_ID: "화면 정보를 성공적으로 가져왔습니다.",
  FAIL_TO_GET_SCREEN_BY_ID: "화면 정보를 가져오는 데 실패했습니다.",
  SUCCESS_TO_UPDATE_SCREEN_SLIDES: "슬라이드를 성공적으로 업데이트했습니다.",
  FAIL_TO_UPDATE_SCREEN_SLIDES: "슬라이드 업데이트에 실패했습니다.",
  FAIL_TO_FIND_SCREEN: "해당 ID의 화면을 찾을 수 없습니다.",
  FAIL_TO_GET_SCREEN_LIST: "화면 목록을 가져오는 데 실패했습니다.",
};

ipcMain.handle("screen:list", async (): IPCResponse<ScreenData[]> => {
  try {
    const screens = await db.query.screens.findMany({
      with: {
        slides: {
          orderBy: (slides, { asc }) => [asc(slides.order)],
        },
      },
    });

    return {
      success: true,
      data: screens,
    };
  } catch (error) {
    console.error("Error fetching screens:", error);
    return {
      success: false,
      message: MESSAGE.FAIL_TO_GET_SCREEN_LIST,
    };
  }
});

ipcMain.handle(
  "screen:get",
  async (_, data: Pick<Screen, "id">): IPCResponse<ScreenWithFileBasedSlides> => {
    try {
      const screen = await db.query.screens.findFirst({
        where: eq(screens.id, data.id),
        with: {
          slides: {
            orderBy: (slides, { asc }) => [asc(slides.order)],
          },
        },
      });

      if (!screen) {
        return {
          success: false,
          message: MESSAGE.FAIL_TO_FIND_SCREEN,
        };
      }

      const slides = screen.slides.map((item) => {
        if (item.filePath === null || !fs.existsSync(path.join(MEDIA_FOLDER, item.filePath))) {
          return {
            ...item,
            file: null,
          };
        }

        return {
          ...item,
          file: {
            name: path.basename(path.join(MEDIA_FOLDER, item.filePath)),
            size: fs.statSync(path.join(MEDIA_FOLDER, item.filePath)).size,
            ext: path.extname(path.join(MEDIA_FOLDER, item.filePath)).toLowerCase().slice(1),
            path: item.filePath,
            isDirectory: false,
          },
        };
      });

      return {
        success: true,
        data: {
          ...screen,
          slides,
        },
      };
    } catch (error) {
      console.error("Error fetching screen by ID:", error);
      return {
        success: false,
        message: MESSAGE.FAIL_TO_GET_SCREEN_BY_ID,
      };
    }
  },
);

ipcMain.handle("screen:create", async (_, data: Pick<Screen, "alias">): IPCResponse<void> => {
  try {
    const existingScreen = await db.query.screens.findFirst({
      where: eq(screens.alias, data.alias),
    });

    if (existingScreen) {
      return {
        success: false,
        message: MESSAGE.SCREEN_ALIAS_ALREADY_EXISTS,
      };
    }

    await db.insert(screens).values({
      id: nanoid(),
      alias: data.alias,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: MESSAGE.SUCCESS_TO_CREATE_SCREEN_,
    };
  } catch (error) {
    console.error("Error creating screen:", error);
    return {
      success: false,
      message: MESSAGE.FAIL_TO_CREATE_SCREEN,
    };
  }
});

ipcMain.handle(
  "screen:update",
  async (_, data: Pick<Screen, "id" | "alias">): IPCResponse<void> => {
    try {
      await db
        .update(screens)
        .set({
          alias: data.alias,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(screens.id, data.id));

      return {
        success: true,
        message: MESSAGE.SUCCESS_TO_UPDATE_SCREEN,
      };
    } catch (error) {
      console.error("Error updating screen:", error);
      return {
        success: false,
        message: MESSAGE.FAIL_TO_UPDATE_SCREEN,
      };
    }
  },
);

ipcMain.handle("screen:delete", async (_, data: Pick<Screen, "id">): IPCResponse<void> => {
  try {
    await db.delete(screens).where(eq(screens.id, data.id));

    return {
      success: true,
      message: MESSAGE.SUCCESS_TO_DELETE_SCREEN,
    };
  } catch (error) {
    console.error("Error deleting screen:", error);
    return {
      success: false,
      message: MESSAGE.FAIL_TO_DELETE_SCREEN,
    };
  }
});

ipcMain.handle(
  "screen:update-slides",
  async (
    _,
    data: {
      screenId: Screen["id"];
      slides: Pick<Slide, "duration" | "show" | "filePath" | "rotate">[];
    },
  ): IPCResponse<void> => {
    try {
      db.transaction(
        (tx) => {
          tx.delete(slides).where(eq(slides.screenId, data.screenId)).run();

          data.slides.map((slide, index) => {
            const ext = slide.filePath ? path.extname(slide.filePath).toLowerCase().slice(1) : null;

            const slideData = {
              id: nanoid(),
              screenId: data.screenId,
              filePath: slide.filePath,
              duration: slide.duration,
              show: slide.show,
              order: index,
              type: ext ? getFileType(ext) : null,
              rotate: slide.rotate,
            };

            return tx.insert(slides).values(slideData).run();
          });
        },
        {
          behavior: "deferred",
        },
      );
      return {
        success: true,
        message: MESSAGE.SUCCESS_TO_UPDATE_SCREEN_SLIDES,
      };
    } catch (error) {
      console.error("Error updating screen slides:", error);
      return {
        success: false,
        message: MESSAGE.FAIL_TO_UPDATE_SCREEN_SLIDES,
      };
    }
  },
);
