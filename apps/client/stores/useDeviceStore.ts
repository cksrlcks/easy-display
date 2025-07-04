import { create } from "zustand";

type Device = {
  deviceId: string | null;
  setDeviceId: (id: string) => void;
};

export const useDeviceStore = create<Device>((set) => ({
  deviceId: null,
  setDeviceId: (id) => set({ deviceId: id }),
}));
