import type { HeroEffect } from "@/content/atmospheres";
import { seeded } from "@/lib/contours";

// The ambient layer over a hero: warm dust, drifting mist, night-city light
// streaks or blossom petals. Each item is a `data-fx` with a `data-depth`, and
// is only ever moved by scrolling — nothing loops.
export function EffectLayer({ effect, seed, className }: { effect: HeroEffect; seed: number; className?: string }) {
  if (effect === "none") return null;
  const random = seeded(seed * 7 + 3);
  const items = { dust: 30, mist: 4, streaks: 11, petals: 16 }[effect];

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
        const x = round(random() * 1200);
        // Streaks stay in the upper part of the frame, clear of the hero type.
        const y = round(random() * (effect === "streaks" ? 400 : 675));
        return (
          <g key={index} data-fx data-depth={depth}>
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
