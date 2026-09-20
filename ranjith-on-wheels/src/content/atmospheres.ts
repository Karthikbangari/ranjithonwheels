// Every country's own cinematic identity (CLAUDE.md §0 decision #20): the
// same navigation, the same blue→red route language and the same chapter
// structure everywhere, but a different colour world, terrain texture and
// ambient effect per country — so the journey reads as an expedition, not one
// template repeated 23 times.
//
// All 23 are defined up front (including countries whose story manuscript is
// still missing) so that adding a story later never needs a redesign: fill
// in stories.ts and the chapter builds itself around what is already here.

export type Theme = {
  tint: string;
  accent: string;
  ink: string;
  glow: string;
};

// "contour": a topographic field, shaped by the params below.
// "grid": a precise lattice with concentric range rings (a city, not terrain).
export type TerrainStyle = "contour" | "grid";

export type Terrain = {
  style: TerrainStyle;
  seed: number;
  levels: number;
  // Feature size of the field: higher = tighter, busier terrain.
  scale: number;
  // Height of the relief: higher = steeper, more dramatic.
  amp: number;
  // Stretches the field along x / y, e.g. long flat steppe vs stacked ridges.
  stretch: [number, number];
};

// Ambient layer over the hero. All scroll-linked, never a loop.
export type HeroEffect = "dust" | "mist" | "streaks" | "petals" | "none";

// What the challenge page's weather does. Only ever set for a country whose
// story has a stated hardship (see `challenge` beats in stories.ts): the
// animation may only reflect what the story actually supports.
export type ChallengeFx = "tremor" | "embers";

export type Atmosphere = {
  theme: Theme;
  challengeFx?: ChallengeFx;
  // The cinematic hero gradient used when there is no photograph (or behind
  // the scrim when there is). `night` sets the hero type to light-on-dark and
  // is the owner-directed night treatment for Singapore and South Korea.
  hero: { from: string; to: string; night?: boolean };
  terrain: Terrain;
  effect: HeroEffect;
};

