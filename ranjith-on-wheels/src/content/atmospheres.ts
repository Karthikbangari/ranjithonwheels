// Every country's small colour identity (CLAUDE.md §0 decision #23). The site
// is plain white and plain black; a country's `theme` is only the pale tint
// behind its map and the accent on its small labels — so the chapters read as
// one family, each with a hint of its own place. All 23 are defined up front
// (including countries whose manuscript is still missing), so adding a story
// later never needs a redesign.
//
// `accent` is checked at ≥4.5:1 as text on both `tint` and white.

export type Theme = {
  tint: string;
  accent: string;
  ink: string;
  glow: string;
};

export type Atmosphere = {
  theme: Theme;
  // The quiet tag on the page that describes a country's natural setting
  // ("Regional terrain", "Natural environment"). Set only where a summary names
  // that setting — it describes the *region*, and never implies an event that
  // happened to him (CLAUDE.md §0 decision #21).
  environmentLabel?: string;
};

export const atmospheres: Record<string, Atmosphere> = {
  india: {
    theme: { tint: "#FFF1DC", accent: "#B4470A", ink: "#3B1A05", glow: "#FF9F1C" },
  },
  "sri-lanka": {
    theme: { tint: "#E2F5F1", accent: "#0B6B5E", ink: "#052B26", glow: "#F2B84B" },
  },
  vietnam: {
    theme: { tint: "#E9F5EC", accent: "#1B6B43", ink: "#0F3321", glow: "#7BC96F" },
  },
  cambodia: {
    theme: { tint: "#ECEEE4", accent: "#5A6444", ink: "#1F2418", glow: "#C8A24A" },
  },
  thailand: {
    theme: { tint: "#FDEAF3", accent: "#A3155F", ink: "#3A0722", glow: "#2EC4A0" },
  },
  malaysia: {
    theme: { tint: "#F1F6DA", accent: "#4B6B0F", ink: "#1F2E06", glow: "#E2B100" },
  },
  singapore: {
    theme: { tint: "#E3F4F5", accent: "#0B6E78", ink: "#06282C", glow: "#4FC3CF" },
  },
  indonesia: {
    theme: { tint: "#DDF1F8", accent: "#0A6E92", ink: "#06283A", glow: "#38B6D9" },
    environmentLabel: "Regional terrain",
  },
  china: {
    theme: { tint: "#FBEAE6", accent: "#A3231A", ink: "#35100C", glow: "#E2B33D" },
  },
  japan: {
    theme: { tint: "#FDEBF1", accent: "#B0305F", ink: "#401427", glow: "#F2A0BC" },
  },
  "south-korea": {
    theme: { tint: "#EDEFF9", accent: "#33409E", ink: "#0E1240", glow: "#FF5A7A" },
  },
  taiwan: {
    theme: { tint: "#ECEAFB", accent: "#4A3DB0", ink: "#1B1547", glow: "#E8478B" },
    environmentLabel: "Natural environment",
  },
  mongolia: {
    theme: { tint: "#F8F0D2", accent: "#7A5C0A", ink: "#2A2004", glow: "#C9A227" },
  },
  australia: {
    theme: { tint: "#F8EBDD", accent: "#A1401A", ink: "#2E1509", glow: "#F2B36B" },
  },
  france: {
    theme: { tint: "#F1ECF6", accent: "#6A3E8C", ink: "#24123A", glow: "#E9B949" },
  },
  switzerland: {
    theme: { tint: "#EAF3F8", accent: "#245E8A", ink: "#0A2436", glow: "#9BD4F0" },
  },
  germany: {
    theme: { tint: "#EDF1EA", accent: "#2F5B3A", ink: "#10251A", glow: "#D9B44A" },
  },
  austria: {
    theme: { tint: "#F6EEEA", accent: "#9C2F3A", ink: "#33101A", glow: "#E8C77A" },
  },
  italy: {
    theme: { tint: "#FBEBDD", accent: "#A63F1E", ink: "#3A140A", glow: "#C6B24A" },
  },
  slovenia: {
    theme: { tint: "#E9F2E1", accent: "#3E6B1F", ink: "#17280A", glow: "#8FC86A" },
  },
  croatia: {
    theme: { tint: "#E1F1FA", accent: "#0E5C99", ink: "#06263F", glow: "#F2C14E" },
  },
  hungary: {
    theme: { tint: "#F6F1D8", accent: "#6B6A12", ink: "#26260A", glow: "#E0A526" },
  },
  slovakia: {
    theme: { tint: "#E6EEF7", accent: "#0B4EA2", ink: "#071C3B", glow: "#E6242A" },
  },
  "czech-republic": {
    theme: { tint: "#EAF2EE", accent: "#1F6B4A", ink: "#0B2A1C", glow: "#8FD9B6" },
  },
};

export function getAtmosphere(slug: string): Atmosphere {
  const atmosphere = atmospheres[slug];
  if (!atmosphere) throw new Error(`No atmosphere defined for "${slug}"`);
  return atmosphere;
}
