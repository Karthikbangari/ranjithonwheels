import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { suggestedSupportLabels } from "@/content/support";
import styles from "./SupportOptions.module.css";

export function SupportOptions() {
  return (
    <section className={styles.section} id="support-options">
      <div>
        <Eyebrow>Choose your support</Eyebrow>
        <h2 className={styles.headline}>Card and other checkout options are coming soon.</h2>
      </div>
      <span className={styles.banner}>
        <span className={styles.dot} aria-hidden="true" />
        In the meantime, <Link href="#upi">support directly via UPI</Link>
      </span>
      <div className={styles.grid}>
        {suggestedSupportLabels.map((option) => (
          <article key={option.id} className={styles.card}>
            <span className={styles.cardLabel}>{option.label}</span>
            <p className={styles.cardDescription}>{option.description}</p>
            <button type="button" className={styles.cardButton} disabled aria-disabled="true">
              Coming soon
            </button>
          </article>
        ))}
      </div>
      <p className={styles.cardDescription}>
        These are examples of what support may help cover, not fixed prices. Checkout will open on
        a provider-hosted page once the recipient, payment provider and disclosures are confirmed
        — this site never collects card or bank details directly.
      </p>
    </section>
  );
}
