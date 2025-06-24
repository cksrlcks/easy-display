export type IPCResponse<T = void> = Promise<{ success: boolean; message?: string; data?: T }>;

export type InternalFile = {
  base: string;
  ext: string;
  path: string;
  name: string;
  size: number;
};
