import { useAppConfigStore } from "@/stores/useAppConfigStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

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

export default function useSetting() {
  const { discoveryPort, discoveryTimeout, slideTransitionSpeed } = useAppConfigStore();
  const setAppConfig = useAppConfigStore((state) => state.setConfig);

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

  const isDirty =
    form.discoveryPort !== discoveryPort.toString() ||
    form.discoveryTimeout !== (discoveryTimeout / 1000).toString() ||
    form.slideTransitionSpeed !== slideTransitionSpeed.toString();

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

    return Promise.all([
      AsyncStorage.setItem("discovery-port", form.discoveryPort),
      AsyncStorage.setItem("discovery-timeout", form.discoveryTimeout),
      AsyncStorage.setItem("slide-transition-speed", form.slideTransitionSpeed),
    ]);
  };

  return {
    form,
    setForm,
    isDirty,
    error,
    setError,
    handleSave,
  };
}
