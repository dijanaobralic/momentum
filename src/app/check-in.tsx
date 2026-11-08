import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useType } from "../fonts";
import { colors } from "../theme";

const FEELINGS = ["Light", "Steady", "Full", "Too much"] as const;

/** The first step of the Sunday check-in. The choice stays on this screen; saving it comes with the full check-in. */
export default function CheckInScreen() {
  const type = useType();
  const [feel, setFeel] = useState<(typeof FEELINGS)[number] | null>(null);

  return (
    <SafeAreaView style={styles.screen}>
      <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.close}>
        <Text style={[styles.closeText, { fontFamily: type.body }]}>Close</Text>
      </Pressable>
      <Text style={[styles.eyebrow, { fontFamily: type.body }]}>Sunday</Text>
      <Text style={[styles.title, { fontFamily: type.heading }]} accessibilityRole="header">
        How did this week feel?
      </Text>
      <Text style={[styles.note, { fontFamily: type.body }]}>One tap is enough.</Text>
      <View style={styles.options}>
        {FEELINGS.map((option) => {
          const selected = feel === option;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setFeel(option)}
              style={[styles.option, selected && styles.optionOn]}
            >
              <Text style={[styles.optionText, { fontFamily: type.heading, color: selected ? "#FFFFFF" : colors.ink }]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ground, paddingHorizontal: 20, paddingBottom: 24 },
  close: { alignSelf: "flex-start", minHeight: 44, justifyContent: "center" },
  closeText: { fontSize: 15, color: colors.muted },
  eyebrow: { marginTop: 12, fontSize: 14, color: colors.muted },
  title: { marginTop: 6, fontSize: 32, letterSpacing: -0.6, color: colors.ink },
  note: { marginTop: 8, fontSize: 15, color: colors.muted },
  options: { marginTop: 24, gap: 10, maxWidth: 480 },
  option: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  optionOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  optionText: { fontSize: 20, letterSpacing: -0.3 },
});
