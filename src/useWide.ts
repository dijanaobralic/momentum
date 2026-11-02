import { useSyncExternalStore } from "react";
import { Platform, useWindowDimensions } from "react-native";

const WIDE_QUERY = "(min-width: 720px)";

function canListen(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function";
}

function subscribe(onChange: () => void) {
  if (!canListen()) return () => {};
  const query = window.matchMedia(WIDE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function snapshot() {
  return canListen() && window.matchMedia(WIDE_QUERY).matches;
}

/** The server HTML is always the phone layout, so the first client render must be too. */
function serverSnapshot() {
  return false;
}

/**
 * Phone layout below 720px, two columns above it.
 * On web this waits until after hydration, so the server HTML and the first client render agree.
 */
export function useWide(): boolean {
  const { width } = useWindowDimensions();
  const webWide = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return Platform.OS === "web" ? webWide : width >= 720;
}
