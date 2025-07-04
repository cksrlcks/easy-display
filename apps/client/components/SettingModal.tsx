import { TEXT } from "@/constants/Text";
import * as Application from "expo-application";
import { useRouter } from "expo-router";
import { BackHandler, Modal, ModalProps, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type SettingModalProps = ModalProps & {
  onClose: () => void;
};

export default function SettingModal({ onClose, ...rest }: SettingModalProps) {
  const router = useRouter();

  const handleGoSettingPage = () => {
    onClose();
    router.push("/setting");
  };

  return (
    <Modal transparent={true} animationType="fade" {...rest}>
      <ThemedView style={styles.backdrop}>
        <ThemedView style={styles.container}>
          <Pressable
            style={({ focused }) => [styles.button, focused && styles.buttonFocused]}
            hasTVPreferredFocus={true}
            onPress={handleGoSettingPage}
          >
            <ThemedText style={styles.label}>{TEXT.SETTING_BUTTON_LABEL}</ThemedText>
          </Pressable>
          <Pressable
            style={({ focused }) => [styles.button, focused && styles.buttonFocused]}
            onPress={() => BackHandler.exitApp()}
          >
            <ThemedText style={styles.label}>{TEXT.QUIT_BUTTON_LABEL}</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>

      <ThemedText style={styles.copyright}>
        {TEXT.APP_NAME} {Application.nativeApplicationVersion}
      </ThemedText>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    width: 300,
    backgroundColor: "#111",
  },
  label: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: 20,
    alignItems: "flex-start",
  },
  buttonFocused: {
    backgroundColor: "#000",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
    paddingLeft: 24,
  },
  copyright: {
    position: "absolute",
    bottom: 0,
    left: 0,
    padding: 20,
    fontSize: 8,
    opacity: 0.5,
  },
});
