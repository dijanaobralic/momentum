import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useType } from "../fonts";
import { colors } from "../theme";

export function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const type = useType();
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { fontFamily: type.bodySemibold }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        style={[styles.input, multiline && styles.inputMulti, { fontFamily: type.body }]}
      />
    </View>
  );
}

export function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const type = useType();
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { fontFamily: type.bodySemibold }]}>{label}</Text>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(option.value)}
              style={[styles.chip, selected && styles.chipOn]}
            >
              <Text style={[styles.chipText, { fontFamily: type.bodyMedium, color: selected ? "#FFFFFF" : colors.ink }]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function SaveBar({ label, disabled, onPress }: { label: string; disabled?: boolean; onPress: () => void }) {
  const type = useType();
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.save, disabled && styles.saveOff]}>
      <Text style={[styles.saveText, { fontFamily: type.bodySemibold }]}>{label}</Text>
    </Pressable>
  );
}

export function FormBlock({ children }: { children: ReactNode }) {
  return <View style={styles.block}>{children}</View>;
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  label: { fontSize: 13, color: colors.muted },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
  },
  inputMulti: { minHeight: 96, textAlignVertical: "top" },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { fontSize: 15 },
  save: {
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  saveOff: { opacity: 0.4 },
  saveText: { color: "#FFFFFF", fontSize: 16 },
  block: { gap: 18, maxWidth: 560 },
});
