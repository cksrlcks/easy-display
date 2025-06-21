import { ElectronAPI } from "@electron-toolkit/preload";
declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getFilesInMediaFolder: () => IPCResponse<
        { ext: string; path: string; name: string; size: number }[]
      >;
      getLocalIp: () => IPCResponse<string>;
      openMediaFolder: () => IPCResponse<void>;
      selectFiles: () => IPCResponse<string[]>;
      copyToMediaFolder: (filePaths: string[]) => IPCResponse<string[]>;
      deleteFile: (filePath: string) => IPCResponse<void>;
    };
  }
}
