import { supportConfig } from "@/content/support";
import styles from "./SupportTransparency.module.css";

export function SupportTransparency() {
  return (
    <section className={styles.section}>
      <p className={styles.body}>
        No fixed amounts, totals or percentages are shown because no verified records have been
        supplied yet. Once the owner provides real figures, this section will list them exactly as
        given — never estimated or rounded for effect.
      </p>
      <span className={styles.updated}>Last updated: {supportConfig.transparencyUpdatedAt}</span>
    </section>
  );
}
