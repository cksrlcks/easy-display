import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { BackHandler } from "react-native";

export default function useBackModal() {
  const [visible, setVisible] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
        setVisible((prev) => !prev);

        return true;
      });

      return () => subscription.remove();
    }, []),
  );

  const onClose = () => {
    setVisible(false);
  };

  return {
    visible,
    onClose,
  };
}
