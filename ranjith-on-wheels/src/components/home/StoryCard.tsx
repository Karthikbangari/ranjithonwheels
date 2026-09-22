import Link from "next/link";
import type { JourneyCountry } from "@/content/journey";
import { CountryCoverImage } from "@/components/journey/CountryCoverImage";
import styles from "./StoryCard.module.css";

// One country as a card: its photograph (or, until it has one, its own map),
// a headline, and a link into its chapter. `headline` is set for a full story
// (the summary then reads as body text); a country with only a one-line teaser
// uses that line as the headline.
export function StoryCard({ country, headline }: { country: JourneyCountry; headline?: string }) {
  return (
    <article className={`${styles.card} fade`}>
      <div className={styles.media}>
        <CountryCoverImage
          slug={country.slug}
          anchor={country.displayAnchor}
          src={country.coverImage}
          alt={country.coverAlt}
          sizes="(max-width: 899px) 100vw, 33vw"
        />
      </div>
      <div className={styles.copy}>
        <span className={styles.label}>
          Country {country.order} — {country.name}
        </span>
        <h3 className={styles.headline}>{headline ?? country.summary ?? country.name}</h3>
        {headline && country.summary ? <p className={styles.summary}>{country.summary}</p> : null}
        <Link href={`/journey/${country.slug}`} className={styles.link}>
          Open the chapter
        </Link>
      </div>
    </article>
  );
}
