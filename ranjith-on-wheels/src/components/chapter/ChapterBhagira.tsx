import Image from "next/image";
import type { Chapter } from "@/content/chapters";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Sections.module.css";

// BHAGIRA — layout hook only. Renders nothing until the owner has supplied
// and approved the details (see content/bhagira.ts): who or what Bhagira is,
// the story, where it belongs. Nothing about Bhagira is assumed here.
export function ChapterBhagira({ chapter }: { chapter: Chapter }) {
  const entry = chapter.bhagira;
  if (!entry) return null;

  return (
    <section className={`${styles.bhagira} fade`} id="chapter-bhagira">
      <div className={styles.head}>
        <Eyebrow>{entry.label ?? "Bhagira"}</Eyebrow>
        <p className={styles.lede}>{entry.text}</p>
      </div>
      {entry.image ? (
        <figure className={styles.bhagiraFrame}>
          <div className={styles.window}>
            <Image src={entry.image.src} alt={entry.image.alt} fill sizes="(max-width: 900px) 90vw, 40vw" className={styles.windowImage} />
          </div>
        </figure>
      ) : null}
    </section>
  );
}
