"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoPath } from "d3-geo";
import type { FeatureCollection } from "geojson";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { motion as motionConfig } from "@/lib/motion";
import {
  CHAPTER_PROGRESS,
  MAP_WIDTH,
  MAP_HEIGHT,
  buildRouteGeometry,
  createProjection,
  declutterPoints,
  loadWorldFeatures,
} from "@/lib/map";
import { journeyCountries, type JourneyChapter } from "@/content/journey";
import { atlasChapters, kindnessCountrySlugs, challengeCountrySlugs, type MapMode } from "@/content/atlas";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CountryMarker } from "./CountryMarker";
import { MapModeControls } from "./MapModeControls";
import { JourneyChapterPanel } from "@/components/home/JourneyChapterPanel";
import styles from "./WorldJourneyMap.module.css";

type ChapterId = keyof typeof CHAPTER_PROGRESS;
const CHAPTER_ORDER = Object.keys(CHAPTER_PROGRESS) as ChapterId[];

type CameraTarget = { scale: number; originXPercent: number; originYPercent: number };

function computeCameraTargets(countryPixel: Record<string, [number, number]>) {
  const byChapter = new Map<JourneyChapter, [number, number][]>();
  journeyCountries.forEach((country) => {
    const point = countryPixel[country.slug];
    if (!point) return;
    const list = byChapter.get(country.chapter) ?? [];
    list.push(point);
    byChapter.set(country.chapter, list);
  });

  const targets: Record<ChapterId, CameraTarget> = {
    india: { scale: 1, originXPercent: 50, originYPercent: 50 },
    "southeast-asia": { scale: 1, originXPercent: 50, originYPercent: 50 },
    "east-asia": { scale: 1, originXPercent: 50, originYPercent: 50 },
    australia: { scale: 1, originXPercent: 50, originYPercent: 50 },
    europe: { scale: 1, originXPercent: 50, originYPercent: 50 },
    complete: { scale: 1, originXPercent: 50, originYPercent: 50 },
  };

  byChapter.forEach((points, chapter) => {
    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const spanX = Math.max(maxX - minX, 90);
    const spanY = Math.max(maxY - minY, 90);
    const scale = Math.min(1.2, Math.max(1.0, Math.min(MAP_WIDTH / (spanX * 3), MAP_HEIGHT / (spanY * 3))));
    targets[chapter as ChapterId] = {
      scale,
      originXPercent: ((minX + maxX) / 2 / MAP_WIDTH) * 100,
      originYPercent: ((minY + maxY) / 2 / MAP_HEIGHT) * 100,
    };
  });

  return targets;
}

function interpolateCamera(progress: number, targets: Record<ChapterId, CameraTarget>): CameraTarget {
  for (let i = 0; i < CHAPTER_ORDER.length - 1; i += 1) {
    const idA = CHAPTER_ORDER[i];
    const idB = CHAPTER_ORDER[i + 1];
    const pA = CHAPTER_PROGRESS[idA];
    const pB = CHAPTER_PROGRESS[idB];
    if (progress >= pA && progress <= pB) {
      const t = pB === pA ? 0 : (progress - pA) / (pB - pA);
      const a = targets[idA];
      const b = targets[idB];
      return {
        scale: a.scale + (b.scale - a.scale) * t,
        originXPercent: a.originXPercent + (b.originXPercent - a.originXPercent) * t,
        originYPercent: a.originYPercent + (b.originYPercent - a.originYPercent) * t,
      };
    }
  }
  return targets.complete;
}

function chapterAtProgress(progress: number): ChapterId {
  let current: ChapterId = "india";
  for (const id of CHAPTER_ORDER) {
    if (progress >= CHAPTER_PROGRESS[id]) current = id;
  }
  return current;
}

function chapterEndProgress(chapter: JourneyChapter): number {
  const idx = CHAPTER_ORDER.indexOf(chapter);
  const nextId = CHAPTER_ORDER[idx + 1] ?? "complete";
  return CHAPTER_PROGRESS[nextId];
}

