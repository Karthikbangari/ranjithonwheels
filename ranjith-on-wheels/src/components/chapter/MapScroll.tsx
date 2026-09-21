"use client";

import { useEffect, useRef, type ReactNode } from "react";

// On a phone the world map is wider than the screen, so it scrolls sideways in
// its own frame. It should open on the journey — Europe to East Asia and
// Australia — not on the Atlantic, so it starts scrolled to that part of the
// map. (Nothing to do on a screen wide enough to show it all.)
export function MapScroll({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.clientWidth;
    if (overflow > 0) el.scrollLeft = overflow * 0.62;
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
