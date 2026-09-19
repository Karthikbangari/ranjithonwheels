"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { ease, dur, stagger } from "@/lib/motion";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LineReveal } from "@/components/motion/LineReveal";
import { CountUp } from "@/components/motion/CountUp";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import styles from "./HeroJourney.module.css";

// Fractional (0-1) control points, resolved to pixel coordinates against the
// hero's real rendered size so the curve is never stretched by the viewBox.
const ROUTE_POINTS = {
  start: { x: 0.58, y: 0.85 },
  c1: { x: 0.66, y: 0.72 },
  c2: { x: 0.7, y: 0.62 },
  mid: { x: 0.76, y: 0.52 },
  c3: { x: 0.9, y: 0.24 },
  end: { x: 0.97, y: 0.15 },
};

function buildRoutePath(width: number, height: number) {
  const p = (point: { x: number; y: number }) => `${point.x * width} ${point.y * height}`;
  return `M ${p(ROUTE_POINTS.start)} C ${p(ROUTE_POINTS.c1)}, ${p(ROUTE_POINTS.c2)}, ${p(ROUTE_POINTS.mid)} S ${p(ROUTE_POINTS.c3)} ${p(ROUTE_POINTS.end)}`;
}

export function HeroJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const wheelRef = useRef<SVGGElement>(null);
  const markerRef = useRef<SVGCircleElement>(null);
  const routeSvgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsap();

      const section = sectionRef.current;
      const svg = routeSvgRef.current;
      const path = pathRef.current;
      if (!section || !svg || !path) return;

      const syncRouteGeometry = () => {
        const { width, height } = section.getBoundingClientRect();
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        path.setAttribute("d", buildRoutePath(width, height));
      };

      syncRouteGeometry();
      window.addEventListener("resize", syncRouteGeometry);

      const pathLength = path.getTotalLength();
      const lines = headlineRef.current?.querySelectorAll<HTMLElement>(".line-inner");
      const revealTargets = [ledeRef.current, actionsRef.current].filter(Boolean);

      // Some hydration paths re-run this effect (false, then the real value)
      // without invoking the previous run's cleanup, leaving its timeline
      // ticking. Kill anything already animating these targets before
      // establishing the new state so the two runs can never fight.
      [
        imageWrapRef.current,
        wheelRef.current,
        markerRef.current,
        path,
        scrollCueRef.current,
        ...(lines ?? []),
        ...revealTargets,
      ].forEach((target) => gsap.killTweensOf(target));

      if (reducedMotion) {
        const endPoint = path.getPointAtLength(pathLength);
        gsap.set(imageWrapRef.current, { scale: 1 });
        gsap.set(wheelRef.current, { autoAlpha: 0 });
        gsap.set(path, { strokeDasharray: "none", strokeDashoffset: 0 });
        gsap.set(markerRef.current, { autoAlpha: 1, attr: { cx: endPoint.x, cy: endPoint.y } });
        if (lines) gsap.set(lines, { yPercent: 0, opacity: 1 });
        gsap.set(revealTargets, { y: 0, opacity: 1 });
        gsap.set(scrollCueRef.current, { opacity: 1 });
        return () => window.removeEventListener("resize", syncRouteGeometry);
      }

      gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
      gsap.set(markerRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: ease.reveal } });

      tl.fromTo(
        imageWrapRef.current,
        { scale: 1.9, transformOrigin: "58% 85%" },
        { scale: 1, duration: 1.15, ease: ease.travel },
        0,
      )
        .fromTo(
          wheelRef.current,
          { scale: 6, rotate: 0, transformOrigin: "50% 50%", autoAlpha: 1 },
          {
            scale: 1,
            rotate: 240,
            duration: 0.85,
            ease: ease.travel,
          },
          0.25,
        )
        .to(wheelRef.current, { autoAlpha: 0, duration: 0.3 }, 1.1)
        .fromTo(
          lines ?? [],
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: dur.reveal, stagger: stagger.default },
          0.45,
        )
        .fromTo(
          revealTargets,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: dur.reveal, stagger: stagger.default },
          1.0,
        )
        .to(path, { strokeDashoffset: 0, duration: dur.travel, ease: ease.travel }, 0.8)
        .to(
          markerRef.current,
          {
            autoAlpha: 1,
            duration: 0.01,
          },
          0.8,
        )
        .to(
          markerRef.current,
          {
            motionPath: { path, alignOrigin: [0.5, 0.5] },
            duration: dur.travel,
            ease: ease.travel,
          } as gsap.TweenVars,
          0.8,
        )
        .fromTo(scrollCueRef.current, { opacity: 0 }, { opacity: 1, duration: dur.reveal }, 3.0);

      return () => {
        window.removeEventListener("resize", syncRouteGeometry);
        tl.kill();
      };
    },
    { dependencies: [reducedMotion], scope: sectionRef },
  );

  return (
    <section className={styles.hero} id="hero" ref={sectionRef}>
      <div className={styles.imageWrap} ref={imageWrapRef}>
        <Image
          src="/media/hero/open-road.jpg"
          alt="Ranjith cycling a loaded touring bicycle down an open mountain road, Indian flag mounted on the handlebars"
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
      </div>
      <div className={styles.gradient} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />
      <svg
        ref={routeSvgRef}
        className={styles.routeSvg}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d={buildRoutePath(100, 100)}
          className={styles.routePath}
        />
        <circle ref={markerRef} cx="0" cy="0" r="9" className={styles.routeMarker} />
      </svg>
      <div className={styles.wheelDecor} aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <g ref={wheelRef}>
            <circle cx="50" cy="50" r="42" className={styles.wheelRing} />
            <circle cx="50" cy="50" r="18" className={styles.wheelRing} />
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * Math.PI) / 4;
              const x1 = 50 + Math.cos(angle) * 18;
              const y1 = 50 + Math.sin(angle) * 18;
              const x2 = 50 + Math.cos(angle) * 42;
              const y2 = 50 + Math.sin(angle) * 42;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className={styles.wheelSpoke} />;
            })}
          </g>
        </svg>
      </div>

      <div className={styles.content}>
        <Eyebrow>A journey for generations</Eyebrow>
        <h1 className={styles.headline} ref={headlineRef}>
          <LineReveal lines={["The world,", "one pedal", "at a time."]} />
        </h1>
        <p className={styles.lede} ref={ledeRef}>
          {site.distanceKm.toLocaleString()}
          + kilometres. {site.countryCount} countries. One bicycle carrying a promise, a purpose
          and thousands of human stories.
        </p>
        <div className={styles.actions} ref={actionsRef}>
          <ButtonLink href="/journey">Ride the journey</ButtonLink>
          <ButtonLink href="#finale" variant="secondary">
            Follow the next kilometre
          </ButtonLink>
        </div>
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Kilometres</dt>
            <dd className={styles.statValue}>
              <CountUp value={site.distanceKm} suffix="+" delay={1.8} />
            </dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Countries</dt>
            <dd className={styles.statValue}>
              <CountUp value={site.countryCount} delay={1.9} />
            </dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Years riding</dt>
            <dd className={styles.statValue}>
              <CountUp value={site.years} suffix="+" delay={2.0} />
            </dd>
          </div>
        </dl>
      </div>
      <span className={styles.scrollCue} ref={scrollCueRef}>
        Scroll
      </span>
    </section>
  );
}
