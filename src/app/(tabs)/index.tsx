import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CheckInPill } from "../../components/CheckInButton";
import { Page, PageHeader } from "../../components/Page";
import { ProgressControl } from "../../components/ProgressControl";
import { useType } from "../../fonts";
import { AREAS, areasMoved, COMFORTABLE_LOAD, fraction, mondayOf, shiftWeek, weekLabel } from "../../lib";
import { useAppState } from "../../state";
import { areaColors, colors } from "../../theme";
import type { Action, Goal } from "../../types";
import { useWide } from "../../useWide";

export default function WeekScreen() {
  const { state, week, setWeek, setProgress, moveToWeek, reset } = useAppState();
  const type = useType();
  const wide = useWide();
  const current = mondayOf();

  const actions = state.actions.filter((action) => action.weekOf === week);
  const moved = areasMoved(actions);
  const open = actions.filter((action) => fraction(action.progress) < 1);
  const goalById = new Map(state.goals.map((goal) => [goal.id, goal]));
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const reflection = state.reflections.find((item) => item.weekOf === week);
  const crowded = actions.length >= COMFORTABLE_LOAD;

  return (
    <Page>
      <PageHeader
        eyebrow={week === current ? `This week · ${today}` : weekLabel(week)}
        title={moved.size > 0 ? "Hi Dijana, you\u2019re moving." : "Hi Dijana. One small step?"}
        action={<CheckInPill week={week} />}
      />
      <View style={styles.pager}>
        <Pressable accessibilityRole="button" accessibilityLabel="Previous week" onPress={() => setWeek(shiftWeek(week, -1))} style={styles.pagerBtn}>
          <Text style={[styles.pagerMark, { fontFamily: type.heading }]}>‹</Text>
        </Pressable>
        <Text style={[styles.pagerLabel, { fontFamily: type.body }]}>Week of {weekLabel(week)}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Next week" onPress={() => setWeek(shiftWeek(week, 1))} style={styles.pagerBtn}>
          <Text style={[styles.pagerMark, { fontFamily: type.heading }]}>›</Text>
        </Pressable>
      </View>
      {week !== current ? (
        <Pressable accessibilityRole="button" onPress={() => setWeek(current)} style={styles.backWeek}>
          <Text style={[styles.backWeekText, { fontFamily: type.body }]}>Back to this week</Text>
        </Pressable>
      ) : null}

      {reflection ? (
        <View style={styles.reflection}>
          <Text style={[styles.reflectionLabel, { fontFamily: type.bodySemibold }]}>Check-in</Text>
          <Text style={[styles.reflectionBody, { fontFamily: type.body }]}>You called this week {reflection.feel}.</Text>
          {reflection.worked ? <Text style={[styles.reflectionBody, { fontFamily: type.body }]}>Worked: {reflection.worked}</Text> : null}
          {reflection.didnt ? (
            <Text style={[styles.reflectionBody, { fontFamily: type.body }]}>{"Didn't: "}{reflection.didnt}</Text>
          ) : null}
        </View>
      ) : null}

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

      {crowded ? (
        <View style={styles.coach} accessibilityLabel="Coach">
          <Text style={[styles.coachLabel, { fontFamily: type.bodySemibold }]}>Coach</Text>
          <Text style={[styles.coachBody, { fontFamily: type.body }]}>
            {actions.length > COMFORTABLE_LOAD
              ? `This week has ${actions.length} actions. Your comfortable range is around ${COMFORTABLE_LOAD}. ${open.length} are still open.`
              : `This week has ${actions.length} actions, the top of your comfortable range. ${open.length} are still open.`}
          </Text>
          {open.map((action) => (
            <View key={action.id} style={styles.coachRow}>
              <Text style={[styles.coachItem, { fontFamily: type.body }]}>{action.title}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Move ${action.title} to next week`}
                onPress={() => moveToWeek(action.id, shiftWeek(week, 1))}
                style={styles.coachMove}
              >
                <Text style={[styles.coachMoveText, { fontFamily: type.bodySemibold }]}>Next week</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      {actions.length === 0 ? <Text style={[styles.muted, { fontFamily: type.body }]}>Nothing planned for this week.</Text> : null}

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
                    <Pressable key={goal.id} accessibilityRole="button" onPress={() => router.push(`/goal/${goal.id}`)} style={styles.chip}>
                      <Text style={[styles.chipText, { color: areaColors[area.id].text, fontFamily: type.bodyMedium }]}>{goal.title}</Text>
                    </Pressable>
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
                  onEdit={() => router.push(`/action/${action.id}`)}
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

      <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: "/action/[id]", params: { id: "new", week } })} style={styles.add}>
        <Text style={[styles.addText, { fontFamily: type.bodySemibold }]}>Add an action</Text>
      </Pressable>
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
  pager: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: -6 },
  pagerBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  pagerMark: { fontSize: 28, color: colors.ink },
  pagerLabel: { fontSize: 15, color: colors.ink },
  backWeek: { alignSelf: "flex-start", minHeight: 36, justifyContent: "center" },
  backWeekText: { fontSize: 14, color: colors.muted, textDecorationLine: "underline" },
  reflection: { backgroundColor: "#FBEDE8", borderRadius: 18, paddingHorizontal: 16, paddingVertical: 14, gap: 4 },
  reflectionLabel: { fontSize: 13, color: "#8A2F17" },
  reflectionBody: { fontSize: 15, lineHeight: 22, color: colors.ink },
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
  coach: { backgroundColor: colors.ink, borderRadius: 18, paddingHorizontal: 20, paddingVertical: 18, gap: 10 },
  coachLabel: { fontSize: 13, color: colors.coachLabel },
  coachBody: { fontSize: 15, lineHeight: 23, color: colors.onCoach },
  coachRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  coachItem: { flex: 1, fontSize: 15, color: colors.onCoach },
  coachMove: { minHeight: 36, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, borderColor: colors.coachLabel, justifyContent: "center" },
  coachMoveText: { fontSize: 13, color: colors.coachLabel },
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
  add: {
    minHeight: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 18,
  },
  addText: { fontSize: 15, color: colors.ink },
  reset: { alignSelf: "flex-start", paddingVertical: 8 },
  resetText: { fontSize: 13, color: colors.muted, textDecorationLine: "underline" },
});
