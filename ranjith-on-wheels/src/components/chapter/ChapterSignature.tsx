import Image from "next/image";
import type { Chapter } from "@/content/chapters";
import type { CountryMedia } from "@/lib/media";
import { Motif } from "./Motif";
import { Scene } from "./Scene";
import styles from "./Sections.module.css";

// Page 11 — the signature moment: the wow page. Each country's is, for now, a
// bespoke illustration with its own motion, built from that one memory (falling
// water at Nohkalikai, the ferry with no signal, Taipei 101's fireworks, a lone
// rider on the steppe…) — see components/chapter/motifs.
//
// An illustration is never passed off as documentary photography: the
// metadata says "Visual interpretation". When the owner supplies the real
// photograph (`signatureImage` in the country's media object), it takes the
// same stage with the same entrance and the metadata says "Photograph" — the
// animation structure doesn't change, only what stands in the frame.
export function ChapterSignature({ chapter, media }: { chapter: Chapter; media: CountryMedia }) {
  const { signature, story } = chapter;
  if (!signature || !story) return null;
  const photo = media.signature;

  return (
    <Scene name="signature" className={styles.signature} id="chapter-signature">
      <div className={styles.head}>
        <p className={styles.kicker} data-reveal>
          The signature moment
        </p>
        <h2 className={styles.h2} data-reveal>
          {signature.label}
        </h2>
        <p className={styles.lede} data-reveal>
          {signature.text}
        </p>
      </div>
      {photo ? (
        <div className={styles.signatureStage}>
          <div className={styles.photoStage}>
            <div className={styles.photoFill} data-sig-photo>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1280px) 100vw, 1280px" className={styles.photoImage} />
            </div>
          </div>
        </div>
      ) : story.motif ? (
        <div className={styles.signatureStage}>
          <Motif story={story} />
        </div>
      ) : null}
      <p className={styles.provenanceRow} data-reveal>
        <span className={styles.provenance}>
          {photo ? (photo.credit ? `Photograph — ${photo.credit}` : "Photograph") : story.motif ? "Visual interpretation" : ""}
        </span>
        {media.videoUrl ? (
          <a href={media.videoUrl} className={styles.videoLink} target="_blank" rel="noreferrer">
            Watch the original video
          </a>
        ) : null}
      </p>
    </Scene>
  );
}
