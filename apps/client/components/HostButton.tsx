import HostIcon from "@/assets/images/icon-host.svg";
import { Host } from "@repo/types";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "./ThemedText";

type HostButtonProps = {
  host: Host;
  onPress: (hostIpWithPort: string) => void;
};

export default function HostButton({ host, onPress }: HostButtonProps) {
  return (
    <Pressable
      style={({ focused }) => [styles.button, focused && styles.focused]}
      onPress={() => onPress(`${host.ip}:${host.port}`)}
    >
      <HostIcon width={200} height={38} style={{ marginBottom: 20, marginTop: 10 }} />
      <ThemedText
        style={{
          width: "100%",
          textAlign: "center",
          backgroundColor: "#111",
          borderRadius: 9999,
          padding: 4,
          fontWeight: "bold",
          fontSize: 14,
        }}
      >
        {host.ip}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    borderColor: "#222",
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    marginTop: 5,
    textAlign: "center",
    lineHeight: 14,
  },
  focused: {
    borderColor: "#fff",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.2)",
  },
});
