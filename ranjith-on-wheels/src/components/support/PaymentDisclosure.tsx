import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./PaymentDisclosure.module.css";

export function PaymentDisclosure() {
  return (
    <section className={styles.section}>
      <Eyebrow>How payment is handled</Eyebrow>
      <h2 className={styles.headline}>This site never collects card or bank details.</h2>
      <ul className={styles.list}>
        <li>Checkout always happens on the payment provider&apos;s own hosted page.</li>
        <li>No card, bank or wallet details are entered on this site.</li>
        <li>No secret keys or financial identifiers are stored in this codebase.</li>
        <li>A payment is only shown as successful once the provider confirms it — never assumed.</li>
        <li>Support here is not described as a charitable or tax-deductible donation.</li>
      </ul>
    </section>
  );
}
