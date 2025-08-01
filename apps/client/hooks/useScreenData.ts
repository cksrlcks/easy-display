import { useAppConfigStore } from "@/stores/useAppConfigStore";
import { useHostIpStore } from "@/stores/useHostStore";
import { ScreenData, Slide } from "@repo/types";
import { useCallback, useEffect, useState } from "react";

export default function useScreenData() {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ScreenData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const hostIp = useHostIpStore((state) => state.hostIp);
  const deviceId = useAppConfigStore((state) => state.deviceId);

  const getScreenData = useCallback(async () => {
    if (!hostIp || !deviceId) return;

    try {
      setError(null);
      setIsLoading(true);
      setData(null);

      const response = await fetch(`http://${hostIp}/get-screen-data?deviceId=${deviceId}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(`${result.error || "Failed to fetch screen data"}`);
      }
      setData(result.data);
    } catch (error) {
      console.error("Error fetching screen data:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [hostIp, deviceId]);

  useEffect(() => {
    getScreenData();
  }, [hostIp, deviceId, getScreenData]);

  const slides = data?.slides.filter((slide: Slide) => slide.show) || [];

  return {
    error,
    isLoading,
    slides,
    getScreenData,
  };
}
