"use client";

import { c } from "../colors";
import { playOnView, useChapterMotion } from "../useChapterMotion";
import styles from "../Motifs.module.css";

// Taiwan — fireworks from Taipei 101 every New Year's Eve, in a country
// engineered to ride out earthquakes. An abstract stacked-tower silhouette,
// five bursts, and a seismograph trace that settles to a flat line.
const RAYS = 18;
const bursts = [
  { x: 300, y: 118, r: 96, color: c.glow },
  { x: 600, y: 96, r: 106, color: c.accent },
  { x: 168, y: 196, r: 64, color: c.accent },
  { x: 738, y: 204, r: 70, color: c.glow },
  { x: 450, y: 44, r: 54, color: c.accent },
];

const SEISMOGRAPH =
  "M0 334 L70 334 L86 312 L102 356 L118 308 L134 358 L150 316 L164 350 L178 322 L192 344 L206 328 L222 340 L240 331 L262 337 L300 334 L900 334";

export function Fireworks() {
  const stageRef = useChapterMotion((stage, gsap) => {
    const burstGroups = stage.querySelectorAll("[data-burst]");
    const trace = stage.querySelector<SVGPathElement>("[data-trace]");

    const tl = gsap.timeline({ scrollTrigger: playOnView(stage) });

    burstGroups.forEach((burst, index) => {
      tl.fromTo(
        burst.querySelectorAll("[data-ray]"),
        { scaleY: 0, opacity: 1, transformOrigin: "50% 100%" },
        // Settles at the same half-glow the page renders without JS.
        { scaleY: 1, opacity: 0.55, duration: 1.1, ease: "expo.out" },
        0.3 + index * 0.22,
      );
    });

    if (trace) {
      const length = trace.getTotalLength();
      trace.style.strokeDasharray = `${length}`;
      // Drawn along its length via stroke-dashoffset: a path can't be traced
      // with a transform.
      tl.fromTo(
        trace,
        { strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" },
        0,
      );
    }
  });

  return (
    <div ref={stageRef} className={`${styles.stage} ${styles.scene}`} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 900 360" preserveAspectRatio="xMidYMid slice">
        {bursts.map((burst) => (
          <g key={`${burst.x}-${burst.y}`} data-burst transform={`translate(${burst.x} ${burst.y})`}>
            {Array.from({ length: RAYS }, (_, i) => (
              <g key={i} transform={`rotate(${(360 / RAYS) * i})`}>
                <line
                  data-ray
                  x1={0}
                  y1={-burst.r * 0.28}
                  x2={0}
                  y2={-burst.r}
                  stroke={burst.color}
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  opacity={0.55}
                />
              </g>
            ))}
          </g>
        ))}
        <rect x={0} y={306} width={900} height={54} fill={c.accent} opacity={0.12} />
        <g>
          <rect x={378} y={292} width={144} height={14} rx={2} fill={c.ink} />
          {Array.from({ length: 8 }, (_, i) => (
            <path
              key={i}
              d={`M${450 - 20 - i * 0.5} ${290 - i * 22} H${450 + 20 + i * 0.5} L${450 + 25 + i * 0.5} ${270 - i * 22} H${450 - 25 - i * 0.5} Z`}
              fill={i % 2 === 0 ? c.accent : c.ink}
            />
          ))}
          {[0, 1, 2].map((i) => (
            <rect key={i} x={450 - (17 - i * 4)} y={112 - i * 14} width={(17 - i * 4) * 2} height={12} fill={c.accent} />
          ))}
          <path d="M450 84 V34" stroke={c.ink} strokeWidth={4} strokeLinecap="round" />
        </g>
        <path data-trace d={SEISMOGRAPH} fill="none" stroke={c.ink} strokeWidth={3} strokeLinejoin="round" opacity={0.6} />
      </svg>
    </div>
  );
}
