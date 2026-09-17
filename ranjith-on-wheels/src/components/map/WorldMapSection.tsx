"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { CHAPTER_PROGRESS, chapterAtProgress } from "@/lib/map";
import { journeyCountries } from "@/content/journey";
import { atlasChapters, kindnessCountrySlugs, challengeCountrySlugs, type MapMode } from "@/content/atlas";
import type { LegId } from "@/content/legs";
import { useMapController } from "./MapProvider";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CountryMarker } from "./CountryMarker";
import { MapModeControls } from "./MapModeControls";
import { JourneyChapterPanel } from "@/components/home/JourneyChapterPanel";
import styles from "./WorldMapSection.module.css";

const LEG_ORDER = Object.keys(CHAPTER_PROGRESS) as (LegId | "complete")[];

export function WorldMapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { mapRef, ready, state, requestMount, requestLeg, selectCountry } = useMapController();
  const reducedMotion = useReducedMotion();

  const [mode, setMode] = useState<MapMode>("route");
  const [isActive, setIsActive] = useState(false);
  const [markerPixels, setMarkerPixels] = useState<Record<string, [number, number]>>({});
  // Tracks raw scroll progress through the five legs, independent of
  // whether the camera has actually finished flying/settling there yet —
  // "which markers count as completed" and the sidebar heading should
  // follow the scrollbar immediately, not wait out a 2.2s flight.
  const [progressLeg, setProgressLeg] = useState<LegId | "complete">("india");
  const liveRegionRef = useRef<HTMLParagraphElement>(null);
  const announcedLegRef = useRef<LegId | "complete" | null>(null);

  const selectedSlug = state.kind === "reading" ? state.countryId ?? null : null;
  const activeLegMeta = atlasChapters.find((chapter) => chapter.id === progressLeg);

  // The map is lazy-mounted from Origin's own proximity check, but a visitor
  // could in principle land scrolled straight into this section (e.g. a
  // deep link to #journey-atlas) before that ever fires.
  useEffect(() => {
    requestMount();
  }, [requestMount]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    let frame: number | null = null;
    const updatePositions = () => {
      frame = null;
      // CountryMarker positions itself with left/top percentages, so pixel
      // coordinates from map.project() need converting against the map's
      // own current box — not window size, which can differ once this
      // section stops filling the full viewport (e.g. tablet layouts).
      const container = map.getContainer();
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      const positions: Record<string, [number, number]> = {};
      journeyCountries.forEach((country) => {
        const point = map.project(country.displayAnchor);
        positions[country.slug] = [(point.x / width) * 100, (point.y / height) * 100];
      });
      setMarkerPixels(positions);
    };
    const scheduleUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(updatePositions);
    };

    updatePositions();
    map.on("move", scheduleUpdate);
    map.on("resize", scheduleUpdate);
    return () => {
      map.off("move", scheduleUpdate);
      map.off("resize", scheduleUpdate);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [mapRef, ready]);

  // Only announce a chapter change at the boundary, not on every scroll
  // frame — the map's own onUpdate fires continuously while pinned.
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

  useGSAP(
    () => {
      registerGsap();
      if (reducedMotion) {
        setProgressLeg("complete");
        requestLeg("europe");
        return;
      }

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onEnter: () => setIsActive(true),
          onEnterBack: () => setIsActive(true),
          onLeave: () => setIsActive(false),
          onLeaveBack: () => setIsActive(false),
          onUpdate: (self) => {
            const chapter = chapterAtProgress(self.progress);
            setProgressLeg(chapter);
            requestLeg(chapter === "complete" ? "europe" : chapter);
          },
        });
        return () => trigger.kill();
      });

      return () => mm.revert();
    },
    { dependencies: [reducedMotion], scope: sectionRef },
  );

  const goToLeg = useCallback(
    (legId: LegId) => {
      setIsActive(true);
      setProgressLeg(legId);
      requestLeg(legId);
    },
    [requestLeg],
  );

  const showOverlay = isActive || reducedMotion;

  return (
    <section className={styles.pinSection} id="journey-atlas" ref={sectionRef}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headlineGroup}>
            <Eyebrow>The world became the road</Eyebrow>
            <h2 className={styles.headline}>Five legs, twenty-three countries.</h2>
          </div>
          <MapModeControls mode={mode} onChange={setMode} />
        </div>

        <div className={styles.sidebar}>
          <div>
            <span className={styles.chapterLabel}>
              {progressLeg === "complete" ? "Journey complete" : `Leg — ${activeLegMeta?.label}`}
            </span>
            {activeLegMeta ? <p className={styles.chapterMeaning}>{activeLegMeta.meaning}</p> : null}
          </div>

          <div aria-live="polite">
            {selectedSlug ? (
              <JourneyChapterPanel
                country={journeyCountries.find((country) => country.slug === selectedSlug)!}
              />
            ) : null}
          </div>

          <div className={styles.mobileChapters}>
            {atlasChapters.map((chapter) => (
              <button
                key={chapter.id}
                type="button"
                className={`${styles.chapterButton} ${
                  progressLeg === chapter.id ? styles.chapterButtonActive : ""
                }`}
                onClick={() => goToLeg(chapter.id as LegId)}
              >
                {chapter.label}
              </button>
            ))}
          </div>

          <p aria-live="polite" ref={liveRegionRef} className="sr-only" />

          {/* CLAUDE.md §10: a real, visually-ordered list of all 23
              countries — keyboard and screen-reader navigation that never
              depends on interacting with the map canvas at all. */}
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

      {showOverlay ? (
        <div className={styles.markerOverlay} aria-hidden="true">
          {journeyCountries.map((country) => {
            const point = markerPixels[country.slug];
            if (!point) return null;
            const completed = LEG_ORDER.indexOf(country.chapter) <= LEG_ORDER.indexOf(progressLeg);
            const showRing = mode === "kindness" && kindnessCountrySlugs.includes(country.slug);
            const showDiamond = mode === "challenge" && challengeCountrySlugs.includes(country.slug);
            return (
              <CountryMarker
                key={country.slug}
                name={country.name}
                x={point[0]}
                y={point[1]}
                mode={mode}
                completed={completed}
                selected={selectedSlug === country.slug}
                showRing={showRing}
                showDiamond={showDiamond}
                onSelect={() => selectCountry(country.chapter, country.slug)}
              />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
