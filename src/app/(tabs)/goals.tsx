import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Page, PageHeader, SectionLabel } from "../../components/Page";
import { useType } from "../../fonts";
import { AREAS, fraction, isActiveGoal, mondayOf } from "../../lib";
import { useAppState } from "../../state";
import { areaColors, colors } from "../../theme";
import type { Action, Goal } from "../../types";

export default function GoalsScreen() {
  const { state, deleteGoal, setGoalArchived } = useAppState();
  const type = useType();
  const week = mondayOf();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const active = state.goals.filter(isActiveGoal);
  const archived = state.goals.filter((goal) => !isActiveGoal(goal));

  return (
    <Page>
      <PageHeader
        title="Goals"
        action={
          <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: "/goal/[id]", params: { id: "new" } })} style={styles.add}>
            <Text style={[styles.addText, { fontFamily: type.bodySemibold }]}>Add a goal</Text>
          </Pressable>
        }
      />
      <Text style={[styles.intro, { fontFamily: type.body }]}>Big goals carry a plan or tracker. Small ones live for one week.</Text>
      {active.length === 0 ? <Text style={[styles.empty, { fontFamily: type.body }]}>No active goals.</Text> : null}
      {(["long", "week"] as const).map((horizon) => {
        const goals = active.filter((goal) => goal.horizon === horizon);
        if (goals.length === 0) return null;
        return (
          <View key={horizon} style={styles.section}>
            <SectionLabel>{horizon === "long" ? "With a plan" : "This week only"}</SectionLabel>
            <View style={styles.grid}>
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  actions={state.actions.filter((action) => action.goalId === goal.id && action.weekOf === week)}
                  confirming={confirmId === goal.id}
                  onEdit={() => router.push({ pathname: "/goal/[id]", params: { id: goal.id } })}
                  onArchive={() => {
                    setConfirmId(null);
                    setGoalArchived(goal.id, true);
                  }}
                  onAskDelete={() => setConfirmId(goal.id)}
                  onDelete={() => {
                    setConfirmId(null);
                    deleteGoal(goal.id);
                  }}
                  onKeep={() => setConfirmId(null)}
                />
              ))}
            </View>
          </View>
        );
      })}
      {archived.length > 0 ? (
        <View style={styles.section}>
          <SectionLabel>Archived</SectionLabel>
          <View style={styles.grid}>
            {archived.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                actions={[]}
                confirming={confirmId === goal.id}
                onEdit={() => router.push({ pathname: "/goal/[id]", params: { id: goal.id } })}
                onArchive={() => {
                  setConfirmId(null);
                  setGoalArchived(goal.id, false);
                }}
                onAskDelete={() => setConfirmId(goal.id)}
                onDelete={() => {
                  setConfirmId(null);
                  deleteGoal(goal.id);
                }}
                onKeep={() => setConfirmId(null)}
              />
            ))}
          </View>
        </View>
      ) : null}
    </Page>
  );
}

function GoalCard({
  goal,
  actions,
  confirming,
  onEdit,
  onArchive,
  onAskDelete,
  onDelete,
  onKeep,
}: {
  goal: Goal;
  actions: Action[];
  confirming: boolean;
  onEdit: () => void;
  onArchive: () => void;
  onAskDelete: () => void;
  onDelete: () => void;
  onKeep: () => void;
}) {
  const type = useType();
  const archived = !isActiveGoal(goal);
  const pct = actions.length ? actions.reduce((sum, action) => sum + fraction(action.progress), 0) / actions.length : 0;
  const palette = areaColors[goal.area];

  return (
    <View style={[styles.card, { borderTopColor: palette.fill }]}>
      <Text style={[styles.area, { fontFamily: type.bodySemibold, color: palette.text }]}>{AREAS.find((area) => area.id === goal.area)?.label}</Text>
      <Text style={[styles.title, { fontFamily: type.heading }]}>{goal.title}</Text>
      {actions.length > 0 ? (
        <Text style={[styles.thisWeek, { fontFamily: type.body }]}>This week: {actions.map((action) => action.title).join(" · ")}</Text>
      ) : null}
      {archived ? null : (
        <View style={[styles.track, { backgroundColor: palette.soft }]} accessibilityLabel={`${Math.round(pct * 100)}% of this week's actions`}>
          <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: palette.fill }]} />
        </View>
      )}
      {goal.artifactTitle ? <Text style={[styles.artifact, { fontFamily: type.bodyMedium, color: palette.text }]}>{goal.artifactTitle}</Text> : null}
      <View style={styles.actionRow}>
        <CardButton label="Edit" accessibilityLabel={`Edit ${goal.title}`} onPress={onEdit} />
        <CardButton
          label={archived ? "Restore" : "Archive"}
          accessibilityLabel={`${archived ? "Restore" : "Archive"} ${goal.title}`}
          onPress={onArchive}
        />
        {confirming ? null : <CardButton label="Delete" accessibilityLabel={`Delete ${goal.title}`} onPress={onAskDelete} />}
      </View>
      {confirming ? (
        <View style={styles.confirmBlock}>
          <Text style={[styles.confirm, { fontFamily: type.body }]}>Delete this goal?</Text>
          <View style={styles.actionRow}>
            <CardButton label="Yes, delete" accessibilityLabel={`Yes, delete ${goal.title}`} onPress={onDelete} />
            <CardButton label="Keep it" accessibilityLabel={`Keep ${goal.title}`} onPress={onKeep} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

function CardButton({ label, onPress, accessibilityLabel }: { label: string; onPress: () => void; accessibilityLabel: string }) {
  const type = useType();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={styles.actionBtn}>
      <Text style={[styles.actionText, { fontFamily: type.bodyMedium }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  add: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: { fontSize: 15, color: colors.ink },
  intro: { fontSize: 14, lineHeight: 21, color: colors.muted, marginTop: -6 },
  empty: { fontSize: 14, lineHeight: 21, color: colors.muted },
  section: { gap: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  card: {
    flexGrow: 1,
    flexBasis: 280,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderTopWidth: 6,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 10,
  },
  area: { fontSize: 12, letterSpacing: 1, textTransform: "uppercase" },
  title: { fontSize: 22, color: colors.ink, letterSpacing: -0.3 },
  thisWeek: { fontSize: 13, lineHeight: 19, color: colors.muted },
  track: { height: 8, borderRadius: 999, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 999 },
  artifact: { fontSize: 13 },
  actionRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actionBtn: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: { fontSize: 14, color: colors.ink },
  confirmBlock: { gap: 8 },
  confirm: { fontSize: 14, lineHeight: 20, color: colors.muted },
});