export const atmospheres: Record<string, Atmosphere> = {
  // ── India: warm, heritage, first roads ───────────────────────────────
  india: {
    theme: { tint: "#FFF1DC", accent: "#B4470A", ink: "#3B1A05", glow: "#FF9F1C" },
    hero: { from: "#2A1004", to: "#B4470A" },
    terrain: { style: "contour", seed: 11, levels: 10, scale: 1.1, amp: 1, stretch: [1, 1] },
    effect: "dust",
  },
  // ── Sri Lanka: tropical / coastal ────────────────────────────────────
  "sri-lanka": {
    theme: { tint: "#E2F5F1", accent: "#0B6B5E", ink: "#052B26", glow: "#F2B84B" },
    hero: { from: "#041F1C", to: "#0B6B5E" },
    terrain: { style: "contour", seed: 23, levels: 9, scale: 0.8, amp: 0.7, stretch: [1, 1.2] },
    effect: "mist",
  },
  // ── Vietnam: stacked green terraces ──────────────────────────────────
  vietnam: {
    theme: { tint: "#E9F5EC", accent: "#1B6B43", ink: "#0F3321", glow: "#7BC96F" },
    hero: { from: "#0A2417", to: "#1B6B43" },
    terrain: { style: "contour", seed: 37, levels: 16, scale: 0.9, amp: 0.8, stretch: [1.6, 0.55] },
    effect: "mist",
  },
  // ── Cambodia: earthy jungle and temple, warm dust ────────────────────
  cambodia: {
    theme: { tint: "#ECEEE4", accent: "#5A6444", ink: "#1F2418", glow: "#C8A24A" },
    hero: { from: "#1B1509", to: "#6B5A2A" },
    terrain: { style: "contour", seed: 41, levels: 11, scale: 0.7, amp: 0.7, stretch: [1.2, 1] },
    effect: "dust",
  },
  // ── Thailand: vibrant road / city / nature contrast ──────────────────
  thailand: {
    theme: { tint: "#FDEAF3", accent: "#A3155F", ink: "#3A0722", glow: "#2EC4A0" },
    hero: { from: "#2B0A1E", to: "#A3155F" },
    terrain: { style: "contour", seed: 53, levels: 13, scale: 1.3, amp: 1, stretch: [1, 1] },
    effect: "streaks",
  },
  // ── Malaysia: rainforest canopy ──────────────────────────────────────
  malaysia: {
    theme: { tint: "#F1F6DA", accent: "#4B6B0F", ink: "#1F2E06", glow: "#E2B100" },
    hero: { from: "#141F04", to: "#4B6B0F" },
    terrain: { style: "contour", seed: 61, levels: 12, scale: 1.2, amp: 0.9, stretch: [1, 1] },
    effect: "mist",
  },
  // ── Singapore: clean, modern, precise, night-city ────────────────────
  singapore: {
    theme: { tint: "#E3F4F5", accent: "#0B6E78", ink: "#06282C", glow: "#4FC3CF" },
    hero: { from: "#030F14", to: "#0B4C57", night: true },
    terrain: { style: "grid", seed: 71, levels: 8, scale: 1, amp: 1, stretch: [1, 1] },
    effect: "streaks",
  },
  // ── Indonesia: ocean and archipelago ─────────────────────────────────
  indonesia: {
    theme: { tint: "#DDF1F8", accent: "#0A6E92", ink: "#06283A", glow: "#38B6D9" },
    hero: { from: "#041824", to: "#0A6E92" },
    terrain: { style: "contour", seed: 83, levels: 9, scale: 1.5, amp: 0.8, stretch: [1, 1] },
    effect: "mist",
    challengeFx: "embers", // the volcanic risk of the Pacific Ring of Fire
  },
  // ── China: large-scale terrain, altitude, depth ──────────────────────
  china: {
    theme: { tint: "#FBEAE6", accent: "#A3231A", ink: "#35100C", glow: "#E2B33D" },
    hero: { from: "#1F0806", to: "#8C2A1E" },
    terrain: { style: "contour", seed: 97, levels: 20, scale: 0.55, amp: 1.7, stretch: [1, 0.9] },
    effect: "mist",
  },
  // ── Japan: discipline, blossom ───────────────────────────────────────
  japan: {
    theme: { tint: "#FDEBF1", accent: "#B0305F", ink: "#401427", glow: "#F2A0BC" },
    hero: { from: "#2A0C1B", to: "#B0305F" },
    terrain: { style: "contour", seed: 101, levels: 12, scale: 1.4, amp: 1, stretch: [0.8, 1.3] },
    effect: "petals",
  },
  // ── South Korea: modern urban / night-road balanced with landscape ───
  "south-korea": {
    theme: { tint: "#EDEFF9", accent: "#33409E", ink: "#0E1240", glow: "#FF5A7A" },
    hero: { from: "#050718", to: "#1B2470", night: true },
    terrain: { style: "contour", seed: 113, levels: 10, scale: 1.1, amp: 0.9, stretch: [1, 1.1] },
    effect: "streaks",
  },
  // ── Taiwan: steep central range ──────────────────────────────────────
  taiwan: {
    theme: { tint: "#ECEAFB", accent: "#4A3DB0", ink: "#1B1547", glow: "#E8478B" },
    hero: { from: "#0F0B2E", to: "#4A3DB0" },
    terrain: { style: "contour", seed: 127, levels: 18, scale: 0.6, amp: 1.5, stretch: [0.7, 1.6] },
    effect: "mist",
    challengeFx: "tremor", // one of the world's most earthquake-prone countries
  },
  // ── Mongolia: vast, flat, open steppe ────────────────────────────────
  mongolia: {
    theme: { tint: "#F8F0D2", accent: "#7A5C0A", ink: "#2A2004", glow: "#C9A227" },
    hero: { from: "#1E1602", to: "#8A6A12" },
    terrain: { style: "contour", seed: 131, levels: 7, scale: 0.4, amp: 0.55, stretch: [2.6, 0.6] },
    effect: "dust",
  },
  // ── Australia: huge open road, strong negative space ─────────────────
  australia: {
    theme: { tint: "#F8EBDD", accent: "#A1401A", ink: "#2E1509", glow: "#F2B36B" },
    hero: { from: "#16324F", to: "#A9551A" },
    terrain: { style: "contour", seed: 149, levels: 4, scale: 0.3, amp: 0.4, stretch: [3, 0.5] },
    effect: "none",
  },
  // ── Europe: a different mood for every country ───────────────────────
  france: {
    theme: { tint: "#F1ECF6", accent: "#6A3E8C", ink: "#24123A", glow: "#E9B949" },
    hero: { from: "#170A26", to: "#6A3E8C" },
    terrain: { style: "contour", seed: 151, levels: 9, scale: 0.6, amp: 0.6, stretch: [1.3, 1] },
    effect: "mist",
  },
  switzerland: {
    theme: { tint: "#EAF3F8", accent: "#245E8A", ink: "#0A2436", glow: "#9BD4F0" },
    hero: { from: "#06151F", to: "#3B7FAE" },
    terrain: { style: "contour", seed: 163, levels: 22, scale: 1.9, amp: 1.8, stretch: [1, 1] },
    effect: "mist",
  },
  germany: {
    theme: { tint: "#EDF1EA", accent: "#2F5B3A", ink: "#10251A", glow: "#D9B44A" },
    hero: { from: "#0A1710", to: "#2F5B3A" },
    terrain: { style: "contour", seed: 173, levels: 12, scale: 1, amp: 0.9, stretch: [1, 1] },
    effect: "none",
  },
  austria: {
    theme: { tint: "#F6EEEA", accent: "#9C2F3A", ink: "#33101A", glow: "#E8C77A" },
    hero: { from: "#1F0A10", to: "#8C2C38" },
    terrain: { style: "contour", seed: 181, levels: 19, scale: 1.6, amp: 1.5, stretch: [1.4, 1] },
    effect: "mist",
  },
  italy: {
    theme: { tint: "#FBEBDD", accent: "#A63F1E", ink: "#3A140A", glow: "#C6B24A" },
    hero: { from: "#2A0F06", to: "#A63F1E" },
    terrain: { style: "contour", seed: 191, levels: 11, scale: 0.9, amp: 0.9, stretch: [0.7, 1.5] },
    effect: "dust",
  },
  slovenia: {
    theme: { tint: "#E9F2E1", accent: "#3E6B1F", ink: "#17280A", glow: "#8FC86A" },
    hero: { from: "#0E1B06", to: "#3E6B1F" },
    terrain: { style: "contour", seed: 199, levels: 14, scale: 1.5, amp: 1.1, stretch: [1, 1] },
    effect: "mist",
  },
  croatia: {
    theme: { tint: "#E1F1FA", accent: "#0E5C99", ink: "#06263F", glow: "#F2C14E" },
    hero: { from: "#041729", to: "#1C7DC3" },
    terrain: { style: "contour", seed: 211, levels: 10, scale: 0.8, amp: 0.7, stretch: [1.8, 0.8] },
    effect: "mist",
  },
  hungary: {
    theme: { tint: "#F6F1D8", accent: "#6B6A12", ink: "#26260A", glow: "#E0A526" },
    hero: { from: "#1B1B06", to: "#7A6E12" },
    terrain: { style: "contour", seed: 223, levels: 6, scale: 0.35, amp: 0.5, stretch: [2.2, 0.7] },
    effect: "dust",
  },
  // ── Slovakia: where the ride stands today — journey blue, route red ──
  slovakia: {
    theme: { tint: "#E6EEF7", accent: "#0B4EA2", ink: "#071C3B", glow: "#E6242A" },
    hero: { from: "#040E1F", to: "#0B4EA2" },
    terrain: { style: "contour", seed: 227, levels: 13, scale: 1.1, amp: 1.1, stretch: [1.2, 1] },
    effect: "none",
  },
};

export function getAtmosphere(slug: string): Atmosphere {
  const atmosphere = atmospheres[slug];
  if (!atmosphere) throw new Error(`No atmosphere defined for "${slug}"`);
  return atmosphere;
}
