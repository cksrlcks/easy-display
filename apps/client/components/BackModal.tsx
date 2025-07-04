import { TEXT } from "@/constants/Text";
import * as Application from "expo-application";
import { Modal, ModalProps, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type LeftModalProps = ModalProps & {
  menus: {
    label: string;
    onPress?: () => void;
  }[];
  onClose: () => void;
};

export default function BackModal({ menus, onClose, ...rest }: LeftModalProps) {
  return (
    <Modal transparent={true} animationType="fade" onRequestClose={onClose} {...rest}>
      <ThemedView style={styles.backdrop}>
        <ThemedView style={styles.container}>
          {menus.map((menu, index) => (
            <Pressable
              key={menu.label}
              style={({ focused }) => [styles.button, focused && styles.buttonFocused]}
              onPress={() => {
                onClose();
                menu.onPress?.();
              }}
              hasTVPreferredFocus={index === 0}
            >
              <ThemedText style={styles.label}>{menu.label}</ThemedText>
            </Pressable>
          ))}
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
