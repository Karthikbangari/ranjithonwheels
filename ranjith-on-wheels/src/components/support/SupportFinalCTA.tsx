import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { journeyCountries } from "@/content/journey";
import styles from "./SupportFinalCTA.module.css";

// This is the journey's second-to-last stop: every chapter's "Next" chain
// (ChapterTransition.tsx) ends here once there is no next country, and this
// section carries it on to the Follow finale — the last stop.
const lastCountry = journeyCountries[journeyCountries.length - 1];

export function SupportFinalCTA() {
  return (
    <section className={styles.section} id="support-final-cta">
      <Eyebrow>What happens next</Eyebrow>
      <h2 className={styles.headline}>Return to the road and follow the next kilometre.</h2>
      <div className={styles.actions}>
        <ButtonLink href="/#finale">Follow the journey</ButtonLink>
        <ButtonLink href="/journey" variant="secondary">
          Browse every country
        </ButtonLink>
      </div>
      {lastCountry ? (
        <p className={styles.back}>
          <ButtonLink href={`/journey/${lastCountry.slug}`} variant="secondary">
            ← Back to {lastCountry.name}
          </ButtonLink>
        </p>
      ) : null}
    </section>
  );
}
