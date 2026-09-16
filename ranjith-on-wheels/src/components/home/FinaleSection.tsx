"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { motion as motionConfig } from "@/lib/motion";
import { siteContent } from "@/content/site";
import { socialLinks } from "@/content/socials";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LineReveal } from "@/components/motion/LineReveal";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import styles from "./FinaleSection.module.css";

const WHEEL_REST_X = 260;

export function FinaleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const emphasisRef = useRef<HTMLElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<SVGGElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsap();
      const lines = headlineRef.current?.querySelectorAll<HTMLElement>(".line-inner");
      const socialItems = socialsRef.current?.querySelectorAll<HTMLElement>("a");

      [imageWrapRef.current, emphasisRef.current, wheelRef.current, ...(lines ?? []), ...(socialItems ?? [])].forEach(
        (target) => gsap.killTweensOf(target),
      );
      ScrollTrigger.getAll()
        .filter((trigger) => trigger.trigger === sectionRef.current)
        .forEach((trigger) => trigger.kill());

      if (reducedMotion) {
        gsap.set(imageWrapRef.current, { y: 0 });
        if (lines) gsap.set(lines, { yPercent: 0, opacity: 1 });
        gsap.set(emphasisRef.current, { opacity: 1 });
        if (socialItems) gsap.set(socialItems, { y: 0, opacity: 1 });
        gsap.set(wheelRef.current, { x: WHEEL_REST_X, rotate: 0 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: motionConfig.ease.reveal },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        lines ?? [],
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: motionConfig.duration.reveal },
        0,
      )
        .fromTo(emphasisRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.18)
        .fromTo(
          socialItems ?? [],
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: motionConfig.duration.reveal, stagger: 0.1 },
          0.5,
        )
        .fromTo(
          wheelRef.current,
          { x: 0, rotate: 0 },
          { x: WHEEL_REST_X, rotate: 360, duration: 1.6, ease: motionConfig.ease.travel },
          0.4,
        );

      const parallax = gsap.fromTo(
        imageWrapRef.current,
        { y: -20 },
        {
          y: 20,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      return () => {
        parallax.scrollTrigger?.kill();
        parallax.kill();
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { dependencies: [reducedMotion], scope: sectionRef },
  );

  return (
    <section className={styles.section} id="finale" ref={sectionRef}>
      <div className={styles.imageWrap} ref={imageWrapRef}>
        <Image
          src="/media/hero/finale.jpg"
          alt="Ranjith's loaded touring bicycle by the roadside with the Indian flag, mountains behind"
          fill
          sizes="100vw"
          className={styles.image}
        />
      </div>
      <div className={styles.gradient} aria-hidden="true" />
      <div className={styles.content}>
        <Eyebrow>
          {siteContent.currentCountry.toUpperCase()} — Country {siteContent.countryCount} — Not
          the finish
        </Eyebrow>
        <h2 className={styles.headline} ref={headlineRef}>
          <LineReveal lines={["The map ends here."]} />
          <em ref={emphasisRef}>The journey doesn&apos;t.</em>
        </h2>
        <div className={styles.socialActions} ref={socialsRef}>
          {socialLinks.map((social) => (
            <a key={social.id} href={social.url} rel="me noreferrer" className={styles.socialLink}>
              <span className={styles.socialLabel}>{social.label}</span>
              <span className={styles.socialDescription}>{social.description}</span>
            </a>
          ))}
        </div>
        <div className={styles.roadWrap}>
          <svg className={styles.roadSvg} viewBox="0 0 320 60" preserveAspectRatio="xMinYMid meet" aria-hidden="true">
            <line x1="0" y1="30" x2="300" y2="30" className={styles.dottedLine} />
            <g ref={wheelRef}>
              <circle cx="14" cy="30" r="12" className={styles.wheel} />
              <circle cx="14" cy="30" r="5" className={styles.wheel} />
            </g>
            <text x="304" y="35" fill="currentColor" fontSize="14">
              24
            </text>
          </svg>
        </div>
        <p className={styles.nextCountry}>The next country is still being written</p>
      </div>
    </section>
  );
}
