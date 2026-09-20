"use client";

import { c } from "../colors";
import { scrubOnView, useChapterMotion } from "../useChapterMotion";
import styles from "../Motifs.module.css";
import { BikeGlyph } from "./BikeGlyph";

// Mongolia — over 2,000 kilometres of steppe and unpaved road. A single
// rider crosses an enormous, nearly empty frame as the page scrolls; the
// wheels turn with the distance and the clouds fall behind.
export function Horizon() {
  const stageRef = useChapterMotion((stage, gsap) => {
    const rider = stage.querySelector("[data-rider]");
    const wheels = stage.querySelectorAll("[data-wheel]");
    const clouds = stage.querySelectorAll("[data-cloud]");

    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: scrubOnView(stage) });
    tl.fromTo(rider, { x: -700 }, { x: 0 }, 0);
    tl.fromTo(wheels, { rotation: -900, transformOrigin: "50% 50%" }, { rotation: 0 }, 0);
    tl.fromTo(clouds, { x: (i: number) => 90 + i * 40 }, { x: 0 }, 0);
  });

  return (
    <div ref={stageRef} className={styles.stage} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 900 360" preserveAspectRatio="xMidYMid meet">
        <circle cx={150} cy={84} r={46} fill={c.glow} opacity={0.8} />
        {[
          { x: 330, y: 70, s: 1 },
          { x: 560, y: 108, s: 0.75 },
          { x: 760, y: 60, s: 0.9 },
        ].map((cloud) => (
          <g key={cloud.x} data-cloud>
            <g transform={`translate(${cloud.x} ${cloud.y}) scale(${cloud.s})`} fill={c.white} opacity={0.85}>
              <ellipse cx={0} cy={0} rx={52} ry={14} />
              <ellipse cx={-18} cy={-10} rx={26} ry={16} />
              <ellipse cx={20} cy={-6} rx={22} ry={13} />
            </g>
          </g>
        ))}
        <path d="M0 250 C150 215 300 240 450 225 S750 210 900 235 V360 H0 Z" fill={c.glow} opacity={0.35} />
        <path d="M0 285 C200 250 380 290 560 268 S800 262 900 280 V360 H0 Z" fill={c.accent} opacity={0.32} />
        <path d="M0 318 H900 V360 H0 Z" fill={c.accent} opacity={0.75} />
        <line x1={0} y1={324} x2={900} y2={324} stroke={c.tint} strokeWidth={4} strokeLinecap="round" strokeDasharray="1 16" />
        <g data-rider>
          <g transform="translate(780 322) scale(1.6)">
            <BikeGlyph rider />
          </g>
        </g>
      </svg>
    </div>
  );
}
