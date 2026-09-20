import Link from "next/link";
import type { Chapter } from "@/content/chapters";
import { followCta } from "@/content/navigation";
import { formatCoords } from "@/lib/coords";
import { Scene } from "./Scene";
import { TransitionLink } from "./TransitionLink";
import styles from "./Sections.module.css";

// Page 13 — The chapter transition. Deliberately almost empty: this country's
// name fades behind us, the next country's coordinates appear, the road line
// carries on — and the button doesn't cut to the next page, it hands off (see
// TransitionLink). After Slovakia the hand-off is to the Follow ending.
export function ChapterTransition({ chapter }: { chapter: Chapter }) {
  const { country, next, previous } = chapter;

  return (
    <Scene name="transition" className={styles.transition} id="chapter-transition">
      <p className={styles.ghostName} data-fade aria-hidden="true">
        {country.name}
      </p>
      <span className={styles.roadLine} data-road aria-hidden="true" />

      <div className={styles.nextBlock}>
        {next ? (
          <>
            <p className={styles.nextCoords} data-reveal>
              Next · {String(next.order).padStart(2, "0")} · {formatCoords(next.displayAnchor)}
            </p>
            <TransitionLink
              href={`/journey/${next.slug}`}
              name={next.name}
              coords={formatCoords(next.displayAnchor)}
              from={chapter.nextHero.from}
              to={chapter.nextHero.to}
              className={styles.nextLink}
            >
              <span data-reveal>Enter {next.name}</span>
            </TransitionLink>
          </>
        ) : (
          <>
            <p className={styles.nextCoords} data-reveal>
              The road goes on
            </p>
            <Link href={followCta.href} className={styles.nextLink}>
              <span data-reveal>{followCta.label}</span>
            </Link>
          </>
        )}
        <nav className={styles.chapterNav} aria-label="Chapter navigation" data-reveal>
          {previous ? <Link href={`/journey/${previous.slug}`}>← {previous.name}</Link> : <span />}
          <Link href="/journey">All chapters</Link>
        </nav>
      </div>
    </Scene>
  );
}
