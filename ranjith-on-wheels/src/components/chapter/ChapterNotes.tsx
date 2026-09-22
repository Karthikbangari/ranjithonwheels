import type { Chapter } from "@/content/chapters";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Sections.module.css";

// A country with a long summary but no story pages yet (South Korea): the
// summary already on the site stays, as plain notes, until its own chapter
// pages are written. Renders nothing when there is none.
export function ChapterNotes({ chapter }: { chapter: Chapter }) {
  if (!chapter.notes) return null;
  return (
    <section className={`${styles.notes} fade`} id="chapter-notes">
      <Eyebrow>The story so far</Eyebrow>
      <p className={styles.lede}>{chapter.notes}</p>
    </section>
  );
}
