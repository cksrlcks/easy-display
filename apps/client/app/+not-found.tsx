import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TEXT } from "@/constants/Text";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText>{TEXT.NOT_FOUND}</ThemedText>
      <ThemedButton onPress={() => router.push("/")} size="small">
        <ThemedText type="small">{TEXT.NOT_FOUND_GO_HOME}</ThemedText>
      </ThemedButton>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },

  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
