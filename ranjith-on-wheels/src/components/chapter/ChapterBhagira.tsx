import Image from "next/image";
import type { Chapter } from "@/content/chapters";
import styles from "./Sections.module.css";

// BHAGIRA — layout hook only. This section renders nothing until the owner
// has supplied and approved the details (see content/bhagira.ts): who or what
// Bhagira is, the story, where it belongs in the journey. Nothing about
// Bhagira is assumed here. When a verified entry names this chapter's country,
// a dedicated section appears between the people and the signature moment —
// in the same film-frame language as Page 10 — and no other page changes.
export function ChapterBhagira({ chapter }: { chapter: Chapter }) {
  const entry = chapter.bhagira;
  if (!entry) return null;

  return (
    <section className={styles.bhagira} id="chapter-bhagira">
      <div className={styles.head}>
        <p className={styles.kicker}>{entry.label ?? "Bhagira"}</p>
        <p className={styles.lede}>{entry.text}</p>
      </div>
      {entry.image ? (
        <figure className={styles.bhagiraFrame}>
          <div className={styles.reel}>
            <div className={styles.window}>
              <Image src={entry.image.src} alt={entry.image.alt} fill sizes="(max-width: 900px) 90vw, 40vw" className={styles.windowImage} />
            </div>
          </div>
        </figure>
      ) : null}
    </section>
  );
}
