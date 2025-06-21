export type IPCResponse<T = void> = Promise<
  T extends void
    ? { success: true } | { success: false; error: string }
    : { success: true; data: T } | { success: false; error: string }
>;

export type InternalFile = {
  ext: string;
  path: string;
  name: string;
  size: number;
};
