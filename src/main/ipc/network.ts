import { ipcMain } from "electron";
import os from "os";
import { IPCResponse } from "src/shared/types";

import { COMMON_MESSAGE } from "../constants";

const MESSAGE = {
  SUCCESS_TO_GET_LOCAL_IP: "로컬 IP 주소를 성공적으로 가져왔습니다.",
  FAIL_TO_GET_LOCAL_IP: "로컬 IP 주소를 가져오는 데 실패했습니다.",
};

ipcMain.handle("network:get-ip", async (): IPCResponse<string> => {
  try {
    const interfaces = os.networkInterfaces();

    for (const name in interfaces) {
      for (const iface of interfaces[name]!) {
        if (iface.family === "IPv4" && !iface.internal)
          return {
            success: true,
            message: MESSAGE.SUCCESS_TO_GET_LOCAL_IP,
            data: iface.address,
          };
      }
    }

    return {
      success: false,
      message: MESSAGE.FAIL_TO_GET_LOCAL_IP,
    };
  } catch (error) {
    console.error("Failed to get local IP address:", error);
    return {
      success: false,
      message: COMMON_MESSAGE.UNKNOWN_ERROR,
    };
  }
});
