"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { geoNaturalEarth1, geoPath, type GeoProjection } from "d3-geo";
import type { FeatureCollection } from "geojson";
import { gsap } from "@/lib/gsap";
import { loadWorldFeatures } from "@/lib/map";
import { findCountryFeature } from "@/lib/countryShape";
import { buildRouteEdges } from "@/lib/journeyRoute";
import { journeyCountries } from "@/content/journey";
import { kindnessCountrySlugs, challengeCountrySlugs } from "@/content/atlas";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./JourneyMap.module.css";

const VIEW_WIDTH = 960;
const VIEW_HEIGHT = 500;
const CAMERA_ZOOM = 3.4;
const GLIDE_DURATION = 0.85;
const RIDE_DURATION = 0.6;

type Mode = "route" | "people" | "challenge";

// CLAUDE.md §0 decision #17 ("The Red Line Across a Blue World" — page 3):
// a real geographic map, not an illustration or a raster reveal, so the
// camera can genuinely glide between real country shapes. Every country
// the journey passes through renders from its real topojson polygon (the
// same 110m dataset CountryTerrainFallback already uses for the per-
// country fallback maps); the rest of the world renders as plain
// unvisited land underneath. Countries fill blue-to-red as the visitor
// reaches them — an ordinal "reached" state driven by which country is
// currently focused, not a live GPS feed.
export function JourneyMap() {
  const reducedMotion = useReducedMotion();
  const [world, setWorld] = useState<FeatureCollection | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("route");
  const cameraRef = useRef<SVGGElement>(null);
  const rideDotRef = useRef<SVGCircleElement>(null);
  const cameraState = useRef({ x: 0, y: 0, scale: 1 });
  const previousIndexRef = useRef(0);

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
  const routeEdges = useMemo(() => buildRouteEdges(), []);

  const journeyFeatures = useMemo(() => {
    if (!world) return null;
    return journeyCountries.map((country) => findCountryFeature(world, country.slug));
  }, [world]);

  const showComplete = reducedMotion;
  const lastIndex = journeyCountries.length - 1;

  // useReducedMotion reads false during SSR/first paint and flips to the
  // real value once hydration checks the media query, so activeIndex's
  // initial 0 needs to jump to the end the moment showComplete becomes
  // true. This is React's own recommended pattern for "adjust state when a
  // prop changes" — setting state directly during render (not inside a
  // useEffect) — specifically because doing it in an effect would run one
  // render late and, worse, trips the set-state-in-effect lint rule for
  // exactly the reason that rule exists: it's synchronous, unconditional
  // setState tied to a value the component doesn't own.
  // previousIndexRef is left at its initial 0 here rather than synced to
  // lastIndex: it only feeds the ride-dot edge animation in goTo, which is
  // already unconditionally skipped whenever showComplete is true, so a
  // stale value here can never produce a visible effect.
  const [syncedForComplete, setSyncedForComplete] = useState(false);
  if (showComplete && !syncedForComplete) {
    setSyncedForComplete(true);
    setActiveIndex(lastIndex);
  }

  const activeCountry = journeyCountries[activeIndex];
  const reachedCount = showComplete ? journeyCountries.length : activeIndex + 1;

  const setCamera = useCallback((x: number, y: number, scale: number) => {
    cameraState.current = { x, y, scale };
    cameraRef.current?.setAttribute("transform", `translate(${x} ${y}) scale(${scale})`);
  }, []);

  // The camera glide: pans/scales one <g> wrapping every path rather than
  // re-deriving the projection, so "gliding" is a single cheap transform
  // tween instead of recomputing geometry every frame.
  const glideTo = useCallback(
    (index: number, instant: boolean) => {
      const country = journeyCountries[index];
      const point = projection(country.displayAnchor);
      if (!point) return;
      const targetX = VIEW_WIDTH / 2 - point[0] * CAMERA_ZOOM;
      const targetY = VIEW_HEIGHT / 2 - point[1] * CAMERA_ZOOM;
      if (instant) {
        setCamera(targetX, targetY, CAMERA_ZOOM);
        return;
      }
      gsap.to(cameraState.current, {
        x: targetX,
        y: targetY,
        scale: CAMERA_ZOOM,
        duration: GLIDE_DURATION,
        ease: "power2.inOut",
        onUpdate: () => {
          const { x, y, scale } = cameraState.current;
          cameraRef.current?.setAttribute("transform", `translate(${x} ${y}) scale(${scale})`);
        },
      });
    },
    [projection, setCamera],
  );

  // Rides a small dot along the edge just reached, once, then lets it fade
  // — the "small red bicycle dot rides this line once, then disappears"
  // beat. Skipped entirely under reduced motion.
  const rideEdge = useCallback(
    (edgeIndex: number) => {
      const edge = routeEdges[edgeIndex];
      const dot = rideDotRef.current;
      if (!edge || !dot || reducedMotion) return;
      gsap.set(dot, { opacity: 1 });
      const progress = { t: 0 };
      gsap.to(progress, {
        t: 1,
        duration: RIDE_DURATION,
        ease: "power1.inOut",
        delay: GLIDE_DURATION * 0.4,
        onUpdate: () => {
          const point = edge[Math.round(progress.t * (edge.length - 1))];
          const projected = projection(point);
          if (projected) {
            dot.setAttribute("cx", String(projected[0]));
            dot.setAttribute("cy", String(projected[1]));
          }
        },
        onComplete: () => {
          gsap.to(dot, { opacity: 0, duration: 0.3 });
        },
      });
    },
    [routeEdges, projection, reducedMotion],
  );

  // World-view entry, then glide to India once — matches the brief's
  // opening beat ("opens at world view; India pulses once in red; camera
  // glides to the active region"). India's own marker plays the pulse via
  // a plain CSS animation with iteration-count 1 (see .pulseMarker), so it
  // needs no state here — it just plays once as soon as that element
  // mounts, which is immediately, before the glide below even starts.
  //
  // Depends on showComplete rather than running once with []: useReducedMotion
  // reads false during SSR/first paint and flips to the real value after
  // hydration checks the media query (the same pattern as elsewhere in this
  // codebase), so an empty deps array would run this effect exactly once
  // with a value that's frequently wrong.
  useEffect(() => {
    gsap.killTweensOf(cameraState.current);
    if (showComplete) {
      glideTo(lastIndex, true);
      return;
    }
    setCamera(0, 0, 1);
    const timer = setTimeout(() => glideTo(0, false), 900);
    return () => clearTimeout(timer);
  }, [showComplete, lastIndex, glideTo, setCamera]);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(journeyCountries.length - 1, index));
      const previous = previousIndexRef.current;
      previousIndexRef.current = clamped;
      setActiveIndex(clamped);
      glideTo(clamped, showComplete);
      if (!showComplete && clamped > previous) {
        for (let edge = previous; edge < clamped; edge += 1) rideEdge(edge);
      }
    },
    [glideTo, rideEdge, showComplete],
  );

  const activePoint = projection(activeCountry.displayAnchor);
  const previousCountry = activeIndex > 0 ? journeyCountries[activeIndex - 1] : null;
  const previousPoint = previousCountry ? projection(previousCountry.displayAnchor) : null;

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
          aria-label={`Map centred on ${activeCountry.name}, showing the journey's route so far`}
        >
          <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} className={styles.ocean} />
          <g ref={cameraRef}>
            {world?.features.map((featureItem, index) => (
              <path key={index} d={pathGenerator(featureItem) ?? undefined} className={styles.land} />
            ))}

            {journeyFeatures &&
              journeyCountries.map((country, index) => {
                const reached = showComplete || index < reachedCount;
                const featureShape = journeyFeatures[index];
                if (!featureShape) return null;
                return (
                  <path
                    key={country.slug}
                    d={pathGenerator(featureShape) ?? undefined}
                    className={`${styles.journeyCountry} ${reached ? styles.reached : ""} ${
                      index === activeIndex ? styles.active : ""
                    }`}
                  />
                );
              })}

            {routeEdges.map((edge, index) => {
              const isReached = showComplete || index < activeIndex;
              const d = pathGenerator({ type: "LineString", coordinates: edge }) ?? undefined;
              return (
                <path
                  key={index}
                  d={d}
                  className={isReached ? styles.routeReached : styles.routeFuture}
                />
              );
            })}

            {/* index !== activeIndex: the active marker below already
                paints over anything at the same point, so a country that's
                both active and flagged for this mode would otherwise hide
                its own mode dot underneath a bigger ivory circle. */}
            {mode === "people" &&
              journeyCountries.map((country, index) => {
                if (index >= reachedCount || index === activeIndex || !kindnessCountrySlugs.includes(country.slug))
                  return null;
                const point = projection(country.displayAnchor);
                if (!point) return null;
                return <circle key={country.slug} cx={point[0]} cy={point[1]} r={4} className={styles.peopleDot} />;
              })}

            {mode === "challenge" &&
              journeyCountries.map((country, index) => {
                if (index >= reachedCount || index === activeIndex || !challengeCountrySlugs.includes(country.slug))
                  return null;
                const point = projection(country.displayAnchor);
                if (!point) return null;
                return (
                  <circle key={country.slug} cx={point[0]} cy={point[1]} r={4.5} className={styles.challengeDot} />
                );
              })}

            <circle ref={rideDotRef} r={3.5} className={styles.rideDot} opacity={0} />

            {previousPoint ? (
              <text x={previousPoint[0]} y={previousPoint[1] - 8} className={styles.fadedLabel}>
                {previousCountry?.name}
              </text>
            ) : null}

            {activePoint ? (
              <g className={activeIndex === 0 ? styles.pulseMarker : ""}>
                <circle cx={activePoint[0]} cy={activePoint[1]} r={5} className={styles.activeMarker} />
                <text x={activePoint[0]} y={activePoint[1] - 10} className={styles.activeLabel}>
                  {activeCountry.name}
                </text>
              </g>
            ) : null}
          </g>
        </svg>

        <div className={styles.panel}>
          <span className={styles.panelOrder}>Country {activeCountry.order} of {journeyCountries.length}</span>
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
      </div>
    </section>
  );
}
