"use client";

import { useEffect, useState } from "react";
import { geoPath } from "d3-geo";
import type { FeatureCollection } from "geojson";
import { loadWorldFeatures } from "@/lib/map";
import { findCountryFeature, computeCountryProjection } from "@/lib/countryShape";
import styles from "./CountryTerrainFallback.module.css";

const VIEW_WIDTH = 400;
const VIEW_HEIGHT = 300;

// Fetched once per page load and shared by every card that needs it — the
// topology is the same static asset the main journey map already uses.
let worldFeaturesPromise: Promise<FeatureCollection> | null = null;
function getWorldFeatures(): Promise<FeatureCollection> {
  if (!worldFeaturesPromise) worldFeaturesPromise = loadWorldFeatures();
  return worldFeaturesPromise;
}

type CountryTerrainFallbackProps = {
  slug: string;
  anchor: [number, number];
};

// The designed "no real photo yet" state from CLAUDE.md §8: a light terrain
// map of the country itself, its outline in coral, in place of any
// placeholder text. Renders full-bleed inside whatever aspect-ratio frame
// the caller already has in place for the real photograph.
export function CountryTerrainFallback({ slug, anchor }: CountryTerrainFallbackProps) {
  const [world, setWorld] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    let cancelled = false;
    getWorldFeatures().then((features) => {
      if (!cancelled) setWorld(features);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!world) {
    return <div className={styles.frame} aria-hidden="true" />;
  }

  const target = findCountryFeature(world, slug);
  const projection = computeCountryProjection(target, anchor, VIEW_WIDTH, VIEW_HEIGHT);
  const pathGenerator = geoPath(projection);
  const markerPoint = projection(anchor);

  return (
    <svg
      className={styles.frame}
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} className={styles.sea} />
      {world.features.map((featureItem, index) => (
        <path key={index} d={pathGenerator(featureItem) ?? undefined} className={styles.land} />
      ))}
      {target ? <path d={pathGenerator(target) ?? undefined} className={styles.target} /> : null}
      {markerPoint ? (
        <circle cx={markerPoint[0]} cy={markerPoint[1]} r={5} className={styles.marker} />
      ) : null}
    </svg>
  );
}
