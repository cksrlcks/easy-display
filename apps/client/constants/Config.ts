import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

export const GUIDE_URL = "https://easy-display.kr/guide";
export const DISCOVERY_PORT = 41234;
export const isDev = __DEV__ || process.env.NODE_ENV === "development";
export const targetAddress = isDev ? "192.168.0.46" : "255.255.255.255";
export const RESPONSE_MESSAGE_NAME = "easy-display";
export const RESPONSE_MESSAGE_TYPE = "host-response";
export const SEND_MESSAGE_NAME = "easy-display";
export const SEND_MESSAGE_TYPE = "discovery-ping";
export const DISCOVERY_TIMEOUT = 5000;
export const DISCOVERY_INTERVAL = 3000;
export const SLIDE_TRANSITION_SPEED = 500;
export const SLIDE_LOADING_TIMEOUT = 5000;

export async function loadAppConfig() {
  const [_deviceId, discoveryPort, discoveryTimeout, slideTransitionSpeed] = await Promise.all([
    AsyncStorage.getItem("easy-display-device-id"),
    AsyncStorage.getItem("discovery-port"),
    AsyncStorage.getItem("discovery-timeout"),
    AsyncStorage.getItem("slide-transition-speed"),
  ]);

  const deviceId = _deviceId || (await setInitialDeviceId());

  return {
    deviceId: deviceId,
    discoveryPort: discoveryPort ? parseInt(discoveryPort, 10) : DISCOVERY_PORT,
    discoveryTimeout: discoveryTimeout ? parseInt(discoveryTimeout, 10) : DISCOVERY_TIMEOUT,
    slideTransitionSpeed: slideTransitionSpeed
      ? parseInt(slideTransitionSpeed, 10)
      : SLIDE_TRANSITION_SPEED,
  };
}

async function setInitialDeviceId() {
  const newDeviceId = Crypto.randomUUID();
  await AsyncStorage.setItem("easy-display-device-id", newDeviceId);

  return newDeviceId;
}
