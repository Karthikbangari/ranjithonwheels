import { atlasChapters } from "@/content/atlas";
import { site } from "@/content/site";
import type { Chapter } from "@/content/chapters";
import { formatCoords } from "@/lib/coords";
import { CountryCoverImage } from "@/components/journey/CountryCoverImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Hero.module.css";

// Page 5 — the chapter introduction. The country's own photograph (or, until
// one exists, its own terrain map — CLAUDE.md §8) beside its name, chapter
// number, coordinates and opening line. The same layout the homepage hero
// uses, so every page on the site reads as one family.
export function ChapterHero({ chapter }: { chapter: Chapter }) {
  const { country, opening, story } = chapter;
  const chapterLabel = atlasChapters.find((item) => item.id === country.chapter)?.label;

  return (
    <section className={styles.hero} id="chapter-intro">
      <div className={styles.copy}>
        <Eyebrow>
          Chapter {String(country.order).padStart(2, "0")} of {site.countryCount}
          {chapterLabel ? ` — ${chapterLabel}` : ""}
        </Eyebrow>
        <h1 className={styles.name}>{country.name}</h1>
        <p className={styles.coords}>{formatCoords(country.displayAnchor)}</p>
        {opening ? <p className={styles.opening}>{opening}</p> : null}
        {story && story.stats.length > 0 ? (
          <dl className={styles.stats}>
            {story.stats.map((stat) => (
              <div key={`${stat.value}-${stat.unit}`} className={styles.stat}>
                <dt>{stat.label}</dt>
                <dd>
                  {stat.prefix}
                  {stat.value.toLocaleString("en-US")} <span>{stat.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      <div className={styles.media}>
        <CountryCoverImage
          slug={country.slug}
          anchor={country.displayAnchor}
          src={country.heroImage?.src ?? country.coverImage}
          alt={country.heroImage?.alt ?? country.coverAlt}
          priority
          sizes="(max-width: 899px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
