import { c } from "../colors";
import styles from "../Motifs.module.css";

// Vietnam — rice grown on standing water at Tam Coc. Five paddy terraces
// rise from the front of the frame to the back, then the water on each one
// catches the light left to right.
const bands = [
  { y: 190, fill: c.glow, opacity: 0.35, sway: 30 },
  { y: 222, fill: c.accent, opacity: 0.3, sway: -26 },
  { y: 254, fill: c.glow, opacity: 0.6, sway: 22 },
  { y: 286, fill: c.accent, opacity: 0.55, sway: -18 },
  { y: 318, fill: c.accent, opacity: 1, sway: 14 },
];

const bandPath = (y: number, sway: number) =>
  `M0 360 V${y} C200 ${y - sway} 350 ${y + sway * 0.5} 520 ${y - sway * 0.2} S800 ${y - sway} 900 ${y - sway * 0.3} V360 Z`;
const edgePath = (y: number, sway: number) =>
  `M0 ${y + 8} C200 ${y + 8 - sway} 350 ${y + 8 + sway * 0.5} 520 ${y + 8 - sway * 0.2} S800 ${y + 8 - sway} 900 ${y + 8 - sway * 0.3}`;

export function Terraces() {

  return (
    <div className={`${styles.stage} ${styles.scene}`} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 900 360" preserveAspectRatio="xMidYMid slice">
        <circle cx={700} cy={82} r={46} fill={c.glow} opacity={0.8} />
        {bands.map((band) => (
          <g key={band.y} data-band>
            <path d={bandPath(band.y, band.sway)} fill={band.fill} opacity={band.opacity} />
            <path
              data-shimmer
              d={edgePath(band.y, band.sway)}
              fill="none"
              stroke={c.white}
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.6}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
