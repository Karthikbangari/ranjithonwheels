"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { ease, dur, stagger } from "@/lib/motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LineReveal } from "@/components/motion/LineReveal";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import styles from "./OriginStory.module.css";

// CLAUDE.md §0 decision #16: owner-supplied "original inspiration text",
// split into the three sentences it's already written in — matching the
// spec's own motion note ("the short paragraph reveals in three calm
// blocks") without needing a different reveal mechanism from before.
const beats = [
  "Ranjith did not set out to collect country names.",
  "He began with a bicycle, a personal reason to keep moving, and a belief that the road can connect people who may never share the same language.",
  "Every border since then has become part of one longer promise: keep going, keep learning and leave the road kinder than it was found.",
];

export function OriginStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const beatsRef = useRef<HTMLUListElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const chapterNumberRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsap();

      const lines = headlineRef.current?.querySelectorAll<HTMLElement>(".line-inner");
      const beatItems = beatsRef.current?.querySelectorAll<HTMLElement>("li");

      // Some hydration paths re-run this effect (false, then the real value)
      // without invoking the previous run's cleanup. Proactively clear any
      // tweens/ScrollTriggers this section owns so the two runs can't fight.
      [
        portraitRef.current,
        linkRef.current,
        chapterNumberRef.current,
        ...(lines ?? []),
        ...(beatItems ?? []),
      ].forEach((target) => gsap.killTweensOf(target));
      ScrollTrigger.getAll()
        .filter((trigger) => trigger.trigger === sectionRef.current)
        .forEach((trigger) => trigger.kill());

      if (reducedMotion) {
        gsap.set(portraitRef.current, { clipPath: "inset(0 0% 0 0)" });
        if (lines) gsap.set(lines, { yPercent: 0, opacity: 1 });
        if (beatItems) gsap.set(beatItems, { opacity: 1, y: 0 });
        gsap.set(linkRef.current, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: ease.reveal },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        portraitRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: dur.settle, ease: ease.travel },
        0,
      )
        .fromTo(
          lines ?? [],
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: dur.reveal, stagger: stagger.default },
          0.15,
        )
        .fromTo(
          beatItems ?? [],
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: dur.reveal, stagger: stagger.default },
          0.36,
        )
        .fromTo(linkRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: dur.ui }, "-=0.1");

      const parallax = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(chapterNumberRef.current, { xPercent: self.progress * 5 });
        },
      });

      return () => {
        parallax.kill();
        tl.kill();
      };
    },
    { dependencies: [reducedMotion], scope: sectionRef },
  );

  return (
    <section className={styles.section} id="story" ref={sectionRef}>
      <span className={styles.chapterNumber} ref={chapterNumberRef} aria-hidden="true">
        01
      </span>
      <div className={styles.copy}>
        <Eyebrow>The origin</Eyebrow>
        <h2 className={styles.headline} ref={headlineRef}>
          <LineReveal lines={["A promise can become a road."]} />
        </h2>
        <ul className={styles.beats} ref={beatsRef}>
          {beats.map((beat) => (
            <li key={beat} className={styles.beat}>
              {beat}
            </li>
          ))}
        </ul>
        <Link href="/about" className={styles.link} ref={linkRef}>
          Read the full story
        </Link>
      </div>
      <div className={styles.portraitWrap} ref={portraitRef}>
        <Image
          src="/media/story/origin-portrait.jpg"
          alt="Ranjith sitting quietly on a dock, looking out over open water"
          fill
          sizes="(max-width: 1023px) 100vw, 50vw"
          className={styles.portrait}
        />
      </div>
    </section>
  );
}
