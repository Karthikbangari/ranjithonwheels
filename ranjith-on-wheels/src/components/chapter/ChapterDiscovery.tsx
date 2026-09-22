import type { Chapter } from "@/content/chapters";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Sections.module.css";

// Page 9 — the discovery. The country's strongest destination, food, culture
// or unexpected discovery, in plain text — one block per moment the story has.
export function ChapterDiscovery({ chapter }: { chapter: Chapter }) {
  const { discovery, country } = chapter;

  return (
    <section className={`${styles.discovery} fade`} id="chapter-discovery">
      <div className={styles.head}>
        <Eyebrow>The discovery</Eyebrow>
        <h2 className={styles.h2}>What {country.name} revealed.</h2>
      </div>
      <div className={styles.discoveryList}>
        {discovery.map((moment) => (
          <article key={moment.label} className={styles.discoveryItem}>
            <h3 className={styles.h3}>{moment.label}</h3>
            <p className={styles.discoveryText}>{moment.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
