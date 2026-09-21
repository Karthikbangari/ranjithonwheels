import type { CSSProperties } from "react";
import type { Chapter } from "@/content/chapters";
import { site } from "@/content/site";
import { formatCoords } from "@/lib/coords";
import { Scene } from "./Scene";
import { SceneLayer } from "./SceneLayer";
import styles from "./Sections.module.css";

// A chapter with no verified manuscript yet gets this instead of a story:
// wordless, atmospheric, and true to what we know. The country's own landscape
// (or architecture, or highway) drifts at depth, the red road runs through it
// as the visitor scrolls, and the next blue road is already leaving the frame.
// There is no copy, so there is nothing that can be invented — and nothing to
// remove when the manuscript arrives.
export function ChapterInterlude({ chapter }: { chapter: Chapter }) {
  const { country, atmosphere } = chapter;
  const night = Boolean(atmosphere.hero.night);
  const style = { "--hero-from": atmosphere.hero.from, "--hero-to": atmosphere.hero.to } as CSSProperties;

  return (
    <Scene
      name="interlude"
      className={`${styles.interlude} ${night ? styles.interludeNight : ""}`}
      style={style}
      id="chapter-interlude"
      aria-label={`${country.name}: the road through`}
    >
      <SceneLayer kinds={atmosphere.scenes} seed={atmosphere.terrain.seed + 9} night={night} className={styles.interludeScene} />
      <div className={styles.interludeRoad} aria-hidden="true">
        <span className={styles.interludeRed} data-road />
        <span className={styles.interludeBlue} />
      </div>
      <p className={styles.interludeMeta} data-reveal>
        <span>
          Chapter {String(country.order).padStart(2, "0")} of {site.countryCount}
        </span>
        <span>{country.name}</span>
        <span>{formatCoords(country.displayAnchor)}</span>
      </p>
    </Scene>
  );
}
