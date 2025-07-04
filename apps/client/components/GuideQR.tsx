import { TEXT } from "@/constants/Text";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

import { ThemedText } from "./ThemedText";

type GuideQRProps = PressableProps & {
  value: string;
};

export default function GuideQR({ value, ...rest }: GuideQRProps) {
  return (
    <Pressable style={({ focused }) => [styles.button, focused && styles.focused]} {...rest}>
      <QRCode value={value} size={70} />

      <ThemedText style={styles.label}>{TEXT.VIEW_GUIDE}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 20,
    left: 20,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#000",
  },
  label: {
    fontSize: 10,
    marginTop: 5,
    textAlign: "center",
    lineHeight: 14,
  },
  focused: {
    borderColor: "#222",
    boxShadow: "0 0 30px rgba(255, 255, 255, 0.2)",
  },
});
