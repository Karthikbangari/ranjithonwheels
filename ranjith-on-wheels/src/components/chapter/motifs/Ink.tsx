"use client";

import { c } from "../colors";
import { playOnView, useChapterMotion } from "../useChapterMotion";
import styles from "../Motifs.module.css";

// China — not the skyline, the hospitality. Ink ridgelines are brushed in
// across the frame, and three bowls of food steam beneath them: strangers
// repeatedly offering food to travellers.
const RIDGE_A = "M0 190 C90 150 130 80 210 120 S330 180 400 135 S520 40 600 95 S760 170 900 120";
const RIDGE_B = "M0 232 C120 197 200 242 300 207 S470 162 560 197 S760 242 900 192";

const bowls = [250, 450, 650];

export function Ink() {
  const stageRef = useChapterMotion((stage, gsap) => {
    const ridges = stage.querySelectorAll<SVGPathElement>("[data-ridge]");
    const sun = stage.querySelector("[data-sun]");
    const bowlGroups = stage.querySelectorAll("[data-bowl]");
    const steam = stage.querySelectorAll("[data-steam]");
    const seal = stage.querySelector("[data-seal]");

    const tl = gsap.timeline({ scrollTrigger: playOnView(stage) });

    // Brush strokes are drawn by animating stroke-dashoffset — not a
    // transform, but it is the only way to trace a path along its length.
    ridges.forEach((ridge, index) => {
      const length = ridge.getTotalLength();
      ridge.style.strokeDasharray = `${length}`;
      tl.fromTo(
        ridge,
        { strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" },
        index * 0.2,
      );
    });

    tl.fromTo(sun, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power2.out" }, 0.7)
      .fromTo(
        bowlGroups,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.06 },
        0.9,
      )
      .fromTo(steam, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "expo.out", stagger: 0.06 }, 1.1)
      .fromTo(seal, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, 1.5);
  });

  return (
    <div ref={stageRef} className={`${styles.stage} ${styles.scene}`} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 900 360" preserveAspectRatio="xMidYMid slice">
        <circle data-sun cx={770} cy={72} r={44} fill={c.accent} opacity={0.92} />
        <path
          data-ridge
          d={RIDGE_B}
          fill="none"
          stroke={c.ink}
          strokeWidth={22}
          strokeLinecap="round"
          opacity={0.32}
        />
        <path
          data-ridge
          d={RIDGE_A}
          fill="none"
          stroke={c.ink}
          strokeWidth={13}
          strokeLinecap="round"
          opacity={0.88}
        />
        {bowls.map((x) => (
          <g key={x}>
            <g data-steam>
              <path
                d={`M${x - 14} 262 C${x - 28} 240 ${x - 2} 230 ${x - 12} 208 M${x + 12} 262 C${x} 240 ${x + 26} 230 ${x + 16} 208`}
                fill="none"
                stroke={c.ink}
                strokeWidth={4}
                strokeLinecap="round"
                opacity={0.3}
              />
            </g>
            <g data-bowl>
              <path
                d={`M${x - 52} 280 H${x + 52} C${x + 52} 318 ${x + 24} 338 ${x} 338 C${x - 24} 338 ${x - 52} 318 ${x - 52} 280 Z`}
                fill={c.white}
                stroke={c.accent}
                strokeWidth={4}
                strokeLinejoin="round"
              />
              <ellipse cx={x} cy={280} rx={52} ry={9} fill={c.glow} stroke={c.accent} strokeWidth={4} />
            </g>
          </g>
        ))}
        <g data-seal transform="rotate(-6 122 62)">
          <rect x={100} y={40} width={44} height={44} rx={4} fill={c.accent} />
          <rect x={107} y={47} width={30} height={30} fill="none" stroke={c.tint} strokeWidth={2.5} />
          <path d="M122 47 V77 M107 62 H137" stroke={c.tint} strokeWidth={2.5} />
        </g>
      </svg>
    </div>
  );
}
