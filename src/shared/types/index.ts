export type IPCResponse<T = void> = Promise<{ success: boolean; message?: string; data?: T }>;

export type ExplorerItem = {
  name: string;
  isDirectory: boolean;
  size: number;
  ext?: string;
  path: string;
};

export type Screen = {
  id: string;
  alias: string;
  direction: "horizontal" | "vertical";
  createdAt: string;
  updatedAt: string;
};

export type Slide = {
  id: string;
  screenId: string;
  filePath: string | null;
  duration: number | null;
  show: boolean;
  order: number;
};

export type ScreenWithSlides = Screen & {
  slides: Slide[];
};

export type ScreenWithFileBasedSlides = Screen & {
  slides: (Omit<Slide, "filePath"> & {
    file: Omit<ExplorerItem, "isDirectory"> | null;
  })[];
};

export type Device = {
  id: string;
  tvId: string;
  ip: string;
  name: string;
  alias: string;
  screenId?: string | null;
};

export type LocalDevice = {
  tvId: string;
  tvName: string;
  ip: string;
  message: string;
};
