import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./SupportFinalCTA.module.css";

export function SupportFinalCTA() {
  return (
    <section className={styles.section}>
      <Eyebrow>What happens next</Eyebrow>
      <h2 className={styles.headline}>Return to the road and follow the next kilometre.</h2>
      <div className={styles.actions}>
        <ButtonLink href="/">Back to the journey</ButtonLink>
        <ButtonLink href="/#finale" variant="secondary">
          Follow the journey
        </ButtonLink>
      </div>
    </section>
  );
}
