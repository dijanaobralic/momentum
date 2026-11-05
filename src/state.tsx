import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { loadStored, saveStored } from "./data/store";
import { freshProgress, mondayOf, shiftWeek } from "./lib";
import { seed } from "./seed";
import type { Action, AppState, Goal, Progress, WeeklyReflection } from "./types";

interface AppStateValue {
  state: AppState;
  /** The Monday being looked at. Not saved; opening the app returns to this week. */
  week: string;
  setWeek: (week: string) => void;
  setProgress: (id: string, progress: Progress) => void;
  reset: () => void;
  saveGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  saveAction: (action: Action) => void;
  deleteAction: (id: string) => void;
  moveToWeek: (id: string, weekOf: string) => void;
  saveReflection: (reflection: WeeklyReflection, carryIds: string[]) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

function withReflections(state: AppState): AppState {
  return { ...state, reflections: state.reflections ?? [] };
}

/** One place for the week, so Week, Goals, and Wins stay in agreement. Saved on the device after the first read. */
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<AppState>(() => withReflections(seed()));
  const [week, setWeek] = useState(() => mondayOf());

  useEffect(() => {
    // The first render has to match the server, so the saved week is read after mount.
    const saved = loadStored();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate after the server render
    if (saved) setState(withReflections(saved));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveStored(state);
  }, [state, ready]);

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

  function saveAction(action: Action) {
    setState((prev) => ({
      ...prev,
      actions: prev.actions.some((item) => item.id === action.id)
        ? prev.actions.map((item) => (item.id === action.id ? action : item))
        : [...prev.actions, action],
    }));
  }

  function deleteAction(id: string) {
    setState((prev) => ({ ...prev, actions: prev.actions.filter((action) => action.id !== id) }));
  }

  function moveToWeek(id: string, weekOf: string) {
    setState((prev) => ({
      ...prev,
      actions: prev.actions.map((action) => (action.id === id ? { ...action, weekOf, progress: freshProgress(action.progress) } : action)),
    }));
  }

  function saveReflection(reflection: WeeklyReflection, carryIds: string[]) {
    const next = shiftWeek(reflection.weekOf, 1);
    setState((prev) => ({
      ...prev,
      reflections: [...prev.reflections.filter((item) => item.weekOf !== reflection.weekOf), reflection],
      actions: prev.actions.map((action) =>
        carryIds.includes(action.id) ? { ...action, weekOf: next, progress: freshProgress(action.progress) } : action,
      ),
    }));
  }

  if (!ready) return null;

  return (
    <AppStateContext.Provider
      value={{
        state,
        week,
        setWeek,
        setProgress,
        reset: () => setState(withReflections(seed())),
        saveGoal,
        deleteGoal,
        saveAction,
        deleteAction,
        moveToWeek,
        saveReflection,
      }}
    >
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
