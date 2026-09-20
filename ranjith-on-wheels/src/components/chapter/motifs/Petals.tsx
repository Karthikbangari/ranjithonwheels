"use client";

import { c } from "../colors";
import { playOnView, scrubOnView, useChapterMotion } from "../useChapterMotion";
import styles from "../Motifs.module.css";

// Japan — discipline, punctuality, hanami. Petals settle as the page scrolls
// (scroll-linked, reversible); the Shinkansen glides in once and stops
// exactly where it should.
const petals = Array.from({ length: 18 }, (_, i) => ({
  x: 24 + ((i * 0.618034) % 1) * 850,
  y: 30 + ((i * 0.381966 + 0.13) % 1) * 250,
  rotate: (i * 47) % 180,
  scale: 0.8 + ((i * 0.37) % 1) * 0.8,
  fill: i % 3 === 0 ? c.accent : c.glow,
  opacity: i % 3 === 0 ? 0.5 : 0.95,
}));

const blossoms = [40, 110, 190, 270, 350, 420].map((x, i) => ({
  x,
  y: 66 + Math.sin(i * 1.3) * 22 + i * 6,
}));

export function Petals() {
  const stageRef = useChapterMotion((stage, gsap) => {
    const drifting = stage.querySelectorAll("[data-petal]");
    const flowers = stage.querySelectorAll("[data-blossom]");
    const train = stage.querySelector("[data-train]");

    gsap.fromTo(
      drifting,
      {
        y: (i: number) => -110 - (i % 5) * 20,
        x: (i: number) => (i % 2 === 0 ? 26 : -26),
        rotation: -70,
        transformOrigin: "50% 50%",
      },
      { y: 0, x: 0, rotation: 0, ease: "none", scrollTrigger: scrubOnView(stage, "bottom 60%") },
    );

    gsap
      .timeline({ scrollTrigger: playOnView(stage) })
      .fromTo(flowers, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.06 }, 0)
      // Arrives from the left and decelerates to a precise halt.
      .fromTo(train, { x: -640 }, { x: 0, duration: 1.6, ease: "expo.out" }, 0.3);
  });

  return (
    <div ref={stageRef} className={`${styles.stage} ${styles.scene}`} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 900 360" preserveAspectRatio="xMidYMid slice">
        <circle cx={730} cy={84} r={42} fill={c.glow} opacity={0.5} />
        <path
          d="M0 44 C120 40 220 70 330 92 C380 102 420 110 460 130 M150 56 C180 90 200 110 226 140 M290 84 C310 60 340 40 380 32"
          fill="none"
          stroke={c.ink}
          strokeWidth={9}
          strokeLinecap="round"
          opacity={0.75}
        />
        {blossoms.map((flower) => (
          <g key={flower.x} data-blossom>
            <circle cx={flower.x} cy={flower.y} r={17} fill={c.glow} />
            <circle cx={flower.x + 13} cy={flower.y - 8} r={12} fill={c.glow} opacity={0.85} />
            <circle cx={flower.x - 11} cy={flower.y - 10} r={11} fill={c.white} opacity={0.6} />
            <circle cx={flower.x} cy={flower.y} r={4} fill={c.accent} />
          </g>
        ))}
        {petals.map((petal, i) => (
          <g key={i} data-petal>
            <ellipse
              cx={petal.x}
              cy={petal.y}
              rx={10 * petal.scale}
              ry={5.5 * petal.scale}
              fill={petal.fill}
              opacity={petal.opacity}
              transform={`rotate(${petal.rotate} ${petal.x} ${petal.y})`}
            />
          </g>
        ))}
        <rect x={0} y={322} width={900} height={38} fill={c.ink} opacity={0.12} />
        <path d="M0 322 H900" stroke={c.ink} strokeWidth={3} opacity={0.35} />
        <g data-train>
          <g transform="translate(560 322)">
            <path d="M0 -8 H250 C286 -8 310 -20 318 -30 C300 -46 280 -56 246 -56 H0 Z" fill={c.white} stroke={c.ink} strokeWidth={3} strokeLinejoin="round" />
            <rect x={0} y={-30} width={310} height={7} fill={c.accent} />
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={16 + i * 30} y={-46} width={16} height={10} rx={2} fill={c.ink} opacity={0.65} />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
