import CustomSplashScreen from "@/components/SplashScreen";
import { loadAppConfig } from "@/constants/Config";
import useBroadcastPresence from "@/hooks/useBroadcastPresence";
import { useAppConfigStore } from "@/stores/useAppConfigStore";
import * as Device from "expo-device";
import { useFonts } from "expo-font";
import { useKeepAwake } from "expo-keep-awake";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

const isAndroid12OrAbove = Device.platformApiLevel && Device.platformApiLevel >= 31;

export default function RootLayout() {
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useKeepAwake();

  const [loaded, error] = useFonts({
    PretendardRegular: require("../assets/fonts/Pretendard-Regular.ttf"),
    PretendardMedium: require("../assets/fonts/Pretendard-Medium.ttf"),
    PretendardBold: require("../assets/fonts/Pretendard-Bold.ttf"),
  });

  const setConfig = useAppConfigStore((state) => state.setConfig);

  useBroadcastPresence();

  useEffect(() => {
    if (isAndroid12OrAbove) {
      SplashScreen.hideAsync();
    }

    (async function prepare() {
      try {
        if (!loaded && !error) {
          return;
        }

        const config = await loadAppConfig();
        setConfig(config);

        if (error) {
          console.warn(`Error in loading fonts: ${error}`);
        }

        if (!isAndroid12OrAbove) {
          SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn("App initialization error:", e);
      }
    })();
  }, [loaded, error, setConfig]);

  if (!loaded && !error) {
    return null;
  }

  if (isAndroid12OrAbove && showCustomSplash) {
    return (
      <CustomSplashScreen
        onFinish={() => {
          setShowCustomSplash(false);
        }}
      />
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="slide" options={{ headerShown: false }} />
      <Stack.Screen name="setting" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ headerShown: false }} />
    </Stack>
  );
}
