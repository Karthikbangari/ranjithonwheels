import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { JourneyCountry } from "@/content/journey";
import { getAtmosphere } from "@/content/atmospheres";
import { resolveMedia } from "@/lib/media";
import { fallbackPhotoFor } from "@/content/fallbackPhotos";
import styles from "./StoryCard.module.css";

// One country as a full photographic card — the real photograph, or (until
// one exists) a real, already-published photo of Ranjith reused from
// elsewhere on the site (owner's direction — no map illustration here). The
// whole card is the link into its chapter, and the small country label is
// tinted with that country's own accent (atmospheres.ts) so each card carries
// a hint of its own place without a page-level colour mood (decision #23).
// `headline` is set for a full story (the summary then reads as body text); a
// country with only a one-line teaser uses that line as the headline.
export function StoryCard({ country, headline }: { country: JourneyCountry; headline?: string }) {
  const { theme } = getAtmosphere(country.slug);
  const media = resolveMedia(country);
  const photo = media.hero ?? fallbackPhotoFor(country.order);

  return (
    <Link
      href={`/journey/${country.slug}`}
      className={`${styles.card} fade`}
      style={{ "--card-accent": theme.accent } as CSSProperties}
    >
      <div className={styles.media}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.photo}
        />
        <span className={styles.zoomHint} aria-hidden="true">
          Open the chapter →
        </span>
      </div>
      {/* The caption restates the photograph's own real alt text — never
          new copy, so a country still waiting on its own photograph gets an
          honest caption from the reused photo instead of a blank line. */}
      <p className={styles.caption}>{photo.alt}</p>
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
