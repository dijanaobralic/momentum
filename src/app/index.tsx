import { StyleSheet, Text, View } from "react-native";

// The home screen. In Expo Router, src/app/index.tsx is the route "/".
export default function WeekScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Week</Text>
      <Text style={styles.subtitle}>Nothing here yet. Next step: the data types.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F3EF",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#1C1E21",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#5F6368",
    textAlign: "center",
  },
});
