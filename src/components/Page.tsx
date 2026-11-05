import type { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useType } from "../fonts";
import { colors } from "../theme";
import { useWide } from "../useWide";

/** The scrolling page inside the shell. The shell owns the name, the tabs, and the mantra. */
export function Page({ children }: { children: ReactNode }) {
  const wide = useWide();
  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.scroll} contentContainerStyle={[styles.content, wide ? styles.wide : styles.phone]}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function PageHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  const type = useType();
  const wide = useWide();
  return (
    <View style={styles.headRow}>
      <View style={styles.headText}>
        {eyebrow ? <Text style={[styles.eyebrow, { fontFamily: type.body }]}>{eyebrow}</Text> : null}
        <Text style={[styles.title, wide && styles.titleWide, { fontFamily: type.heading }]} accessibilityRole="header">
          {title}
        </Text>
      </View>
      {action}
    </View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  const type = useType();
  return <Text style={[styles.section, { fontFamily: type.bodySemibold }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ground },
  scroll: { flex: 1 },
  content: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    gap: 14,
  },
  phone: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 96 },
  wide: { paddingHorizontal: 48, paddingTop: 28, paddingBottom: 64, gap: 20 },
  headRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16 },
  headText: { flex: 1, gap: 6 },
  eyebrow: { fontSize: 14, color: colors.muted },
  title: { fontSize: 32, color: colors.ink, letterSpacing: -0.6 },
  titleWide: { fontSize: 38 },
  section: {
    marginTop: 8,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.muted,
  },
});
