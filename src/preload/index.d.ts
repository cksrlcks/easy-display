import { ElectronAPI } from "@electron-toolkit/preload";
import {
  InternalFile,
  IPCResponse,
  ScreenWithFileBasedSlides,
  ScreenWithSlides,
  Slide,
} from "src/shared/types";
declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      quitApp: () => IPCResponse<void>;
      getFilesInMediaFolder: () => IPCResponse<InternalFile[]>;
      getLocalIp: () => IPCResponse<string>;
      openMediaFolder: () => IPCResponse<void>;
      selectFiles: () => IPCResponse<string[]>;
      copyToMediaFolder: (filePaths: string[]) => IPCResponse<string[]>;
      openFile: (filePath: string) => IPCResponse<void>;
      deleteFile: (filePath: string) => IPCResponse<void>;
      getScreenList: () => IPCResponse<ScreenWithSlides[]>;
      createScreen: (data: Pick<Screen, "alias" | "direction">) => IPCResponse<void>;
      updateScreen: (data: Pick<Screen, "id" | "alias" | "direction">) => IPCResponse<void>;
      deleteScreen: (data: Pick<Screen, "id">) => IPCResponse<void>;
      getScreenById: (data: Pick<Screen, "id">) => IPCResponse<ScreenWithFileBasedSlides>;
      updateScreenSlides: (data: {
        screenId: Screen["id"];
        slides: Pick<Slide, "duration" | "show" | "filePath">[];
      }) => IPCResponse<void>;
    };
  }
}
