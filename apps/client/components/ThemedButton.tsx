import { Pressable, PressableProps, StyleSheet } from "react-native";

type ThemedButtonProps = PressableProps & {
  type?: "primary" | "secondary";
  size?: "small" | "normal";
};

export default function ThemedButton({
  type = "primary",
  size = "normal",
  children,
  ...rest
}: ThemedButtonProps) {
  return (
    <Pressable
      style={({ focused, pressed }) => [
        styles.base,
        styles[type],
        styles[size],
        pressed && styles.pressed,
        focused && styles.focused,
        focused && type === "primary" && styles.focusedPrimary,
        focused && type === "secondary" && styles.focusedSecondary,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 9999,
    borderWidth: 2,
    borderStyle: "solid",
    transitionProperty: "transform",
    transitionDuration: "0.2s",
    transitionTimingFunction: "ease-in-out",
  },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  normal: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  primary: {
    backgroundColor: "#444",
    borderColor: "#444",
  },
  secondary: {
    backgroundColor: "#222",
    borderColor: "#222",
  },
  pressed: {
    opacity: 0.7,
  },
  focused: {
    borderColor: "#fff",
    boxShadow: "0 0 60px rgb(0, 0, 0)",
    transform: [{ scale: 1.05 }],
  },
  focusedPrimary: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    boxShadow: "0 0 20px rgba(0, 122, 255, 0.5)",
  },
  focusedSecondary: {
    backgroundColor: "#000",
    borderColor: "#111",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
  },
});
