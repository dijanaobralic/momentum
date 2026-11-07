import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Field, FormBlock, SaveBar } from "../components/Form";
import { Page, PageHeader } from "../components/Page";
import { useType } from "../fonts";
import { areasMoved, fraction, isDone, shiftWeek, weekLabel } from "../lib";
import { useAppState } from "../state";
import { colors } from "../theme";
import { FEELINGS, type Feel } from "../types";

function param(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/** Sunday check-in: how it felt, what worked, then what to carry into next week. */
export default function CheckInScreen() {
  const type = useType();
  const { state, week: viewedWeek, saveReflection } = useAppState();
  const weekOf = param(useLocalSearchParams<{ week?: string }>().week) || viewedWeek;
  const actions = state.actions.filter((action) => action.weekOf === weekOf);
  const existing = state.reflections.find((item) => item.weekOf === weekOf);
  const [step, setStep] = useState(0);
  const [feel, setFeel] = useState<Feel | null>(existing?.feel ?? null);
  const [worked, setWorked] = useState(existing?.worked ?? "");
  const [didnt, setDidnt] = useState(existing?.didnt ?? "");
  const [carry, setCarry] = useState<string[]>([]);

  const open = actions.filter((action) => fraction(action.progress) < 1);
  const nextWeek = shiftWeek(weekOf, 1);
  const alreadyNext = state.actions.filter((action) => action.weekOf === nextWeek);
  const moving = actions.filter((action) => carry.includes(action.id));

  function toggle(id: string) {
    setCarry((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function save() {
    if (!feel) return;
    saveReflection(
      {
        weekOf,
        feel,
        worked: worked.trim(),
        didnt: didnt.trim(),
        planned: actions.length,
        done: actions.filter((action) => isDone(action.progress)).length,
      },
      carry,
    );
    router.back();
  }

  return (
    <Page>
      <Pressable accessibilityRole="button" onPress={() => (step === 0 ? router.back() : setStep((n) => n - 1))} style={styles.close}>
        <Text style={[styles.closeText, { fontFamily: type.body }]}>{step === 0 ? "Close" : "Back"}</Text>
      </Pressable>
      <PageHeader eyebrow={`${weekLabel(weekOf)} · ${step + 1} of 3`} title={step === 0 ? "How did this week feel?" : step === 1 ? "What stayed with you?" : "Next week"} />

      {step === 0 ? (
        <FormBlock>
          <Text style={[styles.note, { fontFamily: type.body }]}>One tap is enough.</Text>
          <View style={styles.options}>
            {FEELINGS.map((option) => {
              const selected = feel === option;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setFeel(option)}
                  style={[styles.option, selected && styles.optionOn]}
                >
                  <Text style={[styles.optionText, { fontFamily: type.heading, color: selected ? "#FFFFFF" : colors.ink }]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
          <SaveBar label="Next" disabled={!feel} onPress={() => setStep(1)} />
        </FormBlock>
      ) : null}

      {step === 1 ? (
        <FormBlock>
          <Field label="What worked?" value={worked} onChange={setWorked} multiline />
          <Field label="What didn't?" value={didnt} onChange={setDidnt} multiline />
          <SaveBar label="Next" onPress={() => setStep(2)} />
        </FormBlock>
      ) : null}

      {step === 2 ? (
        <FormBlock>
          <View style={styles.summary}>
            <Text style={[styles.summaryText, { fontFamily: type.body }]}>
              {actions.filter((action) => isDone(action.progress)).length} done · {areasMoved(actions).size} of 4 areas moved
              {feel ? ` · ${feel}` : ""}
            </Text>
          </View>
          <Text style={[styles.note, { fontFamily: type.bodySemibold }]}>Move anything unfinished?</Text>
          {open.length === 0 ? <Text style={[styles.note, { fontFamily: type.body }]}>Nothing left open. Next week can start light.</Text> : null}
          {open.map((action) => {
            const selected = carry.includes(action.id);
            return (
              <Pressable key={action.id} accessibilityRole="checkbox" accessibilityState={{ checked: selected }} onPress={() => toggle(action.id)} style={styles.carry}>
                <View style={[styles.box, selected && styles.boxOn]} />
                <Text style={[styles.carryText, { fontFamily: type.body }]}>{action.title}</Text>
              </Pressable>
            );
          })}
          <Text style={[styles.note, { fontFamily: type.bodySemibold }]}>Week of {weekLabel(nextWeek)}</Text>
          {[...alreadyNext.map((action) => action.title), ...moving.map((action) => action.title)].length === 0 ? (
            <Text style={[styles.note, { fontFamily: type.body }]}>Nothing there yet.</Text>
          ) : (
            [...alreadyNext, ...moving].map((action) => (
              <Text key={action.id} style={[styles.draft, { fontFamily: type.body }]}>
                {action.title}
              </Text>
            ))
          )}
          <SaveBar label="Save check-in" disabled={!feel} onPress={save} />
        </FormBlock>
      ) : null}
    </Page>
  );
}

const styles = StyleSheet.create({
  close: { alignSelf: "flex-start", minHeight: 44, justifyContent: "center" },
  closeText: { fontSize: 15, color: colors.muted },
  note: { fontSize: 15, lineHeight: 22, color: colors.muted },
  options: { gap: 10 },
  option: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  optionOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  optionText: { fontSize: 20, letterSpacing: -0.3 },
  summary: { backgroundColor: "#FBEDE8", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14 },
  summaryText: { fontSize: 15, lineHeight: 22, color: "#8A2F17" },
  carry: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 48 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.ink },
  boxOn: { backgroundColor: colors.ink },
  carryText: { flex: 1, fontSize: 16, color: colors.ink },
  draft: { fontSize: 16, color: colors.ink },
});
