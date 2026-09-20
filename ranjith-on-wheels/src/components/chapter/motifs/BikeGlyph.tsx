import { c } from "../colors";

// A loaded touring bicycle in local units, its tyres touching y = 0, centred
// on x = 0. The two wheels are `data-wheel` groups whose bounding box is
// centred on the hub, so GSAP's default transform origin spins them in place.
export function BikeGlyph({ rider = false }: { rider?: boolean }) {
  const spokes = [0, 45, 90, 135];
  return (
    <g fill="none" stroke={c.ink} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      {[-24, 24].map((cx) => (
        <g key={cx} data-wheel>
          <circle cx={cx} cy={-16} r={16} />
          {spokes.map((angle) => (
            <line
              key={angle}
              x1={cx}
              y1={-16 - 14}
              x2={cx}
              y2={-16 + 14}
              strokeWidth={0.8}
              transform={`rotate(${angle} ${cx} -16)`}
            />
          ))}
        </g>
      ))}
      <path d="M-24 -16 L-2 -16 L-12 -40 Z M-12 -40 L14 -42 L-2 -16 M14 -42 L24 -16" stroke={c.accent} />
      <path d="M-17 -43 H-7 M10 -42 V-50 H20" />
      {rider ? <path d="M-12 -40 L-4 -56 L14 -46 M-4 -56 L-2 -64" /> : null}
      {rider ? <circle cx={-1} cy={-70} r={6} fill={c.ink} /> : null}
    </g>
  );
}
