import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./SupportWhy.module.css";

export function SupportWhy() {
  return (
    <section className={styles.section}>
      <Eyebrow>Why help</Eyebrow>
      <h2 className={styles.headline}>The road continues because people choose to carry it.</h2>
      <p className={styles.body}>
        This journey is self-funded and independently created — the riding, the filming and the
        writing all happen on the road, day by day. Support does not replace the effort; it keeps
        the next kilometre possible when the road gets expensive, difficult or uncertain.
      </p>
    </section>
  );
}
