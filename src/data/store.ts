import "./installStorage";

import { parseStored } from "../lib";
import type { AppState } from "../types";

const KEY = "momentum:v1";

export function loadStored(): AppState | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return parseStored(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function saveStored(state: AppState): void {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // A full disk should not take the week off the screen.
  }
}
