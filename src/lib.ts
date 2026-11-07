import { FEELINGS, type Action, type AppState, type Area, type Feel, type Goal, type Progress, type WeeklyReflection } from "./types";

export const AREAS: { id: Area; label: string; lifeGauge: string }[] = [
  { id: "health", label: "Health", lifeGauge: "Health" },
  { id: "work", label: "Work", lifeGauge: "Work" },
  { id: "fun", label: "Fun", lifeGauge: "Play" },
  { id: "social", label: "Love", lifeGauge: "Love" },
];

/** Weeks start on Monday. Returns the Monday (local time) of the week containing `d`, as YYYY-MM-DD. */
export function mondayOf(d: Date = new Date()): string {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const offset = (x.getDay() + 6) % 7; // Mon=0 … Sun=6
  x.setDate(x.getDate() - offset);
  return toISODate(x);
}

export function toISODate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function weekLabel(monday: string): string {
  const start = new Date(monday + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

/** 0..1 */
export function fraction(p: Progress): number {
  switch (p.kind) {
    case "count":
      return p.target > 0 ? Math.min(1, p.done / p.target) : 0;
    case "steps":
      return Math.min(4, Math.max(0, p.value)) / 4;
    case "binary":
      return p.done ? 1 : 0;
  }
}

export function isDone(p: Progress): boolean {
  return fraction(p) >= 1;
}

const STEP_WORDS = ["Not started", "A quarter", "Half", "Almost", "Done"];

export function progressLabel(p: Progress): string {
  switch (p.kind) {
    case "count":
      return `${fmtNum(p.done)} of ${fmtNum(p.target)}${p.unit ? " " + p.unit : ""}`;
    case "steps":
      return STEP_WORDS[p.value] ?? "";
    case "binary":
      return p.done ? "Done" : "Not yet";
  }
}

function fmtNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/**
 * Add or remove one step of a count. Never goes below zero.
 * Rounded so 2.5 + 0.5 stays 3, not 2.999999999.
 */
export function bumpCount(p: Extract<Progress, { kind: "count" }>, direction: -1 | 1): Progress {
  const step = p.step ?? 1;
  const done = Math.max(0, Math.round((p.done + direction * step) * 1000) / 1000);
  return { ...p, done };
}

/** Tap a quarter to set it. Tap the current quarter again to step back one. */
export function tapStep(current: number, tapped: number): number {
  const value = current === tapped ? tapped - 1 : tapped;
  return Math.min(4, Math.max(0, value));
}

/** An area "moved" this week if any of its actions has any progress. Movement, not completion. */
export function areasMoved(actions: Action[]): Set<Area> {
  const moved = new Set<Area>();
  for (const a of actions) if (fraction(a.progress) > 0) moved.add(a.area);
  return moved;
}

/**
 * The comfortable weekly load. A placeholder rule for now: later this is learned from
 * past weeks (planned vs. done vs. how the week felt).
 */
export const COMFORTABLE_LOAD = 9;

const AREAS_SET = new Set<Area>(["health", "work", "fun", "social"]);

/** Move a Monday by whole weeks. */
export function shiftWeek(monday: string, direction: -1 | 1): string {
  const d = new Date(monday + "T00:00:00");
  d.setDate(d.getDate() + direction * 7);
  return toISODate(d);
}

/** A deferred action starts over on the week it moves to. */
export function freshProgress(p: Progress): Progress {
  switch (p.kind) {
    case "count":
      return { ...p, done: 0 };
    case "steps":
      return { kind: "steps", value: 0 };
    case "binary":
      return { kind: "binary", done: false };
  }
}

/** A number in the title means a count ("ride 4 h"). Anything else starts as quarters. */
export function defaultProgress(title: string): Progress {
  const match = title.match(/(\d+(?:\.\d+)?)/);
  if (match) {
    const target = Number(match[1]);
    if (target > 0) return { kind: "count", done: 0, target };
  }
  return { kind: "steps", value: 0 };
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function parseStored(raw: string | null): AppState | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<AppState>;
    if (!Array.isArray(data.goals) || !Array.isArray(data.actions)) return null;
    return {
      goals: data.goals.filter(isGoal),
      actions: data.actions.filter(isAction),
      reflections: Array.isArray(data.reflections) ? data.reflections.filter(isReflection) : [],
    };
  } catch {
    return null;
  }
}

function isArea(value: unknown): value is Area {
  return typeof value === "string" && AREAS_SET.has(value as Area);
}

function isGoal(value: unknown): value is Goal {
  if (!value || typeof value !== "object") return false;
  const goal = value as Goal;
  return typeof goal.id === "string" && typeof goal.title === "string" && isArea(goal.area) && (goal.horizon === "long" || goal.horizon === "week");
}

function isProgress(value: unknown): value is Progress {
  if (!value || typeof value !== "object") return false;
  const progress = value as Progress;
  if (progress.kind === "count") return typeof progress.done === "number" && typeof progress.target === "number";
  if (progress.kind === "steps") return typeof progress.value === "number";
  if (progress.kind === "binary") return typeof progress.done === "boolean";
  return false;
}

function isAction(value: unknown): value is Action {
  if (!value || typeof value !== "object") return false;
  const action = value as Action;
  return typeof action.id === "string" && typeof action.weekOf === "string" && typeof action.title === "string" && isArea(action.area) && isProgress(action.progress);
}

function isFeel(value: unknown): value is Feel {
  return typeof value === "string" && (FEELINGS as readonly string[]).includes(value);
}

function isReflection(value: unknown): value is WeeklyReflection {
  if (!value || typeof value !== "object") return false;
  const reflection = value as WeeklyReflection;
  return typeof reflection.weekOf === "string" && isFeel(reflection.feel) && typeof reflection.worked === "string" && typeof reflection.didnt === "string" && typeof reflection.planned === "number" && typeof reflection.done === "number";
}
