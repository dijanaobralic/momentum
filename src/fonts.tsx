import {
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from "@expo-google-fonts/space-grotesk";
import { createContext, useContext, type ReactNode } from "react";

/** Keys become the `fontFamily` names. Each file is its own family, which is reliable in Expo Go. */
export const fontMap = {
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_500Medium,
  Inter_600SemiBold,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
};

const FontReadyContext = createContext(false);

export function FontReadyProvider({ ready, children }: { ready: boolean; children: ReactNode }) {
  return <FontReadyContext.Provider value={ready}>{children}</FontReadyContext.Provider>;
}

export interface TypeStyle {
  body?: string;
  bodyMedium?: string;
  bodySemibold?: string;
  bodyItalic?: string;
  heading?: string;
  headingBold?: string;
}

/** System fonts until the custom faces have loaded, so a failed download never blanks the text. */
export function useType(): TypeStyle {
  const ready = useContext(FontReadyContext);
  if (!ready) return {};
  return {
    body: "Inter_400Regular",
    bodyMedium: "Inter_500Medium",
    bodySemibold: "Inter_600SemiBold",
    bodyItalic: "Inter_400Regular_Italic",
    heading: "SpaceGrotesk_600SemiBold",
    headingBold: "SpaceGrotesk_700Bold",
  };
}
