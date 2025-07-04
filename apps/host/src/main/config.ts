import { GlobalConfig } from "@shared/types";
import fs from "fs";
import os from "os";
import path from "path";

import { state } from "./";

const defaultConfig: GlobalConfig = {
  hostName: "easy-display-host",
  mediaServerPort: 51235,
  udpPort: 41234,
};

const documentsPath = path.join(os.homedir(), "Documents");
export const configDir = path.join(documentsPath, "easy-display");
export const configPath = path.join(documentsPath, "easy-display", "config.json");

export function initializeConfig(): GlobalConfig {
  let existingConfig: Partial<GlobalConfig> | null = null;

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (fs.existsSync(configPath)) {
    try {
      const configData = fs.readFileSync(configPath, "utf-8");
      existingConfig = JSON.parse(configData);
    } catch (error) {
      console.error("Error reading or parsing config file:", error);
      existingConfig = null;
    }
  } else {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), "utf-8");
  }

  const mergedConfig: GlobalConfig = { ...defaultConfig, ...existingConfig };

  fs.writeFileSync(configPath, JSON.stringify(mergedConfig, null, 2), "utf-8");

  return mergedConfig;
}

export function updateConfig(config: Partial<GlobalConfig>): GlobalConfig | null {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  if (!state.config) {
    return null;
  } else {
    const mergedConfig: GlobalConfig = { ...state.config, ...config };

    fs.writeFileSync(configPath, JSON.stringify(mergedConfig, null, 2), "utf-8");
    state.config = mergedConfig;

    return mergedConfig;
  }
}
