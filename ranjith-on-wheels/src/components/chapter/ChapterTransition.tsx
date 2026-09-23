import Link from "next/link";
import type { Chapter } from "@/content/chapters";
import styles from "./Sections.module.css";

// Page 13 — into the next chapter. A plain link forward: the next country's
// coordinates and name, or — after the last country reached so far — the
// Support page (QR + UPI shown directly there, no extra click), which itself
// links on to the Follow ending. Previous and "all chapters" sit below it for
// anyone navigating backward.
export function ChapterTransition({ chapter }: { chapter: Chapter }) {
  const { next, previous } = chapter;

  return (
    <section className={`${styles.transition} fade`} id="chapter-transition">
      {next ? (
        <Link href={`/journey/${next.slug}`} className={styles.nextLink}>
          <span className={styles.nextLabel}>Next</span> Enter {next.name}
        </Link>
      ) : (
        <Link href="/support" className={styles.nextLink}>
          <span className={styles.nextLabel}>The road continues</span> Support the next kilometre
        </Link>
      )}
      <nav className={styles.chapterNav} aria-label="Chapter navigation">
        {previous ? <Link href={`/journey/${previous.slug}`}>← {previous.name}</Link> : <span />}
        <Link href="/journey">All chapters</Link>
      </nav>
    </section>
  );
}
