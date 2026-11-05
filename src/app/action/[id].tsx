import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { Choice, Field, FormBlock, SaveBar } from "../../components/Form";
import { Page, PageHeader } from "../../components/Page";
import { useType } from "../../fonts";
import { AREAS, defaultProgress, newId } from "../../lib";
import { useAppState } from "../../state";
import { colors } from "../../theme";
import type { Action, Area, Progress } from "../../types";

function param(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default function ActionEditor() {
  const params = useLocalSearchParams<{ id: string; week?: string }>();
  const actionId = param(params.id);
  return <ActionForm key={actionId} actionId={actionId} weekParam={param(params.week)} />;
}

function ActionForm({ actionId, weekParam }: { actionId: string; weekParam: string }) {
  const { state, week, saveAction, deleteAction } = useAppState();
  const type = useType();
  const existing = state.actions.find((action) => action.id === actionId);
  const creating = actionId === "new";
  const [action, setAction] = useState<Action>(
    () =>
      existing ?? {
        id: newId(),
        weekOf: weekParam || week,
        area: "health",
        title: "",
        progress: { kind: "steps", value: 0 },
      },
  );
  const [kindTouched, setKindTouched] = useState(!creating);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!creating && !existing) {
    return (
      <Page>
        <PageHeader title="That action isn't here." />
        <SaveBar label="Back" onPress={() => router.back()} />
      </Page>
    );
  }

  function setTitle(title: string) {
    setAction((prev) => ({
      ...prev,
      title,
      progress: creating && !kindTouched ? defaultProgress(title) : prev.progress,
    }));
  }

  function setKind(kind: Progress["kind"]) {
    setKindTouched(true);
    setAction((prev) => {
      if (prev.progress.kind === kind) return prev;
      if (kind === "count") return { ...prev, progress: { kind: "count", done: 0, target: 1 } };
      if (kind === "steps") return { ...prev, progress: { kind: "steps", value: 0 } };
      return { ...prev, progress: { kind: "binary", done: false } };
    });
  }

  const goalOptions = [{ value: "", label: "None" }, ...state.goals.map((goal) => ({ value: goal.id, label: goal.title }))];

  return (
    <Page>
      <PageHeader title={creating ? "New action" : "Edit action"} />
      <FormBlock>
        <Field label="Title" value={action.title} onChange={setTitle} placeholder="Ride 4 h" />
        <Field label="Note" value={action.note ?? ""} onChange={(note) => setAction({ ...action, note })} placeholder="Sat" />
        <Choice
          label="Goal"
          value={action.goalId ?? ""}
          options={goalOptions}
          onChange={(goalId) => {
            const goal = state.goals.find((item) => item.id === goalId);
            setAction((prev) => ({ ...prev, goalId: goalId || undefined, area: goal?.area ?? prev.area }));
          }}
        />
        <Choice
          label="Area"
          value={action.area}
          options={AREAS.map((area) => ({ value: area.id, label: area.label }))}
          onChange={(area: Area) => setAction({ ...action, area })}
        />
        <Choice
          label="Progress"
          value={action.progress.kind}
          options={[
            { value: "count", label: "Count" },
            { value: "steps", label: "Quarters" },
            { value: "binary", label: "Done or not" },
          ]}
          onChange={setKind}
        />
        {action.progress.kind === "count" ? (
          <>
            <Field
              label="Target"
              value={String(action.progress.target)}
              onChange={(text) => {
                const target = Number(text);
                setAction((prev) =>
                  prev.progress.kind === "count" ? { ...prev, progress: { ...prev.progress, target: Number.isFinite(target) ? target : 0 } } : prev,
                );
              }}
            />
            <Field
              label="Unit"
              value={action.progress.unit ?? ""}
              onChange={(unit) =>
                setAction((prev) => (prev.progress.kind === "count" ? { ...prev, progress: { ...prev.progress, unit } } : prev))
              }
              placeholder="h"
            />
            <Field
              label="Each tap adds"
              value={String(action.progress.step ?? 1)}
              onChange={(text) => {
                const step = Number(text);
                setAction((prev) =>
                  prev.progress.kind === "count"
                    ? { ...prev, progress: { ...prev.progress, step: Number.isFinite(step) && step > 0 ? step : undefined } }
                    : prev,
                );
              }}
            />
          </>
        ) : null}
        <SaveBar
          label="Save"
          disabled={action.title.trim().length === 0}
          onPress={() => {
            const progress = action.progress.kind === "count" ? { ...action.progress, unit: action.progress.unit?.trim() || undefined } : action.progress;
            saveAction({ ...action, title: action.title.trim(), note: action.note?.trim() || undefined, progress });
            router.back();
          }}
        />
        {!creating ? (
          confirmDelete ? (
            <SaveBar
              label="Yes, delete this action"
              onPress={() => {
                deleteAction(action.id);
                router.back();
              }}
            />
          ) : (
            <Pressable accessibilityRole="button" onPress={() => setConfirmDelete(true)} style={styles.delete}>
              <Text style={[styles.deleteText, { fontFamily: type.body }]}>Delete action</Text>
            </Pressable>
          )
        ) : null}
      </FormBlock>
    </Page>
  );
}

const styles = StyleSheet.create({
  delete: { alignSelf: "flex-start", minHeight: 44, justifyContent: "center" },
  deleteText: { fontSize: 15, color: colors.muted, textDecorationLine: "underline" },
});
