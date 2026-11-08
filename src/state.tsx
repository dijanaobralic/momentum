import { createContext, useContext, useState, type ReactNode } from "react";

import { seed } from "./seed";
import type { AppState, Goal, Progress } from "./types";

interface AppStateValue {
  state: AppState;
  setProgress: (id: string, progress: Progress) => void;
  reset: () => void;
  saveGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  setGoalArchived: (id: string, archived: boolean) => void;
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

  function saveGoal(goal: Goal) {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.some((item) => item.id === goal.id) ? prev.goals.map((item) => (item.id === goal.id ? goal : item)) : [...prev.goals, goal],
    }));
  }

  function deleteGoal(id: string) {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((goal) => goal.id !== id),
      actions: prev.actions.filter((action) => action.goalId !== id),
    }));
  }

  function setGoalArchived(id: string, archived: boolean) {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) => (goal.id === id ? { ...goal, archived } : goal)),
    }));
  }

  return (
    <AppStateContext.Provider value={{ state, setProgress, reset: () => setState(seed()), saveGoal, deleteGoal, setGoalArchived }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateValue {
  const value = useContext(AppStateContext);
  if (!value) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return value;
}
