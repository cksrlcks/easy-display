import ErrorIcon from "@/assets/images/icon-error.svg";
import BackModal from "@/components/BackModal";
import SlideShow from "@/components/SlideShow";
import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import useBackModal from "@/hooks/useBackModal";
import useScreenData from "@/hooks/useScreenData";
import { useKeepAwake } from "expo-keep-awake";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export default function Slide() {
  const { slides, error, isLoading, getScreenData } = useScreenData();
  const { visible, onClose } = useBackModal();
  const router = useRouter();

  useKeepAwake();

  const backModalMenus = [
    {
      label: "새로고침",
      onPress: getScreenData,
    },
    {
      label: "슬라이드 종료",
      onPress: () => router.back(),
    },
    {
      label: "닫기",
    },
  ];

  return (
    <>
      <ThemedView style={styles.container}>
        {isLoading && (
          <ThemedView style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>화면 데이터 로딩 중...</ThemedText>
          </ThemedView>
        )}
        {error && (
          <ThemedView
            style={styles.errorContainer}
            importantForAccessibility={visible ? "no-hide-descendants" : "auto"}
          >
            <ErrorIcon style={{ opacity: 0.5 }} width={80} height={80} />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <ThemedButton onPress={getScreenData} disabled={isLoading}>
              <ThemedText>재시도</ThemedText>
            </ThemedButton>
          </ThemedView>
        )}
        {slides.length > 0 && <SlideShow slides={slides} />}
      </ThemedView>
      <BackModal visible={visible} onClose={onClose} menus={backModalMenus} />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 1000,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
  },
  errorText: {
    fontSize: 18,
  },
});
