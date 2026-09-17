import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection } from "geojson";

export async function loadWorldFeatures(): Promise<FeatureCollection> {
  const response = await fetch("/data/countries-110m.json");
  const topology = (await response.json()) as Topology;
  const countries = topology.objects.countries as GeometryCollection;
  return feature(topology, countries) as unknown as FeatureCollection;
}

// The five narrative legs' scroll-progress boundaries, shared by the pinned
// desktop timeline and reduced-motion's "jump straight to the end" state.
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
