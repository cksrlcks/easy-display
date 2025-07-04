export type Client = {
  deviceId: string;
  deviceName: string;
  ip: string;
};

export type Host = {
  ip: string;
  port: number;
  hostName: string;
  lastSeen: number;
};

export type Slide = {
  id: string;
  duration: number | null;
  screenId: string;
  filePath: string | null;
  show: boolean;
  order: number;
  type: "image" | "video" | "etc" | null;
  rotate: number;
};

export type Screen = {
  id: string;
  alias: string;
  createdAt: string;
  updatedAt: string;
};

export type ScreenData = Screen & {
  slides: Slide[];
};

export type HostMessage = Pick<Host, "port" | "hostName"> & {
  name: string;
  type: string;
  deviceId: string;
  screenId: string | null;
};

export type ClientMessage = Client & {
  name: string;
  type: string;
};
