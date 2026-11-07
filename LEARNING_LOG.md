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

---

## 2026-11-02 — Week screen with sample data

**Built:** the Week screen. It shows the four areas, the sample goals, and a progress control on every action. Tapping updates "N of 4 areas moved." A refresh brings the sample week back, because nothing is saved yet.

**Learned:**
- The data model is the shared language: an `Area` holds `Goal`s, and a `Goal` has `Action`s for one week. `Progress` is one of three shapes (`count`, `steps`, `binary`), so the screen can draw the right control without guessing.
- Weeks start on Monday. `mondayOf()` is the only place that does that calendar math. Everywhere else asks it for the date, which is why Sunday the 1st belongs to the previous Monday.
- "Moved" means any progress above zero, not "finished." A 30-minute ride still fills the Health dot.
- React Native has no CSS file. `StyleSheet.create` is the stylesheet, and `flexDirection` defaults to column, so a row of dots has to say `flexDirection: "row"`.
- Fonts are files the app loads at startup (`useFonts`). Until they finish, the screen uses the system font, so a failed download doesn't leave blank text.
- State for this step is `useState` inside the screen. The next step puts it behind a data layer so the screen never talks to storage itself.

**Native Android equivalent:**
- `StyleSheet` ≈ styles in Compose (`Modifier`, colors, spacing)
- `useState` ≈ `mutableStateOf` in a ViewModel, except this one is forgotten when the screen is destroyed
- `useFonts` ≈ putting font files in `res/font` and referencing them from a theme

**Confusing / revisit:** progress disappears on refresh. That's expected until storage exists. Worth feeling it once so the next step has a reason. Also: `flex: 0` is not "don't grow." In CSS that shorthand sets the basis to 0, which flattened the yes/no bar. Use `flexGrow: 0` when that's what you mean.

**Next step:** save the week on the device, with the same functions on web and Android.

---

## 2026-11-03 — The app shell

**Built:** the frame around the Week screen. A phone gets a bottom bar and an orange check-in button. A wide window gets a sidebar, with the name and the mantra, and a Check in pill. Goals and Wins show the same sample week. The check-in asks how the week felt. That answer is not saved yet.

**Learned:**
- The screen and the frame are different jobs. The Week screen scrolls the week. The shell decides whether you see tabs or a sidebar. Putting "momentum." inside the scroll made the phone feel like a web page.
- One list of actions has to live above the tabs. Otherwise logging a ride on Week would not show up on Wins.
- The accent color is only for the check-in. Everything else stays in the area colors, so the orange button is the one thing that asks for a decision.

**Native Android equivalent:**
- The bottom bar ≈ a `NavigationBar` in Compose, with one destination per tab
- The sidebar on a wide window ≈ a `NavigationRail` or a permanent drawer
- The check-in screen pushed on top ≈ a new destination in the back stack

**Confusing / revisit:** the feeling you tap is forgotten when you close the check-in. That's the next piece of the Sunday flow, along with saving the week itself.

**Next step:** save the week on the device.
