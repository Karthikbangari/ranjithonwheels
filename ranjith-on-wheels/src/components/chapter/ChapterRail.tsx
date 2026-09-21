"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./ChapterRail.module.css";

type Stop = { name: string; slug: string } | null;

// The expedition's compass, always on screen inside a chapter: where we came
// from, where we are, where we are going next — as names, a chapter number,
// coordinates, and 23 ticks along the road (red = ridden, blue = ahead, the
// current one ringed) with this chapter's own scroll progress running through
// it. It is what stops a country from feeling like a separate web page.
//
// It updates a CSS variable, never a layout property, and only from a
// passive scroll listener throttled to animation frames.
export function ChapterRail({
  previous,
  current,
  next,
  order,
  total,
  coords,
}: {
  previous: Stop;
  current: string;
  next: Stop;
  order: number;
  total: number;
  coords: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty("--chapter-progress", progress.toFixed(4));
      // Step aside at the very end so it never sits on the footer.
      el.dataset.hidden = progress > 0.985 ? "true" : "false";
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav ref={ref} className={styles.rail} aria-label="Journey progress" data-hidden="false">
      <span className={styles.progress} aria-hidden="true" />
      <div className={styles.stop}>
        {previous ? (
          <Link href={`/journey/${previous.slug}`} className={styles.link}>
            <span className={styles.tag}>From</span>
            {previous.name}
          </Link>
        ) : (
          <span className={styles.origin}>
            <span className={styles.tag}>The road begins</span>
          </span>
        )}
      </div>
      <div className={styles.here} aria-current="location">
        <span className={styles.ticks} aria-hidden="true">
          {Array.from({ length: total }, (_, index) => (
            <i key={index} data-state={index + 1 < order ? "done" : index + 1 === order ? "here" : "ahead"} />
          ))}
        </span>
        <span className={styles.label}>
          {String(order).padStart(2, "0")} / {total} · {current}
          <span className={styles.coords}> · {coords}</span>
        </span>
      </div>
      <div className={`${styles.stop} ${styles.stopEnd}`}>
        {next ? (
          <Link href={`/journey/${next.slug}`} className={styles.link}>
            <span className={styles.tag}>Next</span>
            {next.name}
          </Link>
        ) : (
          <span className={styles.origin}>
            <span className={styles.tag}>The road goes on</span>
          </span>
        )}
      </div>
    </nav>
  );
}
