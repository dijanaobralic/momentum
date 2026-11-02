export type Area = "health" | "work" | "fun" | "social";

/** How an action's progress is measured. */
export type Progress =
  /** Countable things: 2 of 3 strength sessions, 7 of 10 applications, 2.5 of 4 h. */
  | { kind: "count"; done: number; target: number; unit?: string; step?: number }
  /** Fuzzy one-offs logged in quarters: "half the photos printed". 0–4. */
  | { kind: "steps"; value: number }
  /** Did it or didn't: a hangout. */
  | { kind: "binary"; done: boolean };

export interface Goal {
  id: string;
  area: Area;
  title: string;
  /** Long-running goals carry a plan or tracker; week goals live for one week. */
  horizon: "long" | "week";
  why?: string;
  /** Link to the plan / tracker (training plan, finance spreadsheet...). */
  artifactTitle?: string;
  artifactUrl?: string;
}

export interface Action {
  id: string;
  /** ISO date of the Monday that starts the week this action belongs to. */
  weekOf: string;
  area: Area;
  goalId?: string;
  title: string;
  note?: string;
  progress: Progress;
}

export interface AppState {
  goals: Goal[];
  actions: Action[];
}
