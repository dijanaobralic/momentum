import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useType } from "../fonts";
import { colors } from "../theme";
import { useWide } from "../useWide";

const TABS = [
  { name: "index", label: "Week", ios: "calendar", android: "calendar_today" },
  { name: "goals", label: "Goals", ios: "target", android: "target" },
  { name: "library", label: "Library", ios: "books.vertical", android: "menu_book" },
  { name: "wins", label: "Wins", ios: "star", android: "star" },
] as const;

interface Props {
  state: { index: number; routes: { key: string; name: string }[] };
  navigateToTab: (routeKey: string) => void;
}

const SIDEBAR_OPEN = 232;
const SIDEBAR_CLOSED = 76;

/** Phone: a bottom bar. Wide window: a sidebar that can fold down to icons. */
export function AppTabBar({ state, navigateToTab }: Props) {
  const wide = useWide();
  const insets = useSafeAreaInsets();
  const type = useType();
  const current = state.routes[state.index]?.name;
  const [collapsed, setCollapsed] = useState(false);
  const folded = wide && collapsed;

  return (
    <View
      style={[
        wide ? styles.side : styles.bottom,
        wide
          ? { width: folded ? SIDEBAR_CLOSED : SIDEBAR_OPEN, paddingTop: Math.max(insets.top, 24), paddingHorizontal: folded ? 10 : 16 }
          : { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
    >
      {wide ? (
        <View style={[styles.brandRow, folded && styles.brandRowFolded]}>
          {folded ? null : (
            <Text style={[styles.brand, { fontFamily: type.headingBold }]}>
              momentum<Text style={styles.brandDot}>.</Text>
            </Text>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={folded ? "Show sidebar" : "Hide sidebar"}
            onPress={() => setCollapsed((value) => !value)}
            style={styles.toggle}
          >
            <Text style={[styles.toggleMark, { fontFamily: type.heading }]}>{folded ? "›" : "‹"}</Text>
          </Pressable>
        </View>
      ) : null}
      <View style={wide ? styles.sideList : styles.bottomList}>
        {state.routes.map((route) => {
          const tab = TABS.find((item) => item.name === route.name);
          if (!tab) return null;
          const active = current === route.name;
          const tint = active ? (wide ? "#FFFFFF" : colors.ink) : wide ? colors.ink2 : colors.muted;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.label}
              onPress={() => navigateToTab(route.key)}
              style={[styles.item, wide ? styles.sideItem : styles.bottomItem, folded && styles.sideItemFolded, wide && active && styles.sideItemOn]}
            >
              <SymbolView
                name={{ ios: tab.ios, android: tab.android, web: tab.android }}
                tintColor={tint}
                size={22}
                fallback={<View style={[styles.iconFallback, { borderColor: tint }]} />}
              />
              {folded ? null : (
                <Text style={[styles.label, wide ? styles.sideLabel : styles.bottomLabel, { fontFamily: active ? type.bodySemibold : type.body, color: tint }]}>
                  {tab.label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
      {wide && !folded ? (
        <Text style={[styles.mantra, { fontFamily: type.bodyItalic }]}>“Depression can’t hit a moving target.”</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  side: {
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: "stretch",
    backgroundColor: colors.panel,
    borderRightWidth: 1,
    borderRightColor: colors.line,
    paddingBottom: 16,
  },
  bottom: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 6,
    paddingHorizontal: 8,
  },
  brandRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 4, marginBottom: 16 },
  brandRowFolded: { justifyContent: "center", paddingHorizontal: 0 },
  brand: { fontSize: 22, color: colors.ink, letterSpacing: -0.4, flexShrink: 1 },
  toggle: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  toggleMark: { fontSize: 26, color: colors.ink, lineHeight: 28 },
  brandDot: { color: colors.accent },
  sideList: { gap: 6 },
  bottomList: { flexDirection: "row" },
  item: { alignItems: "center" },
  sideItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    minHeight: 44,
  },
  sideItemFolded: { justifyContent: "center", paddingHorizontal: 0, gap: 0 },
  sideItemOn: { backgroundColor: colors.ink },
  bottomItem: { flex: 1, flexDirection: "column", gap: 3, minHeight: 48, justifyContent: "center" },
  label: { fontSize: 15 },
  sideLabel: { fontSize: 15 },
  bottomLabel: { fontSize: 11 },
  iconFallback: { width: 18, height: 18, borderWidth: 1.5, borderRadius: 4 },
  mantra: { marginTop: "auto", paddingHorizontal: 12, paddingTop: 24, fontSize: 13, lineHeight: 20, color: colors.muted },
});
