import Discovery from "@/components/Discovery";
import GuideQR from "@/components/GuideQR";
import Intro from "@/components/Intro";
import SettingModal from "@/components/SettingModal";
import { GUIDE_URL } from "@/constants/Config";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { BackHandler, View } from "react-native";
import { StyleSheet } from "react-native";

export default function Home() {
  const [visible, setVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
        if (visible) {
          setVisible(false);
        } else {
          setVisible(true);
        }

        return true;
      });

      return () => subscription.remove();
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.introContainer}>
        <Intro />
        <GuideQR value={GUIDE_URL} />
      </View>
      <View style={styles.sidebar}>
        <Discovery />
      </View>
      <View style={{ height: 0, width: 0, backgroundColor: "red" }} focusable />
      <SettingModal
        visible={visible}
        onClose={() => setVisible(false)}
        onRequestClose={() => setVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#000",
  },
  introContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sidebar: {
    width: 320,
    backgroundColor: "#111",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
