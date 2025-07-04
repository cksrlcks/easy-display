import ErrorIcon from "@/assets/images/icon-error.svg";
import SlideShow from "@/components/SlideShow";
import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import useScreenData from "@/hooks/useScreenData";
import { StyleSheet } from "react-native";

export default function Slide() {
  const { slides, error, isLoading, getScreenData } = useScreenData();

  return (
    <ThemedView style={styles.container}>
      {isLoading && (
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>화면 데이터 로딩 중...</ThemedText>
        </ThemedView>
      )}
      {error && (
        <ThemedView style={styles.errorContainer}>
          <ErrorIcon style={{ opacity: 0.5 }} width={80} height={80} />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <ThemedButton onPress={getScreenData} disabled={isLoading}>
            <ThemedText>재시도</ThemedText>
          </ThemedButton>
        </ThemedView>
      )}
      {slides.length > 0 && <SlideShow slides={slides} />}
    </ThemedView>
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
