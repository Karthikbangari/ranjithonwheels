import Link from "next/link";
import type { JourneyCountry } from "@/content/journey";
import { CountryCoverImage } from "@/components/journey/CountryCoverImage";
import styles from "./JourneyChapterPanel.module.css";

export function JourneyChapterPanel({ country }: { country: JourneyCountry }) {
  return (
    <div className={styles.panel}>
      <div className={styles.thumb}>
        <CountryCoverImage
          slug={country.slug}
          anchor={country.displayAnchor}
          src={country.coverImage}
          alt={country.coverAlt}
          sizes="84px"
          className={styles.thumbImage}
        />
      </div>
      <div className={styles.body}>
        <span className={styles.chapter}>
          Country {country.order} — {country.name}
        </span>
        {country.summary ? <p className={styles.title}>{country.summary}</p> : null}
        <Link href={`/journey/${country.slug}`} className={styles.link}>
          Open full chapter
        </Link>
      </div>
    </div>
  );
}
