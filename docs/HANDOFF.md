# Momentum — Handoff blueprint

For a developer (or designer) picking up this project. Read this first, then [`SPEC.md`](SPEC.md) for product detail and [`../CHANGELOG.md`](../CHANGELOG.md) for history.

**Owner:** Dijana Obralic · **State as of:** 0.2.0-dev (Expo rebuild, blank app), 2026-11-02 · **Repo:** `dijanaobralic/momentum` (private)

---

## 1. What this is, in one minute

A personal weekly-goals app. The user sets goals in four life areas; each week shows only the **actions** that move those goals forward, and every action has progress. A Sunday check-in reflects on the week, and an AI coach suggests scaling down when the plan is more than the user can realistically do.

It is built on *Designing Your Life* (Burnett & Evans) and on the owner's mantra, *"Depression can't hit a moving target."* The product's job is to **keep the user moving, not to grade her**.

**Primary user:** the owner, a single user. Multi-user is not a goal.

## 2. Product principles (non-negotiable)

These decide arguments. If a feature conflicts with one, the feature loses.

1. **Movement over completion.** Any progress counts. The headline metric is "areas moved this week," not "% done."
2. **Not a to-do app.** No daily task lists and no scheduling to specific days. Goals → weekly actions only.
3. **Never punish a bad week.** No streaks, no red failure states, no "you missed 3 days."
4. **Logging takes one tap.** If recording progress takes more than a tap, it won't happen, and the data stops matching reality.
5. **Prevent overcommitment at planning time.** The coach is most useful on Sunday, before the week starts, not as a mid-week nag.
6. **Everything in one place.** Plans and trackers (training plan, finance sheet) attach to their goals instead of living elsewhere.

## 3. Domain model

```
Area (4, fixed)
 └── Goal
      ├── horizon: 'long' (has a plan/tracker "artifact")  or  'week' (one-off)
      ├── why      (shown next to its weekly actions)
      └── Action   (belongs to one week: weekOf = Monday's date)
           └── Progress: count | steps | binary
```

| Area | Maps to *Designing Your Life* gauge | Color |
|---|---|---|
| Health | Health | `#2E7A57` |
| Work (incl. finance, job hunt) | Work | `#2F5FA8` |
| Fun | Play | `#E08A3C` (text `#A55312`) |
| Love | Love | `#B04A86` |

**Progress kinds** (`src/types.ts`):

| Kind | Shape | UI | Example |
|---|---|---|---|
| `count` | `{ done, target, unit?, step? }` | bar + −/+ | Ride 2.5 of 4 h (`step: 0.5`) |
| `steps` | `{ value: 0..4 }` | 4 tappable quarters | Charlie's album: Half |
| `binary` | `{ done }` | single tappable bar | Hang out with Tamara |

**Week:** Monday–Sunday. Always use `mondayOf()` from `src/lib.ts`, never `getDay()` math inline.

**"Area moved":** an area counts as moved if at least one of its actions this week has progress greater than 0 (`areasMoved()`).

## 4. Current state (0.2.0-dev)

**Works:** the app shell, a saved week, editing, and the Sunday check-in. On a phone, a bottom bar (Week, Goals, Library, Wins). On a wide window, a sidebar with the name and the mantra. A ‹ control folds that sidebar down to icons, and › opens it again. Check in sits in the Week header on every width, so it does not cover the areas card. You can page to other weeks, add and edit goals and actions, and move an unfinished action to next week. The check-in saves how the week felt, what worked, what didn't, and which actions moved. A refresh keeps all of that on the device. The sample week is still the first thing you see, until you change it. The coach appears at 9 actions.

**Next:** sign-in and sync, so a week logged on the phone shows up on the computer. Keep writing on the device first. The coach's real job (planned vs. done vs. how the week felt) comes after there is more than one saved week to learn from.

## 5. Tech stack and architecture

