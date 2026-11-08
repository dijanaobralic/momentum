import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { areasMoved, bumpCount, fraction, isActiveGoal, isDone, mondayOf, progressLabel, tapStep, weekLabel } from "./lib";
import type { Action } from "./types";

describe("mondayOf", () => {
  it("keeps a Monday", () => {
    assert.equal(mondayOf(new Date(2026, 10, 2)), "2026-11-02");
  });

  it("walks Sunday back to the previous Monday", () => {
    assert.equal(mondayOf(new Date(2026, 10, 1)), "2026-10-26");
  });

  it("walks Wednesday back to Monday", () => {
    assert.equal(mondayOf(new Date(2026, 10, 4)), "2026-11-02");
  });
});

describe("isActiveGoal", () => {
  it("treats a missing or false archive flag as active", () => {
    assert.equal(isActiveGoal({}), true);
    assert.equal(isActiveGoal({ archived: false }), true);
    assert.equal(isActiveGoal({ archived: true }), false);
  });
});

describe("weekLabel", () => {
  it("labels Monday through Sunday", () => {
    assert.equal(weekLabel("2026-11-02"), "Nov 2 – Nov 8");
  });
});

describe("fraction", () => {
  it("caps a count at 1 and treats a zero target as no progress", () => {
    assert.equal(fraction({ kind: "count", done: 5, target: 4 }), 1);
    assert.equal(fraction({ kind: "count", done: 2.5, target: 4 }), 0.625);
    assert.equal(fraction({ kind: "count", done: 1, target: 0 }), 0);
  });

  it("reads steps as quarters and binary as all or nothing", () => {
    assert.equal(fraction({ kind: "steps", value: 2 }), 0.5);
    assert.equal(fraction({ kind: "steps", value: 9 }), 1);
    assert.equal(fraction({ kind: "binary", done: false }), 0);
    assert.equal(fraction({ kind: "binary", done: true }), 1);
  });
});

describe("progress helpers", () => {
  it("labels each kind", () => {
    assert.equal(progressLabel({ kind: "count", done: 2.5, target: 4, unit: "h" }), "2.5 of 4 h");
    assert.equal(progressLabel({ kind: "steps", value: 2 }), "Half");
    assert.equal(progressLabel({ kind: "binary", done: false }), "Not yet");
  });

  it("bumps a count by its step and never below zero", () => {
    const ride = { kind: "count" as const, done: 2.5, target: 4, unit: "h", step: 0.5 };
    assert.deepEqual(bumpCount(ride, 1), { ...ride, done: 3 });
    const dropped = bumpCount({ kind: "count", done: 0.5, target: 3, step: 1 }, -1);
    assert.equal(dropped.kind, "count");
    if (dropped.kind === "count") assert.equal(dropped.done, 0);
  });

  it("steps back when the current quarter is tapped again", () => {
    assert.equal(tapStep(2, 4), 4);
    assert.equal(tapStep(2, 2), 1);
  });

  it("counts an area as moved from any progress, including a partial one", () => {
    const actions: Action[] = [
      { id: "1", weekOf: "2026-11-02", area: "health", title: "Ride", progress: { kind: "count", done: 0.5, target: 4 } },
      { id: "2", weekOf: "2026-11-02", area: "work", title: "Apply", progress: { kind: "count", done: 0, target: 10 } },
      { id: "3", weekOf: "2026-11-02", area: "fun", title: "Album", progress: { kind: "steps", value: 0 } },
    ];
    assert.deepEqual([...areasMoved(actions)], ["health"]);
    assert.equal(isDone(actions[0].progress), false);
    assert.equal(isDone({ kind: "steps", value: 4 }), true);
  });
});
