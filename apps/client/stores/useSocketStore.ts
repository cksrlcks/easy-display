import dgram from "react-native-udp";
import { create } from "zustand";

type State = {
  socket: ReturnType<typeof dgram.createSocket> | null;
  setSocket: (socket: ReturnType<typeof dgram.createSocket> | null) => void;
};

export const useDiscoverySocketStore = create<State>((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
}));