> **Stack changed on 2026-11-02.** v0.1.0 was a Vite + React web prototype, now archived on the `archive/vite-prototype` branch. It's a useful visual and logic reference (`src/lib.ts`, `src/types.ts` there), but don't build on it. The app is being rebuilt in Expo step by step, because the project is also how the owner is learning Android development. Follow the project's agent instructions: plan before code, small steps, explain the why.

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Expo SDK 58 (React Native 0.88) + TypeScript (strict)** | One codebase for Android (primary) and web |
| Navigation | **Expo Router** | Every file in `src/app/` is a screen; `_layout.tsx` files define navigators |
| Storage | **`expo-sqlite` localStorage on native, `localStorage` on web** | Same `loadStored` / `saveStored` API. Cloud sync only after offline works |
| State | `useState` + context | No state library unless there's a named problem it solves |
| Data access | `src/data/` | Screens never touch storage directly, so the backend can change later |
| Build | Expo Go / dev build → **EAS Build** for an installable APK | |

```
src/
  app/
    _layout.tsx              root stack; loads the fonts and holds the saved week
    (tabs)/_layout.tsx       bottom bar on a phone, sidebar on a wide window
    (tabs)/index.tsx         Week screen (route "/")
    (tabs)/goals.tsx         Goals
    (tabs)/library.tsx       Library placeholder
    (tabs)/wins.tsx          Wins
    check-in.tsx             Sunday check-in, three steps
    goal/[id].tsx            create or edit a goal
    action/[id].tsx          create or edit an action
  components/
    AppTabBar.tsx
    CheckInButton.tsx        Check in pill in the Week header
    Form.tsx                 shared fields for the editors and the check-in
    Page.tsx                 shared page scroll and header
    ProgressControl.tsx      +/−, quarter segments, or a single bar
  data/
    store.ts                 load and save the week; screens do not import storage
    installStorage.ts        no-op on web, where localStorage already exists
    installStorage.native.ts localStorage backed by SQLite on Android and iOS
  fonts.tsx                  font loading; falls back to the system font if a face fails
  lib.ts                     week math, progress fractions, parsing a saved week
  lib.test.ts                unit tests for lib.ts (`npm test`)
  seed.ts                    sample week, so the first launch isn't empty
  state.tsx                  the week, shared by the tabs, saved after it loads
  theme.ts                   colors from the mockup
  types.ts                   Area, Goal, Action, Progress, WeeklyReflection
assets/images/               app icon, adaptive icon, splash
app.json                     app config: name, icons, Android settings → becomes the Android manifest at build time
AGENTS.md                    Expo's own guidance for AI agents (from the template)
docs/                        SPEC.md, HANDOFF.md
```

**Rules:** install packages with `npx expo install <pkg>` (it picks SDK-compatible versions), never plain `npm install <pkg>`. Check the versioned Expo docs before using any Expo API. Platform differences go in `*.web.tsx` / `*.native.tsx` files or a small `Platform.OS` check.

## 6. Running, building, deploying

```bash
npm install
npx expo start     # dev server; prints a QR code
#   Android: scan the QR with the Expo Go app (phone and computer on the same Wi-Fi)
#   Web:     press w
npx tsc --noEmit   # typecheck
npm test           # week math and progress fractions
```

**Installable APK (later):** EAS Build (`eas build -p android --profile preview`). Not set up yet.

**Before every commit:** `npx tsc --noEmit` passes, and the change has been checked on both Android (Expo Go) and web.

## 7. Design system

The source of truth is the **"Momentum — App Mockup"** design canvas (Desktop and Phone pages). It's private to the owner, so ask her to share it.

