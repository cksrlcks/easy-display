import HostIcon from "@/assets/images/icon-host.svg";
import { Host } from "@repo/types";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

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
      <ThemedView style={styles.label}>
        <ThemedText style={styles.name} numberOfLines={1}>
          {host.hostName}
        </ThemedText>
        <ThemedText style={styles.ip} numberOfLines={1}>
          {host.ip}
        </ThemedText>
      </ThemedView>
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
  focused: {
    borderColor: "#fff",
    boxShadow: "0 0 30px rgba(0, 0, 0, 0.2)",
  },
  label: {
    gap: 4,
    alignItems: "center",
    backgroundColor: "#111",
    width: "100%",
    padding: 10,
    borderRadius: 8,
  },
  name: {
    fontSize: 14,
    fontFamily: "PretendardMedium",
  },
  ip: {
    fontSize: 12,
    opacity: 0.5,
  },
});
