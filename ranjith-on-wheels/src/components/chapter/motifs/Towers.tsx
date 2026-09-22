import { c } from "../colors";
import styles from "../Motifs.module.css";

// Cambodia — a Hindu temple that became Buddhist, its towers rising out of a
// still moat. Abstract lotus-bud silhouettes, not a drawing of Angkor Wat.
const TOWER = "M-34 0 V-44 H-28 V-70 H-22 V-98 Q-22 -140 0 -184 Q22 -140 22 -98 V-70 H28 V-44 H34 V0 Z";
const towers = [
  { x: 215, scale: 0.7 },
  { x: 330, scale: 0.95 },
  { x: 450, scale: 1.25 },
  { x: 570, scale: 0.95 },
  { x: 685, scale: 0.7 },
];

export function Towers() {

  return (
    <div className={`${styles.stage} ${styles.scene}`} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 900 360" preserveAspectRatio="xMidYMid slice">
        <defs>
          <path id="tower-spire" d={TOWER} />
        </defs>
        <circle data-sun cx={450} cy={170} r={96} fill={c.glow} opacity={0.5} />
        <rect x={0} y={300} width={900} height={60} fill={c.glow} opacity={0.18} />
        <g data-reflection opacity={1}>
          <g transform="translate(0 600) scale(1 -1)" opacity={0.16}>
            {towers.map((tower) => (
              <use
                key={tower.x}
                href="#tower-spire"
                fill={c.accent}
                transform={`translate(${tower.x} 300) scale(${tower.scale})`}
              />
            ))}
          </g>
        </g>
        <rect x={120} y={286} width={660} height={14} rx={2} fill={c.accent} />
        {towers.map((tower) => (
          <g key={tower.x} data-tower>
            <use
              href="#tower-spire"
              fill={c.accent}
              stroke={c.ink}
              strokeWidth={1.5}
              transform={`translate(${tower.x} 300) scale(${tower.scale})`}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
