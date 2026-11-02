import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProgressControl } from "../components/ProgressControl";
import { useType, type TypeStyle } from "../fonts";
import { AREAS, areasMoved, COMFORTABLE_LOAD, fraction, mondayOf, weekLabel } from "../lib";
import { seed } from "../seed";
import { areaColors, colors } from "../theme";
import type { Action, AppState, Goal, Progress } from "../types";
import { useWide } from "../useWide";

// The home screen. In Expo Router, src/app/index.tsx is the route "/".
// Progress lives in component state for this step. Storage comes next, behind a data layer.
export default function WeekScreen() {
  const [state, setState] = useState<AppState>(() => seed());
  const type = useType();
  const wide = useWide();
  const styles = useMemo(() => makeStyles(type, wide), [type, wide]);

  const week = mondayOf();
  const actions = state.actions.filter((action) => action.weekOf === week);
  const moved = areasMoved(actions);
  const open = actions.filter((action) => fraction(action.progress) < 1);
  const goalById = new Map(state.goals.map((goal) => [goal.id, goal]));
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  function setProgress(id: string, progress: Progress) {
    setState((prev) => ({
      ...prev,
      actions: prev.actions.map((action) => (action.id === id ? { ...action, progress } : action)),
    }));
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.brand}>
          momentum<Text style={styles.brandDot}>.</Text>
        </Text>

        <View style={styles.pageHead}>
          <Text style={styles.eyebrow}>
            Week of {weekLabel(week)} · {today}
          </Text>
          <Text style={styles.title} accessibilityRole="header">
            {moved.size > 0 ? "Hi Dijana, you're moving." : "Hi Dijana. One small step?"}
          </Text>
        </View>

        <View style={styles.card} accessibilityLabel="Momentum this week">
          <Text style={styles.big}>
            {moved.size} of {AREAS.length} areas moved
          </Text>
          <Text style={styles.muted}>Movement counts, not completion.</Text>
          <View style={styles.dots}>
            {AREAS.map((area) => {
              const didMove = moved.has(area.id);
              const palette = areaColors[area.id];
              return (
                <View key={area.id} style={styles.dotWrap} accessibilityLabel={`${area.label}, ${didMove ? "moved" : "quiet"}`}>
                  <View
                    style={[
                      styles.dot,
                      didMove
                        ? { backgroundColor: palette.fill }
                        : { backgroundColor: "transparent", borderWidth: 3, borderColor: palette.fill },
                    ]}
                  />
                  <Text style={styles.dotLabel}>{area.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {actions.length > COMFORTABLE_LOAD && (
          <View style={styles.coach} accessibilityLabel="Coach">
            <Text style={styles.coachLabel}>Coach</Text>
            <Text style={styles.coachBody}>
              This week has {actions.length} actions. Your comfortable range is around {COMFORTABLE_LOAD}. {open.length} are
              still open. Want to pick one to move to next week?
            </Text>
          </View>
        )}

        <View style={styles.grid}>
          {AREAS.map((area) => {
            const items = actions.filter((action) => action.area === area.id);
            if (items.length === 0) return null;
            const goalIds = [...new Set(items.map((item) => item.goalId).filter((id): id is string => !!id))];
            const longGoals = goalIds
              .map((id) => goalById.get(id))
              .filter((goal): goal is Goal => !!goal && goal.horizon === "long");
            return (
              <View key={area.id} style={styles.areaCard}>
                <View style={styles.areaHead}>
                  <Text style={[styles.areaName, { fontFamily: type.bodySemibold, color: areaColors[area.id].text }]}>
                    {area.label}
                  </Text>
                  <View style={styles.chips}>
                    {longGoals.map((goal) => (
                      <View key={goal.id} style={styles.chip}>
                        <Text style={[styles.chipText, { color: areaColors[area.id].text, fontFamily: type.bodyMedium }]}>
                          {goal.title}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                {items.map((action) => (
                  <ProgressControl
                    key={action.id}
                    title={actionTitle(action)}
                    area={action.area}
                    progress={action.progress}
                    onChange={(progress) => setProgress(action.id, progress)}
                  />
                ))}
                {longGoals
                  .filter((goal) => goal.why)
                  .map((goal) => (
                    <View key={goal.id} style={styles.why}>
                      <Text style={styles.whyText}>
                        <Text style={styles.whyLabel}>Why: </Text>
                        {goal.why}
                      </Text>
                    </View>
                  ))}
              </View>
            );
          })}
        </View>

        <Pressable accessibilityRole="button" onPress={() => setState(seed())} style={styles.reset}>
          <Text style={styles.resetText}>Reset sample data</Text>
        </Pressable>
        <Text style={styles.mantra}>“Depression can’t hit a moving target.”</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function actionTitle(action: Action): string {
  return action.note ? `${action.title} · ${action.note}` : action.title;
}

function makeStyles(type: TypeStyle, wide: boolean) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.ground },
    scroll: { flex: 1 },
    content: {
      paddingHorizontal: wide ? 48 : 16,
      paddingTop: wide ? 28 : 12,
      paddingBottom: 40,
      gap: wide ? 20 : 14,
      maxWidth: 1100,
      width: "100%",
      alignSelf: "center",
    },
    brand: { fontFamily: type.headingBold, fontSize: 22, color: colors.ink, letterSpacing: -0.4 },
    brandDot: { color: colors.accent },
    pageHead: { gap: 6 },
    eyebrow: { fontFamily: type.body, fontSize: 14, color: colors.muted },
    title: { fontFamily: type.heading, fontSize: wide ? 38 : 32, color: colors.ink, letterSpacing: -0.6 },
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: wide ? 16 : 18,
      paddingHorizontal: 20,
      paddingVertical: 18,
      gap: 8,
    },
    big: { fontFamily: type.heading, fontSize: 28, color: colors.ink, letterSpacing: -0.4 },
    muted: { fontFamily: type.body, fontSize: 14, lineHeight: 21, color: colors.muted },
    dots: { flexDirection: "row", gap: 14, marginTop: 8 },
    dotWrap: { alignItems: "center", gap: 6 },
    dot: { width: 40, height: 40, borderRadius: 20 },
    dotLabel: { fontFamily: type.body, fontSize: 12, color: colors.ink2 },
    coach: {
      backgroundColor: colors.ink,
      borderRadius: wide ? 16 : 18,
      paddingHorizontal: 20,
      paddingVertical: 18,
      gap: 6,
    },
    coachLabel: { fontFamily: type.bodySemibold, fontSize: 13, color: colors.coachLabel },
    coachBody: { fontFamily: type.body, fontSize: 15, lineHeight: 23, color: colors.onCoach },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
    areaCard: {
      flexGrow: 1,
      flexBasis: wide ? 360 : "100%",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: wide ? 16 : 18,
      paddingHorizontal: 20,
      paddingVertical: 18,
      gap: 16,
    },
    areaHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" },
    areaName: { fontSize: 12, letterSpacing: 1, textTransform: "uppercase" },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    chip: {
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    chipText: { fontSize: 12 },
    why: { backgroundColor: colors.ground, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
    whyText: { fontFamily: type.body, fontSize: 13, lineHeight: 19, color: colors.ink },
    whyLabel: { color: colors.muted },
    reset: { alignSelf: "flex-start", paddingVertical: 8 },
    resetText: { fontFamily: type.body, fontSize: 13, color: colors.muted, textDecorationLine: "underline" },
    mantra: { fontFamily: type.bodyItalic, fontSize: 13, lineHeight: 20, color: colors.muted },
  });
}
