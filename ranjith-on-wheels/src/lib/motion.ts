// Read matchMedia directly rather than caching it in state initialised to
// `false` — that stale-until-first-effect pattern previously left
// reduced-motion visitors with hidden start states (see CLAUDE.md's decision
// log on the old chapter system). Every call here reads the real value.
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
