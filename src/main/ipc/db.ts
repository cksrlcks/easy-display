import { Screen } from "@shared/types";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { MESSAGE } from "../constants";
import { db } from "../db/client";
import { screens } from "../db/schema";

export async function getScreenList() {
  try {
    const screens = await db.query.screens.findMany({
      orderBy: (screen, { desc }) => desc(screen.createdAt),
    });

    return {
      success: true,
      data: screens.map((screen) => ({ ...screen, slides: [] })),
    };
  } catch (error) {
    console.error("Error fetching screen list:", error);
    return {
      success: false,
      message: MESSAGE.FAIL_TO_GET_SCREEN_LIST,
    };
  }
}

export async function createScreen(_, data: Pick<Screen, "alias" | "direction">) {
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

export async function updateScreen(_, data: Pick<Screen, "id" | "alias" | "direction">) {
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

export async function deleteScreen(_, data: Pick<Screen, "id">) {
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
