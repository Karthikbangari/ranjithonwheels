import { c } from "../colors";
import styles from "../Motifs.module.css";

// India — Nohkalikai Falls and the legend it carries. Rock walls either side,
// a curtain of falling water, and mist that rises from the pool below. The
// water is revealed by opacity (never grown top-down), and the mist climbs
// bottom to top, matching the entrance rules in CLAUDE.md §5.2.
const streams = [0, 1, 2, 3, 4, 5, 6];

export function Falls() {

  return (
    <div className={`${styles.stage} ${styles.scene}`} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 900 360" preserveAspectRatio="xMidYMid slice">
        <g data-wall>
          <path d="M0 0 H300 L318 90 L296 170 L326 360 H0 Z" fill={c.ink} opacity={0.88} />
          <path d="M0 0 H250 L268 100 L246 200 L276 360 H0 Z" fill={c.accent} opacity={0.7} />
        </g>
        <g data-wall>
          <path d="M900 0 H590 L606 110 L586 190 L612 360 H900 Z" fill={c.ink} opacity={0.88} />
          <path d="M900 0 H640 L652 90 L636 200 L660 360 H900 Z" fill={c.accent} opacity={0.7} />
        </g>
        {streams.map((i) => (
          <line
            key={i}
            data-stream
            x1={352 + i * 32}
            y1={0}
            x2={352 + i * 32}
            y2={286}
            stroke={c.white}
            strokeWidth={i % 2 === 0 ? 14 : 7}
            strokeLinecap="round"
            opacity={i % 2 === 0 ? 0.92 : 0.6}
          />
        ))}
        <rect x={300} y={296} width={300} height={64} fill={c.glow} opacity={0.22} />
        <g data-mist>
          <ellipse cx={450} cy={296} rx={190} ry={38} fill={c.white} opacity={0.6} />
        </g>
        <g data-mist>
          <ellipse cx={400} cy={270} rx={130} ry={30} fill={c.white} opacity={0.45} />
          <ellipse cx={510} cy={264} rx={110} ry={26} fill={c.white} opacity={0.4} />
        </g>
      </svg>
    </div>
  );
}
