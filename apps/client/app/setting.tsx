import Input from "@/components/Input";
import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TEXT } from "@/constants/Text";
import useSetting from "@/hooks/useSetting";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert, BackHandler, ScrollView, StyleSheet } from "react-native";

export default function Setting() {
  const { form, isDirty, error, setForm, handleSave } = useSetting();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
        if (!isDirty) {
          router.back();
          return true;
        }

        Alert.alert(TEXT.SETTING_EXIT_TITLE, TEXT.SETTING_EXIT_MESSAGE, [
          {
            text: TEXT.SETTING_EXIT_CANCEL,
            style: "cancel",
          },
          {
            text: TEXT.SETTING_EXIT_CONFIRM,
            onPress: () => router.back(),
            style: "destructive",
          },
        ]);

        return true;
      });

      return () => subscription.remove();
    }, [router, isDirty]),
  );

  const handleSubmit = async () => {
    await handleSave();

    Alert.alert(TEXT.SETTING_ALERT_TITLE, TEXT.SETTING_SAVE_SUCCESS, [
      {
        text: TEXT.SETTING_SUCCESS_CONFIRM,
        onPress: () => {
          router.back();
        },
        style: "default",
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.left}>
        <ThemedText style={{ fontSize: 24, color: "#fff", marginBottom: 20 }}>
          {TEXT.SETTING_TITLE}
        </ThemedText>
        <ThemedText style={{ color: "#aaa" }}>{TEXT.SETTING_DESCRIPTION}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.sidebar}>
        <ScrollView style={styles.scrollContainer}>
          <ThemedView>
            <Input
              label={TEXT.SETTING_HOST_PORT}
              value={form.discoveryPort}
              onChange={(text) => setForm({ ...form, discoveryPort: text })}
              error={error.discoveryPort}
              keyboardType="number-pad"
            />
            <Input
              label={TEXT.SETTING_HOST_DISCOVERY_TIMEOUT}
              value={form.discoveryTimeout}
              onChange={(text) => setForm({ ...form, discoveryTimeout: text })}
              error={error.discoveryTimeout}
              keyboardType="number-pad"
            />
            <Input
              label={TEXT.SETTING_SLIDE_TRANSITION_SPEED}
              value={form.slideTransitionSpeed}
              onChange={(text) => setForm({ ...form, slideTransitionSpeed: text })}
              error={error.slideTransitionSpeed}
              keyboardType="number-pad"
            />
          </ThemedView>
          <ThemedView style={styles.buttonContainer}>
            <ThemedButton onPress={handleSubmit}>
              <ThemedText>{TEXT.SETTING_SAVE}</ThemedText>
            </ThemedButton>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#000",
  },
  left: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sidebar: {
    width: 320,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    width: "100%",
    padding: 40,
  },
  buttonContainer: {
    alignItems: "flex-end",
  },
});
