"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ChapterProgressRail.module.css";

export type ChapterRailItem = {
  slug: string;
  name: string;
  order: number;
};

// One IntersectionObserver watching all ten chapter sections through a thin
// band near the vertical centre of the viewport — cheaper than a per-section
// observer, and gives a single, stable "which chapter is this" answer to
// drive both the sticky desktop rail and the live chapter-number text.
export function ChapterProgressRail({ items }: { items: ChapterRailItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const railRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(`chapter-${item.slug}`))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    // Fixed to the viewport (not sticky within the chapters section itself),
    // so a second, wider-margin pass on the same sections decides whether the
    // rail should show at all — it fades out on every other section rather
    // than sitting pinned over the Origin or Map screens above.
    const activityObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) return;
        const topMost = visibleEntries.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        const index = sections.indexOf(topMost.target as HTMLElement);
        if (index !== -1) setActiveIndex(index);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((section) => activityObserver.observe(section));

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        setVisible(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0 },
    );
    sections.forEach((section) => visibilityObserver.observe(section));

    return () => {
      activityObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [items]);

  return (
    <nav
      className={`${styles.rail} ${visible ? styles.railVisible : ""}`}
      aria-label="Chapter progress"
      ref={railRef}>
      <span className={styles.count} aria-hidden="true">
        {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
      </span>
      <ol className={styles.dots}>
        {items.map((item, index) => (
          <li key={item.slug}>
            <a
              href={`#chapter-${item.slug}`}
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <span className="sr-only">{item.name}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
