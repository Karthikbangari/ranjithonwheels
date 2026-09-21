import type { HeroEffect } from "@/content/atmospheres";
import { seeded } from "@/lib/contours";

// The ambient layer over a hero: warm dust, drifting mist, night-city light
// streaks or blossom petals. Each item is a `data-fx` with a `data-depth`, and
// is only ever moved by scrolling — nothing loops.
export function EffectLayer({ effect, seed, className }: { effect: HeroEffect; seed: number; className?: string }) {
  if (effect === "none") return null;
  const random = seeded(seed * 7 + 3);
  const items = { dust: 30, mist: 4, streaks: 11, petals: 16, citylights: 18, highway: 6 }[effect];

  return (
    <svg
      className={className}
      viewBox="0 0 1200 675"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {effect === "mist" ? (
        <defs>
          <radialGradient id="fx-mist">
            <stop offset="0%" stopColor="#fff9f0" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#fff9f0" stopOpacity="0" />
          </radialGradient>
        </defs>
      ) : null}
      {Array.from({ length: items }, (_, index) => {
        const depth = round(0.3 + random() * 1.1);
        // Highway light trails run down the right of the frame, clear of the type.
        const x = round(effect === "highway" ? 780 + random() * 460 : random() * 1200);
        // Streaks stay in the upper part of the frame, clear of the hero type.
        const y = round(
          effect === "streaks"
            ? random() * 400
            : effect === "citylights"
              ? 330 + random() * 170
              : effect === "highway"
                ? 470 + random() * 170
                : random() * 675,
        );
        // Half of a busy layer is dropped on a phone (see Hero.module.css): fewer
        // nodes to paint and to animate where the GPU is weakest.
        const heavy = effect === "mist" ? index >= 2 : index % 2 === 1;
        return (
          <g
            key={index}
            data-fx
            data-depth={depth}
            data-axis={effect === "streaks" || effect === "highway" ? "x" : undefined}
            data-heavy={heavy ? "" : undefined}
          >
            {effect === "dust" ? (
              <circle cx={x} cy={y} r={round(1 + random() * 2.6)} fill="var(--story-glow)" opacity={round(0.2 + random() * 0.35)} />
            ) : null}
            {effect === "mist" ? (
              <ellipse cx={x} cy={y} rx={round(320 + random() * 220)} ry={round(60 + random() * 60)} fill="url(#fx-mist)" />
            ) : null}
            {effect === "streaks" ? (
              <line
                x1={x - 300}
                y1={y}
                x2={x - 300 + round(140 + random() * 320)}
                y2={y}
                stroke={index % 3 === 0 ? "var(--story-glow)" : "var(--ink-inverse)"}
                strokeWidth={round(1.2 + random() * 1.4)}
                strokeLinecap="round"
                opacity={round(0.2 + random() * 0.4)}
              />
            ) : null}
            {effect === "citylights" ? (
              <circle
                cx={x}
                cy={y}
                r={round(1 + random() * 2.2)}
                fill={index % 4 === 0 ? "#fff9f0" : "var(--story-glow)"}
                opacity={round(0.25 + random() * 0.55)}
              />
            ) : null}
            {effect === "highway" ? (
              <line
                x1={x - 260}
                y1={y}
                x2={x - 260 + round(120 + random() * 300)}
                y2={round(y + (random() - 0.5) * 6)}
                stroke={index % 2 === 0 ? "#ff4b50" : "#fff9f0"}
                strokeWidth={round(1.4 + random() * 1.8)}
                strokeLinecap="round"
                opacity={round(0.3 + random() * 0.45)}
              />
            ) : null}
            {effect === "petals" ? (
              <ellipse
                cx={x}
                cy={y}
                rx={round(7 + random() * 6)}
                ry={round(4 + random() * 3)}
                fill="var(--story-glow)"
                opacity={round(0.35 + random() * 0.4)}
                transform={`rotate(${Math.round(random() * 180)} ${x} ${y})`}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

const round = (value: number) => Math.round(value * 10) / 10;
