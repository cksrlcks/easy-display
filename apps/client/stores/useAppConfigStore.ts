import { DISCOVERY_PORT, DISCOVERY_TIMEOUT, SLIDE_TRANSITION_SPEED } from "@/constants/Config";
import { create } from "zustand";

type AppConfig = {
  deviceId: string;
  discoveryPort: number;
  discoveryTimeout: number;
  slideTransitionSpeed: number;
  setConfig: (config: Partial<AppConfig>) => void;
};

export const useAppConfigStore = create<AppConfig>((set) => ({
  deviceId: "",
  discoveryPort: DISCOVERY_PORT,
  discoveryTimeout: DISCOVERY_TIMEOUT,
  slideTransitionSpeed: SLIDE_TRANSITION_SPEED,
  setConfig: (config) => set((state) => ({ ...state, ...config })),
}));
