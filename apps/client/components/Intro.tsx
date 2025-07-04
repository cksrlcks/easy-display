import { TEXT } from "@/constants/Text";
import { Image, StyleSheet, View } from "react-native";

import { ThemedText } from "./ThemedText";

export default function Intro() {
  return (
    <>
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <View>
        <ThemedText style={styles.introText}>{TEXT.INTRO}</ThemedText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 25,
    width: 270,
  },
  introText: {
    marginTop: 20,
    opacity: 0.4,
    fontSize: 15,
  },
});
