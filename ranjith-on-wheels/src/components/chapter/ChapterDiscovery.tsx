import type { Chapter } from "@/content/chapters";
import { heroMap } from "@/lib/chapterGeo";
import { Scene } from "./Scene";
import styles from "./Sections.module.css";

// Page 9 — The discovery. The brightest page in the chapter: the country's
// tint, a big outline of the country itself drawing on behind, and each
// discovery in large type with its own name sliding across as an outlined
// word. Brighter and more visual than the challenge page, deliberately.
export function ChapterDiscovery({ chapter }: { chapter: Chapter }) {
  const { discovery, country } = chapter;
  const art = heroMap(country.slug, country.displayAnchor, 800, 600, [
    [50, 40],
    [750, 560],
  ]);

  return (
    <Scene name="discovery" className={styles.discovery} id="chapter-discovery">
      <svg className={styles.discoveryArt} viewBox="0 0 800 600" preserveAspectRatio="xMaxYMid meet" aria-hidden="true" focusable="false">
        {art.outline ? (
          <path
            data-outline
            d={art.outline}
            fill="var(--story-glow)"
            fillOpacity={0.22}
            stroke="var(--story-accent)"
            strokeWidth={2}
            strokeLinejoin="round"
          />
        ) : (
          <g fill="none" stroke="var(--story-accent)" strokeWidth={2}>
            {[40, 90, 150, 220].map((radius) => (
              <circle key={radius} data-outline cx={art.anchor[0]} cy={art.anchor[1]} r={radius} opacity={0.7} />
            ))}
          </g>
        )}
      </svg>

      <p className={styles.kicker} data-reveal>
        The discovery
      </p>
      {discovery.map((moment) => (
        <article key={moment.label} className={styles.discoveryItem}>
          <span className={styles.bigWord} data-word aria-hidden="true">
            {moment.label}
          </span>
          <div className={styles.discoveryCopy} data-reveal>
            <h2 className={styles.h2}>{moment.label}</h2>
            <p className={styles.discoveryText}>{moment.text}</p>
          </div>
        </article>
      ))}
    </Scene>
  );
}
