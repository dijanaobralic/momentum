import { Tabs } from "expo-router";
import { View } from "react-native";

import { AppTabBar } from "../../components/AppTabBar";
import { CheckInFab } from "../../components/CheckInButton";
import { colors } from "../../theme";
import { useWide } from "../../useWide";

export default function TabLayout() {
  const wide = useWide();
  return (
    <View style={{ flex: 1, backgroundColor: colors.ground }}>
      <Tabs
        tabBar={(props) => <AppTabBar state={props.state} navigateToTab={props.navigateToTab} />}
        screenOptions={{
          headerShown: false,
          tabBarPosition: wide ? "left" : "bottom",
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Week" }} />
        <Tabs.Screen name="goals" options={{ title: "Goals" }} />
        <Tabs.Screen name="library" options={{ title: "Library" }} />
        <Tabs.Screen name="wins" options={{ title: "Wins" }} />
      </Tabs>
      {wide ? null : <CheckInFab />}
    </View>
  );
}
