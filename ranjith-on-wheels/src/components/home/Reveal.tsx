"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/useInView";
import styles from "./Reveal.module.css";

// A section eases in the first time it scrolls into view. The hidden start
// state only ever applies under the ".js" class layout.tsx sets once this
// script actually runs (Reveal.module.css), so a visitor with JS off, or a
// script that fails, simply sees the finished content — never a section
// stuck at opacity 0 with nothing left to reveal it.
export function Reveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${inView ? styles.inView : ""} ${className}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
