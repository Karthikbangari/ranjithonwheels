import Link from "next/link";
import type { JourneyCountry } from "@/content/journey";
import styles from "./StoryCard.module.css";

// One country as a text card: a headline and a link into its chapter — no
// map or photograph on the card itself (the owner asked for the country
// outline maps removed from these cards). `headline` is set for a full story
// (the summary then reads as body text); a country with only a one-line
// teaser uses that line as the headline. The real photograph (or, until one
// exists, the country's own terrain map) still lives on the chapter page
// itself, one click away.
export function StoryCard({ country, headline }: { country: JourneyCountry; headline?: string }) {
  return (
    <article className={`${styles.card} fade`}>
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
