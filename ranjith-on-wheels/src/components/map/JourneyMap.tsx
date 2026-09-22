"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { geoNaturalEarth1, geoPath, type GeoProjection } from "d3-geo";
import type { FeatureCollection } from "geojson";
import { loadWorldFeatures } from "@/lib/map";
import { findCountryFeature } from "@/lib/countryShape";
import { journeyCountries } from "@/content/journey";
import { kindnessCountrySlugs, challengeCountrySlugs } from "@/content/atlas";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./JourneyMap.module.css";

const VIEW_WIDTH = 960;
const VIEW_HEIGHT = 500;

type Mode = "route" | "people" | "challenge";

// CLAUDE.md §0 decision #18: the owner's reference images are a plain
// whole-world view — every visited country filled solid red, no
// connecting line, no camera movement. Decision #24 corrected a regression
// from that: every visited country is always red, all at once, not gated
// behind stepping through the Next/Previous browser — Next/Previous and the
// country list only move which country's panel and marker are focused, they
// never change which countries are coloured. The reached paths fade in
// together, once, when the map first scrolls into view.
export function JourneyMap() {
  const [world, setWorld] = useState<FeatureCollection | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("route");

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

  const journeyFeatures = useMemo(() => {
    if (!world) return null;
    return journeyCountries.map((country) => findCountryFeature(world, country.slug));
  }, [world]);

  const lastIndex = journeyCountries.length - 1;

  const activeCountry = journeyCountries[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(Math.max(0, Math.min(lastIndex, index)));
    },
    [lastIndex],
  );

  const activePoint = projection(activeCountry.displayAnchor);

  return (
    <section className={styles.section} id="journey-map">
      <div className={styles.header}>
        <div>
          <Eyebrow>The world became the road</Eyebrow>
          <h2 className={styles.headline}>Blue is the world. Red is the journey.</h2>
        </div>
        <div className={styles.modeSwitch} role="radiogroup" aria-label="Map mode">
          {(["route", "people", "challenge"] as Mode[]).map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={mode === option}
              className={`${styles.modeButton} ${mode === option ? styles.modeButtonActive : ""}`}
              onClick={() => setMode(option)}
            >
              {option === "route" ? "Route" : option === "people" ? "People" : "Challenge"}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.frame}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          role="img"
          aria-label={`World map with all ${journeyCountries.length} journey countries highlighted, currently on ${activeCountry.name}`}
        >
          <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} className={styles.ocean} />

          {world?.features.map((featureItem, index) => (
            <path key={index} d={pathGenerator(featureItem) ?? undefined} className={styles.land} />
          ))}

          {/* Every visited country is red, all at once (CLAUDE.md §0 decision
              #18, corrected by #24) — this group only fades in together, once,
              as the map scrolls into view; it never gates which countries are
              coloured by how far the visitor has stepped through the browser
              below. */}
          <g className="fade">
            {journeyFeatures &&
              journeyCountries.map((country, index) => {
                const featureShape = journeyFeatures[index];
                if (!featureShape) return null;
                return (
                  <path
                    key={country.slug}
                    d={pathGenerator(featureShape) ?? undefined}
                    className={`${styles.journeyCountry} ${styles.reached} ${index === activeIndex ? styles.active : ""}`}
                  />
                );
              })}
          </g>

          {/* index !== activeIndex: the active marker below already paints
              over anything at the same point, so a country that's both
              active and flagged for this mode would otherwise hide its own
              mode dot underneath a bigger ivory circle. */}
          {mode === "people" &&
            journeyCountries.map((country, index) => {
              if (index === activeIndex || !kindnessCountrySlugs.includes(country.slug)) return null;
              const point = projection(country.displayAnchor);
              if (!point) return null;
              return <circle key={country.slug} cx={point[0]} cy={point[1]} r={4} className={styles.peopleDot} />;
            })}

          {mode === "challenge" &&
            journeyCountries.map((country, index) => {
              if (index === activeIndex || !challengeCountrySlugs.includes(country.slug)) return null;
              const point = projection(country.displayAnchor);
              if (!point) return null;
              return (
                <circle key={country.slug} cx={point[0]} cy={point[1]} r={4.5} className={styles.challengeDot} />
              );
            })}

          {activePoint ? (
            <g>
              <circle cx={activePoint[0]} cy={activePoint[1]} r={4} className={styles.activeMarker} />
              <text x={activePoint[0]} y={activePoint[1] - 8} className={styles.activeLabel}>
                {activeCountry.name}
              </text>
            </g>
          ) : null}
        </svg>
      </div>

      {/* Below the map, not on top of it — no glass overlay any more. */}
      <div className={styles.panel}>
        <span className={styles.panelOrder}>
          Country {activeCountry.order} of {journeyCountries.length}
        </span>
        <h3 className={styles.panelName}>{activeCountry.name}</h3>
        {activeCountry.summary ? <p className={styles.panelSummary}>{activeCountry.summary}</p> : null}
        <div className={styles.panelActions}>
          <button
            type="button"
            className={styles.stepButton}
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
          >
            Previous
          </button>
          <button
            type="button"
            className={styles.stepButton}
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === journeyCountries.length - 1}
          >
            Next country
          </button>
          <ButtonLink href={`/journey/${activeCountry.slug}`} variant="route">
            Open story
          </ButtonLink>
        </div>

        {/* CLAUDE.md §10: a real, visually-ordered list of all 23
            countries — keyboard and screen-reader navigation that never
            depends on interacting with the map graphic at all. */}
        <details className={styles.countryList}>
          <summary className={styles.countryListSummary}>All {journeyCountries.length} countries</summary>
          <ol className={styles.countryListItems}>
            {journeyCountries.map((country, index) => (
              <li key={country.slug}>
                <button
                  type="button"
                  className={index === activeIndex ? styles.countryListActive : ""}
                  onClick={() => goTo(index)}
                >
                  {country.order}. {country.name}
                </button>
              </li>
            ))}
          </ol>
        </details>
        <Link href={`/journey/${activeCountry.slug}`} className={styles.fullChapterLink}>
          Read the full chapter
        </Link>
      </div>
    </section>
  );
}
