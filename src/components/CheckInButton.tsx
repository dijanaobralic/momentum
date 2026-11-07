import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { useType } from "../fonts";
import { colors } from "../theme";

export function openCheckIn(week: string) {
  router.push({ pathname: "/check-in", params: { week } });
}

/** The accent is reserved for the check-in. It sits in the page header so it never covers a card. */
export function CheckInPill({ week }: { week: string }) {
  const type = useType();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Sunday check-in" onPress={() => openCheckIn(week)} style={styles.pill}>
      <Text style={[styles.pillText, { fontFamily: type.bodySemibold }]}>Check in</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
