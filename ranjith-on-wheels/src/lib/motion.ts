// CLAUDE.md §5.2 — the one motion vocabulary every component draws from.
export const ease = {
  travel: "power2.inOut", // camera, route draw
  reveal: "expo.out", // content entrances
  ui: "power2.out", // hover, controls
} as const;

export const dur = {
  micro: 0.18,
  ui: 0.32,
  reveal: 0.8,
  travel: 2.2,
  settle: 1.2,
} as const;

// Not in §5.2's snippet directly, but its prose rule is explicit: "One
// reveal per viewport. Stagger capped at 5 items, 60ms apart."
export const stagger = {
  default: 0.06,
} as const;
