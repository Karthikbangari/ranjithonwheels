import Image from "next/image";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CountUp } from "./CountUp";
import { HeroParallax } from "./HeroParallax";
import styles from "./HeroJourney.module.css";

// The first screen: one real photograph, full viewport, the journey's own
// numbers, and a way down into the story. The photo is the one already used
// for the site's hero — a real frame from the road, not stock imagery — and
// every figure below reads straight from site.ts, the single source of
// truth CLAUDE.md requires (§1: never invent a travel fact).
export function HeroJourney() {
  return (
    <section className={styles.hero} id="hero">
      <HeroParallax>
        <div className={styles.media}>
          <Image
            src="/media/hero/open-road.jpg"
            alt="Ranjith cycling a loaded touring bicycle down an open mountain road, Indian flag mounted on the handlebars"
            fill
            priority
            quality={68}
            sizes="100vw"
            className={styles.image}
          />
        </div>
      </HeroParallax>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.content}>
        <span className={styles.eyebrow}>{site.name}</span>
        <h1 className={styles.headline}>One bicycle. A world still opening.</h1>
        <p className={styles.lede}>
          {site.distanceKm.toLocaleString()}+ kilometres across {site.countryCount} countries, carried by a
          purpose that began at home.
        </p>

        <svg className={styles.routeAccent} viewBox="0 0 160 12" aria-hidden="true" focusable="false">
          <path d="M2 9 C 30 2, 60 2, 80 6 S 130 10, 158 4" />
        </svg>

        <div className={styles.actions}>
          <a href="#chapters" className={styles.exploreLink}>
            Explore the journey <span aria-hidden="true">↓</span>
          </a>
          <ButtonLink href="/support" variant="primary">
            Support the ride
          </ButtonLink>
        </div>

        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt>Kilometres</dt>
            <dd>
              <CountUp value={site.distanceKm} suffix="+" />
            </dd>
          </div>
          <div className={styles.stat}>
            <dt>Countries</dt>
            <dd>
              <CountUp value={site.countryCount} />
            </dd>
          </div>
          <div className={styles.stat}>
            <dt>Years riding</dt>
            <dd>
              <CountUp value={site.years} suffix="+" />
            </dd>
          </div>
        </dl>
      </div>

      <p className={styles.caption}>Ranjith, somewhere on the open road — the ride that started it all.</p>

      <a href="#chapters" className={styles.scrollCue} aria-label="Scroll to the journey">
        <span className={styles.scrollLine} aria-hidden="true" />
        Scroll
      </a>
    </section>
  );
}
