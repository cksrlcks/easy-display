import { GlobalConfig, IPCResponse } from "@shared/types";
import { ipcMain } from "electron";

import { updateConfig } from "../config";
import { state } from "../index";

const MESSAGE = {
  SUCCESS_TO_UPDATE_CONFIG: "설정이 성공적으로 업데이트되었습니다.",
  FAIL_TO_UPDATE_CONFIG: "설정 업데이트에 실패했습니다.",
  SUCCESS_TO_GET_CONFIG: "설정 정보를 성공적으로 가져왔습니다.",
  FAIL_TO_GET_CONFIG: "설정 정보를 가져오는 데 실패했습니다.",
};

ipcMain.handle("setting:get", async (): IPCResponse<GlobalConfig> => {
  if (!state.config) {
    return {
      success: false,
      message: MESSAGE.FAIL_TO_GET_CONFIG,
    };
  }

  return {
    success: true,
    data: state.config,
  };
});

ipcMain.handle("setting:update", async (_, config: Partial<GlobalConfig>): IPCResponse<void> => {
  const updatedConfig = updateConfig(config);

  if (!updatedConfig) {
    return {
      success: false,
      message: MESSAGE.FAIL_TO_UPDATE_CONFIG,
    };
  }

  return {
    success: true,
    message: MESSAGE.SUCCESS_TO_UPDATE_CONFIG,
  };
});
