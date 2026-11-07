import { mondayOf } from "./lib";
import type { AppState } from "./types";

/** Sample data so the app isn't empty on first open. Replace with your own. */
export function seed(): AppState {
  const week = mondayOf();
  return {
    reflections: [],
    goals: [
      {
        id: "race",
        area: "health",
        title: "Tahoe Truckee 100",
        horizon: "long",
        why: "[Your reason, in your words. Shown next to every workout.]",
        artifactTitle: "Training plan",
      },
      { id: "job", area: "work", title: "Land an analytics role", horizon: "long", artifactTitle: "Job tracker" },
      { id: "finance", area: "work", title: "[Your finance goal]", horizon: "long", artifactTitle: "Finance tracker" },
      { id: "albums", area: "fun", title: "Photo albums", horizon: "week" },
      { id: "friends", area: "social", title: "Friends time", horizon: "week" },
    ],
    actions: [
      { id: "a1", weekOf: week, area: "health", goalId: "race", title: "Strength training", progress: { kind: "count", done: 2, target: 3 } },
      { id: "a2", weekOf: week, area: "health", goalId: "race", title: "Ride", progress: { kind: "count", done: 2.5, target: 4, unit: "h", step: 0.5 } },
      { id: "a3", weekOf: week, area: "work", goalId: "job", title: "Apply to jobs", progress: { kind: "count", done: 7, target: 10 } },
      { id: "a4", weekOf: week, area: "work", goalId: "job", title: "Outreach messages", progress: { kind: "count", done: 1, target: 2 } },
      { id: "a5", weekOf: week, area: "work", goalId: "finance", title: "Update spreadsheet & review month", progress: { kind: "steps", value: 1 } },
      { id: "a6", weekOf: week, area: "fun", goalId: "albums", title: "Print photos for Mila's album", progress: { kind: "steps", value: 4 } },
      { id: "a7", weekOf: week, area: "fun", goalId: "albums", title: "Print photos for Charlie's album", progress: { kind: "steps", value: 2 } },
      { id: "a8", weekOf: week, area: "social", goalId: "friends", title: "Hang out with Tamara", note: "Sat", progress: { kind: "binary", done: false } },
      { id: "a9", weekOf: week, area: "social", goalId: "friends", title: "Wine tasting with Becky + Isaac", progress: { kind: "binary", done: true } },
    ],
  };
}
