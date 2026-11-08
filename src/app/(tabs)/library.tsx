import { StyleSheet, Text } from "react-native";

import { Page, PageHeader } from "../../components/Page";
import { useType } from "../../fonts";
import { colors } from "../../theme";

export default function LibraryScreen() {
  const type = useType();
  return (
    <Page>
      <PageHeader title="Library" />
      <Text style={[styles.text, { fontFamily: type.body }]}>Plans, trackers, and reports attached to your goals. Coming next.</Text>
    </Page>
  );
}

const styles = StyleSheet.create({
  text: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
});
