import Image from "next/image";
import Link from "next/link";
import type { JourneyCountry } from "@/content/journey";
import styles from "./JourneyChapterPanel.module.css";

export function JourneyChapterPanel({ country }: { country: JourneyCountry }) {
  return (
    <div className={styles.panel}>
      <div className={styles.thumb}>
        <Image
          src={country.coverImage}
          alt={country.coverAlt}
          fill
          sizes="84px"
          className={styles.thumbImage}
        />
      </div>
      <div className={styles.body}>
        <span className={styles.chapter}>
          Country {country.order} — {country.name}
        </span>
        <p className={styles.title}>{country.summary}</p>
        <Link href={`/journey/${country.slug}`} className={styles.link}>
          Open full chapter
        </Link>
      </div>
    </div>
  );
}
