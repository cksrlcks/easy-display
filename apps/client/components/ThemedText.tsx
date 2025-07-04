import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "title" | "subTitle" | "body" | "small";
};

export function ThemedText({ style, type = "body", ...rest }: ThemedTextProps) {
  return <Text style={[styles.base, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: {
    color: "#fff",
  },
  title: {
    fontFamily: "PretendardSemiBold",
    fontSize: 24,
  },
  subTitle: {
    fontFamily: "PretendardSemiBold",
    fontSize: 20,
  },
  body: {
    fontFamily: "PretendardRegular",
    fontSize: 16,
  },
  small: {
    fontFamily: "PretendardRegular",
    fontSize: 12,
  },
});
