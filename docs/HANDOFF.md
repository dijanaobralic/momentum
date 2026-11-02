# Momentum — Handoff blueprint

For a developer (or designer) picking up this project. Read this first, then [`SPEC.md`](SPEC.md) for product detail and [`../CHANGELOG.md`](../CHANGELOG.md) for history.

**Owner:** Dijana Obralic · **State as of:** v0.1.0, 2026-11-02 · **Repo:** `dijanaobralic/momentum` (private)

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
| Social | Love | `#B04A86` |

**Progress kinds** (`src/types.ts`):

| Kind | Shape | UI | Example |
|---|---|---|---|
| `count` | `{ done, target, unit?, step? }` | bar + −/+ | Ride 2.5 of 4 h (`step: 0.5`) |
| `steps` | `{ value: 0..4 }` | 4 tappable quarters | Charlie's album: Half |
| `binary` | `{ done }` | single tappable bar | Hang out with Tamara |

**Week:** Monday–Sunday. Always use `mondayOf()` from `src/lib.ts`, never `getDay()` math inline.

**"Area moved":** an area counts as moved if at least one of its actions this week has progress greater than 0 (`areasMoved()`).

## 4. Current state (v0.1.0)

**Works:** Week screen with live progress controls · Goals screen · basic Wins list · responsive phone/desktop shell · installable PWA · localStorage persistence.

**Doesn't exist yet:** creating or editing goals and actions (everything comes from `src/seed.ts`) · Sunday check-in · sync · real coach · Library · quarterly check-in · tests · deployment.

**Important:** data is per-browser. Progress logged on the phone does not appear on the desktop.

## 5. Tech stack and architecture

| Layer | Choice | Notes |
|---|---|---|
| Build | Vite 8 | `npm run dev` / `build` / `preview` |
| UI | React 19 + TypeScript | Function components, no router yet (tab state in `App.tsx`) |
| Styling | One plain CSS file, `src/index.css` | CSS variables for tokens; area color via `.area-{id}` classes setting `--c` / `--soft` |
| PWA | `vite-plugin-pwa` | Manifest in `vite.config.ts`; icons in `public/` |
| State | `useStore()` hook in `src/store.ts` | `useState` + `localStorage` under key `momentum:v1` |
| Backend | None | See roadmap 0.4.0 |
| Lint | oxlint | `npm run lint` |

```
src/
  types.ts            data model — start here
  lib.ts              areas, week math, progress helpers, COMFORTABLE_LOAD
  seed.ts             sample data (replace when editing lands)
  store.ts            state + persistence (swap point for a backend)
  ProgressControl.tsx progress widget, one branch per kind
  App.tsx             shell + Week / Goals / Wins / Library screens
  index.css           all styles and design tokens
docs/
  SPEC.md             product spec
  HANDOFF.md          this file
```

**Design intent for the store:** `useStore()` is the only place that touches persistence. When a backend is added, keep its return shape (`state`, `setProgress`, …) so the screens don't change.

## 6. Running, building, deploying

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve dist/ at http://localhost:4173
```

**Deploy (recommended): Vercel.** Import the GitHub repo, use the Vite preset, build command `npm run build`, output `dist`. Every push to `main` deploys. GitHub Pages is not an option while the repo is private on a free plan.

**Install on Android:** open the deployed URL in Chrome → menu → *Add to Home screen*.

**Before any release:** `npm run build` must pass, and you should click through phone width (390 px) and desktop width (1440 px).

## 7. Design system

The source of truth is the **"Momentum — App Mockup"** design canvas (Desktop and Phone pages). It's private to the owner, so ask her to share it.

- **Fonts:** Space Grotesk (headings, numbers), Inter (body). Loaded from Google Fonts in `index.css`.
- **Colors:** ground `#F4F3EF`, card `#FFFFFF`, ink `#1C1E21`, muted `#5F6368`, line `#E2E0D9`, accent `#D2512F` (check-in button and the coach's highlights only). Area colors are in §3.
- **Coach surfaces:** a dark card (`#1C1E21`) with salmon label `#F2A38E`, or a light card `#FBEDE8` with label `#8A2F17`.
- **Shape:** cards use 16 px radius (18 on phone); pills use 999 px.
- **Touch targets:** at least 44 px on phone. Progress segments are 30 px tall on phone.
- **Copy tone:** warm, short, never guilt. "You're moving," not "You're behind."
- **No:** emoji in the UI, gradient backgrounds, streak counters.

## 8. Roadmap

Each item has acceptance criteria. Build them in order unless the owner says otherwise.

### 0.2.0 — Sunday check-in
- Entry: a button on Week (desktop) and an orange floating button (phone).
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
- **No tests yet.** Add unit tests for `lib.ts` (week math and progress fractions) before the coach logic depends on them.
