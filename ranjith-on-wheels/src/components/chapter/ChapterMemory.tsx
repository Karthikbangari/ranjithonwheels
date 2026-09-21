import Image from "next/image";
import type { Chapter } from "@/content/chapters";
import { formatCoords } from "@/lib/coords";
import { heroMap } from "@/lib/chapterGeo";
import type { CountryMedia } from "@/lib/media";
import { Scene } from "./Scene";
import styles from "./Sections.module.css";

// Page 10 — the people, the memory. Slower and more personal than anything
// else in the chapter: film frames, minimal motion, no advertisement.
//
// A frame holds a documentary photograph from the country's `gallery` when
// one exists on disk — the strongest photograph is never re-cropped just to
// move — and a deliberate stand-in until then: the country's outline in the
// warm tones of an old print, with its name, its route coordinates and the
// frame's number. The moment the gallery has a photograph for that frame, the
// frame swaps to it by itself; the page is never redesigned to receive it.
export function ChapterMemory({ chapter, media }: { chapter: Chapter; media: CountryMedia }) {
  const { people, country } = chapter;
  const count = Math.max(people.length, media.gallery.length);
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
        {Array.from({ length: count }, (_, index) => {
          const moment = people[index] ?? null;
          const photograph = media.gallery[index] ?? null;
          const number = String(index + 1).padStart(2, "0");
          return (
            <figure key={moment?.label ?? photograph?.src ?? index} className={styles.frame} data-frame>
              <div className={styles.reel}>
                <div className={styles.rail} data-rail aria-hidden="true" />
                <div className={styles.window}>
                  {photograph ? (
                    <Image src={photograph.src} alt={photograph.alt} fill sizes="(max-width: 900px) 90vw, 40vw" className={styles.windowImage} />
                  ) : (
                    <>
                      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
                        {art.outline ? (
                          <path d={art.outline} fill="var(--story-glow)" fillOpacity={0.3} stroke="var(--story-ink)" strokeOpacity={0.55} strokeWidth={2} strokeLinejoin="round" />
                        ) : (
                          <circle cx={art.anchor[0]} cy={art.anchor[1]} r={70} fill="none" stroke="var(--story-ink)" strokeOpacity={0.55} strokeWidth={2} />
                        )}
                        <circle cx={art.anchor[0]} cy={art.anchor[1]} r={6} fill="var(--story-ink)" opacity={0.7} />
                      </svg>
                      <span className={`${styles.stamp} ${styles.stampName}`}>{country.name}</span>
                      <span className={`${styles.stamp} ${styles.stampCoords}`}>{formatCoords(country.displayAnchor)}</span>
                      <span className={`${styles.stamp} ${styles.stampSlot}`}>Memory {number}</span>
                    </>
                  )}
                </div>
                <div className={styles.rail} data-rail aria-hidden="true" />
              </div>
              <figcaption className={styles.frameCaption}>
                <span className={styles.frameNo}>Frame {number}</span>
                {moment ? (
                  <>
                    <strong>{moment.label}</strong>
                    <span>{moment.text}</span>
                  </>
                ) : photograph ? (
                  <span>{photograph.alt}</span>
                ) : null}
                {photograph?.credit ? <span className={styles.provenance}>{photograph.credit}</span> : null}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </Scene>
  );
}
