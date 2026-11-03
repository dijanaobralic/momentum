import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useType } from "../fonts";
import { colors } from "../theme";

export function openCheckIn() {
  router.push("/check-in");
}

/** The accent is reserved for the check-in. On the phone it floats; on a wide window it sits in the page header. */
export function CheckInFab() {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Sunday check-in"
      onPress={openCheckIn}
      style={[styles.fab, { bottom: insets.bottom + 74 }]}
    >
      <SymbolView
        name={{ ios: "checklist", android: "checklist", web: "checklist" }}
        tintColor="#FFFFFF"
        size={26}
        fallback={<Text style={styles.fabFallback}>✓</Text>}
      />
    </Pressable>
  );
}

export function CheckInPill() {
  const type = useType();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Sunday check-in" onPress={openCheckIn} style={styles.pill}>
      <Text style={[styles.pillText, { fontFamily: type.bodySemibold }]}>Check in</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.ink,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabFallback: { color: "#FFFFFF", fontSize: 22 },
  pill: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    minHeight: 44,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: { color: "#FFFFFF", fontSize: 15 },
});
