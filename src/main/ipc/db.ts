import {
  IPCResponse,
  Screen,
  ScreenWithFileBasedSlides,
  ScreenWithSlides,
  Slide,
} from "@shared/types";
import { eq } from "drizzle-orm";
import fs from "fs";
import { nanoid } from "nanoid";
import path from "path";

import { MESSAGE } from "../constants";
import { db } from "../db/client";
import { screens, slides } from "../db/schema";

export async function getScreenList(): IPCResponse<ScreenWithSlides[]> {
  try {
    const screens = await db.query.screens.findMany({
      with: {
        slides: true,
      },
      orderBy: (screen, { desc }) => desc(screen.createdAt),
    });

    return {
      success: true,
      data: screens,
    };
  } catch (error) {
    console.error("Error fetching screen list:", error);
    return {
      success: false,
      message: MESSAGE.FAIL_TO_GET_SCREEN_LIST,
    };
  }
}

export async function createScreen(
  _,
  data: Pick<Screen, "alias" | "direction">,
): IPCResponse<void> {
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
      direction: data.direction,
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
}

export async function updateScreen(
  _,
  data: Pick<Screen, "id" | "alias" | "direction">,
): IPCResponse<void> {
  try {
    await db
      .update(screens)
      .set({
        alias: data.alias,
        direction: data.direction,
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
}

export async function deleteScreen(_, data: Pick<Screen, "id">): IPCResponse<void> {
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
}

export async function getScreenById(
  _,
  data: Pick<Screen, "id">,
): IPCResponse<ScreenWithFileBasedSlides> {
  try {
    const screen = await db.query.screens.findFirst({
      where: eq(screens.id, data.id),
      with: {
        slides: true,
      },
    });

    if (!screen) {
      return {
        success: false,
        message: MESSAGE.FAIL_TO_FIND_SCREEN,
      };
    }

    const slides = screen.slides.map((item) => {
      if (!item.filePath || !fs.existsSync(item.filePath)) {
        return {
          ...item,
          file: null,
        };
      }

      const ext = path.extname(item.filePath).toLowerCase().slice(1);
      return {
        ...item,
        file: {
          base: path.parse(item.filePath).base,
          name: path.parse(item.filePath).name,
          size: fs.statSync(item.filePath).size,
          path: item.filePath,
          ext,
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
}

type UpdateScreenSlidesData = {
  screenId: string;
  slides: Pick<Slide, "duration" | "show" | "filePath">[];
};
export async function updateScreenSlides(_, data: UpdateScreenSlidesData): IPCResponse<void> {
  try {
    db.transaction(
      (tx) => {
        tx.delete(slides).where(eq(slides.screenId, data.screenId)).run();

        data.slides.map((slide, index) => {
          const slideData = {
            id: nanoid(),
            screenId: data.screenId,
            filePath: slide.filePath,
            duration: slide.duration,
            show: slide.show,
            order: index,
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
}
