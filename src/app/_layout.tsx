import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { fontMap, FontReadyProvider } from "../fonts";
import { AppStateProvider } from "../state";
import { colors } from "../theme";

SplashScreen.preventAutoHideAsync().catch(() => {
  // The splash screen is already hidden on web. The app still renders.
});

export default function RootLayout() {
  const [loaded, error] = useFonts(fontMap);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <FontReadyProvider ready={loaded}>
      <AppStateProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.ground },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="check-in" options={{ animation: "slide_from_bottom" }} />
        </Stack>
      </AppStateProvider>
    </FontReadyProvider>
  );
}
