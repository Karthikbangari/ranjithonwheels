"use client";

import dynamic from "next/dynamic";
import { useMapTier } from "@/lib/mapTier";
import { StaticWorldMap } from "@/components/map/StaticWorldMap";

const WorldMapSection = dynamic(
  () => import("@/components/map/WorldMapSection").then((mod) => mod.WorldMapSection),
  { ssr: false },
);

export function JourneyAtlas() {
  const tier = useMapTier();

  // Tier 3 (no WebGL, reduced motion, or Save-Data) never even imports
  // maplibre-gl — the live map's ~200KB and a WebGL context request are
  // exactly what this tier exists to avoid.
  return tier === 3 ? <StaticWorldMap /> : <WorldMapSection />;
}