export function WorldJourneyMap() {
  const [world, setWorld] = useState<FeatureCollection | null>(null);
  const [mode, setMode] = useState<MapMode>("route");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [activeChapter, setActiveChapter] = useState<ChapterId>("india");
  const reducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const matchMediaRef = useRef<gsap.MatchMedia | null>(null);
  const travelMarkerRef = useRef<SVGCircleElement>(null);
  const liveRegionRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    loadWorldFeatures().then((features) => {
      if (!cancelled) setWorld(features);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const projection = useMemo(() => createProjection(), []);
  const pathGenerator = useMemo(() => geoPath(projection), [projection]);
  const route = useMemo(() => buildRouteGeometry(projection), [projection]);

  const countryPixel = useMemo(() => {
    const positions: Record<string, [number, number]> = {};
    route.checkpoints.forEach((checkpoint) => {
      positions[checkpoint.slug] = checkpoint.point;
    });
    return positions;
  }, [route]);

  const checkpointFraction = useMemo(() => {
    const fractions: Record<string, number> = {};
    route.checkpoints.forEach((checkpoint) => {
      fractions[checkpoint.slug] = checkpoint.fraction;
    });
    return fractions;
  }, [route]);

  const cameraTargets = useMemo(() => computeCameraTargets(countryPixel), [countryPixel]);
  const markerPositions = useMemo(() => declutterPoints(countryPixel, 40, 8), [countryPixel]);

  const applyProgress = useRef<(progress: number) => void>(() => {});

  useGSAP(
    () => {
      registerGsap();
      const path = pathRef.current;
      if (!path || !stageRef.current) return;

      const totalLength = path.getTotalLength();

      const setProgress = (progress: number, announce: boolean) => {
        progressRef.current = progress;
        gsap.set(path, { strokeDashoffset: totalLength * (1 - progress) });

        const point = path.getPointAtLength(totalLength * progress);
        gsap.set(travelMarkerRef.current, { attr: { cx: point.x, cy: point.y } });

        const camera = interpolateCamera(progress, cameraTargets);
        gsap.set(stageRef.current, {
          scale: camera.scale,
          transformOrigin: `${camera.originXPercent}% ${camera.originYPercent}%`,
        });

        const chapter = chapterAtProgress(progress);
        if (announce) {
          setActiveChapter((previous) => (previous === chapter ? previous : chapter));
        }
      };

      applyProgress.current = (progress: number) => setProgress(progress, true);

      // Some hydration paths re-run this effect (false, then the real value)
      // without invoking the previous run's cleanup, leaving a prior
      // ScrollTrigger alive to fire onUpdate later and overwrite this run's
      // state. Revert any matchMedia/ScrollTrigger this component owns by
      // reference before establishing new state.
      matchMediaRef.current?.revert();
      matchMediaRef.current = null;

      gsap.set(path, { strokeDasharray: totalLength });

      if (reducedMotion) {
        setProgress(1, true);
        return;
      }

      setProgress(0, false);

      const mm = gsap.matchMedia();
      matchMediaRef.current = mm;

      mm.add("(min-width: 1024px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => setProgress(self.progress, true),
        });

        return () => trigger.kill();
      });

      return () => mm.revert();
    },
    { dependencies: [world, route, cameraTargets, reducedMotion], scope: sectionRef },
  );

  const goToChapter = (chapter: JourneyChapter) => {
    const target = chapterEndProgress(chapter);
    if (reducedMotion) {
      applyProgress.current(target);
      return;
    }
    gsap.to(progressRef, {
      current: target,
      duration: 0.8,
      ease: motionConfig.ease.travel,
      onUpdate: () => applyProgress.current(progressRef.current),
    });
  };

  const activeChapterMeta = atlasChapters.find((chapter) => chapter.id === activeChapter);
  const selectedCountry = journeyCountries.find((country) => country.slug === selectedSlug) ?? null;

  return (
    <section className={styles.pinSection} id="journey-atlas" ref={sectionRef}>
      <div className={styles.header}>
        <div>
          <Eyebrow>The world became the road</Eyebrow>
          <h2 className={styles.headline}>Five chapters, twenty-three countries.</h2>
        </div>
        <MapModeControls mode={mode} onChange={setMode} />
      </div>

      {world ? (
        <div className={styles.layout}>
          <div className={styles.stageWrap}>
            <div className={styles.stage} ref={stageRef}>
              <svg
                className={styles.svg}
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label="World map showing Ranjith's cycling route across 23 countries"
              >
                <g>
                  {world.features.map((featureItem, index) => (
                    <path
                      key={index}
                      d={pathGenerator(featureItem) ?? undefined}
                      className={styles.land}
                    />
                  ))}
                </g>
                <path
                  ref={pathRef}
                  d={route.d}
                  className={styles.routePath}
                  style={{ opacity: mode === "route" ? 1 : 0.28 }}
                />
                <circle ref={travelMarkerRef} cx="0" cy="0" r="5" className={styles.travelMarker} />
              </svg>
              <div className={styles.markerOverlay}>
                {journeyCountries.map((country) => {
                  const point = markerPositions[country.slug];
                  if (!point) return null;
                  const completed = (checkpointFraction[country.slug] ?? 0) <= CHAPTER_PROGRESS[activeChapter];
                  const showRing = mode === "kindness" && kindnessCountrySlugs.includes(country.slug);
                  const showDiamond = mode === "challenge" && challengeCountrySlugs.includes(country.slug);
                  return (
                    <CountryMarker
                      key={country.slug}
                      name={country.name}
                      x={(point[0] / MAP_WIDTH) * 100}
                      y={(point[1] / MAP_HEIGHT) * 100}
                      mode={mode}
                      completed={completed}
                      selected={selectedSlug === country.slug}
                      showRing={showRing}
                      showDiamond={showDiamond}
                      onSelect={() =>
                        setSelectedSlug((current) => (current === country.slug ? null : country.slug))
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div>
              <span className={styles.chapterLabel}>
                {activeChapter === "complete"
                  ? "Journey complete"
                  : `Chapter — ${activeChapterMeta?.label}`}
              </span>
              {activeChapterMeta ? (
                <p className={styles.chapterMeaning}>{activeChapterMeta.meaning}</p>
              ) : null}
            </div>

            {selectedCountry ? <JourneyChapterPanel country={selectedCountry} /> : null}

            <div className={styles.mobileChapters}>
              {atlasChapters.map((chapter) => (
                <button
                  key={chapter.id}
                  type="button"
                  className={`${styles.chapterButton} ${
                    activeChapter === chapter.id ? styles.chapterButtonActive : ""
                  }`}
                  onClick={() => goToChapter(chapter.id)}
                >
                  {chapter.label}
                </button>
              ))}
            </div>

            <p aria-live="polite" ref={liveRegionRef} className="sr-only">
              {activeChapterMeta
                ? `Now viewing ${activeChapterMeta.label}: ${activeChapterMeta.meaning}`
                : "Journey complete"}
            </p>

            <ol className="sr-only">
              {journeyCountries.map((country) => (
                <li key={country.slug}>{country.name}</li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        <div className={styles.placeholder}>Loading the journey map…</div>
      )}
    </section>
  );
}
