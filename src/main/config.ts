import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  mediaServerPort: number;
  udpPort: number;
};

const defaultConfig: Config = {
  mediaServerPort: 51235,
  udpPort: 41234,
};

const documentsPath = path.join(os.homedir(), "Documents");
const configDir = path.join(documentsPath, "easy-display");
const configPath = path.join(documentsPath, "easy-display", "config.json");

export function initializeConfig(): Config {
  let existingConfig: Partial<Config> | null = null;

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

  const mergedConfig: Config = { ...defaultConfig, ...existingConfig };

  fs.writeFileSync(configPath, JSON.stringify(mergedConfig, null, 2), "utf-8");

  return mergedConfig;
}
