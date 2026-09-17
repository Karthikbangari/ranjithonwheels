import { geoInterpolate, geoDistance } from "d3-geo";
import type { Feature, FeatureCollection, LineString, Point } from "geojson";
import { journeyCountries } from "@/content/journey";

// CLAUDE.md §4.3: the three named sea crossings, identified by the slug of
// the country the crossing arrives at. Singapore -> Indonesia is the real
// crossing edge in the route order (Ranjith's own ferry left from
// Singapore, not Malaysia directly — see Indonesia's summary in journey.ts),
// even though §4.3's prose shorthand says "Malaysia -> Indonesia".
const SEA_CROSSING_ARRIVAL_SLUGS = new Set(["sri-lanka", "indonesia", "australia"]);

const SAMPLES_PER_SEGMENT = 16;
const UNFINISHED_SEGMENT_STEPS = 6;
const UNFINISHED_SEGMENT_STEP_DEGREES = 0.6;

// Catmull-Rom in raw lon/lat only looks right when consecutive control
// points are close together — for the long inter-continental jumps (e.g.
// Australia -> France) it degenerates into a straight line across the
// equirectangular grid, cutting through whatever happens to sit between
// the two lon/lat values. Great-circle waypoints inserted for any edge
// longer than this keep the spline hugging a sensible geodesic instead.
const LONG_EDGE_THRESHOLD_RADIANS = (20 * Math.PI) / 180;
const GREAT_CIRCLE_WAYPOINTS_PER_LONG_EDGE = 6;

type LonLat = [number, number];

// Inserts great-circle waypoints into long edges and returns the densified
// point list alongside, for each gap in it, which original edge (index into
// the untouched anchors array) it subdivides — so per-country bookkeeping
// downstream can still be done per original edge.
function densifyLongEdges(points: LonLat[]): { points: LonLat[]; originalEdgeIndex: number[] } {
  const expanded: LonLat[] = [points[0]];
  const originalEdgeIndex: number[] = [];

  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    if (geoDistance(a, b) > LONG_EDGE_THRESHOLD_RADIANS) {
      const interpolate = geoInterpolate(a, b);
      for (let step = 1; step <= GREAT_CIRCLE_WAYPOINTS_PER_LONG_EDGE; step += 1) {
        expanded.push(interpolate(step / (GREAT_CIRCLE_WAYPOINTS_PER_LONG_EDGE + 1)) as LonLat);
        originalEdgeIndex.push(i);
      }
    }
    expanded.push(b);
    originalEdgeIndex.push(i);
  }

  return { points: expanded, originalEdgeIndex };
}

function catmullRom1D(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

function catmullRomPoint(p0: LonLat, p1: LonLat, p2: LonLat, p3: LonLat, t: number): LonLat {
  return [catmullRom1D(p0[0], p1[0], p2[0], p3[0], t), catmullRom1D(p0[1], p1[1], p2[1], p3[1], t)];
}

// Samples a smooth curve through every anchor (used as the tangent context
// for natural-looking curves) and returns, per ORIGINAL segment index (i.e.
// per country-to-country edge, not per densified sub-edge), the list of
// sampled points that make up that segment — so callers can decide
// per-segment whether to treat it as the main route or a sea crossing.
function sampleSmoothedSegments(anchors: LonLat[]): LonLat[][] {
  const { points, originalEdgeIndex } = densifyLongEdges(anchors);

  const segmentsByOriginalEdge: LonLat[][] = anchors.slice(0, -1).map(() => []);

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const target = segmentsByOriginalEdge[originalEdgeIndex[i]];
    const startStep = target.length === 0 ? 0 : 1; // don't duplicate the shared join point
    for (let step = startStep; step <= SAMPLES_PER_SEGMENT; step += 1) {
      const t = step / SAMPLES_PER_SEGMENT;
      target.push(catmullRomPoint(p0, p1, p2, p3, t));
    }
  }

  return segmentsByOriginalEdge;
}

