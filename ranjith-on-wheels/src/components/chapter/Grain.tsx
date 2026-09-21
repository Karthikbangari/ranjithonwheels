import styles from "./Grain.module.css";

// A very light film grain over the dark sections, so they read as layered
// depth rather than a flat black screen. It is one static, tiled SVG noise
// image (rasterised once) — no runtime filter, nothing to animate.
export function Grain({ strength = 1 }: { strength?: number }) {
  return <div className={styles.grain} style={{ opacity: 0.07 * strength }} aria-hidden="true" />;
}
