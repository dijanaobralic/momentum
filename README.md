# Momentum

A personal weekly-goals app built on the idea from *Designing Your Life*: keep moving in every area of life, and don't let an overambitious week stall you.

> “Depression can’t hit a moving target.”

It is **not** a daily to-do list. Big goals (a race, a job search, a finance goal) carry a plan or tracker; each week you see only the actions that move them forward, plus small one-week goals.

- [`docs/SPEC.md`](docs/SPEC.md): product spec
- [`docs/HANDOFF.md`](docs/HANDOFF.md): blueprint for anyone picking up the work
- [`CHANGELOG.md`](CHANGELOG.md): version history and roadmap

## Status

**Rebuilding in Expo (React Native)** so it runs as a real Android app, with web as a second target. The app code will appear here step by step.

The first web prototype (Vite + React) is kept on the [`archive/vite-prototype`](../../tree/archive/vite-prototype) branch for reference.

## Run it

```bash
npm install
npx expo start
```

Then scan the QR code with the **Expo Go** app on Android (same Wi-Fi as your computer), or press `w` to open it in a browser.

Stack: Expo SDK 58 · React Native · Expo Router · TypeScript. Learning notes are in [`LEARNING_LOG.md`](LEARNING_LOG.md).
