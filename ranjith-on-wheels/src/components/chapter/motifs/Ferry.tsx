"use client";

import type { Story } from "@/content/stories";
import { c } from "../colors";
import { scrubOnView, useChapterMotion } from "../useChapterMotion";
import styles from "../Motifs.module.css";

// Indonesia — a 32-hour ferry from Singapore with no signal at all. The
// crossing is scroll-linked: the clock counts the hours, the swell slides
// past, and the volcano of the Ring of Fire comes up out of the haze.
const WAVE_PERIOD = 300;
const wave = (top: number) =>
  `M0 ${top} q75 -22 150 0${" t150 0".repeat(11)} V360 H0 Z`;

export function Ferry({ story }: { story: Story }) {
  const hours = story.stats.find((stat) => stat.unit === "hours")?.value ?? 0;

  const stageRef = useChapterMotion((stage, gsap) => {
    const swells = stage.querySelectorAll("[data-swell]");
    const boat = stage.querySelector("[data-ferry]");
    const volcano = stage.querySelector("[data-volcano]");
    const clock = stage.querySelector<HTMLElement>("[data-hours]");

    const counter = { value: 0 };
    // Text, not a transform — the ferry clock is a counter. Written from the
    // trigger's own refresh/update as well as the tween: ScrollTrigger applies
    // an already-scrolled position with tween callbacks suppressed.
    const sync = () => {
      if (clock) clock.textContent = `${Math.round(counter.value)} of ${hours} hours`;
    };
    sync();

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { ...scrubOnView(stage), onRefresh: sync, onUpdate: sync },
    });
    // One whole wave period, so the end frame matches the resting frame.
    tl.fromTo(swells, { x: 0 }, { x: -WAVE_PERIOD }, 0);
    tl.fromTo(boat, { x: -480 }, { x: 0 }, 0);
    tl.fromTo(volcano, { opacity: 0.12 }, { opacity: 1 }, 0.45);
    if (clock) tl.to(counter, { value: hours, onUpdate: sync }, 0);
  });

  return (
    <div ref={stageRef} className={styles.stage} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 900 360" preserveAspectRatio="xMidYMid meet">
        <circle cx={220} cy={96} r={40} fill={c.glow} opacity={0.7} />
        <g data-volcano>
          <path d="M690 262 L772 128 Q782 116 792 128 L880 262 Z" fill={c.ink} opacity={0.3} />
          <path d="M760 142 L772 128 Q782 116 792 128 L800 142 Q780 152 760 142 Z" fill={c.glow} />
        </g>
        <g data-swell>
          <path d={wave(252)} fill={c.glow} opacity={0.5} transform="translate(-150 0)" />
        </g>
        <g data-ferry>
          <g transform="translate(600 254)">
            <path d="M-78 0 H84 L62 34 H-56 Z" fill={c.ink} />
            <rect x={-38} y={-38} width={78} height={38} rx={4} fill={c.white} stroke={c.ink} strokeWidth={3} />
            {[-26, -8, 10, 28].map((x) => (
              <rect key={x} x={x} y={-28} width={10} height={12} rx={2} fill={c.accent} />
            ))}
            <rect x={14} y={-58} width={16} height={20} fill={c.accent} />
          </g>
        </g>
        <g data-swell>
          <path d={wave(284)} fill={c.accent} opacity={0.45} transform="translate(-150 0)" />
        </g>
        <g data-swell>
          <path d={wave(316)} fill={c.accent} opacity={0.85} transform="translate(-150 0)" />
        </g>
      </svg>
      <div className={styles.clock} data-hours>
        {hours} of {hours} hours
      </div>
      <div className={styles.signal}>
        <svg viewBox="0 0 20 16" fill="none">
          {[0, 1, 2, 3].map((bar) => (
            <rect key={bar} x={bar * 5} y={12 - bar * 4} width={3.4} height={4 + bar * 4} rx={1} fill={c.ink} opacity={0.28} />
          ))}
          <path d="M1 15 L19 1" stroke={c.accent} strokeWidth={2} strokeLinecap="round" />
        </svg>
        No signal
      </div>
    </div>
  );
}
