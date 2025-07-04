import { StyleSheet, TextInput } from "react-native";

import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type InputProps = {
  label: string;
  value: string;
  onChange: (text: string) => void;
  error?: string;
};

export default function Input({ label, value, onChange, error }: InputProps) {
  return (
    <ThemedView style={styles.inputContainer}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput style={styles.input} value={value} onChangeText={onChange} />
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
  },
  input: {
    backgroundColor: "#222",
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "#fff",
  },
  error: {
    color: "red",
    fontSize: 12,
    opacity: 0.4,
  },
});
