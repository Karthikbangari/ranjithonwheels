// Deterministic topographic contours. A seeded scalar field is sampled on a
// coarse grid and traced with marching squares, so every country gets its own
// terrain texture (CLAUDE.md §0 decision #20) from a handful of numbers, and
// the same seed always draws the same terrain — pure, server-renderable, no
// client work.
import type { Terrain } from "@/content/atmospheres";

export const CONTOUR_WIDTH = 1200;
export const CONTOUR_HEIGHT = 675;
const COLS = 52;
const ROWS = 30;
const CELL_X = CONTOUR_WIDTH / COLS;
const CELL_Y = CONTOUR_HEIGHT / ROWS;

export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildField(terrain: Terrain): number[][] {
  const random = seeded(terrain.seed);
  const [sx, sy] = terrain.stretch;
  const blobs = Array.from({ length: 5 }, () => ({
    x: random() * COLS,
    y: random() * ROWS,
    radius: (6 + random() * 9) / terrain.scale,
    weight: (0.5 + random()) * terrain.amp * (random() > 0.35 ? 1 : -0.7),
  }));
  const waves = Array.from({ length: 3 }, () => ({
    fx: (0.08 + random() * 0.16) * terrain.scale,
    fy: (0.08 + random() * 0.16) * terrain.scale,
    phase: random() * Math.PI * 2,
    weight: (0.15 + random() * 0.35) * terrain.amp,
  }));

  return Array.from({ length: ROWS + 1 }, (_, row) =>
    Array.from({ length: COLS + 1 }, (_, col) => {
      let value = 0;
      for (const blob of blobs) {
        const dx = (col - blob.x) / sx;
        const dy = (row - blob.y) / sy;
        value += blob.weight * Math.exp(-(dx * dx + dy * dy) / (2 * blob.radius * blob.radius));
      }
      for (const wave of waves) {
        value += wave.weight * Math.sin((col / sx) * wave.fx + (row / sy) * wave.fy + wave.phase);
      }
      return value;
    }),
  );
}

type Edge = "top" | "right" | "bottom" | "left";
// Marching-squares case (bit 8 = top-left corner above the level, 4 = top-right,
// 2 = bottom-right, 1 = bottom-left) → the edge pairs to join. Saddles (5, 10)
// are resolved to one fixed pairing, which is invisible at this scale.
const SEGMENTS: Record<number, Array<[Edge, Edge]>> = {
  1: [["left", "bottom"]],
  2: [["bottom", "right"]],
  3: [["left", "right"]],
  4: [["top", "right"]],
  5: [["top", "left"], ["bottom", "right"]],
  6: [["top", "bottom"]],
  7: [["top", "left"]],
  8: [["top", "left"]],
  9: [["top", "bottom"]],
  10: [["top", "right"], ["left", "bottom"]],
  11: [["top", "right"]],
  12: [["left", "right"]],
  13: [["bottom", "right"]],
  14: [["left", "bottom"]],
};

const round = (value: number) => Math.round(value * 10) / 10;

function levelPath(field: number[][], level: number): string {
  const parts: string[] = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const a = field[row][col];
      const b = field[row][col + 1];
      const c = field[row + 1][col + 1];
      const d = field[row + 1][col];
      const index = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
      const pairs = SEGMENTS[index];
      if (!pairs) continue;

      const point = (edge: Edge): [number, number] => {
        switch (edge) {
          case "top":
            return [col + (level - a) / (b - a), row];
          case "right":
            return [col + 1, row + (level - b) / (c - b)];
          case "bottom":
            return [col + (level - d) / (c - d), row + 1];
          case "left":
            return [col, row + (level - a) / (d - a)];
        }
      };

      for (const [from, to] of pairs) {
        const [x1, y1] = point(from);
        const [x2, y2] = point(to);
        parts.push(`M${round(x1 * CELL_X)} ${round(y1 * CELL_Y)}L${round(x2 * CELL_X)} ${round(y2 * CELL_Y)}`);
      }
    }
  }
  return parts.join("");
}

// One path string per parallax layer. Levels are dealt round-robin so every
// layer spans the whole height range of the terrain, and layers differ only
// in depth — nearer layers get the higher (steeper) contours.
export function contourLayers(terrain: Terrain, layerCount = 4): string[] {
  const field = buildField(terrain);
  let min = Infinity;
  let max = -Infinity;
  for (const row of field) {
    for (const value of row) {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  }

  const layers: string[] = Array.from({ length: layerCount }, () => "");
  for (let i = 0; i < terrain.levels; i += 1) {
    const level = min + ((i + 1) / (terrain.levels + 1)) * (max - min);
    layers[i % layerCount] += levelPath(field, level);
  }
  return layers;
}