export type RouteCheckpoint = {
  slug: string;
  order: number;
  fraction: number;
  point: LonLat;
};

export type RouteData = {
  mainLine: Feature<LineString>;
  crossingLines: Feature<LineString>[];
  crossingLabels: FeatureCollection<Point, { label: string }>;
  unfinishedLine: Feature<LineString>;
  checkpoints: RouteCheckpoint[];
};

function pathLength(coords: LonLat[]): number {
  let total = 0;
  for (let i = 1; i < coords.length; i += 1) {
    const [lon1, lat1] = coords[i - 1];
    const [lon2, lat2] = coords[i];
    total += Math.hypot(lon2 - lon1, lat2 - lat1);
  }
  return total;
}

export function buildRouteData(): RouteData {
  const anchors = journeyCountries.map((country) => country.displayAnchor as LonLat);
  const segments = sampleSmoothedSegments(anchors);

  const mainCoords: LonLat[] = [];
  const crossingLines: Feature<LineString>[] = [];
  const crossingLabelFeatures: Feature<Point, { label: string }>[] = [];
  const checkpoints: RouteCheckpoint[] = [];

  let cumulative = 0;
  checkpoints.push({ slug: journeyCountries[0].slug, order: 1, fraction: 0, point: anchors[0] });
  if (mainCoords.length === 0) mainCoords.push(anchors[0]);

  segments.forEach((segmentSamples, index) => {
    const arrivalCountry = journeyCountries[index + 1];
    const isCrossing = SEA_CROSSING_ARRIVAL_SLUGS.has(arrivalCountry.slug);
    const segmentLength = pathLength(segmentSamples);

    if (isCrossing) {
      crossingLines.push({
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: segmentSamples },
      });
      const mid = segmentSamples[Math.floor(segmentSamples.length / 2)];
      crossingLabelFeatures.push({
        type: "Feature",
        properties: { label: "SEA CROSSING" },
        geometry: { type: "Point", coordinates: mid },
      });
      // The main line still needs to reach the arrival anchor so the next
      // real segment resumes from the right place — just without drawing a
      // solid cycling line across the water.
      mainCoords.push(segmentSamples[segmentSamples.length - 1]);
    } else {
      mainCoords.push(...segmentSamples.slice(1));
    }

    cumulative += segmentLength;
    checkpoints.push({
      slug: arrivalCountry.slug,
      order: arrivalCountry.order,
      fraction: cumulative, // normalised to 0-1 below, once the total is known
      point: anchors[index + 1],
    });
  });

  const totalLength = cumulative || 1;
  checkpoints.forEach((checkpoint) => {
    checkpoint.fraction = checkpoint.fraction / totalLength;
  });

  // The unfinished segment: continues past Slovakia along its final
  // heading, dashed, fading, unlabelled — the journey hasn't stopped, it's
  // just not written yet.
  const last = anchors[anchors.length - 1];
  const secondLast = anchors[anchors.length - 2];
  const heading: LonLat = [last[0] - secondLast[0], last[1] - secondLast[1]];
  const headingLength = Math.hypot(heading[0], heading[1]) || 1;
  const direction: LonLat = [heading[0] / headingLength, heading[1] / headingLength];

  const unfinishedCoords: LonLat[] = [last];
  for (let step = 1; step <= UNFINISHED_SEGMENT_STEPS; step += 1) {
    unfinishedCoords.push([
      last[0] + direction[0] * UNFINISHED_SEGMENT_STEP_DEGREES * step,
      last[1] + direction[1] * UNFINISHED_SEGMENT_STEP_DEGREES * step,
    ]);
  }

  return {
    mainLine: {
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: mainCoords },
    },
    crossingLines,
    crossingLabels: { type: "FeatureCollection", features: crossingLabelFeatures },
    unfinishedLine: {
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: unfinishedCoords },
    },
    checkpoints,
  };
}
