import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { Choice, Field, FormBlock, SaveBar } from "../../components/Form";
import { Page, PageHeader } from "../../components/Page";
import { useType } from "../../fonts";
import { AREAS, newId } from "../../lib";
import { useAppState } from "../../state";
import { colors } from "../../theme";
import type { Area, Goal } from "../../types";

function param(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default function GoalEditor() {
  const goalId = param(useLocalSearchParams<{ id: string }>().id);
  return <GoalForm key={goalId} goalId={goalId} />;
}

function GoalForm({ goalId }: { goalId: string }) {
  const { state, saveGoal, deleteGoal, setGoalArchived } = useAppState();
  const type = useType();
  const existing = state.goals.find((goal) => goal.id === goalId);
  const creating = goalId === "new";
  const [goal, setGoal] = useState<Goal>(
    () =>
      existing ?? {
        id: newId(),
        area: "health",
        title: "",
        horizon: "long",
      },
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!creating && !existing) {
    return (
      <Page>
        <PageHeader title="That goal isn't here." />
        <SaveBar label="Back" onPress={() => router.back()} />
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader title={creating ? "New goal" : "Edit goal"} />
      <FormBlock>
        <Field label="Title" value={goal.title} onChange={(title) => setGoal({ ...goal, title })} />
        <Choice
          label="Area"
          value={goal.area}
          options={AREAS.map((area) => ({ value: area.id, label: area.label }))}
          onChange={(area: Area) => setGoal({ ...goal, area })}
        />
        <Choice
          label="Kind"
          value={goal.horizon}
          options={[
            { value: "long", label: "With a plan" },
            { value: "week", label: "This week only" },
          ]}
          onChange={(horizon) => setGoal({ ...goal, horizon })}
        />
        <Field
          label="Why"
          value={goal.why ?? ""}
          onChange={(why) => setGoal({ ...goal, why })}
          multiline
          placeholder="Shown next to this week's actions."
        />
        <Field
          label="Plan or tracker"
          value={goal.artifactTitle ?? ""}
          onChange={(artifactTitle) => setGoal({ ...goal, artifactTitle })}
          placeholder="Training plan, job tracker..."
        />
        <SaveBar
          label="Save"
          disabled={goal.title.trim().length === 0}
          onPress={() => {
            saveGoal({
              ...goal,
              title: goal.title.trim(),
              why: goal.why?.trim() || undefined,
              artifactTitle: goal.artifactTitle?.trim() || undefined,
            });
            router.back();
          }}
        />
        {!creating ? (
          <>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setGoalArchived(goal.id, existing?.archived !== true);
                router.back();
              }}
              style={styles.delete}
            >
              <Text style={[styles.deleteText, { fontFamily: type.body }]}>{existing?.archived ? "Restore goal" : "Archive goal"}</Text>
            </Pressable>
            {confirmDelete ? (
              <SaveBar
                label="Yes, delete this goal"
                onPress={() => {
                  deleteGoal(goal.id);
                  router.back();
                }}
              />
            ) : (
              <Pressable accessibilityRole="button" onPress={() => setConfirmDelete(true)} style={styles.delete}>
                <Text style={[styles.deleteText, { fontFamily: type.body }]}>Delete goal</Text>
              </Pressable>
            )}
          </>
        ) : null}
      </FormBlock>
    </Page>
  );
}

const styles = StyleSheet.create({
  delete: { alignSelf: "flex-start", minHeight: 44, justifyContent: "center" },
  deleteText: { fontSize: 15, color: colors.muted, textDecorationLine: "underline" },
});
