import {
  DISCOVERY_INTERVAL,
  SEND_MESSAGE_NAME,
  SEND_MESSAGE_TYPE,
  targetAddress,
} from "@/constants/Config";
import { useAppConfigStore } from "@/stores/useAppConfigStore";
import { useDiscoverySocketStore } from "@/stores/useSocketStore";
import { ClientMessage } from "@repo/types";
import * as Device from "expo-device";
import { useEffect } from "react";
import dgram from "react-native-udp";

export default function useBroadcastPresence() {
  const { deviceId, discoveryPort } = useAppConfigStore();
  const { setSocket } = useDiscoverySocketStore();

  useEffect(() => {
    if (!deviceId || !discoveryPort) return;

    const newSocket = dgram.createSocket({ type: "udp4" });
    newSocket.bind(0);
    setSocket(newSocket);

    const interval = setInterval(() => {
      const message = Buffer.from(
        JSON.stringify({
          name: SEND_MESSAGE_NAME,
          type: SEND_MESSAGE_TYPE,
          deviceId,
          deviceName: Device.deviceName,
        } as ClientMessage),
      );

      // targetaddress를 255로 해보자
      newSocket.send(message, 0, message.length, discoveryPort, targetAddress, (err) => {
        if (err) console.error("ping error", err);
        else console.log("ping sent successfully to", targetAddress);
      });
    }, DISCOVERY_INTERVAL);

    return () => {
      clearInterval(interval);
      newSocket.close();
      setSocket(null);
    };
  }, [deviceId, discoveryPort, setSocket]);
}
