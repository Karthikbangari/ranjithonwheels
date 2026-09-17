"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import styles from "./BookFeature.module.css";

const MAX_TILT_DEGREES = 10;

export function BookFeature() {
  const coverRef = useRef<HTMLDivElement>(null);
  const teardownRef = useRef<(() => void) | null>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      registerGsap();
      const cover = coverRef.current;
      if (!cover) return;

      // Some hydration paths re-run this effect (false, then the real value)
      // without invoking the previous run's cleanup, which would otherwise
      // leave a stale pointermove listener attached and re-applying tilt
      // even after reduced motion is detected. Tear it down by reference.
      teardownRef.current?.();
      teardownRef.current = null;

      gsap.killTweensOf(cover);

      const canTilt = !reducedMotion && window.matchMedia("(pointer: fine)").matches;
      if (!canTilt) {
        gsap.set(cover, { rotationX: 0, rotationY: 0 });
        return;
      }

      const quickX = gsap.quickTo(cover, "rotationY", { duration: 0.4, ease: "power2.out" });
      const quickY = gsap.quickTo(cover, "rotationX", { duration: 0.4, ease: "power2.out" });

      const onPointerMove = (event: PointerEvent) => {
        const rect = cover.getBoundingClientRect();
        const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
        const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
        quickX(relativeX * MAX_TILT_DEGREES * 2);
        quickY(relativeY * -MAX_TILT_DEGREES * 2);
      };

      const onPointerLeave = () => {
        quickX(0);
        quickY(0);
      };

      cover.addEventListener("pointermove", onPointerMove);
      cover.addEventListener("pointerleave", onPointerLeave);

      const teardown = () => {
        cover.removeEventListener("pointermove", onPointerMove);
        cover.removeEventListener("pointerleave", onPointerLeave);
      };
      teardownRef.current = teardown;

      return teardown;
    },
    { dependencies: [reducedMotion], scope: coverRef },
  );

  return (
    <section className={styles.section} id="book">
      <div className={styles.stage}>
        <div className={styles.cover} ref={coverRef}>
          <Image
            src={site.bookCoverImage}
            alt={site.bookCoverAlt}
            fill
            sizes="280px"
            className={styles.coverImage}
          />
          <div className={styles.coverGradient} aria-hidden="true" />
          <span className={styles.coverTitle}>{site.book}</span>
        </div>
      </div>
      <div className={styles.copy}>
        <Eyebrow>The book</Eyebrow>
        <h2 className={styles.headline}>The complete journey lives between these pages.</h2>
        {site.bookDescription ? <p className={styles.description}>{site.bookDescription}</p> : null}
        <div className={styles.actions}>
          <ButtonLink href="/book">Read a sample</ButtonLink>
          {site.bookUrl ? (
            <ButtonLink href={site.bookUrl} variant="secondary">
              Buy or enquire
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
