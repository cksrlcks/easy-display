export type Host = {
  ip: string;
  port: number;
  lastSeen: number;
};

export type Slide = {
  id: string;
  duration: number | null;
  screenId: string;
  filePath: string | null;
  show: boolean;
  order: number;
  type: "image" | "video" | "etc";
  rotate: number;
};

export type ScreenData = {
  id: string;
  alias: string;
  createdAt: string;
  updatedAt: string;
  slides: Slide[];
};
