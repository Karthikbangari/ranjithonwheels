import { c } from "../colors";
import styles from "../Motifs.module.css";

// Singapore — technology and respect for the environment. A skyline builds
// from the ground up, a wall of water falls through the middle of it and the
// metro line runs straight through.
const groups: Array<Array<{ x: number; w: number; h: number; fill: string; opacity: number }>> = [
  [
    { x: 60, w: 60, h: 120, fill: c.accent, opacity: 0.85 },
    { x: 130, w: 50, h: 170, fill: c.ink, opacity: 0.85 },
    { x: 190, w: 70, h: 210, fill: c.accent, opacity: 1 },
  ],
  [
    { x: 270, w: 55, h: 150, fill: c.glow, opacity: 0.9 },
    { x: 335, w: 60, h: 250, fill: c.ink, opacity: 0.9 },
  ],
  [
    { x: 405, w: 70, h: 190, fill: c.accent, opacity: 0.9 },
    { x: 485, w: 55, h: 230, fill: c.glow, opacity: 0.9 },
    { x: 550, w: 65, h: 160, fill: c.accent, opacity: 1 },
  ],
  [
    { x: 625, w: 50, h: 200, fill: c.ink, opacity: 0.85 },
    { x: 685, w: 75, h: 140, fill: c.accent, opacity: 0.85 },
  ],
  [
    { x: 770, w: 55, h: 180, fill: c.glow, opacity: 0.9 },
    { x: 835, w: 45, h: 110, fill: c.accent, opacity: 0.9 },
  ],
];

const stations = [100, 260, 420, 580, 740, 860];

export function Skyline() {

  return (
    <div className={`${styles.stage} ${styles.scene}`} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 900 360" preserveAspectRatio="xMidYMid slice">
        <rect x={0} y={300} width={900} height={60} fill={c.ink} opacity={0.1} />
        {groups.map((group, index) => (
          <g key={index} data-block>
            {group.map((tower) => (
              <rect
                key={tower.x}
                x={tower.x}
                y={300 - tower.h}
                width={tower.w}
                height={tower.h}
                rx={3}
                fill={tower.fill}
                opacity={tower.opacity}
              />
            ))}
          </g>
        ))}
        <rect x={350} y={150} width={104} height={150} rx={4} fill={c.white} opacity={0.94} />
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={i}
            data-fall
            x1={358 + i * 12}
            y1={150}
            x2={358 + i * 12}
            y2={300}
            stroke={c.glow}
            strokeWidth={5}
            strokeLinecap="round"
          />
        ))}
        <line data-track x1={0} y1={324} x2={900} y2={324} stroke={c.accent} strokeWidth={6} strokeLinecap="round" />
        {stations.map((x) => (
          <circle key={x} data-station cx={x} cy={324} r={8} fill={c.white} stroke={c.ink} strokeWidth={3} />
        ))}
      </svg>
    </div>
  );
}
