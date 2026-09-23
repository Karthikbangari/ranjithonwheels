import type { CSSProperties } from "react";
import Link from "next/link";
import type { JourneyCountry } from "@/content/journey";
import type { Story } from "@/content/stories";
import { getAtmosphere } from "@/content/atmospheres";
import { CountryCoverImage } from "@/components/journey/CountryCoverImage";
import { Reveal } from "./Reveal";
import styles from "./ChapterSection.module.css";

type ChapterSectionProps = {
  country: JourneyCountry;
  story: Story;
  index: number;
  total: number;
  previous: { slug: string; name: string } | null;
  next: { slug: string; name: string } | null;
};

// One country, one immersive section — the documentary read the owner asked
// for in place of a grid of cards. Alternates which side the photograph sits
// on by index so ten chapters in a row don't read as one repeated template.
// Every word here already exists in stories.ts / journey.ts: the signature
// moment becomes the pull quote, the rest of the moments become the body,
// and nothing is written fresh for this component (CLAUDE.md §1).
export function ChapterSection({ country, story, index, total, previous, next }: ChapterSectionProps) {
  const { theme } = getAtmosphere(country.slug);
  const reversed = index % 2 === 1;
  const pullQuote = story.moments.find((moment) => moment.beat === "signature") ?? story.moments[0] ?? null;
  const bodyMoments = story.moments.filter((moment) => moment !== pullQuote);

  return (
    <section
      id={`chapter-${country.slug}`}
      className={`${styles.chapter} ${reversed ? styles.reversed : ""}`}
      style={{ "--chapter-accent": theme.accent } as CSSProperties}
    >
      <Reveal className={styles.kicker}>
        <span className={styles.chapterNumber} aria-hidden="true">
          {String(country.order).padStart(2, "0")}
        </span>
        <span className={styles.label}>
          Country {String(country.order).padStart(2, "0")} — {country.name}
        </span>
      </Reveal>

      <div className={styles.grid}>
        <Reveal className={styles.photoCol}>
          <div className={styles.photoFrame}>
            <CountryCoverImage
              slug={country.slug}
              anchor={country.displayAnchor}
              src={country.coverImage}
              alt={country.coverAlt}
              sizes="(max-width: 900px) 100vw, 58vw"
            />
          </div>
          <p className={styles.caption}>{country.coverAlt}</p>
        </Reveal>

        <Reveal className={styles.textCol} delayMs={120}>
          <h2 className={styles.countryName}>{country.name}</h2>
          <h3 className={styles.headline}>{story.headline}</h3>

          {pullQuote ? (
            <blockquote className={styles.pullQuote}>
              <span className={styles.pullQuoteLabel}>{pullQuote.label}</span>
              {pullQuote.text}
            </blockquote>
          ) : null}

          {bodyMoments.map((moment) => (
            <p key={moment.label} className={styles.moment}>
              <span className={styles.momentLabel}>{moment.label}</span>
              {moment.text}
            </p>
          ))}
        </Reveal>
      </div>

      <Reveal>
        <nav className={styles.chapterNav} aria-label={`${country.name} chapter navigation`}>
          {previous ? (
            <a href={`#chapter-${previous.slug}`} className={styles.navLink}>
              ← {previous.name}
            </a>
          ) : (
            <span className={styles.navSpacer} />
          )}
          <span className={styles.navProgress}>
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          {next ? (
            <a href={`#chapter-${next.slug}`} className={styles.navLink}>
              {next.name} →
            </a>
          ) : (
            <Link href="/journey" className={styles.navLink}>
              Every chapter →
            </Link>
          )}
        </nav>
      </Reveal>
    </section>
  );
}
