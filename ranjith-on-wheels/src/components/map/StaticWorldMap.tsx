"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { geoNaturalEarth1, geoPath, type GeoProjection } from "d3-geo";
import type { FeatureCollection } from "geojson";
import { loadWorldFeatures } from "@/lib/map";
import { buildRouteData } from "@/lib/routeGeometry";
import { journeyCountries } from "@/content/journey";
import { atlasChapters, kindnessCountrySlugs, challengeCountrySlugs, type MapMode } from "@/content/atlas";
import { CountryMarker } from "./CountryMarker";
import { MapModeControls } from "./MapModeControls";
import { JourneyChapterPanel } from "@/components/home/JourneyChapterPanel";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./StaticWorldMap.module.css";

const VIEW_WIDTH = 960;
const VIEW_HEIGHT = 500;

// CLAUDE.md §4.4 Tier 3 + §5.5: no WebGL, reduced motion, or Save-Data all
// land here — a complete, immediately-readable map with every marker and
// the whole route already drawn, no animation, no live tiles. It shares
// the exact route data (crossings, unfinished segment) the live map uses,
// projected once with plain d3-geo instead of MapLibre.
export function StaticWorldMap() {
  const [world, setWorld] = useState<FeatureCollection | null>(null);
  const [mode, setMode] = useState<MapMode>("route");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadWorldFeatures().then((features) => {
      if (!cancelled) setWorld(features);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const projection: GeoProjection = useMemo(
    () => geoNaturalEarth1().scale(160).translate([VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + 10]),
    [],
  );
  const pathGenerator = useMemo(() => geoPath(projection), [projection]);
  const route = useMemo(() => buildRouteData(), []);
  const selectedCountry = journeyCountries.find((country) => country.slug === selectedSlug) ?? null;

  return (
    <section className={styles.section} aria-label="World journey map, static view">
      <div className={styles.header}>
        <div>
          <Eyebrow>The world became the road</Eyebrow>
          <h2 className={styles.headline}>Five legs, twenty-three countries.</h2>
        </div>
        <MapModeControls mode={mode} onChange={setMode} />
      </div>

      <div className={styles.mapFrame}>
        {world ? (
          <svg
            className={styles.svg}
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            role="img"
            aria-label="Map showing Ranjith's complete cycling route across 23 countries"
          >
            <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} className={styles.sea} />
            {world.features.map((featureItem, index) => (
              <path key={index} d={pathGenerator(featureItem) ?? undefined} className={styles.land} />
            ))}
            <path
              d={pathGenerator(route.mainLine) ?? undefined}
              className={styles.routeLine}
              style={{ opacity: mode === "route" ? 1 : 0.28 }}
            />
            {route.crossingLines.map((line, index) => (
              <path key={index} d={pathGenerator(line) ?? undefined} className={styles.crossingLine} />
            ))}
            <path d={pathGenerator(route.unfinishedLine) ?? undefined} className={styles.unfinishedLine} />
          </svg>
        ) : (
          <div className={styles.placeholder}>Loading the journey map…</div>
        )}

        <div className={styles.markerOverlay}>
          {journeyCountries.map((country) => {
            const projected = projection(country.displayAnchor);
            if (!projected) return null;
            const [x, y] = [(projected[0] / VIEW_WIDTH) * 100, (projected[1] / VIEW_HEIGHT) * 100];
            const showRing = mode === "kindness" && kindnessCountrySlugs.includes(country.slug);
            const showDiamond = mode === "challenge" && challengeCountrySlugs.includes(country.slug);
            return (
              <CountryMarker
                key={country.slug}
                name={country.name}
                x={x}
                y={y}
                mode={mode}
                completed
                selected={selectedSlug === country.slug}
                showRing={showRing}
                showDiamond={showDiamond}
                onSelect={() => setSelectedSlug((current) => (current === country.slug ? null : country.slug))}
              />
            );
          })}
        </div>
      </div>

      <div className={styles.sidebar}>
        <div aria-live="polite">{selectedCountry ? <JourneyChapterPanel country={selectedCountry} /> : null}</div>

        <details className={styles.countryList}>
          <summary className={styles.countryListSummary}>All 23 countries</summary>
          <ol className={styles.countryListItems}>
            {journeyCountries.map((country) => (
              <li key={country.slug}>
                <Link href={`/journey/${country.slug}`}>
                  {country.order}. {country.name}
                </Link>
              </li>
            ))}
          </ol>
        </details>

        <ul className={styles.legList}>
          {atlasChapters.map((chapter) => (
            <li key={chapter.id}>
              <span className={styles.legName}>{chapter.label}</span>
              <span className={styles.legMeaning}>{chapter.meaning}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
