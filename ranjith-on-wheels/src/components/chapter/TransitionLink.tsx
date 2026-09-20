"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { prefersReducedMotion } from "./useChapterMotion";

// The hand-off into the next chapter (Page 13): instead of a hard page cut,
// a veil in the next country's own colours comes up, the road line runs across
// it and the country's name settles — then the route changes underneath, and
// the next hero lifts the veil (see the `hero` choreography). A normal <a> to
// everything else: modified clicks, reduced motion and no-JS all just navigate.
export function TransitionLink({
  href,
  name,
  coords,
  from,
  to,
  children,
  className,
}: {
  href: string;
  name: string;
  coords: string;
  from: string;
  to: string;
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (prefersReducedMotion()) return;
    event.preventDefault();

    const veil = document.createElement("div");
    veil.id = "chapter-veil";
    veil.setAttribute("aria-hidden", "true");
    Object.assign(veil.style, {
      position: "fixed",
      inset: "0",
      zIndex: "200",
      opacity: "0",
      pointerEvents: "none",
      display: "grid",
      placeItems: "center",
      alignContent: "center",
      gap: "14px",
      background: `linear-gradient(160deg, ${from}, ${to})`,
      color: "#fff9f0",
      textAlign: "center",
    });
    veil.innerHTML = `
      <span data-veil-coords style="font-family:var(--font-data);font-size:12px;letter-spacing:.16em;text-transform:uppercase;opacity:0">${coords}</span>
      <span data-veil-name style="font-family:var(--font-display);font-size:clamp(44px,10vw,120px);line-height:1;letter-spacing:-0.02em;opacity:0">${name}</span>
      <span data-veil-road style="display:block;width:min(70vw,720px);height:3px;background:linear-gradient(90deg,#e6242a,#5aa2ff);transform:scaleX(0);transform-origin:0 50%"></span>`;
    document.body.appendChild(veil);

    gsap
      .timeline({
        onComplete: () => router.push(href),
      })
      .to(veil, { opacity: 1, duration: 0.4, ease: ease.ui }, 0)
      .to(veil.querySelector("[data-veil-road]"), { scaleX: 1, duration: 0.8, ease: ease.travel }, 0.15)
      .to(veil.querySelector("[data-veil-coords]"), { opacity: 0.8, duration: 0.5 }, 0.35)
      .to(veil.querySelector("[data-veil-name]"), { opacity: 1, duration: 0.5 }, 0.45);

    // Never strand a visitor behind the veil if the next page is slow or fails.
    window.setTimeout(() => veil.isConnected && veil.remove(), 6000);
  };

  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
