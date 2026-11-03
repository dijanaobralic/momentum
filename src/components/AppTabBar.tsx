import { SymbolView } from "expo-symbols";
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

/** Phone: a bottom bar. Wide window: a sidebar, which is where the name and the mantra live. */
export function AppTabBar({ state, navigateToTab }: Props) {
  const wide = useWide();
  const insets = useSafeAreaInsets();
  const type = useType();
  const current = state.routes[state.index]?.name;

  return (
    <View
      style={[
        wide ? styles.side : styles.bottom,
        wide ? { paddingTop: Math.max(insets.top, 24) } : { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
    >
      {wide ? (
        <Text style={[styles.brand, { fontFamily: type.headingBold }]}>
          momentum<Text style={styles.brandDot}>.</Text>
        </Text>
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
              style={[styles.item, wide ? styles.sideItem : styles.bottomItem, wide && active && styles.sideItemOn]}
            >
              <SymbolView
                name={{ ios: tab.ios, android: tab.android, web: tab.android }}
                tintColor={tint}
                size={22}
                fallback={<View style={[styles.iconFallback, { borderColor: tint }]} />}
              />
              <Text style={[styles.label, wide ? styles.sideLabel : styles.bottomLabel, { fontFamily: active ? type.bodySemibold : type.body, color: tint }]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {wide ? <Text style={[styles.mantra, { fontFamily: type.bodyItalic }]}>“Depression can’t hit a moving target.”</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  side: {
    width: 240,
    flex: 1,
    backgroundColor: colors.panel,
    borderRightWidth: 1,
    borderRightColor: colors.line,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  bottom: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 6,
    paddingHorizontal: 8,
  },
  brand: { fontSize: 22, color: colors.ink, letterSpacing: -0.4, paddingHorizontal: 12, paddingBottom: 24 },
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
  sideItemOn: { backgroundColor: colors.ink },
  bottomItem: { flex: 1, flexDirection: "column", gap: 3, minHeight: 48, justifyContent: "center" },
  label: { fontSize: 15 },
  sideLabel: { fontSize: 15 },
  bottomLabel: { fontSize: 11 },
  iconFallback: { width: 18, height: 18, borderWidth: 1.5, borderRadius: 4 },
  mantra: { marginTop: "auto", paddingHorizontal: 12, paddingTop: 24, fontSize: 13, lineHeight: 20, color: colors.muted },
});
