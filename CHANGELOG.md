# Changelog

All notable changes to Momentum. Newest first.

Versioning follows `MAJOR.MINOR.PATCH`. While the app is a personal prototype it stays at `0.x`:
- **MINOR** (`0.2.0`): a new screen or capability (e.g. the Sunday check-in)
- **PATCH** (`0.1.1`): fixes and small tweaks to existing behavior

Bump `version` in `package.json` with every release, add an entry here, and tag the commit (`git tag v0.2.0 && git push --tags`).

---

## [0.2.0-dev] — 2026-11-02 · Switched to Expo

### Changed
- **Stack: Vite + React (web) → Expo SDK 58 + React Native + Expo Router + TypeScript.** Android is the primary target, web the second. The project is also a way to learn Android development, and a web app skips all of the Android pipeline.
- The v0.1.0 web prototype moved to the `archive/vite-prototype` branch, kept for reference.

### Added
- A blank Expo app from the SDK 58 default template, reset to a single empty "Week" screen.
- `AGENTS.md` (Expo's agent guidance, from the template).

---

## [Unreleased]

The order is the current plan and can change. Details are in [`docs/HANDOFF.md`](docs/HANDOFF.md#roadmap).

- **0.2.0: Sunday check-in.** 3-step flow: how the week felt → what worked / didn't → plan next week. Stores weekly reflections.
- **0.3.0: Editing.** Add, edit and delete goals and actions in the app (today they come from sample data). Carry unfinished actions into next week.
- **0.4.0: Sync + sign-in.** Backend (Firebase or Supabase) so phone and desktop share data.
- **0.5.0: Coach v1.** Scale-down suggestions based on planned vs. done vs. how the week felt.
- **0.6.0: Library + Wins.** Attach plans/trackers to goals; wins timeline and totals.
- **0.7.0: Quarterly life check-in.** Health / Work / Play / Love gauges, Workview + Lifeview.
- **Later:** Strava import, check-in reminders.

---

## [0.1.0] — 2026-11-02

The first working prototype. Installable web app, phone and desktop from one codebase.

### Added
- **Week at a glance**: 4 areas (Health, Work, Fun, Social), "N of 4 areas moved" metric, actions grouped by area with links to their goal and the goal's *why*.
- **Progress on every action**, in three kinds:
  - `count`: +/− buttons (strength 2/3, rides 2.5 of 4 h, applications 7/10)
  - `steps`: tap one of 4 quarter segments ("half the photos printed")
  - `binary`: single tap (a hangout)
- **Goals screen**: long-running goals (with plan/tracker) vs. this-week-only goals, each with a progress bar for this week.
- **Wins screen** (basic): list of finished actions.
- **Library tab**: placeholder.
- **Responsive shell**: sidebar on desktop, bottom tabs on phone (≤720 px).
- **PWA**: manifest, icons and service worker, so it installs to the Android home screen.
- **Weeks start Monday**: `mondayOf()` in `src/lib.ts`.
- **Local persistence** in `localStorage` (`momentum:v1`), plus a "Reset sample data" link.
- Docs: `README.md`, `docs/SPEC.md`.

### Known limitations
- Data lives only in the browser it was entered in. No sync between devices.
- Goals and actions can't be created or edited in the app yet; they come from `src/seed.ts`.
- The coach is a fixed rule: it appears when a week has more than 9 actions.
- No tests.

---

## [0.0.0] — 2026-10-30 · Design

Not code. Mockups and product decisions.

- Sketched the concept: a goal hub based on *Designing Your Life*, not a to-do list.
- Clickable mockups: 7 desktop screens (Week, Goals, Goal detail, Reports & artifacts, Achievements, Sunday check-in, Quarterly life check-in) and 6 phone screens.
- Decisions:
  - Structure: **goal → plan/tracker (artifact) → weekly actions**
  - **Movement over completion** as the core metric; no streaks
  - Categories reduced from 5 to **4**: Finance merged into Work, so the areas map 1:1 to Health / Work / Play / Love
  - **Progress on every item**, including fuzzy one-offs
  - The life check-in is **quarterly**, not weekly
  - Weeks run **Monday–Sunday**; the check-in is on Sunday
