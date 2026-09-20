"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

// `useReducedMotion()` reads `false` during SSR and the first client render,
// then flips to the real value — so an effect keyed on it can run its
// animation setup once with the stale value before the correction lands. The
// effects below ask the media query directly instead: by the time an effect
// runs we are on the client, so the first run already has the true answer and
// a reduced-motion visitor never gets a hidden "from" state to clean up.
export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Every motif rests in its finished state in plain CSS/SVG: no JS, or
// prefers-reduced-motion, shows the complete picture (CLAUDE.md §5.5). The
// setup callback only ever animates *from* a hidden state *to* that resting
// state, so it is skipped entirely under reduced motion.
export function useChapterMotion<T extends HTMLElement = HTMLDivElement>(
  setup: (stage: HTMLElement, api: typeof gsap) => void | (() => void),
  deps: unknown[] = [],
) {
  const stageRef = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;
      registerGsap();

      // Some hydration paths re-run this effect (false, then the real value)
      // without invoking the previous run's cleanup — clear anything a prior
      // run left on this stage so two runs can't fight over it.
      ScrollTrigger.getAll()
        .filter((trigger) => trigger.trigger === stage)
        .forEach((trigger) => trigger.kill());
      gsap.killTweensOf(stage.querySelectorAll("*"));

      if (prefersReducedMotion()) return;
      return setup(stage, gsap);
    },
    { dependencies: [reducedMotion, ...deps], scope: stageRef },
  );

  return stageRef;
}

// Scroll-linked motion is always reversible (§5.2). `end` defaults to
// "the stage's top is 35% down the viewport", so a counter or a ride lands
// on its final frame while the stage is still fully on screen.
export const scrubOnView = (stage: HTMLElement, end = "top 35%") => ({
  trigger: stage,
  start: "top bottom",
  end,
  scrub: 0.6,
});

export const playOnView = (stage: HTMLElement) => ({
  trigger: stage,
  start: "top 80%",
  toggleActions: "play none none none" as const,
});
