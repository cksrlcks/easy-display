import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function CustomSplashScreen({ onFinish }: { onFinish: () => void }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    SplashScreen.hideAsync();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.splashContainer}>
      <Animated.View
        style={[
          styles.splashContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require("../assets/images/splash-image.png")}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  splashContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  splashImage: {
    width: Math.min(width * 0.6, 300),
    height: Math.min(height * 0.6, 300),
  },
});
