import type { Chapter } from "@/content/chapters";
import { Motif } from "./Motif";
import styles from "./Sections.module.css";

// Page 11 — The signature moment: the wow page. Each country's is a bespoke
// illustration with its own motion, built from that one memory (falling water
// at Nohkalikai, the ferry with no signal, Taipei 101's fireworks, a lone rider
// on the steppe…) — see components/chapter/motifs. The motif animates itself,
// so this section is plain markup.
export function ChapterSignature({ chapter }: { chapter: Chapter }) {
  const { signature, story } = chapter;
  if (!signature || !story) return null;

  return (
    <section className={styles.signature} id="chapter-signature">
      <div className={styles.head}>
        <p className={styles.kicker}>The signature moment</p>
        <h2 className={styles.h2}>{signature.label}</h2>
        <p className={styles.lede}>{signature.text}</p>
      </div>
      {story.motif ? (
        <div className={styles.signatureStage}>
          <Motif story={story} />
        </div>
      ) : null}
    </section>
  );
}
