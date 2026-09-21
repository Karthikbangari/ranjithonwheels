import type { SceneKind } from "@/content/atmospheres";
import { SCENE_H, SCENE_W, sceneData } from "@/lib/silhouette";

// The country's environment under the hero type — its landscape or
// architecture, in layers. Far layers are lighter and fainter (atmospheric
// perspective), near layers darker and more solid, and each drifts at its own
// depth as the page scrolls. On the night heroes the city gets a waterline and
// its own reflection. Static SVG: renders complete with no JavaScript.
export function SceneLayer({
  kinds,
  seed,
  night,
  subtle = false,
  className,
}: {
  kinds: SceneKind[];
  seed: number;
  night: boolean;
  // Behind a photograph the scene steps back: the photograph stays the
  // subject and the environment only frames it.
  subtle?: boolean;
  className?: string;
}) {
  const weight = subtle ? 0.45 : 1;
  const { layers, lights, reflection } = sceneData(kinds, seed, night);
  const fill = (tone: "far" | "near" | "ink") =>
    tone === "far" ? "var(--hero-to)" : tone === "ink" ? "var(--story-ink)" : "var(--hero-from)";

  return (
    <svg
      className={className}
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {layers.map((layer, index) => (
        <g key={index} data-layer>
          <g data-drift data-depth={layer.depth} data-axis={layer.axis}>
            <path d={layer.d} fill={fill(layer.tone)} opacity={layer.opacity * weight} />
          </g>
        </g>
      ))}
      {reflection ? (
        <g
          aria-hidden="true"
          opacity={0.16}
          transform={`translate(0 ${reflection.y * (1 + reflection.scaleY)}) scale(1 ${-reflection.scaleY})`}
        >
          {layers.map((layer, index) => (
            <path key={index} d={layer.d} fill="var(--story-glow)" opacity={layer.opacity * 0.55} />
          ))}
        </g>
      ) : null}
      {lights.map((light, index) => (
        <circle
          key={index}
          data-heavy={index % 2 === 1 ? "" : undefined}
          cx={light.x}
          cy={light.y}
          r={light.r}
          fill={index % 3 === 0 ? "#fff9f0" : "var(--story-glow)"}
          opacity={light.o * weight}
        />
      ))}
    </svg>
  );
}
