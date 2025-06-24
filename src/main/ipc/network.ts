import os from "os";
import { IPCResponse } from "src/shared/types";

import { MESSAGE } from "../constants";

export async function getLocalIp(): IPCResponse<string> {
  const interfaces = os.networkInterfaces();

  for (const name in interfaces) {
    for (const iface of interfaces[name]!) {
      if (iface.family === "IPv4" && !iface.internal)
        return {
          success: true,
          data: iface.address,
        };
    }
  }

  return {
    success: false,
    message: MESSAGE.FAIL_TO_GET_LOCAL_IP,
  };
}
