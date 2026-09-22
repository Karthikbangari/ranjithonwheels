import Image from "next/image";
import type { Chapter } from "@/content/chapters";
import { formatCoords } from "@/lib/coords";
import { heroMap } from "@/lib/chapterGeo";
import type { CountryMedia } from "@/lib/media";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Sections.module.css";

// Page 10 — the people, the memory. A frame holds a documentary photograph
// from the country's `gallery` when one exists on disk — the strongest
// photograph is never re-cropped just to move — and a deliberate stand-in
// until then: the country's own outline, its name, its coordinates and the
// frame's number. The moment the gallery has a photograph for that frame, the
// frame swaps to it by itself; the page is never redesigned to receive it.
export function ChapterMemory({ chapter, media }: { chapter: Chapter; media: CountryMedia }) {
  const { people, country } = chapter;
  const count = Math.max(people.length, media.gallery.length);
  const art = heroMap(country.slug, country.displayAnchor, 600, 400, [
    [60, 60],
    [540, 340],
  ]);

  return (
    <section className={`${styles.memory} fade`} id="chapter-memory">
      <div className={styles.head}>
        <Eyebrow>The people</Eyebrow>
        <h2 className={styles.h2}>What stayed with him in {country.name}.</h2>
      </div>
      <div className={styles.filmStrip}>
        {Array.from({ length: count }, (_, index) => {
          const moment = people[index] ?? null;
          const photograph = media.gallery[index] ?? null;
          const number = String(index + 1).padStart(2, "0");
          return (
            <figure key={moment?.label ?? photograph?.src ?? index} className={styles.frame}>
              <div className={styles.window}>
                {photograph ? (
                  <Image src={photograph.src} alt={photograph.alt} fill sizes="(max-width: 900px) 90vw, 40vw" className={styles.windowImage} />
                ) : (
                  <>
                    <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
                      {art.outline ? (
                        <path d={art.outline} fill="var(--land)" stroke="var(--ink-soft)" strokeWidth={1.4} strokeLinejoin="round" />
                      ) : (
                        <circle cx={art.anchor[0]} cy={art.anchor[1]} r={70} fill="none" stroke="var(--ink-soft)" strokeWidth={1.4} />
                      )}
                    </svg>
                    <span className={`${styles.stamp} ${styles.stampName}`}>{country.name}</span>
                    <span className={`${styles.stamp} ${styles.stampCoords}`}>{formatCoords(country.displayAnchor)}</span>
                    <span className={`${styles.stamp} ${styles.stampSlot}`}>Memory {number}</span>
                  </>
                )}
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
    </section>
  );
}
