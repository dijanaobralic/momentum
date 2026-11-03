import { Pressable, StyleSheet, Text, View } from "react-native";

import { ProgressControl } from "../../components/ProgressControl";
import { CheckInPill } from "../../components/CheckInButton";
import { Page, PageHeader } from "../../components/Page";
import { useType } from "../../fonts";
import { AREAS, areasMoved, COMFORTABLE_LOAD, fraction, mondayOf, weekLabel } from "../../lib";
import { useAppState } from "../../state";
import { areaColors, colors } from "../../theme";
import type { Action, Goal } from "../../types";
import { useWide } from "../../useWide";

export default function WeekScreen() {
  const { state, setProgress, reset } = useAppState();
  const type = useType();
  const wide = useWide();

  const week = mondayOf();
  const actions = state.actions.filter((action) => action.weekOf === week);
  const moved = areasMoved(actions);
  const open = actions.filter((action) => fraction(action.progress) < 1);
  const goalById = new Map(state.goals.map((goal) => [goal.id, goal]));
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <Page>
      <PageHeader
        eyebrow={`Week of ${weekLabel(week)} · ${today}`}
        title={moved.size > 0 ? "Hi Dijana, you're moving." : "Hi Dijana. One small step?"}
        action={wide ? <CheckInPill /> : undefined}
      />

      <View style={styles.card} accessibilityLabel="Momentum this week">
        <Text style={[styles.big, { fontFamily: type.heading }]}>
          {moved.size} of {AREAS.length} areas moved
        </Text>
        <Text style={[styles.muted, { fontFamily: type.body }]}>Movement counts, not completion.</Text>
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
                <Text style={[styles.dotLabel, { fontFamily: type.body }]}>{area.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {actions.length > COMFORTABLE_LOAD ? (
        <View style={styles.coach} accessibilityLabel="Coach">
          <Text style={[styles.coachLabel, { fontFamily: type.bodySemibold }]}>Coach</Text>
          <Text style={[styles.coachBody, { fontFamily: type.body }]}>
            This week has {actions.length} actions. Your comfortable range is around {COMFORTABLE_LOAD}. {open.length} are still
            open. Want to pick one to move to next week?
          </Text>
        </View>
      ) : null}

      <View style={styles.grid}>
        {AREAS.map((area) => {
          const items = actions.filter((action) => action.area === area.id);
          if (items.length === 0) return null;
          const goalIds = [...new Set(items.map((item) => item.goalId).filter((id): id is string => !!id))];
          const longGoals = goalIds
            .map((id) => goalById.get(id))
            .filter((goal): goal is Goal => !!goal && goal.horizon === "long");
          return (
            <View key={area.id} style={[styles.areaCard, wide ? styles.radiusWide : styles.radiusPhone, wide && styles.areaWide]}>
              <View style={styles.areaHead}>
                <Text style={[styles.areaName, { fontFamily: type.bodySemibold, color: areaColors[area.id].text }]}>{area.label}</Text>
                <View style={styles.chips}>
                  {longGoals.map((goal) => (
                    <View key={goal.id} style={styles.chip}>
                      <Text style={[styles.chipText, { color: areaColors[area.id].text, fontFamily: type.bodyMedium }]}>{goal.title}</Text>
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
                    <Text style={[styles.whyText, { fontFamily: type.body }]}>
                      <Text style={styles.whyLabel}>Why: </Text>
                      {goal.why}
                    </Text>
                  </View>
                ))}
            </View>
          );
        })}
      </View>

      <Pressable accessibilityRole="button" onPress={reset} style={styles.reset}>
        <Text style={[styles.resetText, { fontFamily: type.body }]}>Reset sample data</Text>
      </Pressable>
    </Page>
  );
}

function actionTitle(action: Action): string {
  return action.note ? `${action.title} · ${action.note}` : action.title;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 8,
  },
  big: { fontSize: 28, color: colors.ink, letterSpacing: -0.4 },
  muted: { fontSize: 14, lineHeight: 21, color: colors.muted },
  dots: { flexDirection: "row", gap: 14, marginTop: 8 },
  dotWrap: { alignItems: "center", gap: 6 },
  dot: { width: 40, height: 40, borderRadius: 20 },
  dotLabel: { fontSize: 12, color: colors.ink2 },
  coach: {
    backgroundColor: colors.ink,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 6,
  },
  coachLabel: { fontSize: 13, color: colors.coachLabel },
  coachBody: { fontSize: 15, lineHeight: 23, color: colors.onCoach },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  areaCard: {
    flexGrow: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 16,
  },
  areaWide: { flexBasis: 360 },
  radiusPhone: { borderRadius: 18, flexBasis: "100%" },
  radiusWide: { borderRadius: 16 },
  areaHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" },
  areaName: { fontSize: 12, letterSpacing: 1, textTransform: "uppercase" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontSize: 12 },
  why: { backgroundColor: colors.ground, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  whyText: { fontSize: 13, lineHeight: 19, color: colors.ink },
  whyLabel: { color: colors.muted },
  reset: { alignSelf: "flex-start", paddingVertical: 8 },
  resetText: { fontSize: 13, color: colors.muted, textDecorationLine: "underline" },
});
