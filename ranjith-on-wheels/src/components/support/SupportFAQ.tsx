import { Eyebrow } from "@/components/ui/Eyebrow";
import { supportFaq } from "@/content/support";
import styles from "./SupportFAQ.module.css";

export function SupportFAQ() {
  return (
    <section className={styles.section}>
      <div>
        <Eyebrow>Questions</Eyebrow>
        <h2 className={styles.headline}>Before you support the journey.</h2>
      </div>
      <div className={styles.list}>
        {supportFaq.map((item) => (
          <details key={item.question} className={styles.item}>
            <summary className={styles.question}>{item.question}</summary>
            <p className={styles.answer}>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
