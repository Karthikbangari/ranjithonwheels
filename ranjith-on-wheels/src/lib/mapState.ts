import type { LegId } from "@/content/legs";

// CLAUDE.md §4.2 — the map's own state machine. Text only swaps in
// "reading"; a story panel that updates while the camera is still moving is
// exactly the bug this type exists to prevent.
export type MapState =
  | { kind: "idle" }
  | { kind: "flying"; legId: LegId }
  | { kind: "settling"; legId: LegId }
  | { kind: "reading"; legId: LegId; countryId?: string };
