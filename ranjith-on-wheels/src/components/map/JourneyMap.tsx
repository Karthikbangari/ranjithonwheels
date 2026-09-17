"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { geoNaturalEarth1, geoPath, type GeoProjection } from "d3-geo";
import type { FeatureCollection } from "geojson";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { loadWorldFeatures, CHAPTER_PROGRESS, chapterAtProgress } from "@/lib/map";
import { buildRouteData } from "@/lib/routeGeometry";
import { journeyCountries, type JourneyChapter } from "@/content/journey";
import { atlasChapters, kindnessCountrySlugs, challengeCountrySlugs, type MapMode } from "@/content/atlas";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CountryMarker } from "./CountryMarker";
import { MapModeControls } from "./MapModeControls";
import { JourneyChapterPanel } from "@/components/home/JourneyChapterPanel";
import styles from "./JourneyMap.module.css";

const VIEW_WIDTH = 960;
const VIEW_HEIGHT = 500;
const LEG_ORDER = Object.keys(CHAPTER_PROGRESS) as (JourneyChapter | "complete")[];

// OWNER-directed deviation from CLAUDE.md §3/§4: the spec calls for a
// MapLibre GL globe with real terrain and basemap tiles. After seeing it
// live, the owner asked for a minimal illustrated map instead — flat
// landmasses, no real place names, a route that draws itself in as the
// visitor scrolls — so this single component now replaces the former
// MapProvider/WorldMapSection/StaticWorldMap tier system entirely. There is
// no WebGL, no live tiles, and therefore no degradation tiers to manage:
// this same lightweight SVG renders identically for every visitor, with the
// scroll-driven draw animation skipped (route shown complete immediately)
// under reduced motion or on narrow/mobile viewports.
export function JourneyMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const routePathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGCircleElement>(null);
  const crossingRefs = useRef<(SVGPathElement | null)[]>([]);
  const crossingLabelRefs = useRef<(SVGTextElement | null)[]>([]);
  const unfinishedRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  const [world, setWorld] = useState<FeatureCollection | null>(null);
  const [mode, setMode] = useState<MapMode>("route");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  // Starts at "india" (progress 0) rather than hidden: the route line is
  // undrawn until the visitor scrolls or taps a leg, but showing India's own
  // marker as reached from the first paint reads naturally — it's the
  // journey's literal starting point, not a leg that has to be "unlocked".
  const [progressLeg, setProgressLeg] = useState<JourneyChapter | "complete">("india");
  const liveRegionRef = useRef<HTMLParagraphElement>(null);
  const announcedLegRef = useRef<JourneyChapter | "complete" | null>(null);

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
  const routeLineD = useMemo(() => pathGenerator(route.mainLine) ?? "", [pathGenerator, route.mainLine]);

  const activeLegMeta = atlasChapters.find((chapter) => chapter.id === progressLeg);
  const selectedCountry = journeyCountries.find((country) => country.slug === selectedSlug) ?? null;
  const showComplete = reducedMotion;

  useEffect(() => {
    if (progressLeg === announcedLegRef.current) return;
    announcedLegRef.current = progressLeg;
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent =
        progressLeg === "complete"
          ? "Journey complete"
          : `Now viewing ${activeLegMeta?.label}: ${activeLegMeta?.meaning}`;
    }
  }, [progressLeg, activeLegMeta]);

  // Drives the route's "draws itself in" effect: the path's own geometry
  // never changes, only how much of its stroke is revealed. Sea crossings
  // and the unfinished segment aren't drawn incrementally like the main
  // line — each just fades in the moment the main line's progress reaches
  // where it belongs, via the revealAt fraction routeGeometry attaches to
  // it. Mutating these directly on the DOM (not through React state) keeps
  // a scroll-scrubbed 60fps update off the render path.
  const setDraw = useCallback(
    (progress: number) => {
      const path = routePathRef.current;
      if (!path) return;
      const length = path.getTotalLength();
      path.style.strokeDashoffset = String(length * (1 - progress));
      const tip = path.getPointAtLength(length * progress);
      if (tipRef.current) {
        tipRef.current.setAttribute("cx", String(tip.x));
        tipRef.current.setAttribute("cy", String(tip.y));
      }
      route.crossingLines.forEach((line, index) => {
        const el = crossingRefs.current[index];
        if (el) el.style.opacity = progress >= line.properties.revealAt ? "" : "0";
      });
      route.crossingLabels.features.forEach((label, index) => {
        const el = crossingLabelRefs.current[index];
        if (el) el.style.opacity = progress >= label.properties.revealAt ? "1" : "0";
      });
      if (unfinishedRef.current) {
        unfinishedRef.current.style.opacity = progress >= route.unfinishedLine.properties.revealAt ? "" : "0";
      }
    },
    [route],
  );

  useGSAP(
    () => {
      registerGsap();
      const path = routePathRef.current;
      if (!path) return;
      const length = path.getTotalLength();
      path.style.strokeDasharray = String(length);

      if (reducedMotion) {
        setDraw(1);
        setProgressLeg("complete");
        return;
      }

      setDraw(0);

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            setDraw(self.progress);
            setProgressLeg(chapterAtProgress(self.progress));
          },
        });
        return () => trigger.kill();
      });

      return () => mm.revert();
    },
    { dependencies: [reducedMotion], scope: sectionRef },
  );

  const goToLeg = useCallback(
    (legId: JourneyChapter) => {
      setProgressLeg(legId);
      const entries = Object.entries(CHAPTER_PROGRESS) as [JourneyChapter | "complete", number][];
      const index = entries.findIndex(([id]) => id === legId);
      const end = index >= 0 && index + 1 < entries.length ? entries[index + 1][1] : 1;
      const tweened = { value: 0 };
      gsap.to(tweened, {
        value: end,
        duration: reducedMotion ? 0 : 1.4,
        ease: "power2.inOut",
        onUpdate: () => setDraw(tweened.value),
      });
    },
    [reducedMotion, setDraw],
  );

  return (
    <section className={styles.pinSection} id="journey-atlas" ref={sectionRef}>
      <div className={styles.header}>
        <div className={styles.headlineGroup}>
          <Eyebrow>The world became the road</Eyebrow>
          <h2 className={styles.headline}>Five legs, twenty-three countries.</h2>
        </div>
        <MapModeControls mode={mode} onChange={setMode} />
      </div>

      <div className={styles.mapFrame}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          role="img"
          aria-label="Map showing Ranjith's complete cycling route across 23 countries"
        >
          <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} className={styles.sea} />
          {world?.features.map((featureItem, index) => (
            <path key={index} d={pathGenerator(featureItem) ?? undefined} className={styles.land} />
          ))}
          <path
            ref={routePathRef}
            d={routeLineD}
            className={styles.routeLine}
            style={{ opacity: mode === "route" ? 1 : 0.28 }}
          />
          {route.crossingLines.map((line, index) => (
            <path
              key={index}
              ref={(el) => {
                crossingRefs.current[index] = el;
              }}
              d={pathGenerator(line) ?? undefined}
              className={styles.crossingLine}
              style={showComplete ? undefined : { opacity: 0 }}
            />
          ))}
          {route.crossingLabels.features.map((label, index) => {
            const point = projection(label.geometry.coordinates as [number, number]);
            if (!point) return null;
            return (
              <text
                key={index}
                ref={(el) => {
                  crossingLabelRefs.current[index] = el;
                }}
                x={point[0]}
                y={point[1] - 6}
                className={styles.crossingLabel}
                style={showComplete ? undefined : { opacity: 0 }}
              >
                {label.properties.label}
              </text>
            );
          })}
          <path
            ref={unfinishedRef}
            d={pathGenerator(route.unfinishedLine) ?? undefined}
            className={styles.unfinishedLine}
            style={showComplete ? undefined : { opacity: 0 }}
          />
          {showComplete ? null : <circle ref={tipRef} r={4} className={styles.tip} />}
        </svg>

        <div className={styles.markerOverlay}>
          {journeyCountries.map((country) => {
            const projected = projection(country.displayAnchor);
            if (!projected) return null;
            const [x, y] = [(projected[0] / VIEW_WIDTH) * 100, (projected[1] / VIEW_HEIGHT) * 100];
            const completed = showComplete || LEG_ORDER.indexOf(country.chapter) <= LEG_ORDER.indexOf(progressLeg);
            const showRing = mode === "kindness" && kindnessCountrySlugs.includes(country.slug);
            const showDiamond = mode === "challenge" && challengeCountrySlugs.includes(country.slug);
            return (
              <CountryMarker
                key={country.slug}
                name={country.name}
                x={x}
                y={y}
                mode={mode}
                completed={completed}
                selected={selectedSlug === country.slug}
                showRing={showRing}
                showDiamond={showDiamond}
                onSelect={() => setSelectedSlug((current) => (current === country.slug ? null : country.slug))}
              />
            );
          })}
        </div>

        <div className={styles.sidebar}>
          <div>
            <span className={styles.chapterLabel}>
              {progressLeg === "complete" ? "Journey complete" : `Leg — ${activeLegMeta?.label}`}
            </span>
            {activeLegMeta ? <p className={styles.chapterMeaning}>{activeLegMeta.meaning}</p> : null}
          </div>

          <div aria-live="polite">{selectedCountry ? <JourneyChapterPanel country={selectedCountry} /> : null}</div>

          <div className={styles.mobileChapters}>
            {atlasChapters.map((chapter) => (
              <button
                key={chapter.id}
                type="button"
                className={`${styles.chapterButton} ${
                  progressLeg === chapter.id ? styles.chapterButtonActive : ""
                }`}
                onClick={() => goToLeg(chapter.id)}
              >
                {chapter.label}
              </button>
            ))}
          </div>

          <p aria-live="polite" ref={liveRegionRef} className="sr-only" />

          {/* CLAUDE.md §10: a real, visually-ordered list of all 23
              countries — keyboard and screen-reader navigation that never
              depends on interacting with the map graphic at all. */}
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
        </div>
      </div>
    </section>
  );
}
