import type { Chapter } from "@/content/chapters";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Sections.module.css";

// Page 8 — the natural environment. Exists only where a summary names a
// feature of the country's setting — the volcanic geography of Indonesia, the
// seismic terrain of Taiwan. It describes the *region*, never an event: the
// tag reads "Regional terrain" / "Natural environment", never anything like a
// danger encountered (CLAUDE.md §0 decision #21).
export function ChapterEnvironment({ chapter }: { chapter: Chapter }) {
  const { environment, atmosphere } = chapter;
  if (!environment || !atmosphere.environmentLabel) return null;

  return (
    <section className={`${styles.environment} fade`} id="chapter-environment">
      <Eyebrow>{atmosphere.environmentLabel}</Eyebrow>
      <h2 className={styles.h2}>{environment.label}</h2>
      <p className={styles.lede}>{environment.text}</p>
    </section>
  );
}
