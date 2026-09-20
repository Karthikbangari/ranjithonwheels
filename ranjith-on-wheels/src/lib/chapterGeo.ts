// Server-side map geometry for the chapter pages. The 110m world topology
// already ships as a static file in /public, so every map on a chapter page is
// projected and turned into SVG path strings here at build time — no client
// fetch, no client d3, and the maps render complete with JavaScript off.
//
// Coordinates everywhere are the display anchors from journey.ts, never the
// cycling track, so every route drawn from them is *indicative* (CLAUDE.md §1).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { feature } from "topojson-client";
import { geoInterpolate, geoMercator, geoNaturalEarth1, geoPath, type GeoProjection } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import { findCountryFeature } from "./countryShape";

import { formatCoords, type LonLat } from "./coords";

export { formatCoords, type LonLat };
export type XY = [number, number];

let worldCache: FeatureCollection | null = null;

export function world(): FeatureCollection {
  if (!worldCache) {
    const file = join(process.cwd(), "public", "data", "countries-110m.json");
    const topology = JSON.parse(readFileSync(file, "utf8")) as Topology;
    worldCache = feature(topology, topology.objects.countries as GeometryCollection) as unknown as FeatureCollection;
  }
  return worldCache;
}

export function countryFeature(slug: string): Feature | undefined {
  return findCountryFeature(world(), slug);
}

const pathFor = (projection: GeoProjection) => geoPath(projection).digits(1);

// A frame that shows both ends of a crossing with room to breathe, and never
// zooms in tighter than `minSpan` degrees so two neighbouring countries don't
// fill the frame with a single border.
export function regionProjection(
  a: LonLat,
  b: LonLat,
  width: number,
  height: number,
  { padding = 90, minSpan = 16 }: { padding?: number; minSpan?: number } = {},
): GeoProjection {
  const between = geoInterpolate(a, b);
  const samples = [0, 0.25, 0.5, 0.75, 1].map((t) => between(t) as LonLat);
  const mid = between(0.5) as LonLat;
  const halfLon = minSpan / 2;
  const halfLat = (minSpan / 2) * (height / width);
  const corners: LonLat[] = [
    [mid[0] - halfLon, mid[1] - halfLat],
    [mid[0] + halfLon, mid[1] - halfLat],
    [mid[0] - halfLon, mid[1] + halfLat],
    [mid[0] + halfLon, mid[1] + halfLat],
  ];
  return geoNaturalEarth1().fitExtent(
    [
      [padding, padding],
      [width - padding, height - padding],
    ],
    { type: "MultiPoint", coordinates: [...samples, ...corners] },
  );
}

// Only the land that actually falls inside the frame, so a regional map isn't
// carrying the whole world's coastline in its markup.
export function landPaths(projection: GeoProjection, width: number, height: number, skip: string[] = []): string[] {
  const path = pathFor(projection);
  const paths: string[] = [];
  for (const item of world().features) {
    if (skip.includes(String(item.id))) continue;
    const [[x0, y0], [x1, y1]] = path.bounds(item);
    if (![x0, y0, x1, y1].every(Number.isFinite)) continue;
    if (x1 < 0 || x0 > width || y1 < 0 || y0 > height) continue;
    const d = path(item);
    if (d) paths.push(d);
  }
  return paths;
}

export function outline(projection: GeoProjection, slug: string): { d: string; id: string } | null {
  const target = countryFeature(slug);
  if (!target) return null;
  const d = pathFor(projection)(target);
  return d ? { d, id: String(target.id) } : null;
}

// A great-circle arc, which is how d3 draws an edge between two lon/lat points.
export function arc(projection: GeoProjection, a: LonLat, b: LonLat): string {
  return pathFor(projection)({ type: "LineString", coordinates: [a, b] }) ?? "";
}

export function project(projection: GeoProjection, point: LonLat): XY {
  const projected = projection(point);
  return projected ? [round(projected[0]), round(projected[1])] : [0, 0];
}

const round = (value: number) => Math.round(value * 10) / 10;

// One country fitted into part of a frame, for the chapter hero. Singapore has
// no outline at 110m (see countryShape.ts), so it comes back with none and the
// hero draws it as a city — rings and a grid — around its anchor instead.
export type HeroMap = {
  width: number;
  height: number;
  outline: string | null;
  anchor: XY;
  routeIn: string;
  routeOut: string;
};

export function heroMap(
  slug: string,
  anchor: LonLat,
  width: number,
  height: number,
  extent: [XY, XY],
): HeroMap {
  const target = countryFeature(slug);
  const projection = geoMercator();
  if (target) {
    projection.fitExtent(extent, target);
  } else {
    const [[x0, y0], [x1, y1]] = extent;
    projection.center(anchor).scale(width * 9).translate([(x0 + x1) / 2, (y0 + y1) / 2]);
  }
  const at = project(projection, anchor);
  const [ax, ay] = at;

  return {
    width,
    height,
    outline: target ? (pathFor(projection)(target) ?? null) : null,
    anchor: at,
    // The road arriving and leaving: continuity between countries, not a
    // geographic claim, so these are drawn in screen space.
    // Arrives from the upper left, so it never cuts across the type that sits
    // at the bottom left of the hero.
    routeIn: `M-80 ${round(ay - height * 0.14)}C${round(ax * 0.3)} ${round(ay - height * 0.34)} ${round(ax * 0.62)} ${round(ay + height * 0.08)} ${ax} ${ay}`,
    routeOut: `M${ax} ${ay}C${round(ax + width * 0.08)} ${round(ay + height * 0.06)} ${round(ax + width * 0.16)} ${round(ay - height * 0.2)} ${width + 80} ${round(ay - height * 0.12)}`,
  };
}

// The world as the ride crossed it, fitted to the frame for the chapter
// gateway: from the Atlantic edge of Europe to the far side of Australia,
// which is everywhere the road has been. The Americas fall off the left edge.
export function worldProjection(width: number, height: number): GeoProjection {
  return geoNaturalEarth1().fitExtent(
    [
      [24, 24],
      [width - 24, height - 24],
    ],
    {
      type: "MultiPoint",
      coordinates: [
        [-42, 66],
        [172, 66],
        [-42, -50],
        [172, -50],
      ],
    },
  );
}
