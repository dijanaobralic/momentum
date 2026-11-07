import { createContext, useContext, useState, type ReactNode } from "react";

import { seed } from "./seed";
import type { AppState, Progress } from "./types";

interface AppStateValue {
  state: AppState;
  setProgress: (id: string, progress: Progress) => void;
  reset: () => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

/** One place for the week, so Week, Goals, and Wins stay in agreement. */
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => seed());

  function setProgress(id: string, progress: Progress) {
    setState((prev) => ({
      ...prev,
      actions: prev.actions.map((action) => (action.id === id ? { ...action, progress } : action)),
    }));
  }

  return <AppStateContext.Provider value={{ state, setProgress, reset: () => setState(seed()) }}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return value;
}
