import {
  DISCOVERY_INTERVAL,
  RESPONSE_MESSAGE_NAME,
  RESPONSE_MESSAGE_TYPE,
} from "@/constants/Config";
import { useAppConfigStore } from "@/stores/useAppConfigStore";
import { useDiscoverySocketStore } from "@/stores/useSocketStore";
import { Host, HostMessage } from "@repo/types";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

export default function useHostDiscovery() {
  const [hostList, setHostList] = useState<Host[]>([]);
  const [status, setStatus] = useState<"idle" | "pending" | "error" | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const { socket } = useDiscoverySocketStore();
  const { discoveryTimeout, deviceId } = useAppConfigStore();

  useFocusEffect(
    useCallback(() => {
      discoveryHost();

      return () => {
        cleanup();
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deviceId]),
  );

  const discoveryHost = () => {
    if (!socket) return;

    setHostList([]);
    setStatus("pending");
    socket.on("message", handleMessage);

    socket.on("error", (err) => {
      console.error("소켓 오류:", err);
      if (status === "pending") {
        setStatus("error");
      }
    });

    timeoutRef.current = setTimeout(() => {
      if (hostList.length === 0) {
        setStatus("idle");
        cleanup();
      }
    }, discoveryTimeout);
  };

  const handleMessage = useCallback(
    (msg: Buffer, rinfo: { address: string }) => {
      const data = JSON.parse(msg.toString("utf8")) as HostMessage;

      if (
        data.name !== RESPONSE_MESSAGE_NAME ||
        data.type !== RESPONSE_MESSAGE_TYPE ||
        data.deviceId !== deviceId
      ) {
        return;
      }

      setHostList((prev) => {
        const now = Date.now();
        const existing = prev.find((host) => host.ip === rinfo.address);

        if (existing) {
          return prev.map((host) =>
            host.ip === rinfo.address ? { ...host, lastSeen: now } : host,
          );
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        return [
          ...prev,
          { ip: rinfo.address, port: data.port, hostName: data.hostName, lastSeen: now },
        ];
      });
    },
    [deviceId],
  );

  const cleanup = useCallback(() => {
    setStatus("idle");
    socket?.off("message", handleMessage);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [socket, handleMessage]);

  const retry = () => {
    setHostList([]);
    setStatus("pending");
    discoveryHost();
  };

  useFocusEffect(
    useCallback(() => {
      const timeout = setInterval(() => {
        const now = Date.now();
        setHostList((prev) => {
          const filtered = prev.filter((host) => now - host.lastSeen < DISCOVERY_INTERVAL);
          if (filtered.length === 0 && status === "pending") {
            if (!timeoutRef.current) {
              timeoutRef.current = setTimeout(() => {
                setStatus("idle");
                cleanup();
              }, discoveryTimeout);
            }
          }

          return filtered;
        });
      }, DISCOVERY_INTERVAL);

      return () => clearInterval(timeout);
    }, [cleanup, discoveryTimeout, status]),
  );

  return {
    hostList,
    status,
    cleanup,
    retry,
  };
}
