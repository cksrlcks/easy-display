import { TEXT } from "@/constants/Text";
import useHostDiscovery from "@/hooks/useHostDiscovery";
import { useHostIpStore } from "@/stores/useHostStore";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";

import HostButton from "./HostButton";
import ThemedButton from "./ThemedButton";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function Discovery() {
  const router = useRouter();
  const { cleanup, hostList, status, retry } = useHostDiscovery();
  const setHostIp = useHostIpStore((state) => state.setHostIp);

  const handleHostItemPress = (hostIp: string) => {
    setHostIp(hostIp);
    cleanup();

    router.push("/slide");
  };

  if (status === "pending" && hostList.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <ThemedText>{TEXT.DISCOVERY_SEARCHING}</ThemedText>
      </ThemedView>
    );
  }

  if (status === "error") {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>{TEXT.DISCOVERY_ERROR}</ThemedText>
        <ThemedButton onPress={retry}>
          <ThemedText>{TEXT.DISCOVERY_RETRY}</ThemedText>
        </ThemedButton>
      </ThemedView>
    );
  }

  if (status === "idle" && hostList.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>{TEXT.DISCOVERY_NO_HOSTS}</ThemedText>
        <ThemedButton onPress={retry}>
          <ThemedText>{TEXT.DISCOVERY_RETRY}</ThemedText>
        </ThemedButton>
      </ThemedView>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 30 }}
      data={hostList}
      renderItem={({ item }) => <HostButton host={item} onPress={handleHostItemPress} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
