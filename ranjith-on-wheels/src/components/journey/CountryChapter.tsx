import Link from "next/link";
import type { JourneyCountry } from "@/content/journey";
import { atlasChapters } from "@/content/atlas";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { ReadingProgress } from "./ReadingProgress";
import styles from "./CountryChapter.module.css";

export function CountryChapter({
  country,
  previous,
  next,
}: {
  country: JourneyCountry;
  previous: JourneyCountry | null;
  next: JourneyCountry | null;
}) {
  const chapterLabel = atlasChapters.find((chapter) => chapter.id === country.chapter)?.label;

  const blocks = [
    { label: "The story", text: country.summary },
    { label: "What happened", text: country.challengeStory },
    { label: "Who or what helped", text: country.kindnessStory },
    { label: "Who or what helped", text: country.whoHelped },
    { label: "What the road taught him", text: country.lesson },
  ].filter((block, index, all) => block.text && all.findIndex((b) => b.text === block.text) === index);

  return (
    <>
      <ReadingProgress />
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <FallbackImage
            src={country.coverImage}
            alt={country.coverAlt}
            priority
            sizes="100vw"
            pendingLabel={`${country.name} photograph pending`}
          />
        </div>
        <div className={styles.gradient} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            Country {country.order} — {chapterLabel}
          </span>
          <h1 className={styles.headline}>{country.name}</h1>
        </div>
      </section>
      <article className={styles.body}>
        {blocks.map((block) => (
          <div key={block.label + block.text} className={styles.block}>
            <span className={styles.blockLabel}>{block.label}</span>
            <p className={styles.blockText}>{block.text}</p>
          </div>
        ))}
      </article>
      <nav className={styles.nav} aria-label="Country navigation">
        {previous ? (
          <Link href={`/journey/${previous.slug}`} className={styles.navLink}>
            <span className={styles.navLabel}>Previous</span>
            <span className={styles.navName}>{previous.name}</span>
          </Link>
        ) : (
          <Link href="/journey" className={styles.navLink}>
            <span className={styles.navLabel}>Back to</span>
            <span className={styles.navName}>The full journey</span>
          </Link>
        )}
        {next ? (
          <Link href={`/journey/${next.slug}`} className={`${styles.navLink} ${styles.navLinkEnd}`}>
            <span className={styles.navLabel}>Next</span>
            <span className={styles.navName}>{next.name}</span>
          </Link>
        ) : (
          <Link href="/" className={`${styles.navLink} ${styles.navLinkEnd}`}>
            <span className={styles.navLabel}>Back to</span>
            <span className={styles.navName}>The homepage</span>
          </Link>
        )}
      </nav>
    </>
  );
}
