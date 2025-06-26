import { Device, IPCResponse } from "@shared/types";
import { eq } from "drizzle-orm";
import { ipcMain } from "electron";
import { nanoid } from "nanoid";

import { db } from "../db/client";
import { devices } from "../db/schema";

const MESSAGE = {
  FAIL_TO_GET_DEVICE_LIST: "장치 목록을 가져오는 데 실패했습니다.",
  SUCCESS_TO_GET_DEVICE: "장치 정보를 성공적으로 가져왔습니다.",
  FAIL_TO_GET_DEVICE: "장치 정보를 가져오는 데 실패했습니다.",
  SUCCESS_TO_CREATE_DEVICE: "장치를 성공적으로 등록했습니다.",
  FAIL_TO_CREATE_DEVICE: "장치 등록에 실패했습니다.",
  DEVICE_ALIAS_ALREADY_EXISTS: "이미 존재하는 장치 별칭입니다.",
  SUCCESS_TO_UPDATE_DEVICE: "장치를 성공적으로 업데이트했습니다.",
  FAIL_TO_UPDATE_DEVICE: "장치 업데이트에 실패했습니다.",
  SUCCESS_TO_DELETE_DEVICE: "장치를 성공적으로 삭제했습니다.",
  FAIL_TO_DELETE_DEVICE: "장치 삭제에 실패했습니다.",
};

ipcMain.handle("device:list", async (): IPCResponse<Device[]> => {
  try {
    const devices = await db.query.devices.findMany({
      with: {
        screen: true,
      },
    });

    return {
      success: true,
      data: devices,
    };
  } catch (error) {
    console.error("Error fetching devices:", error);
    return {
      success: false,
      message: MESSAGE.FAIL_TO_GET_DEVICE_LIST,
    };
  }
});

ipcMain.handle("device:get", async (_, data: Pick<Device, "id">): IPCResponse<Device> => {
  try {
    const device = await db.query.devices.findFirst({
      where: eq(devices.id, data.id),
      with: {
        screen: true,
      },
    });

    if (!device) {
      return {
        success: false,
        message: MESSAGE.FAIL_TO_GET_DEVICE,
      };
    }

    return {
      success: true,
      data: device,
    };
  } catch (error) {
    console.error("Error fetching device:", error);
    return {
      success: false,
      message: MESSAGE.FAIL_TO_GET_DEVICE,
    };
  }
});

ipcMain.handle(
  "device:create",
  async (_, data: Omit<Device, "id" | "screenId">): IPCResponse<Device> => {
    try {
      const existingDevice = await db.query.devices.findFirst({
        where: eq(devices.alias, data.alias),
      });

      if (existingDevice) {
        return {
          success: false,
          message: MESSAGE.DEVICE_ALIAS_ALREADY_EXISTS,
        };
      }

      const newDevice = {
        ...data,
        id: nanoid(),
        screenId: null,
      };

      await db.insert(devices).values(newDevice);

      return {
        success: true,
        message: MESSAGE.SUCCESS_TO_CREATE_DEVICE,
        data: newDevice,
      };
    } catch (error) {
      console.error("Error creating device:", error);
      return {
        success: false,
        message: MESSAGE.FAIL_TO_CREATE_DEVICE,
      };
    }
  },
);

ipcMain.handle("device:update", async (_, data: Partial<Device>): IPCResponse<void> => {
  if (!data.id) {
    return {
      success: false,
      message: "장치 ID가 필요합니다.",
    };
  }

  try {
    const existingDevice = await db.query.devices.findFirst({
      where: eq(devices.id, data.id),
    });

    if (!existingDevice) {
      return {
        success: false,
        message: MESSAGE.FAIL_TO_UPDATE_DEVICE,
      };
    }

    await db
      .update(devices)
      .set({
        ip: data.ip,
        name: data.name,
        alias: data.alias,
        screenId: data.screenId || null,
      })
      .where(eq(devices.id, data.id));

    return {
      success: true,
      message: MESSAGE.SUCCESS_TO_UPDATE_DEVICE,
    };
  } catch (error) {
    console.error("Error updating device:", error);
    return {
      success: false,
      message: MESSAGE.FAIL_TO_UPDATE_DEVICE,
    };
  }
});

ipcMain.handle("device:delete", async (_, data: Pick<Device, "id">): IPCResponse<void> => {
  try {
    const existingDevice = await db.query.devices.findFirst({
      where: eq(devices.id, data.id),
    });

    if (!existingDevice) {
      return {
        success: false,
        message: MESSAGE.FAIL_TO_DELETE_DEVICE,
      };
    }

    await db.delete(devices).where(eq(devices.id, data.id));

    return {
      success: true,
      message: MESSAGE.SUCCESS_TO_DELETE_DEVICE,
    };
  } catch (error) {
    console.error("Error deleting device:", error);
    return {
      success: false,
      message: MESSAGE.FAIL_TO_DELETE_DEVICE,
    };
  }
});
