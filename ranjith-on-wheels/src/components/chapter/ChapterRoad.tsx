import type { Chapter } from "@/content/chapters";
import { Scene } from "./Scene";
import { BikeGlyph } from "./motifs/BikeGlyph";
import { c } from "./colors";
import styles from "./Sections.module.css";

const DASH_PERIOD = 120;

// Page 7 — The road. The ride through the country, held on screen (pinned on a
// desktop) while the road slides past, the wheels turn, the odometer climbs and
// each place on the ride lights up in turn. Its steps are the story's `road`
// moments; the kilometres are the story's own figure. Without those moments
// the page doesn't exist — the route itself is never invented.
export function ChapterRoad({ chapter }: { chapter: Chapter }) {
  const { story, road } = chapter;
  const distance = story?.stats.find((stat) => stat.unit === "km") ?? null;

  return (
    <Scene name="road" className={styles.road} id="chapter-road">
      <div className={styles.head}>
        <p className={styles.kicker} data-reveal>
          The road
        </p>
        <h2 className={styles.h2} data-reveal>
          Through {chapter.country.name}, kilometre by kilometre.
        </h2>
      </div>

      {/* The full-width wrapper is what gets pinned: pinning the centred panel
          itself would drop its auto margins and jump it to the left edge. */}
      <div className={styles.roadPin} data-panel>
      <div className={styles.roadPanel}>
        <div className={styles.roadScene}>
          <svg viewBox="0 0 900 360" preserveAspectRatio="xMidYMid slice" className={styles.roadSvg} aria-hidden="true" focusable="false">
            <circle cx={760} cy={92} r={44} fill={c.glow} opacity={0.75} />
            <path d="M0 266 V210 Q120 140 260 205 T520 185 T780 198 T900 176 V266 Z" fill={c.glow} opacity={0.28} />
            <rect x={0} y={266} width={900} height={94} fill={c.ink} opacity={0.92} />
            <g data-dashes>
              {Array.from({ length: 16 }, (_, i) => (
                <rect key={i} x={-DASH_PERIOD + i * DASH_PERIOD} y={308} width={60} height={6} rx={3} fill={c.tint} />
              ))}
            </g>
            <g transform="translate(450 266) scale(2.4)">
              <BikeGlyph rider />
            </g>
          </svg>
          {distance ? (
            <div className={styles.odometer}>
              <span data-count data-total={distance.value}>
                {distance.value.toLocaleString("en-US")}
              </span>
              <small>{distance.unit}</small>
            </div>
          ) : null}
        </div>

        <ol className={styles.steps}>
          {road.map((moment, index) => (
            <li key={moment.label} className={styles.step} data-step>
              <span className={styles.stepIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={styles.stepLabel}>{moment.label}</h3>
                <p className={styles.stepText}>{moment.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.track} aria-hidden="true">
          <span className={styles.trackLine}>
            <span className={styles.trackFill} data-fill />
          </span>
          {road.map((moment) => (
            <span key={moment.label} className={styles.pin} data-pin>
              <i />
              {moment.label}
            </span>
          ))}
        </div>
      </div>
      </div>
    </Scene>
  );
}
