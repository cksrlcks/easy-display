import BackModal from "@/components/BackModal";
import Discovery from "@/components/Discovery";
import GuideQR from "@/components/GuideQR";
import Intro from "@/components/Intro";
import { GUIDE_URL } from "@/constants/Config";
import useBackModal from "@/hooks/useBackModal";
import { useRouter } from "expo-router";
import { BackHandler, StyleSheet, View } from "react-native";

export default function Home() {
  const { visible, onClose } = useBackModal();
  const router = useRouter();

  const backModalMenus = [
    {
      label: "설정",
      onPress: () => router.push("/setting"),
    },
    {
      label: "닫기",
    },
    { label: "앱 종료", onPress: () => BackHandler.exitApp() },
  ];

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
      <BackModal visible={visible} onClose={onClose} menus={backModalMenus} />
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
