"use client";

import { useEffect, useRef, type ReactNode } from "react";

// A few pixels of cursor-driven depth on the hero photograph — desktop with
// a real pointer only (matchMedia guards touch/coarse pointers, which have
// no hover to drive this from), and never under reduced motion. The
// transform is applied directly via a ref, not React state, so mousemove
// never triggers a re-render.
export function HeroParallax({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The node fills `.hero` exactly (`inset: 0`) and only its own transform
    // ever changes, never its layout position or size — so its rect only
    // needs recomputing on resize, not on every mousemove. Reading
    // getBoundingClientRect() inside the mousemove handler itself forces a
    // synchronous layout on every event, which is the kind of jank a cursor
    // effect should never cause.
    let rect = node.getBoundingClientRect();
    const updateRect = () => {
      rect = node.getBoundingClientRect();
    };
    window.addEventListener("resize", updateRect);

    let raf = 0;
    const onMove = (event: MouseEvent) => {
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        node.style.transform = `translate3d(${x * -10}px, ${y * -8}px, 0) scale(1.04)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      node.style.transform = "";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={frameRef} style={{ position: "absolute", inset: 0, willChange: "transform" }}>
      {children}
    </div>
  );
}
