import Input from "@/components/Input";
import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { TEXT } from "@/constants/Text";
import { useAppConfigStore } from "@/stores/useAppConfigStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, TextInput } from "react-native";

type AppSettingForm = {
  discoveryPort: string;
  discoveryTimeout: string;
  slideTransitionSpeed: string;
};

const validateForm = (form: AppSettingForm) => {
  const errors: Partial<AppSettingForm> = {};

  const port = parseInt(form.discoveryPort, 10);
  if (isNaN(port) || port < 1024 || port > 65535) {
    errors.discoveryPort = "유효한 포트 번호를 입력하세요 (1024~65535)";
  }

  const timeout = parseInt(form.discoveryTimeout, 10);
  if (isNaN(timeout) || timeout < 1 || timeout > 60) {
    errors.discoveryTimeout = "유효한 시간(초)을 입력하세요 (1~60초)";
  }

  const speed = parseInt(form.slideTransitionSpeed, 10);
  if (isNaN(speed) || speed < 100 || speed > 2000) {
    errors.slideTransitionSpeed = "유효한 속도(밀리초)를 입력하세요 (100~2000ms)";
  }

  return errors;
};

export default function Setting() {
  const { discoveryPort, discoveryTimeout, slideTransitionSpeed } = useAppConfigStore();
  const setAppConfig = useAppConfigStore((state) => state.setConfig);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<Partial<AppSettingForm>>({
    discoveryPort: "",
    discoveryTimeout: "",
    slideTransitionSpeed: "",
  });
  const [form, setForm] = useState<AppSettingForm>({
    discoveryPort: discoveryPort.toString(),
    discoveryTimeout: (discoveryTimeout / 1000).toString(),
    slideTransitionSpeed: slideTransitionSpeed.toString(),
  });
  const router = useRouter();

  const handleSave = () => {
    const errors = validateForm(form);
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    setAppConfig({
      discoveryPort: parseInt(form.discoveryPort, 10),
      discoveryTimeout: parseInt(form.discoveryTimeout, 10) * 1000,
      slideTransitionSpeed: parseInt(form.slideTransitionSpeed, 10),
    });

    AsyncStorage.setItem("discovery-port", form.discoveryPort);
    AsyncStorage.setItem("discovery-timeout", form.discoveryTimeout);
    AsyncStorage.setItem("slide-transition-speed", form.slideTransitionSpeed);

    Alert.alert(TEXT.SETTING_ALERT_TITLE, TEXT.SETTING_SAVE_SUCCESS);
    router.back();
  };

  const handleBack = () => {
    setVisible(false);
    router.back();
  };

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 500);
  }, []);

  return (
    <Modal visible={visible} onRequestClose={handleBack} transparent={true} animationType="fade">
      <ScrollView style={styles.container}>
        <ThemedView style={styles.inner}>
          <ThemedView>
            <Input
              label={TEXT.SETTING_HOST_PORT}
              value={form.discoveryPort}
              onChange={(text) => setForm({ ...form, discoveryPort: text })}
              error={error.discoveryPort}
            />
            <Input
              label={TEXT.SETTING_HOST_DISCOVERY_TIMEOUT}
              value={form.discoveryTimeout}
              onChange={(text) => setForm({ ...form, discoveryTimeout: text })}
              error={error.discoveryTimeout}
            />
            <Input
              label={TEXT.SETTING_SLIDE_TRANSITION_SPEED}
              value={form.slideTransitionSpeed}
              onChange={(text) => setForm({ ...form, slideTransitionSpeed: text })}
              error={error.slideTransitionSpeed}
            />
          </ThemedView>
          <ThemedView style={styles.buttonContainer}>
            <ThemedButton onPress={handleSave}>
              <ThemedText>{TEXT.SETTING_SAVE}</ThemedText>
            </ThemedButton>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 80,
  },
  inner: {
    maxWidth: 400,
    width: "100%",
    margin: "auto",
    paddingBottom: 100,
  },
  buttonContainer: {
    alignItems: "flex-end",
  },
});
