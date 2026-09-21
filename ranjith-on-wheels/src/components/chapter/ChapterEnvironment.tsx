import type { Chapter } from "@/content/chapters";
import { seeded } from "@/lib/contours";
import { Scene } from "./Scene";
import styles from "./Sections.module.css";

const round = (value: number) => Math.round(value * 10) / 10;

// A seismograph trace: quiet, then a violent tremor that decays to a flat
// line. Seeded, so it draws the same every build.
function seismograph(seed: number) {
  const random = seeded(seed);
  const points: string[] = [];
  for (let x = 0; x <= 1200; x += 10) {
    const strength = x < 180 ? 0 : Math.max(0, 1 - (x - 180) / 620);
    const y = 560 + (random() - 0.5) * 2 * 90 * strength * strength;
    points.push(`${x === 0 ? "M" : "L"}${x} ${round(y)}`);
  }
  return points.join("");
}

// Page 8 — the natural environment. It exists only where a summary names a
// feature of the country's setting — the volcanic geography of Indonesia, the
// seismic terrain of Taiwan — and it is atmospheric and factual: embers
// rising off the Ring of Fire, a seismograph tracing a trace. It is a
// description of the *region*. Nothing here says or implies he met an
// eruption or felt an earthquake (CLAUDE.md §0 decision #21), which is why
// the tag reads "Regional terrain" / "Natural environment" and never anything
// like a danger encountered.
export function ChapterEnvironment({ chapter }: { chapter: Chapter }) {
  const { environment, atmosphere } = chapter;
  if (!environment || !atmosphere.environment) return null;
  const { fx, label } = atmosphere.environment;
  const random = seeded(atmosphere.terrain.seed + 5);

  return (
    <Scene name="environment" className={styles.environment} id="chapter-environment">
      {fx === "embers" ? (
        <svg className={styles.environmentArt} viewBox="0 0 1200 675" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
          <path d="M0 675 V560 L330 470 L470 380 L560 300 Q600 270 640 300 L740 380 L900 470 L1200 560 V675 Z" fill="#000" opacity={0.28} />
          {Array.from({ length: 34 }, (_, index) => {
            const depth = round(0.3 + random() * 1.1);
            return (
              <g key={index} data-fx data-depth={depth} data-heavy={index % 2 === 1 ? "" : undefined}>
                <circle
                  cx={round(380 + random() * 440)}
                  cy={round(300 + random() * 360)}
                  r={round(1.5 + random() * 3.2)}
                  fill="var(--story-glow)"
                  opacity={round(0.5 + random() * 0.5)}
                />
              </g>
            );
          })}
        </svg>
      ) : null}
      {fx === "tremor" ? (
        <svg className={styles.environmentArt} viewBox="0 0 1200 675" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
          <path
            data-trace
            d={seismograph(atmosphere.terrain.seed)}
            fill="none"
            stroke="var(--story-glow)"
            strokeWidth={3}
            strokeLinejoin="round"
            opacity={0.9}
          />
        </svg>
      ) : null}

      <div className={styles.environmentCopy} data-jitter>
        <p className={styles.kickerLight} data-reveal>
          {label}
        </p>
        <h2 className={styles.h2Light} data-reveal>
          {environment.label}
        </h2>
        <p className={styles.ledeLight} data-reveal>
          {environment.text}
        </p>
      </div>
    </Scene>
  );
}
