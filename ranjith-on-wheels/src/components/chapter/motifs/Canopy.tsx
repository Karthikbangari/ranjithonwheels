"use client";

import { c } from "../colors";
import { playOnView, scrubOnView, useChapterMotion } from "../useChapterMotion";
import styles from "../Motifs.module.css";

// Malaysia — reserve zones and fruit. A canopy of fronds sways with the
// scroll while the three fruits Ranjith tasted rise into place.
const LEAF = "M0 0 C40 -26 120 -26 170 0 C120 26 40 26 0 0 Z";
const fronds = [
  { angle: 18, opacity: 0.85 },
  { angle: 38, opacity: 0.6 },
  { angle: 58, opacity: 0.85 },
  { angle: 78, opacity: 0.55 },
  { angle: 98, opacity: 0.8 },
];

// A spiky durian outline: alternating outer / inner radii.
const durianPoints = Array.from({ length: 32 }, (_, i) => {
  const angle = (i / 32) * Math.PI * 2;
  const radius = i % 2 === 0 ? 68 : 54;
  return `${(Math.cos(angle) * radius).toFixed(1)},${(Math.sin(angle) * radius * 0.86).toFixed(1)}`;
}).join(" ");

export function Canopy() {
  const stageRef = useChapterMotion((stage, gsap) => {
    const fruit = stage.querySelectorAll("[data-fruit]");
    const captions = stage.querySelectorAll("[data-caption]");
    const leaves = stage.querySelectorAll("[data-frond]");

    gsap
      .timeline({ scrollTrigger: playOnView(stage) })
      .fromTo(
        fruit,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.06 },
        0,
      )
      .fromTo(captions, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.06 }, 0.5);

    // Sway is a scrolled gesture, not a loop: each frond leans back to rest
    // as the stage crosses the viewport, and leans out again on scroll-up.
    gsap.fromTo(
      leaves,
      { rotation: (i: number) => (i % 2 === 0 ? -5 : 5), transformOrigin: "0% 50%" },
      {
        rotation: 0,
        ease: "none",
        scrollTrigger: scrubOnView(stage),
      },
    );
  });

  return (
    <div ref={stageRef} className={`${styles.stage} ${styles.scene}`} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 900 360" preserveAspectRatio="xMidYMid slice">
        <rect x={0} y={292} width={900} height={68} fill={c.accent} opacity={0.16} />
        <g transform="translate(-10 -6) scale(1.5)">
          {fronds.map((frond) => (
            <g key={frond.angle} transform={`rotate(${frond.angle})`}>
              <g data-frond>
                <path d={LEAF} fill={c.accent} opacity={frond.opacity} />
              </g>
            </g>
          ))}
        </g>
        <g transform="translate(910 -6) scale(-1.5 1.5)">
          {fronds.map((frond) => (
            <g key={frond.angle} transform={`rotate(${frond.angle})`}>
              <g data-frond>
                <path d={LEAF} fill={c.accent} opacity={frond.opacity} />
              </g>
            </g>
          ))}
        </g>

        <g data-fruit>
          <g transform="translate(270 236)">
            <polygon points={durianPoints} fill={c.glow} stroke={c.accent} strokeWidth={3} strokeLinejoin="round" />
          </g>
        </g>
        <g data-fruit>
          <g transform="translate(450 240)">
            <circle r={48} fill={c.accent} />
            <circle cx={-14} cy={-16} r={10} fill={c.white} opacity={0.22} />
            <path d="M0 -48 L-14 -60 M0 -48 L14 -60 M0 -48 L0 -66 M0 -48 L-24 -50 M0 -48 L24 -50" stroke={c.glow} strokeWidth={5} strokeLinecap="round" />
          </g>
        </g>
        <g data-fruit>
          <g transform="translate(630 234)">
            <path d="M0 -62 C42 -22 46 30 0 60 C-46 30 -42 -22 0 -62 Z" fill={c.glow} stroke={c.accent} strokeWidth={3} />
            {[-30, -6, 18].map((y, row) =>
              [-18, 0, 18].map((x) => (
                <path key={`${row}-${x}`} d={`M${x - 7} ${y} q7 8 14 0`} fill="none" stroke={c.accent} strokeWidth={2} opacity={0.6} />
              )),
            )}
          </g>
        </g>

        {[
          { x: 270, label: "Durian" },
          { x: 450, label: "Mangosteen" },
          { x: 630, label: "Snake fruit" },
        ].map((item) => (
          <text
            key={item.label}
            data-caption
            x={item.x}
            y={336}
            textAnchor="middle"
            fill={c.ink}
            fontSize={17}
            fontWeight={600}
            style={{ fontFamily: "var(--font-body)" }}
          >
            {item.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
