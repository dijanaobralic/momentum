import type { Action, Area, Progress } from "./types";

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
