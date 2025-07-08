import { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function CustomSplashScreen({ onFinish }: { onFinish: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish(); // 애니메이션 끝나고 콜백
      });
    }, 2500);

    return () => clearTimeout(timeout);
  }, [opacity, scale, onFinish]);

  return (
    <View style={styles.splashContainer}>
      <Animated.View
        style={[
          styles.splashContent,
          {
            opacity: opacity,
            transform: [{ scale }],
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
