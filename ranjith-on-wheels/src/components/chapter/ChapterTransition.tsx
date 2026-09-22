import Link from "next/link";
import type { Chapter } from "@/content/chapters";
import { followCta } from "@/content/navigation";
import styles from "./Sections.module.css";

// Page 13 — into the next chapter. A plain link forward: the next country's
// coordinates and name, or — after Slovakia — the Follow ending. Previous and
// "all chapters" sit below it for anyone navigating backward.
export function ChapterTransition({ chapter }: { chapter: Chapter }) {
  const { next, previous } = chapter;

  return (
    <section className={`${styles.transition} fade`} id="chapter-transition">
      {next ? (
        <Link href={`/journey/${next.slug}`} className={styles.nextLink}>
          <span className={styles.nextLabel}>Next</span> Enter {next.name}
        </Link>
      ) : (
        <Link href={followCta.href} className={styles.nextLink}>
          <span className={styles.nextLabel}>The road goes on</span> {followCta.label}
        </Link>
      )}
      <nav className={styles.chapterNav} aria-label="Chapter navigation">
        {previous ? <Link href={`/journey/${previous.slug}`}>← {previous.name}</Link> : <span />}
        <Link href="/journey">All chapters</Link>
      </nav>
    </section>
  );
}
