import { ElectronAPI } from "@electron-toolkit/preload";
import {
  ExplorerItem,
  IPCResponse,
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
      screenCreate: (data: Pick<Screen, "alias" | "direction">) => IPCResponse<void>;
      screenUpdate: (data: Pick<Screen, "id" | "alias" | "direction">) => IPCResponse<void>;
      screenDelete: (data: Pick<Screen, "id">) => IPCResponse<void>;
      screenUpdateSlides: (data: {
        screenId: Screen["id"];
        slides: Pick<Slide, "duration" | "show" | "filePath">[];
      }) => IPCResponse<void>;

      // device
      deviceList: () => IPCResponse<Device[]>;
      deviceGet: (data: Pick<Device, "id">) => IPCResponse<Device>;
      deviceCreate: (data: Omit<Device, "id" | "screenId">) => IPCResponse<void>;
      deviceUpdate: (data: Device) => IPCResponse<void>;
      deviceDelete: (data: Pick<Device, "id">) => IPCResponse<void>;

      // socket
      discoveredTvs: (
        callback: (tvs: { tvId: string; tvName: string; ip: string; message: string }[]) => void,
      ) => void;
    };
  }
}
