import { loadAppConfig } from "@/constants/Config";
import { useAppConfigStore } from "@/stores/useAppConfigStore";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ReanimatedLogLevel, configureReanimatedLogger } from "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.setOptions({
  duration: 2000,
});
SplashScreen.preventAutoHideAsync();

// Disable reanimated warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PretendardRegular: require("../assets/fonts/Pretendard-Regular.ttf"),
    PretendardMedium: require("../assets/fonts/Pretendard-Medium.ttf"),
    PretendardBold: require("../assets/fonts/Pretendard-Bold.ttf"),
  });
  const setConfig = useAppConfigStore((state) => state.setConfig);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      if (error) {
        console.warn(`Error in loading fonts: ${error}`);
      }
    }
  }, [loaded, error]);

  useEffect(() => {
    (async function () {
      const config = await loadAppConfig();
      setConfig(config);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="slide" options={{ headerShown: false }} />
        <Stack.Screen name="setting" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
