import { ElectronAPI } from "@electron-toolkit/preload";
import {
  Device,
  ExplorerItem,
  IPCResponse,
  Screen,
  ScreenWithFileBasedSlides,
  ScreenWithSlides,
  Slide,
} from "src/shared/types";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      // general
      quitApp: () => IPCResponse<void>;

      // explorer
      explorerList: (folderPath: string) => IPCResponse<ExplorerItem[]>;
      explorerOpen: (filePath: string) => IPCResponse<void>;
      explorerDelete: (filePath: string) => IPCResponse<void>;
      explorerSelect: () => IPCResponse<string[]>;
      explorerCopy: (filePaths: string[]) => IPCResponse<string[]>;

      // network
      networkGetIp: () => IPCResponse<string>;

      // screen
      screenList: () => IPCResponse<ScreenWithSlides[]>;
      screenGet: (data: Pick<Screen, "id">) => IPCResponse<ScreenWithFileBasedSlides>;
      screenCreate: (data: Partial<Screen>) => IPCResponse<void>;
      screenUpdate: (data: Partial<Screen>) => IPCResponse<void>;
      screenDelete: (data: Pick<Screen, "id">) => IPCResponse<void>;
      screenUpdateSlides: (data: {
        screenId: Screen["id"];
        slides: Partial<Slide>[];
      }) => IPCResponse<void>;

      // device
      deviceList: () => IPCResponse<Device[]>;
      deviceGet: (data: Pick<Device, "id">) => IPCResponse<Device>;
      deviceCreate: (data: Partial<Device>) => IPCResponse<void>;
      deviceUpdate: (data: Partial<Device>) => IPCResponse<void>;
      deviceDelete: (data: Pick<Device, "id">) => IPCResponse<void>;

      // socket
      socketStartDiscovery: () => IPCResponse<void>;
      socketStopDiscovery: () => IPCResponse<void>;
      socketDiscoveredDevices: (callback: (data: LocalDevice[]) => void) => void;
    };
  }
}
