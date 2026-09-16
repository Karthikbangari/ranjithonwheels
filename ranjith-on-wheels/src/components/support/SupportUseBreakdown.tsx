import { Eyebrow } from "@/components/ui/Eyebrow";
import { supportUseCategories } from "@/content/support";
import styles from "./SupportUseBreakdown.module.css";

export function SupportUseBreakdown() {
  return (
    <section className={styles.section} id="where-support-goes">
      <div>
        <Eyebrow>Where support goes</Eyebrow>
        <h2 className={styles.headline}>A quiet, honest breakdown.</h2>
      </div>
      <ul className={styles.list}>
        {supportUseCategories.map((category) => (
          <li key={category} className={styles.item}>
            {category}
          </li>
        ))}
      </ul>
    </section>
  );
}
