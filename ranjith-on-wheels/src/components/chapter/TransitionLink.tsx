"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { formatCoords, type LonLat } from "@/lib/coords";
import { gsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";
import { prefersReducedMotion } from "./useChapterMotion";

// The hand-off into the next chapter (Page 13). There should be almost no
// feeling of "page ends, new page starts", so the click plays the chapter
// change as one continuous move, in the next country's own colours:
//
//   the red road exits the frame → the next blue road appears →
//   the coordinates change → the terrain morphs in → the country's type
//   enters → the next chapter begins (the hero lifts the veil).
//
// The veil is laid out exactly like the hero it becomes — same gradient, same
// chapter line, name and coordinates in the same place — and the hero, seeing
// the veil, does not replay its own type, so the name simply *stays*. For a
// sourced sea crossing the road becomes a dashed navigation line across the
// water. Everything else — modified clicks, reduced motion, no JS — is a plain
// link.
export function TransitionLink({
  href,
  name,
  from,
  to,
  chapterLine,
  region,
  fromLonLat,
  toLonLat,
  contour,
  glow,
  sea,
  opening,
  stats,
  children,
  className,
}: {
  href: string;
  name: string;
  from: string;
  to: string;
  chapterLine: string;
  region: string;
  fromLonLat: LonLat;
  toLonLat: LonLat;
  contour: string;
  glow: string;
  sea: boolean;
  // The rest of the hero's text stack, so the veil is exactly as tall as the
  // hero it becomes and every line lands where the hero's will.
  opening: string;
  stats: Array<{ value: string; unit: string; label: string }>;
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
      overflow: "hidden",
      pointerEvents: "none",
      background: `linear-gradient(155deg, ${from} 0%, ${to} 135%)`,
      color: "#fff9f0",
    });

    const road = sea
      ? `repeating-linear-gradient(90deg, #5aa2ff 0 12px, transparent 12px 24px)`
      : "linear-gradient(90deg, #5aa2ff, #5aa2ff)";
    // Built with the same metrics as the hero (Hero.module.css) so the two line up.
    veil.innerHTML = `
      <svg data-v-terrain viewBox="0 0 1200 675" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:0">
        <path d="${contour}" fill="none" stroke="${glow}" stroke-width="1.3" stroke-linecap="round" opacity="0.5"/>
      </svg>
      <div style="position:absolute;left:0;right:0;top:34%;height:3px">
        <span data-v-red style="position:absolute;inset:0;background:#e6242a;border-radius:2px"></span>
        <span data-v-blue style="position:absolute;inset:0;background:${road};border-radius:2px;transform:scaleX(0);transform-origin:0 50%"></span>
      </div>
      <div style="position:absolute;left:0;right:0;bottom:0;padding:0 var(--page-gutter) clamp(36px,7vh,80px);display:flex;flex-direction:column;gap:14px">
        <p data-v-line style="margin:0;display:flex;flex-wrap:wrap;gap:8px 20px;font-family:var(--font-data);font-size:var(--text-data);letter-spacing:.16em;text-transform:uppercase;color:rgba(255,249,240,.86);opacity:0">
          <span></span>${region ? `<span style="color:rgba(255,249,240,.7)"></span>` : ""}
        </p>
        <div style="overflow:hidden;padding-bottom:.16em;margin-bottom:-.16em">
          <div data-v-name style="font-family:var(--font-display);font-weight:420;letter-spacing:-.02em;font-size:clamp(64px,15.5vw,250px);line-height:.92"></div>
        </div>
        <p data-v-coords style="margin:0;font-family:var(--font-data);font-size:12px;letter-spacing:.14em;color:rgba(255,249,240,.82)"></p>
        ${opening ? `<p data-v-opening style="margin:0;max-width:22ch;font-family:var(--font-display);font-style:italic;font-size:clamp(22px,2.7vw,40px);line-height:1.12;text-wrap:balance"></p>` : ""}
        ${
          stats.length > 0
            ? `<dl style="margin:6px 0 0;display:flex;flex-wrap:wrap;gap:10px 36px">${stats
                .map(
                  () =>
                    `<div data-v-stat style="display:flex;flex-direction:column-reverse;gap:2px"><dt style="font-size:.85rem;color:rgba(255,249,240,.78)"></dt><dd style="margin:0;font-family:var(--font-data);font-size:clamp(1.3rem,2.4vw,1.9rem);letter-spacing:.04em;font-variant-numeric:tabular-nums"><span></span> <span style="font-size:.7em;letter-spacing:.12em;color:rgba(255,249,240,.8)"></span></dd></div>`,
                )
                .join("")}</dl>`
            : ""
        }
      </div>`;
    // Text goes in as text, never as markup.
    const spans = veil.querySelectorAll<HTMLElement>("[data-v-line] span");
    spans[0].textContent = chapterLine;
    if (spans[1]) spans[1].textContent = region;
    veil.querySelector<HTMLElement>("[data-v-name]")!.textContent = name;
    const openingEl = veil.querySelector<HTMLElement>("[data-v-opening]");
    if (openingEl) openingEl.textContent = opening;
    veil.querySelectorAll<HTMLElement>("[data-v-stat]").forEach((el, index) => {
      el.querySelector("dt")!.textContent = stats[index].label;
      const parts = el.querySelectorAll("dd span");
      parts[0].textContent = stats[index].value;
      parts[1].textContent = stats[index].unit;
    });
    const coordsEl = veil.querySelector<HTMLElement>("[data-v-coords]")!;
    coordsEl.textContent = formatCoords(fromLonLat);
    document.body.appendChild(veil);

    const q = <T extends Element>(selector: string) => veil.querySelector<T>(selector);
    gsap.set(q("[data-v-name]"), { yPercent: 110 });
    const trip = { p: 0 };
    gsap
      .timeline({ onComplete: () => router.push(href) })
      .to(veil, { opacity: 1, duration: 0.35, ease: ease.ui }, 0)
      // 1. the red road exits the frame…
      .to(q("[data-v-red]"), { xPercent: 105, duration: 0.7, ease: ease.travel }, 0.1)
      // 2. …the next blue road appears behind it…
      .to(q("[data-v-blue]"), { scaleX: 1, duration: 0.8, ease: ease.travel }, 0.2)
      // 3. …the coordinates change…
      .to(
        trip,
        {
          p: 1,
          duration: 0.8,
          ease: "power2.inOut",
          onUpdate: () => {
            coordsEl.textContent = formatCoords([
              fromLonLat[0] + (toLonLat[0] - fromLonLat[0]) * trip.p,
              fromLonLat[1] + (toLonLat[1] - fromLonLat[1]) * trip.p,
            ]);
          },
        },
        0.35,
      )
      .to(q("[data-v-line]"), { opacity: 1, duration: 0.4 }, 0.5)
      .fromTo(veil.querySelectorAll("[data-v-opening], dl"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.8)
      // 4. …the terrain morphs in…
      .to(q("[data-v-terrain]"), { opacity: 1, duration: 0.8, ease: ease.ui }, 0.35)
      // 5. …and the country's type enters, where the hero's type will be.
      .to(q("[data-v-name]"), { yPercent: 0, duration: 0.9, ease: ease.reveal }, 0.65);

    // Never strand a visitor behind the veil if the next page is slow or fails.
    window.setTimeout(() => veil.isConnected && veil.remove(), 6000);
  };

  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
