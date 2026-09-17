"use client";

import { useSyncExternalStore } from "react";

// CLAUDE.md §4.4 — three degradation tiers. All the underlying signals
// (WebGL, deviceMemory, Save-Data) are effectively constant for a session;
// only prefers-reduced-motion and the desktop/mobile breakpoint can change
// while the page is open, so those are the only two this subscribes to.
export type MapTier = 1 | 2 | 3;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DESKTOP_QUERY = "(min-width: 1024px)";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function hasSaveData(): boolean {
  type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };
  return !!(navigator as NavigatorWithConnection).connection?.saveData;
}

function deviceMemoryGB(): number | undefined {
  type NavigatorWithMemory = Navigator & { deviceMemory?: number };
  return (navigator as NavigatorWithMemory).deviceMemory;
}

function computeTier(): MapTier {
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  if (reducedMotion || hasSaveData() || !hasWebGL()) return 3;

  const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
  const memory = deviceMemoryGB();
  // deviceMemory is undefined on browsers that don't expose it (notably
  // Safari) — treat "unknown" as capable rather than penalising them.
  const isCapable = memory === undefined || memory >= 4;

  return isDesktop && isCapable ? 1 : 2;
}

function subscribe(callback: () => void) {
  const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  const desktopQuery = window.matchMedia(DESKTOP_QUERY);
  reducedMotionQuery.addEventListener("change", callback);
  desktopQuery.addEventListener("change", callback);
  return () => {
    reducedMotionQuery.removeEventListener("change", callback);
    desktopQuery.removeEventListener("change", callback);
  };
}

// Tier 2 (the more conservative, lower-capability tier) as the SSR/initial
// snapshot — never actually rendered from, since every consumer treats it
// as a client-only value, but it keeps the hydration snapshot inert.
function getServerSnapshot(): MapTier {
  return 2;
}

export function useMapTier(): MapTier {
  return useSyncExternalStore(subscribe, computeTier, getServerSnapshot);
}
