import { Screen, Slide } from "@repo/types";

export type IPCResponse<T = void> = Promise<{ success: boolean; message?: string; data?: T }>;

export type ExplorerItem = {
  name: string;
  isDirectory: boolean;
  size: number;
  ext?: string;
  path: string;
};

export type ScreenWithFileBasedSlides = Screen & {
  slides: (Omit<Slide, "filePath"> & {
    file: Omit<ExplorerItem, "isDirectory"> | null;
  })[];
};

export type Device = {
  id: string;
  deviceId: string;
  ip: string;
  name: string;
  alias: string;
  screenId?: string | null;
};
