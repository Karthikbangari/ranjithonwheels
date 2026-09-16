"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { motion } from "@/lib/motion";
import { useReducedMotion } from "./ReducedMotionProvider";

type CountUpProps = {
  value: number;
  suffix?: string;
  formatter?: (value: number) => string;
  delay?: number;
};

export function CountUp({ value, suffix = "", formatter, delay = 0 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const reducedMotion = useReducedMotion();
  const format = formatter ?? ((n: number) => Math.round(n).toLocaleString());

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      // Some hydration paths re-run this effect (false, then the real value)
      // without invoking the previous run's cleanup. Kill any in-flight
      // counter tween by reference so the two runs can't fight over textContent.
      tweenRef.current?.kill();

      if (reducedMotion) {
        el.textContent = `${format(value)}${suffix}`;
        return;
      }

      const counter = { value: 0 };
      tweenRef.current = gsap.to(counter, {
        value,
        duration: motion.duration.scene,
        delay,
        ease: motion.ease.settle,
        onUpdate: () => {
          el.textContent = `${format(counter.value)}${suffix}`;
        },
      });

      return () => {
        tweenRef.current?.kill();
      };
    },
    { dependencies: [value, reducedMotion], scope: ref },
  );

  return (
    <span ref={ref}>
      {reducedMotion ? `${format(value)}${suffix}` : "0"}
    </span>
  );
}
