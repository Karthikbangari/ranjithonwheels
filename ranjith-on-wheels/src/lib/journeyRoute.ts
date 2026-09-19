import { geoInterpolate } from "d3-geo";
import { journeyCountries } from "@/content/journey";

const SAMPLES_PER_EDGE = 24;

export type LonLat = [number, number];

// One entry per edge between consecutive countries (22 edges for 23
// countries), each a great-circle-sampled polyline from one anchor to the
// next. geoInterpolate always follows the sphere's surface, so — unlike a
// straight line drawn directly between two lon/lat pairs on a flat
// projection — it never cuts through whatever happens to sit between two
// anchors that are far apart (e.g. Mongolia to Australia).
export function buildRouteEdges(): LonLat[][] {
  const anchors = journeyCountries.map((country) => country.displayAnchor as LonLat);
  const edges: LonLat[][] = [];
  for (let i = 0; i < anchors.length - 1; i += 1) {
    const interpolate = geoInterpolate(anchors[i], anchors[i + 1]);
    const points: LonLat[] = [];
    for (let step = 0; step <= SAMPLES_PER_EDGE; step += 1) {
      points.push(interpolate(step / SAMPLES_PER_EDGE) as LonLat);
    }
    edges.push(points);
  }
  return edges;
}
