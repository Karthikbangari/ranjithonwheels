import type { Terrain } from "@/content/atmospheres";
import { CONTOUR_HEIGHT, CONTOUR_WIDTH, contourLayers } from "@/lib/contours";

// The country's terrain, drawn as topographic lines — or, for a city-state,
// as a precise lattice. Four `data-layer` groups, each with its own
// `data-drift` depth, so the hero can bring them in one after another and
// drift them at different speeds as the page scrolls. Renders complete with
// no JavaScript.
export function TerrainBackdrop({ terrain, className }: { terrain: Terrain; className?: string }) {
  const svgProps = {
    className,
    viewBox: `0 0 ${CONTOUR_WIDTH} ${CONTOUR_HEIGHT}`,
    preserveAspectRatio: "xMidYMid slice" as const,
    "aria-hidden": true,
    focusable: false,
  };

  if (terrain.style === "grid") {
    const minor: string[] = [];
    const major: string[] = [];
    for (let x = 0; x <= CONTOUR_WIDTH; x += 30) (x % 120 === 0 ? major : minor).push(`M${x} 0V${CONTOUR_HEIGHT}`);
    for (let y = 0; y <= CONTOUR_HEIGHT; y += 30) (y % 120 === 0 ? major : minor).push(`M0 ${y}H${CONTOUR_WIDTH}`);
    return (
      <svg {...svgProps}>
        <g data-layer>
          <g data-drift data-depth={0.15}>
            <path d={minor.join("")} fill="none" stroke="var(--ink-inverse)" strokeWidth={0.6} opacity={0.07} />
          </g>
        </g>
        <g data-layer>
          <g data-drift data-depth={0.4}>
            <path d={major.join("")} fill="none" stroke="var(--story-glow)" strokeWidth={1} opacity={0.2} />
          </g>
        </g>
      </svg>
    );
  }

  return (
    <svg {...svgProps}>
      {contourLayers(terrain, 4).map((d, index) => (
        <g key={index} data-layer>
          <g data-drift data-depth={0.2 + index * 0.25}>
            <path
              d={d}
              fill="none"
              stroke={index % 2 === 0 ? "var(--ink-inverse)" : "var(--story-glow)"}
              strokeWidth={0.9 + index * 0.35}
              strokeLinecap="round"
              opacity={0.13 + index * 0.07}
            />
          </g>
        </g>
      ))}
    </svg>
  );
}