- **Fonts:** Space Grotesk (headings, numbers), Inter (body). Loaded from Google Fonts in `index.css`.
- **Colors:** ground `#F4F3EF`, card `#FFFFFF`, ink `#1C1E21`, muted `#5F6368`, line `#E2E0D9`, accent `#D2512F` (check-in button and the coach's highlights only). Area colors are in §3.
- **Coach surfaces:** a dark card (`#1C1E21`) with salmon label `#F2A38E`, or a light card `#FBEDE8` with label `#8A2F17`.
- **Shape:** cards use 16 px radius (18 on phone); pills use 999 px.
- **Touch targets:** at least 44 px on phone. Progress bars are 8 px tall; the tap area around them stays large.
- **Copy tone:** warm, short, never guilt. "You're moving," not "You're behind."
- **No:** emoji in the UI, gradient backgrounds, streak counters.

## 8. Roadmap

Each item has acceptance criteria. 0.2.0 and 0.3.0 are in the app. Build the rest in order unless the owner says otherwise.

### 0.2.0 — Sunday check-in (in the app)
- Entry: a Check in pill in the Week header. It used to float on the phone, and it covered the areas card, so it stays in the header on every width.
- Step 1: "How did this week feel?" with Light / Steady / Full / Too much (one tap).
- Step 2: "What worked?" and "What didn't?" free text. Voice dictation is nice-to-have.
- Step 3: a summary (actions done, areas moved, carried over) and the next week's draft.
- Saves a `WeeklyReflection { weekOf, feel, worked, didnt, planned, done }`.
- **Done when:** it can be completed in under 2 minutes on the phone, and reflections persist and are viewable later.

### 0.3.0 — Editing
- Create, edit and delete goals (area, title, horizon, why, artifact link).
- Add an action to a week, choosing its progress kind. Defaults: `count` when there's a number in the title, otherwise `steps`.
- "Carry over" unfinished actions into next week (a one-tap choice during the check-in).
- **Done when:** the app is usable without `seed.ts`.

### 0.4.0 — Sync and sign-in
- The owner is fluent in **Firebase/Firestore**, which makes it the default choice. Supabase is fine too.
- Single-user sign-in (Google). Offline-first: keep working without a connection and sync later.
- **Done when:** progress logged on the phone appears on the desktop within seconds.

### 0.5.0 — Coach v1
- Replace `COMFORTABLE_LOAD = 9` with a value learned from reflection history (planned vs. done vs. feel).
- Show suggestions **at planning time**: "You drafted 12. At 11+ you finish about half. Defer these 3?" with checkboxes.
- A mid-week offer when the week is clearly slipping: "Count the week as done at X?"
- An LLM for wording and chat ("I'm feeling overwhelmed…"). The decision logic stays deterministic and testable.
- **Done when:** suggestions reference the user's own numbers, and accepting one updates the plan in one tap.

### 0.6.0 — Library and Wins
- Library: each long goal can have an artifact (a link to a sheet or doc, or an AI-drafted plan stored in the app).
- Wins: a timeline of finished actions by month, plus totals. It's there so the user can look back at what she's done.

### 0.7.0 — Quarterly life check-in
- Reminder every ~3 months.
- 4 gauges (empty → full) with last quarter's marker; Workview and Lifeview (~250 words each); the three coherence questions.
- Desktop-first.

### Later
- **Strava:** import ride hours and strength sessions into `count` actions. Keep strength separate from riding.
- **Notifications:** Sunday check-in reminder, quarterly reminder.

## 9. Decisions log

| Date | Decision | Why |
|---|---|---|
| 2026-10-30 | Goal → artifact → weekly actions | Big goals need a plan; the week should show only what to do now |
| 2026-10-30 | Life check-in is quarterly, not weekly | Weekly would be too heavy and would get skipped |
| 2026-10-30 | No streaks | Missed weeks shouldn't feel like failure |
| 2026-10-30 | Finance merged into Work → 4 areas | Simpler; maps 1:1 to the book's gauges |
| 2026-10-30 | Progress on every item, including quarter steps | Partial progress ("half printed") must count |
| 2026-10-30 | Weeks start Monday; check-in Sunday | Owner's preference |
| 2026-11-02 | One codebase as a PWA (React + Vite) | Covers Android and desktop; no app store needed |
| 2026-11-02 | localStorage first, backend later | Get the experience right before infrastructure |

## 10. Open questions (ask the owner)

- Firebase or Supabase?
- Artifacts: link out to existing files, embed them, or rebuild trackers natively?
- The quick fallback when a check-in is skipped: a single "how's the week feeling?" tap on Week. In or out?
- Which AI model or provider for the coach, and the monthly budget?
- Notification timing (Sunday evening?).

## 11. Known risks

- **Logging friction:** if the progress data drifts from reality, the coach gives bad advice. Keep logging to one tap, and consider pulling data automatically (Strava) wherever possible.
- **Skipped check-ins** happen exactly in the overwhelmed weeks that matter most. Design a fallback, not a nag.
- **Scope creep:** the vision covers a lot. Ship the weekly loop (plan → glance → check-in) well before Library, quarterly check-ins or integrations.
- **Tests cover `lib.ts` only.** Week math and progress fractions have unit tests. Add more before the coach logic depends on them. The screens themselves are still untested.
