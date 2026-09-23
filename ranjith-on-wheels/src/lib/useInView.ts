"use client";

import { useEffect, useRef, useState } from "react";

// Whether an element has scrolled into view, once. Used to trigger a reveal
// or a count-up the first time a section is actually seen, rather than on
// mount. Starts `true` when IntersectionObserver isn't available (very old
// browsers) or the visitor asked for reduced motion, so content is never
// stuck hidden behind a script that chose not to run — the CSS/markup
// default must already be the finished state; this only adds an
// entrance on top of it.
export function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const skipToVisible =
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (skipToVisible) {
      // Deferred a tick rather than called synchronously in the effect body
      // itself — same one-time result, just expressed the same way the
      // observer's own callback below reports a change, not as a direct
      // side effect of running the effect.
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
