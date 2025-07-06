import { useState } from "react";
import { KeyboardTypeOptions, StyleSheet, TextInput } from "react-native";

import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type InputProps = {
  label: string;
  value: string;
  onChange: (text: string) => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
};

export default function Input({
  label,
  value,
  onChange,
  error,
  keyboardType = "default",
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <ThemedView style={styles.inputContainer}>
      <ThemedText style={[styles.label, isFocused && styles.labelFocused]}>{label}</ThemedText>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 30,
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontFamily: "PretendardMedium",
    opacity: 0.5,
  },
  labelFocused: {
    opacity: 1,
  },
  input: {
    backgroundColor: "#222",
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: "#222",
    borderWidth: 2,
    color: "#fff",
  },
  inputFocused: {
    borderColor: "#555",
  },
  error: {
    color: "red",
    fontSize: 12,
    opacity: 0.4,
  },
});
