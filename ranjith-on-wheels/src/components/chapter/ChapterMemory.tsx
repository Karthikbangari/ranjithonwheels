import Image from "next/image";
import type { Chapter } from "@/content/chapters";
import { heroMap } from "@/lib/chapterGeo";
import { Scene } from "./Scene";
import styles from "./Sections.module.css";

// Page 10 — The people, the memory. Slower and more personal than anything
// else in the chapter: film frames, minimal motion, no advertisement. A frame
// holds a documentary photograph from the country's `gallery` when there is
// one — the strongest photograph is never re-cropped just to move — and the
// country's own outline, in the warm tones of an old print, until then.
export function ChapterMemory({ chapter }: { chapter: Chapter }) {
  const { people, country } = chapter;
  const art = heroMap(country.slug, country.displayAnchor, 600, 400, [
    [60, 40],
    [540, 360],
  ]);

  return (
    <Scene name="memory" className={styles.memory} id="chapter-memory">
      <div className={styles.head}>
        <p className={styles.kicker} data-reveal>
          The people
        </p>
        <h2 className={styles.h2} data-reveal>
          What stayed with him in {country.name}.
        </h2>
      </div>
      <div className={styles.filmStrip}>
        {people.map((moment, index) => {
          const photograph = country.gallery[index];
          return (
            <figure key={moment.label} className={styles.frame} data-frame>
              <div className={styles.reel}>
              <div className={styles.rail} data-rail aria-hidden="true" />
              <div className={styles.window}>
                {photograph ? (
                  <Image src={photograph.src} alt={photograph.alt} fill sizes="(max-width: 900px) 90vw, 40vw" className={styles.windowImage} />
                ) : (
                  <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
                    {art.outline ? (
                      <path d={art.outline} fill="var(--story-glow)" fillOpacity={0.3} stroke="var(--story-ink)" strokeOpacity={0.55} strokeWidth={2} strokeLinejoin="round" />
                    ) : (
                      <circle cx={art.anchor[0]} cy={art.anchor[1]} r={70} fill="none" stroke="var(--story-ink)" strokeOpacity={0.55} strokeWidth={2} />
                    )}
                    <circle cx={art.anchor[0]} cy={art.anchor[1]} r={6} fill="var(--story-ink)" opacity={0.7} />
                  </svg>
                )}
              </div>
              <div className={styles.rail} data-rail aria-hidden="true" />
              </div>
              <figcaption className={styles.frameCaption}>
                <span className={styles.frameNo}>Frame {String(index + 1).padStart(2, "0")}</span>
                <strong>{moment.label}</strong>
                <span>{moment.text}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </Scene>
  );
}
