import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { areasMoved, bumpCount, defaultProgress, fraction, freshProgress, isDone, mondayOf, parseStored, progressLabel, shiftWeek, tapStep, weekLabel } from "./lib";
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

  it("shifts a Monday by one week", () => {
    assert.equal(shiftWeek("2026-11-02", 1), "2026-11-09");
    assert.equal(shiftWeek("2026-11-02", -1), "2026-10-26");
  });

  it("picks a count when the title has a number, and starts a move over at zero", () => {
    assert.deepEqual(defaultProgress("Ride 4 h"), { kind: "count", done: 0, target: 4 });
    assert.deepEqual(defaultProgress("Print the photos"), { kind: "steps", value: 0 });
    assert.deepEqual(freshProgress({ kind: "count", done: 2.5, target: 4, unit: "h", step: 0.5 }), {
      kind: "count",
      done: 0,
      target: 4,
      unit: "h",
      step: 0.5,
    });
  });

  it("reads a saved week and ignores a broken one", () => {
    const raw = JSON.stringify({
      goals: [{ id: "g", area: "health", title: "Race", horizon: "long" }],
      actions: [{ id: "a", weekOf: "2026-11-02", area: "health", title: "Ride", progress: { kind: "binary", done: true } }],
    });
    const stored = parseStored(raw);
    assert.equal(stored?.goals.length, 1);
    assert.equal(stored?.reflections.length, 0);
    assert.equal(parseStored("nope"), null);
    assert.equal(parseStored(JSON.stringify({ goals: [] })), null);
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
