# Momentum — Product spec (v0.1)

Design mockups: the "Momentum — App Mockup" canvas (Desktop and Phone pages).

## Purpose

One place for goals that are often scattered (training plan in one doc, finance in a spreadsheet, job search somewhere else), with a weekly rhythm that keeps the user moving without overcommitting. Built mostly for one user.

**Core principle:** measure *movement*, not completion. Partial progress counts, and the app should never become a scoreboard of failure.

## Structure

```
Goal (long-running: has a plan or tracker = "artifact")
 └── Weekly actions (what shows on Week at a glance)

Goal (this week only: no artifact)
 └── Weekly actions
```

Example: **Tahoe Truckee 100** (Health) → artifact: training plan → this week: strength ×3, ride 4 h. The goal's *why* is shown next to the weekly actions as a reminder.

## Areas

Four areas, mapping one-to-one onto the *Designing Your Life* gauges:

| Area | Life gauge |
|---|---|
| Health | Health |
| Work (includes finance and job hunt) | Work |
| Fun | Play |
| Social | Love |

## Progress

Every action has progress, measured in one of three ways:

| Kind | Use for | Interaction |
|---|---|---|
| `count` | Countable things: sessions, applications, hours | +/− buttons |
| `steps` | Fuzzy one-offs: "half the photos printed" | Tap one of 4 quarter segments |
| `binary` | Did it or didn't: a hangout | Tap the bar |

Long-running goals also show overall progress, measured in whatever way fits the goal: weeks into a plan, a stage (Applying → Interviews → Final → Offer), or % toward a target taken from the tracker.

Logging progress must take a single tap. If it gets slower than that, the data stops being kept up.

## Weekly rhythm

- **Weeks run Monday–Sunday.**
- **Sunday check-in** (~5 min, 3 steps on the phone):
  1. How did this week feel? Light / Steady / Full / Too much
  2. What worked? What didn't?
  3. Plan next week. The coach flags overload and suggests what to defer.
- A ~30-second fallback (one "how's the week feeling?" tap on Week) so a skipped check-in still gives the coach a signal. *Open idea.*

## AI coach

It shows up at decision points, not constantly:

- **Planning (Sunday):** compares the draft against the user's own pattern (planned vs. done vs. how the week felt). Example: "At 11+ actions you finish about half and call it Too much. At 9 or fewer you finish most."
- **Mid-week:** when something is clearly slipping, it offers to scale down rather than reschedule.
- **New big goal:** a warning when a 4th long-running goal would crowd out the others; suggests a "Someday" list.
- A chat is available anytime ("I'm feeling overwhelmed…").

The prototype uses a fixed comfortable load of 9 actions (`COMFORTABLE_LOAD`). The real version learns it from check-in history.

## Quarterly life check-in

Every ~3 months, with a reminder:

- Health / Work / Play / Love gauges (empty → full), compared with last quarter
- Workview and Lifeview, ~250 words each
- Coherence questions: where do they complement each other, where do they clash, does one drive the other?
- The coach compares the answers with what the quarter's weeks actually held.

This is desktop-first, because long writing doesn't suit a phone.

## Screens

| Tab | Purpose |
|---|---|
| Week | Week at a glance, areas moved, the coach nudge, progress controls |
| Goals | Long-running goals (with artifact + overall progress), week-only goals |
| Library | Plans, trackers, weekly and quarterly reports |
| Wins | Everything finished; totals and a timeline, so there's somewhere to look back |

Phone: bottom tabs plus a check-in button. Desktop: sidebar plus a coach panel.

## Not doing (for now)

- Daily to-do lists, or scheduling tasks on specific days
- Streaks (they punish missed weeks, which goes against the core principle)
- Multi-user and sharing

## Open questions

- Sync backend (Firebase vs. Supabase) and sign-in
- How artifacts work: link out to a spreadsheet, embed it, or build native trackers?
- Strava: which data to pull (ride hours, logged strength sessions)
- Notification timing for the Sunday check-in and the quarterly reminder
