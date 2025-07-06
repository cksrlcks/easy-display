import { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function CustomSplashScreen({ onFinish }: { onFinish: () => void }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withTiming(1, { duration: 800 });

    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 });
      scale.value = withTiming(1.1, { duration: 500 }, () => {
        runOnJS(onFinish)();
      });
    }, 2500);
  }, [opacity, scale, onFinish]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.splashContainer}>
      <Animated.View style={[styles.splashContent, animatedStyle]}>
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
