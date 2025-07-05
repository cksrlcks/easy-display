import CustomSplashScreen from "@/components/SplashScreen";
import { loadAppConfig } from "@/constants/Config";
import { useAppConfigStore } from "@/stores/useAppConfigStore";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import * as Device from "expo-device";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ReanimatedLogLevel, configureReanimatedLogger } from "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

const isAndroid12OrAbove = Device.platformApiLevel && Device.platformApiLevel >= 31;

// Disable reanimated warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(isAndroid12OrAbove);

  const [loaded, error] = useFonts({
    PretendardRegular: require("../assets/fonts/Pretendard-Regular.ttf"),
    PretendardMedium: require("../assets/fonts/Pretendard-Medium.ttf"),
    PretendardBold: require("../assets/fonts/Pretendard-Bold.ttf"),
  });

  const setConfig = useAppConfigStore((state) => state.setConfig);

  useEffect(() => {
    (async function prepare() {
      try {
        if (!loaded && !error) {
          return;
        }

        const config = await loadAppConfig();
        setConfig(config);

        // 에러 처리
        if (error) {
          console.warn(`Error in loading fonts: ${error}`);
        }

        setIsAppReady(true);

        if (!isAndroid12OrAbove) {
          SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn("App initialization error:", e);
        setIsAppReady(true);
      }
    })();
  }, [loaded, error, setConfig]);

  if (!loaded && !error) {
    return null;
  }

  if (showCustomSplash || !isAppReady) {
    return <CustomSplashScreen onFinish={() => setShowCustomSplash(false)} />;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="slide" options={{ headerShown: false }} />
        <Stack.Screen name="setting" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
