import type { Area } from "./types";

/** Colors from the Momentum mockup. Area text for Fun is darker than the fill so it stays readable. */
export const colors = {
  ground: "#F4F3EF",
  panel: "#FBFAF7",
  card: "#FFFFFF",
  ink: "#1C1E21",
  ink2: "#3A3D42",
  muted: "#5F6368",
  line: "#E2E0D9",
  accent: "#D2512F",
  coachLabel: "#F2A38E",
  onCoach: "#F4F3EF",
} as const;

export const areaColors: Record<Area, { text: string; fill: string; soft: string }> = {
  health: { text: "#2E7A57", fill: "#2E7A57", soft: "#E3EEE8" },
  work: { text: "#2F5FA8", fill: "#2F5FA8", soft: "#E4EAF4" },
  fun: { text: "#A55312", fill: "#E08A3C", soft: "#F6E3D1" },
  social: { text: "#B04A86", fill: "#B04A86", soft: "#F3E1EC" },
};
