export type LonLat = [number, number];

// "12.57° N · 104.99° E" — the anchors in journey.ts are display points, not
// the cycling track, so two decimals is already more precision than they need.
export function formatCoords([lon, lat]: LonLat): string {
  return `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"} · ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? "E" : "W"}`;
}
