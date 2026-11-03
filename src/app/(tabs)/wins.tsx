import { StyleSheet, Text, View } from "react-native";

import { Page, PageHeader } from "../../components/Page";
import { useType } from "../../fonts";
import { fraction } from "../../lib";
import { useAppState } from "../../state";
import { areaColors, colors } from "../../theme";

export default function WinsScreen() {
  const { state } = useAppState();
  const type = useType();
  const wins = state.actions.filter((action) => fraction(action.progress) >= 1);

  return (
    <Page>
      <PageHeader title="Look how far you've come." />
      <View style={styles.card}>
        {wins.length === 0 ? (
          <Text style={[styles.empty, { fontFamily: type.body }]}>Finished things land here.</Text>
        ) : (
          wins.map((win, index) => (
            <View key={win.id} style={[styles.row, index > 0 && styles.rowLine]}>
              <View style={[styles.dot, { backgroundColor: areaColors[win.area].fill }]} />
              <Text style={[styles.title, { fontFamily: type.body }]}>{win.title}</Text>
            </View>
          ))
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  empty: { fontSize: 15, lineHeight: 22, color: colors.muted, paddingVertical: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  rowLine: { borderTopWidth: 1, borderTopColor: colors.line },
  dot: { width: 10, height: 10, borderRadius: 5 },
  title: { flex: 1, fontSize: 15, color: colors.ink },
});
