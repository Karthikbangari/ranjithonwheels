import Image from "next/image";
import type { CSSProperties } from "react";
import type { Chapter } from "@/content/chapters";
import type { CountryMedia } from "@/lib/media";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Motif } from "./Motif";
import styles from "./Sections.module.css";

// Page 11 — the signature moment: the strongest memory from the country. Each
// one is, for now, a small bespoke illustration built from that one memory
// (falling water at Nohkalikai, the ferry with no signal, Taipei 101's
// fireworks, a lone rider on the steppe…) — see components/chapter/motifs.
//
// An illustration is never passed off as documentary photography: it is
// labelled "Visual interpretation". When the owner supplies the real
// photograph (`signatureImage`), it takes the same place labelled
// "Photograph" — only what stands in the frame changes.
export function ChapterSignature({ chapter, media }: { chapter: Chapter; media: CountryMedia }) {
  const { signature, story } = chapter;
  if (!signature || !story) return null;
  const photo = media.signature;

  return (
    <section className={`${styles.signature} fade`} id="chapter-signature">
      <div className={styles.head}>
        <Eyebrow>The signature moment</Eyebrow>
        <h2 className={styles.h2}>{signature.label}</h2>
        <p className={styles.lede}>{signature.text}</p>
      </div>
      {photo ? (
        <div className={styles.signatureStage}>
          <div className={styles.photoStage}>
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) 100vw, 900px" className={styles.photoImage} />
          </div>
        </div>
      ) : story.motif ? (
        // The illustration's own small colour world — scoped to just this
        // box, not the page (CLAUDE.md §0 decision #23: no per-country page
        // colour any more).
        <div
          className={styles.signatureStage}
          style={
            {
              "--story-tint": chapter.atmosphere.theme.tint,
              "--story-accent": chapter.atmosphere.theme.accent,
              "--story-ink": chapter.atmosphere.theme.ink,
              "--story-glow": chapter.atmosphere.theme.glow,
            } as CSSProperties
          }
        >
          <Motif story={story} />
        </div>
      ) : null}
      <p className={styles.provenanceRow}>
        <span className={styles.provenance}>
          {photo ? (photo.credit ? `Photograph — ${photo.credit}` : "Photograph") : story.motif ? "Visual interpretation" : ""}
        </span>
        {media.videoUrl ? (
          <a href={media.videoUrl} className={styles.videoLink} target="_blank" rel="noreferrer">
            Watch the original video
          </a>
        ) : null}
      </p>
    </section>
  );
}
