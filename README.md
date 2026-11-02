# Momentum

A personal weekly-goals app built on the idea from *Designing Your Life*: keep moving in every area of life, and don't let an overambitious week stall you.

> “Depression can’t hit a moving target.”

It is **not** a daily to-do list. Big goals (a race, a job search, a finance goal) carry a plan or tracker; each week you see only the actions that move them forward, plus small one-week goals.

See [`docs/SPEC.md`](docs/SPEC.md) for the product spec and design decisions.

## Status

Prototype, v0.1:

- [x] Week at a glance: 4 areas (Health, Work, Fun, Social), "areas moved" momentum metric
- [x] Progress on every action: counts (+/−), quarter steps (tap a segment), yes/no
- [x] Goals screen: long-running vs. this-week-only goals
- [x] Installable on Android / desktop (PWA), responsive phone + desktop layout
- [ ] Sunday check-in (how did the week feel / what worked / what didn't)
- [ ] AI coach: scale-down suggestions from planned vs. done vs. felt
- [ ] Library: plans and trackers attached to goals
- [ ] Quarterly life check-in (Health / Work / Play / Love gauges, Workview + Lifeview)
- [ ] Sync across devices (data is currently stored in the browser only)
- [ ] Strava for ride and strength data

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the build
```

To install it on your phone, deploy `dist/` to any static host (Vercel, Netlify, GitHub Pages), open the URL in Chrome on Android, and choose **Add to Home screen**.

## Stack

Vite · React · TypeScript · vite-plugin-pwa. No backend yet.

## Code map

| File | What it holds |
|---|---|
| `src/types.ts` | Data model: `Goal`, `Action`, `Progress` (count / steps / binary) |
| `src/lib.ts` | Areas, Monday-start week math, progress helpers |
| `src/seed.ts` | Sample data for first open |
| `src/store.ts` | State + localStorage persistence |
| `src/ProgressControl.tsx` | The progress widget for each kind |
| `src/App.tsx` | Shell (sidebar / bottom tabs) and screens |
