// SVG presentation attributes accept var(), so motif shapes take their
// colour straight from the --story-* properties StoryPage sets.
export const c = {
  accent: "var(--story-accent)",
  glow: "var(--story-glow)",
  ink: "var(--story-ink)",
  tint: "var(--story-tint)",
  white: "#ffffff",
} as const;
