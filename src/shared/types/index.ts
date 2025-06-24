export type IPCResponse<T = void> = Promise<{ success: boolean; message?: string; data?: T }>;

export type InternalFile = {
  base: string;
  ext: string;
  path: string;
  name: string;
  size: number;
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
    file: InternalFile | null;
  })[];
};
