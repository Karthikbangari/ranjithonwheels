import Image from "next/image";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./HeroJourney.module.css";

// The first screen: the headline, the numbers, and one big photograph.
export function HeroJourney() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.copy}>
        <Eyebrow>A journey for generations</Eyebrow>
        <h1 className={styles.headline}>One bicycle. A world still opening.</h1>
        <p className={styles.lede}>
          {site.distanceKm.toLocaleString()}+ kilometres across {site.countryCount} countries, carried by a
          purpose that began at home.
        </p>
        <div className={styles.actions}>
          <ButtonLink href="/journey" variant="primary">
            Explore the route
          </ButtonLink>
          <ButtonLink href="#finale" variant="secondary">
            Where the ride is now
          </ButtonLink>
        </div>
        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt>Kilometres</dt>
            <dd>{site.distanceKm.toLocaleString()}+</dd>
          </div>
          <div className={styles.stat}>
            <dt>Countries</dt>
            <dd>{site.countryCount}</dd>
          </div>
          <div className={styles.stat}>
            <dt>Years riding</dt>
            <dd>{site.years}+</dd>
          </div>
        </dl>
      </div>
      <div className={styles.media}>
        <Image
          src="/media/hero/open-road.jpg"
          alt="Ranjith cycling a loaded touring bicycle down an open mountain road, Indian flag mounted on the handlebars"
          fill
          priority
          sizes="(max-width: 899px) 100vw, 50vw"
          className={styles.image}
        />
      </div>
    </section>
  );
}
