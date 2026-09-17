"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { ease, dur, stagger } from "@/lib/motion";
import type { JourneyCountry } from "@/content/journey";
import { CountryCoverImage } from "@/components/journey/CountryCoverImage";
import { LineReveal } from "@/components/motion/LineReveal";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import styles from "./StoryFeature.module.css";

export function StoryFeature({ country, reverse = false }: { country: JourneyCountry; reverse?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const beatsRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion();

  // Only render beats that actually have sourced content — never a
  // placeholder. See the OWNER note beside this country's entry in
  // journey.ts for what's still missing.
  const beats = [
    { label: "What happened", text: country.challengeStory },
    { label: "Who or what helped", text: country.whoHelped },
    { label: "What the road taught him", text: country.lesson },
  ].filter((beat): beat is { label: string; text: string } => Boolean(beat.text));

  useGSAP(
    () => {
      registerGsap();
      const lines = headlineRef.current?.querySelectorAll<HTMLElement>(".line-inner");
      const beatItems = beatsRef.current?.querySelectorAll<HTMLElement>("[data-beat]");

      // Some hydration paths re-run this effect (false, then the real value)
      // without invoking the previous run's cleanup, leaving a prior
      // ScrollTrigger alive to fire later and override this run's state.
      [mediaRef.current, linkRef.current, ...(lines ?? []), ...(beatItems ?? [])].forEach((target) =>
        gsap.killTweensOf(target),
      );
      ScrollTrigger.getAll()
        .filter((trigger) => trigger.trigger === sectionRef.current)
        .forEach((trigger) => trigger.kill());

      if (reducedMotion) {
        gsap.set(mediaRef.current, { clipPath: "inset(0 0 0 0)", scale: 1 });
        if (lines) gsap.set(lines, { yPercent: 0, opacity: 1 });
        if (beatItems) gsap.set(beatItems, { opacity: 1, y: 0 });
        gsap.set(linkRef.current, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: ease.reveal },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        mediaRef.current,
        { clipPath: reverse ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", scale: 1.03 },
        {
          clipPath: "inset(0 0% 0 0%)",
          scale: 1,
          duration: dur.settle,
          ease: ease.travel,
        },
        0,
      )
        .fromTo(
          lines ?? [],
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: dur.reveal, stagger: stagger.default },
          0.2,
        )
        .fromTo(
          beatItems ?? [],
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: dur.reveal, stagger: stagger.default },
          0.4,
        )
        .fromTo(linkRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: dur.ui }, 0.7);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { dependencies: [reducedMotion], scope: sectionRef },
  );

  return (
    <section className={`${styles.section} ${reverse ? styles.reverse : ""}`} ref={sectionRef}>
      <div className={styles.mediaWrap} ref={mediaRef}>
        <CountryCoverImage
          slug={country.slug}
          anchor={country.displayAnchor}
          src={country.coverImage}
          alt={country.coverAlt}
          sizes="(max-width: 1023px) 100vw, 50vw"
        />
      </div>
      <div className={styles.copy}>
        <span className={styles.chapterLabel}>
          Country {country.order} — {country.name}
        </span>
        <h2 className={styles.headline} ref={headlineRef}>
          <LineReveal lines={[country.summary ?? country.name]} />
        </h2>
        <div className={styles.beats} ref={beatsRef}>
          {beats.map((beat) => (
            <div key={beat.label} className={styles.beat} data-beat>
              <span className={styles.beatLabel}>{beat.label}</span>
              <p className={styles.beatText}>{beat.text}</p>
            </div>
          ))}
        </div>
        <Link href={`/journey/${country.slug}`} className={styles.link} ref={linkRef}>
          Open full chapter
        </Link>
      </div>
    </section>
  );
}
