import {
  DEVICE_ID_KEY,
  DISCOVERY_INTERVAL,
  RESPONSE_MESSAGE_NAME,
  RESPONSE_MESSAGE_TYPE,
  SEND_MESSAGE_NAME,
  SEND_MESSAGE_TYPE,
  targetAddress,
} from "@/constants/Config";
import { useAppConfigStore } from "@/stores/useAppConfigStore";
import { useDeviceStore } from "@/stores/useDeviceStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClientMessage, Host, HostMessage } from "@repo/types";
import { Buffer } from "buffer";
import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import dgram from "react-native-udp";

export default function useHostDiscovery() {
  const [hostList, setHostList] = useState<Host[]>([]);
  const [status, setStatus] = useState<"idle" | "pending" | "error" | null>(null);

  const socketRef = useRef<ReturnType<typeof dgram.createSocket> | null>(null);
  let intervalRef = useRef<number | null>(null);

  const setDeviceId = useDeviceStore((state) => state.setDeviceId);
  const deviceId = useDeviceStore((state) => state.deviceId);
  const discoveryPort = useAppConfigStore((state) => state.discoveryPort);
  const discoveryTimeout = useAppConfigStore((state) => state.discoveryTimeout);

  // 디바이스 ID 설정
  useEffect(() => {
    (async () => {
      const existingId = await AsyncStorage.getItem(DEVICE_ID_KEY);

      if (existingId) {
        setDeviceId(existingId);
      } else {
        const newId = Crypto.randomUUID();
        await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
        setDeviceId(newId);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!deviceId) return;

      setupListener();

      return () => cleanup();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deviceId]),
  );

  const setupListener = () => {
    if (socketRef.current) {
      return;
    }

    const socket = dgram.createSocket({ type: "udp4" });
    socketRef.current = socket;

    socket.bind(0);

    setStatus("pending");

    intervalRef.current = setInterval(() => {
      sendDiscoveryPing();
    }, DISCOVERY_INTERVAL);

    socket.on("message", (msg, rinfo) => {
      const data = JSON.parse(msg.toString("utf8")) as HostMessage;
      console.log("HOST 메세지 수신된:", data, rinfo);

      if (
        data.name !== RESPONSE_MESSAGE_NAME ||
        data.type !== RESPONSE_MESSAGE_TYPE ||
        data.deviceId !== deviceId
      ) {
        return;
      }

      setHostList((prev) => {
        const now = Date.now();

        const filtered = prev.filter((host) => now - host.lastSeen < DISCOVERY_INTERVAL);

        const existing = filtered.find((host) => host.ip === rinfo.address);

        if (existing) {
          return filtered.map((host) =>
            host.ip === rinfo.address ? { ...host, lastSeen: now } : host,
          );
        }

        return [...filtered, { ip: rinfo.address, port: data.port, lastSeen: now }];
      });
    });

    socket.on("error", (err) => {
      console.error("소켓 오류:", err);
      if (status === "pending") {
        setStatus("error");
      }
    });
  };

  const sendDiscoveryPing = () => {
    if (!deviceId || !socketRef.current) {
      return;
    }

    const message = Buffer.from(
      JSON.stringify({
        name: SEND_MESSAGE_NAME,
        type: SEND_MESSAGE_TYPE,
        deviceId,
        deviceName: Device.deviceName,
      } as ClientMessage),
    );

    socketRef.current.send(message, 0, message.length, discoveryPort, targetAddress, (err) => {
      if (err) {
        console.error("브로드캐스트 실패:", err);
        setStatus("error");
      } else {
        console.log("브로드캐스트 전송됨");
      }
    });
  };

  const cleanup = () => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.close();
      socketRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setStatus("idle");
    setHostList([]);
  };

  const retry = () => {
    setStatus("pending");
    setupListener();
  };

  useEffect(() => {
    if (status !== "pending") return;

    const timeout = setTimeout(() => {
      const now = Date.now();
      const stillNone = hostList.every((host) => now - host.lastSeen > DISCOVERY_INTERVAL);

      if (stillNone) {
        cleanup();
      }
    }, discoveryTimeout);

    return () => clearTimeout(timeout);
  }, [status, hostList, discoveryTimeout]);

  return {
    hostList,
    status,
    cleanup,
    retry,
  };
}
