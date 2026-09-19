"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { site } from "@/content/site";
import { journeyCountries } from "@/content/journey";
import styles from "./TravelMap.module.css";

const REVEAL_DELAY_MS = 2000;
const REVEAL_DURATION_S = 1.6;
const ENTRANCE_DURATION_S = 0.9;

// OWNER-directed replacement for the illustrated SVG route map: two
// full-world raster images (a plain blue map and the same map with visited
// countries pre-highlighted red) that cross-reveal on scroll, rather than
// per-country markers driven by real geo data. See the written report
// after this change for two real issues found in the supplied images
// (a projection/scale mismatch between the two files, and a couple of
// countries colored in the highlighted image that aren't part of the real
// 23-country list) — flagged, not silently fixed by substituting content.
export function TravelMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const [highlightLoaded, setHighlightLoaded] = useState(false);
  const [entered, setEntered] = useState(false);
  const revealStartedRef = useRef(false);

  // Fires once, whenever the section crosses ~35% visible — including on a
  // direct page load that lands already inside the viewport, since
  // IntersectionObserver reports its initial state as soon as it starts
  // observing, not only on a later crossing.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // The 2s pause + reveal only starts once BOTH the section has been
  // scrolled to AND the highlighted image has actually finished decoding —
  // whichever happens last — so a slow network can never produce a blank
  // flash where the clip-path has opened but there's nothing to show yet.
  useEffect(() => {
    if (!entered || !highlightLoaded || revealStartedRef.current) return;
    revealStartedRef.current = true;

    const highlight = highlightRef.current;
    if (!highlight) return;

    if (reducedMotion) {
      gsap.set(highlight, { clipPath: "inset(0 0% 0 0)", opacity: 1 });
      return;
    }

    const timer = setTimeout(() => {
      gsap.to(highlight, {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        duration: REVEAL_DURATION_S,
        ease: ease.reveal,
      });
    }, REVEAL_DELAY_MS);

    return () => clearTimeout(timer);
  }, [entered, highlightLoaded, reducedMotion]);

  useGSAP(
    () => {
      registerGsap();
      const frame = frameRef.current;
      const highlight = highlightRef.current;
      if (!frame || !highlight) return;

      if (reducedMotion) {
        gsap.set(frame, { opacity: 1, y: 0, scale: 1 });
        gsap.set(highlight, { clipPath: "inset(0 0% 0 0)", opacity: 1 });
        return;
      }

      gsap.set(highlight, { clipPath: "inset(0 100% 0 0)", opacity: 0 });

      if (!entered) {
        gsap.set(frame, { opacity: 0, y: 35, scale: 0.985 });
        return;
      }

      gsap.to(frame, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ENTRANCE_DURATION_S,
        ease: ease.reveal,
      });
    },
    { dependencies: [entered, reducedMotion], scope: sectionRef },
  );

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.header}>
        <Eyebrow>The world became the road</Eyebrow>
        <h2 className={styles.headline}>Five legs, twenty-three countries.</h2>
      </div>

      <div className={styles.inner}>
        <div className={styles.frame} ref={frameRef}>
          <Image
            src="/media/map/travel-map-blue.png"
            alt="World map showing countries visited during the journey"
            fill
            sizes="(max-width: 1024px) 94vw, 1650px"
            className={styles.base}
            priority={false}
          />
          <div className={styles.highlightWrap} ref={highlightRef}>
            <Image
              src="/media/map/travel-map-highlighted.png"
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 1024px) 94vw, 1650px"
              className={styles.highlight}
              onLoad={() => setHighlightLoaded(true)}
            />
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div>
          <span className={styles.statValue}>{site.countryCount}</span>
          <span className={styles.statLabel}>Countries</span>
        </div>
        <div>
          <span className={styles.statValue}>{site.distanceKm.toLocaleString()}+</span>
          <span className={styles.statLabel}>Kilometres</span>
        </div>
        <div>
          <span className={styles.statValue}>One</span>
          <span className={styles.statLabel}>Journey</span>
        </div>
      </div>

      <details className={styles.countryList}>
        <summary className={styles.countryListSummary}>All {site.countryCount} countries</summary>
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
    </section>
  );
}
