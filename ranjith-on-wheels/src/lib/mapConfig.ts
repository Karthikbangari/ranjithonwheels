// CLAUDE.md §4.1: MapTiler Outdoor if the owner supplies a key, otherwise
// OpenFreeMap Liberty (no key required) as the default so the map works out
// of the box. Kept behind an env var so the style can be swapped without a
// code change once the owner decides.
export const MAP_STYLE_URL =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? "https://tiles.openfreemap.org/styles/liberty";

// India, roughly centred — the map's resting position before any leg is
// requested.
export const DEFAULT_MAP_CENTER: [number, number] = [78.9629, 20.5937];
export const DEFAULT_MAP_ZOOM = 2.4;
