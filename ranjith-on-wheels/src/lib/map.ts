import { geoNaturalEarth1, geoInterpolate, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { journeyCountries } from "@/content/journey";

export const MAP_WIDTH = 960;
export const MAP_HEIGHT = 460;

export function createProjection(): GeoProjection {
  return geoNaturalEarth1()
    .scale(168)
    .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2 + 10]);
}

export async function loadWorldFeatures(): Promise<FeatureCollection> {
  const response = await fetch("/data/countries-110m.json");
  const topology = (await response.json()) as Topology;
  const countries = topology.objects.countries as GeometryCollection;
  return feature(topology, countries) as unknown as FeatureCollection;
}

export type RouteCheckpoint = {
  slug: string;
  fraction: number;
  point: [number, number];
};

export type RouteGeometry = {
  d: string;
  totalLength: number;
  checkpoints: RouteCheckpoint[];
};

const SAMPLES_PER_SEGMENT = 24;

export function buildRouteGeometry(projection: GeoProjection): RouteGeometry {
  const segments: string[] = [];
  const checkpoints: RouteCheckpoint[] = [];
  let cumulative = 0;
  let previousPoint: [number, number] | null = null;

  journeyCountries.forEach((country, index) => {
    const projected = projection(country.displayAnchor);
    if (!projected) return;

    if (index === 0) {
      segments.push(`M ${projected[0]} ${projected[1]}`);
      previousPoint = projected;
      checkpoints.push({ slug: country.slug, fraction: 0, point: projected });
      return;
    }

    const previousCountry = journeyCountries[index - 1];
    const interpolate = geoInterpolate(previousCountry.displayAnchor, country.displayAnchor);

    for (let step = 1; step <= SAMPLES_PER_SEGMENT; step += 1) {
      const lonLat = interpolate(step / SAMPLES_PER_SEGMENT);
      const point = projection(lonLat);
      if (!point || !previousPoint) continue;
      cumulative += Math.hypot(point[0] - previousPoint[0], point[1] - previousPoint[1]);
      segments.push(`L ${point[0]} ${point[1]}`);
      previousPoint = point;
    }

    checkpoints.push({ slug: country.slug, fraction: cumulative, point: projected });
  });

  const totalLength = cumulative || 1;

  return {
    d: segments.join(" "),
    totalLength,
    checkpoints: checkpoints.map((checkpoint) => ({
      ...checkpoint,
      fraction: checkpoint.fraction / totalLength,
    })),
  };
}

export const CHAPTER_PROGRESS = {
  india: 0,
  "southeast-asia": 0.18,
  "east-asia": 0.38,
  australia: 0.58,
  europe: 0.76,
  complete: 1,
} as const;

export function chapterAtProgress(progress: number) {
  const entries = Object.entries(CHAPTER_PROGRESS) as [
    keyof typeof CHAPTER_PROGRESS,
    number,
  ][];
  let current: keyof typeof CHAPTER_PROGRESS = "india";
  for (const [chapter, threshold] of entries) {
    if (progress >= threshold) current = chapter;
  }
  return current;
}

export type CountryFeature = Feature<Geometry, { name: string }>;

// Country markers are dense enough in Southeast Asia and Europe that their
// true geographic positions overlap and fail WCAG 2.5.8 touch-target
// spacing. Nudge close markers apart with a bounded relaxation pass so every
// button keeps a clickable margin, independent of the route line (which
// still traces the real projected coordinates).
export function declutterPoints(
  points: Record<string, [number, number]>,
  minDistance = 16,
  iterations = 6,
): Record<string, [number, number]> {
  const slugs = Object.keys(points);
  const positions: Record<string, [number, number]> = {};
  slugs.forEach((slug) => {
    positions[slug] = [...points[slug]] as [number, number];
  });

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    for (let i = 0; i < slugs.length; i += 1) {
      for (let j = i + 1; j < slugs.length; j += 1) {
        const a = positions[slugs[i]];
        const b = positions[slugs[j]];
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const distance = Math.hypot(dx, dy) || 0.0001;
        if (distance < minDistance) {
          const push = (minDistance - distance) / 2;
          const nx = dx / distance;
          const ny = dy / distance;
          a[0] -= nx * push;
          a[1] -= ny * push;
          b[0] += nx * push;
          b[1] += ny * push;
        }
      }
    }
  }

  return positions;
}
