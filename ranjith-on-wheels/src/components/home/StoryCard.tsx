import Link from "next/link";
import type { CSSProperties } from "react";
import type { JourneyCountry } from "@/content/journey";
import { getAtmosphere } from "@/content/atmospheres";
import { CountryCoverImage } from "@/components/journey/CountryCoverImage";
import styles from "./StoryCard.module.css";

// One country as a full photographic card — the real photograph, or (until
// one exists) the country's own terrain map, same fallback rule as
// JourneyArchive and the chapter hero (CLAUDE.md §8: never an empty frame).
// The whole card is the link into its chapter, and the small country label is
// tinted with that country's own accent (atmospheres.ts) so each card carries
// a hint of its own place without a page-level colour mood (decision #23).
// `headline` is set for a full story (the summary then reads as body text); a
// country with only a one-line teaser uses that line as the headline.
export function StoryCard({ country, headline }: { country: JourneyCountry; headline?: string }) {
  const { theme } = getAtmosphere(country.slug);

  return (
    <Link
      href={`/journey/${country.slug}`}
      className={`${styles.card} fade`}
      style={{ "--card-accent": theme.accent } as CSSProperties}
    >
      <div className={styles.media}>
        <CountryCoverImage
          slug={country.slug}
          anchor={country.displayAnchor}
          src={country.coverImage}
          alt={country.coverAlt}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className={styles.zoomHint} aria-hidden="true">
          Open the chapter →
        </span>
      </div>
      {/* The caption restates the photograph's own alt text (coverAlt) —
          nothing new is written here, so a country still waiting on a
          photograph gets an honest caption too ("standing in until a
          journey photograph is sourced") rather than a blank line. */}
      <p className={styles.caption}>{country.coverAlt}</p>
      <div className={styles.copy}>
        <span className={styles.label}>
          Country {country.order} — {country.name}
        </span>
        <h3 className={styles.headline}>{headline ?? country.summary ?? country.name}</h3>
        {headline && country.summary ? <p className={styles.summary}>{country.summary}</p> : null}
        <span className={styles.link}>Open the chapter →</span>
      </div>
    </Link>
  );
}
