import { StyleSheet, Text, View } from "react-native";

import { Page, PageHeader, SectionLabel } from "../../components/Page";
import { useType } from "../../fonts";
import { AREAS, fraction, mondayOf } from "../../lib";
import { useAppState } from "../../state";
import { areaColors, colors } from "../../theme";

export default function GoalsScreen() {
  const { state } = useAppState();
  const type = useType();
  const week = mondayOf();

  return (
    <Page>
      <PageHeader title="Goals" />
      <Text style={[styles.intro, { fontFamily: type.body }]}>Big goals carry a plan or tracker. Small ones live for one week.</Text>
      {(["long", "week"] as const).map((horizon) => (
        <View key={horizon} style={styles.section}>
          <SectionLabel>{horizon === "long" ? "With a plan" : "This week only"}</SectionLabel>
          <View style={styles.grid}>
            {state.goals
              .filter((goal) => goal.horizon === horizon)
              .map((goal) => {
                const actions = state.actions.filter((action) => action.goalId === goal.id && action.weekOf === week);
                const pct = actions.length ? actions.reduce((sum, action) => sum + fraction(action.progress), 0) / actions.length : 0;
                const palette = areaColors[goal.area];
                return (
                  <View key={goal.id} style={[styles.card, { borderTopColor: palette.fill }]}>
                    <Text style={[styles.area, { fontFamily: type.bodySemibold, color: palette.text }]}>
                      {AREAS.find((area) => area.id === goal.area)?.label}
                    </Text>
                    <Text style={[styles.title, { fontFamily: type.heading }]}>{goal.title}</Text>
                    {actions.length > 0 ? (
                      <Text style={[styles.thisWeek, { fontFamily: type.body }]}>This week: {actions.map((action) => action.title).join(" · ")}</Text>
                    ) : null}
                    <View style={[styles.track, { backgroundColor: palette.soft }]} accessibilityLabel={`${Math.round(pct * 100)}% of this week's actions`}>
                      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: palette.fill }]} />
                    </View>
                    {goal.artifactTitle ? (
                      <Text style={[styles.artifact, { fontFamily: type.bodyMedium, color: palette.text }]}>{goal.artifactTitle}</Text>
                    ) : null}
                  </View>
                );
              })}
          </View>
        </View>
      ))}
    </Page>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 14, lineHeight: 21, color: colors.muted, marginTop: -6 },
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
});
