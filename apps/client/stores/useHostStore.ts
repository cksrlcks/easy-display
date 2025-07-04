import { create } from "zustand";

type HostIpState = {
  hostIp: string | null;
  setHostIp: (ip: string) => void;
};

export const useHostIpStore = create<HostIpState>((set) => ({
  hostIp: null,
  setHostIp: (ip) => set({ hostIp: ip }),
}));
