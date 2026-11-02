# Learning log

One entry per session. Newest at the bottom.

---

## 2026-11-02 — Switched to Expo, blank app

**Built:** a blank Expo app with one "Week" screen that runs on Android (Expo Go) and web. The old web prototype is archived on a branch.

**Learned:**
- A git **branch** is a named pointer to a commit, which makes it a safe way to shelve code without losing it.
- **Expo Router:** each file in `src/app/` is a screen. `index.tsx` is the home route `/`, and `_layout.tsx` decides how screens are arranged (here, a Stack).
- **`app.json`** is the app's settings (name, icon, Android options). At build time Expo turns it into the Android manifest.
- **Metro** is the bundler: it packs all the JavaScript into one bundle the phone (or browser) runs. Expo Go downloads that bundle from your computer over Wi-Fi.
- React Native uses `View` / `Text` / `StyleSheet` instead of `div` / `span` / CSS. Layout is flexbox, with `flexDirection: column` as the default.

**Native Android equivalent:**
- Screens in `src/app/` ≈ Activities / Compose destinations in a Navigation graph
- `app.json` → `AndroidManifest.xml` + `build.gradle` settings
- Metro + Expo Go ≈ Android Studio's build + "Run" onto a device (except here only JavaScript is rebuilt, not the native app)

**Confusing / revisit:** _(fill in)_

**Next step:** define the data types (Area, Goal, Action, Progress) in `src/types.ts`.
