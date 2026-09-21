// The environment silhouettes under each hero (CLAUDE.md §0 decision #21):
// a country's own landscape or architecture, generated from a seed so the same
// country always draws the same scene. Pure and server-rendered — the layers
// are static paths that the hero drifts at different depths on scroll.
import type { SceneKind } from "@/content/atmospheres";
import { seeded } from "./contours";

export const SCENE_W = 1200;
export const SCENE_H = 675;

export type SceneLayer = {
  d: string;
  // Atmospheric perspective: far layers are lighter and fainter, near layers
  // darker and more solid. `tone` picks the colour, `opacity` the weight.
  tone: "far" | "near" | "ink";
  opacity: number;
  // Scroll drift speed, and the axis it moves on (long flat scenes slide
  // sideways; mountains and buildings rise).
  depth: number;
  axis: "x" | "y";
  // Thin road / lane marks drawn as strokes rather than fills.
  stroke?: boolean;
};

export type SceneLights = { x: number; y: number; r: number; o: number };

export type SceneData = {
  layers: SceneLayer[];
  lights: SceneLights[];
  // A waterline with the scene mirrored beneath it (the night city).
  reflection: { y: number; scaleY: number } | null;
};

type Pt = [number, number];
const r1 = (v: number) => Math.round(v * 10) / 10;
const close = (pts: Pt[]) =>
  `M${pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join("L")}L${SCENE_W} ${SCENE_H}L0 ${SCENE_H}Z`;

type Rand = () => number;

function ridge(rand: Rand, base: number, amp: number, wavelength: number, rough: number, step = 24): Pt[] {
  const p1 = rand() * 6.28;
  const p2 = rand() * 6.28;
  const pts: Pt[] = [];
  for (let x = 0; x <= SCENE_W; x += step) {
    const wave = 0.55 * Math.sin(x / wavelength + p1) + 0.3 * Math.sin(x / (wavelength * 0.45) + p2) + 0.15;
    pts.push([x, base - amp * wave - rough * rand()]);
  }
  return pts;
}

function peaks(rand: Rand, base: number, minH: number, maxH: number, from = 0): Pt[] {
  const pts: Pt[] = [[0, base]];
  let x = from;
  while (x < SCENE_W + 60) {
    const rise = 40 + rand() * 70;
    const h = minH + rand() * (maxH - minH);
    // A ragged shoulder on the way up, so a peak is a ridge, not a triangle.
    pts.push([x + rise * 0.5, base - h * (0.5 + rand() * 0.22)]);
    x += rise;
    pts.push([x, base - h]);
    const fall = 30 + rand() * 60;
    pts.push([x + fall * 0.45, base - h * (0.4 + rand() * 0.25)]);
    x += fall;
    pts.push([x, base - rand() * minH * 0.45]);
  }
  return pts;
}

// Building blocks along a base line; also the source of window lights.
function blocks(rand: Rand, base: number, minW: number, maxW: number, minH: number, maxH: number, from = -10) {
  let x = from;
  let d = "";
  const windows: SceneLights[] = [];
  while (x < SCENE_W) {
    const w = minW + rand() * (maxW - minW);
    const h = minH + rand() * (maxH - minH);
    d += `M${r1(x)} ${base}V${r1(base - h)}h${r1(w)}V${base}Z`;
    if (rand() > 0.72) d += `M${r1(x + w / 2 - 1)} ${r1(base - h)}v${-Math.round(10 + rand() * 26)}h2v${Math.round(10 + rand() * 26)}Z`;
    for (let i = 0; i < 3; i += 1) {
      if (rand() > 0.35) windows.push({ x: r1(x + 4 + rand() * (w - 8)), y: r1(base - 8 - rand() * (h - 14)), r: 1 + rand() * 1.4, o: 0.35 + rand() * 0.5 });
    }
    x += w + rand() * 6;
  }
  return { d: `${d}M0 ${SCENE_H}H${SCENE_W}V${base}H0Z`, windows };
}

function towers(rand: Rand, base: number, left: number, right: number, count: number) {
  let d = "";
  for (let i = 0; i < count; i += 1) {
    const cx = left + ((i + 0.5) / count) * (right - left) + (rand() - 0.5) * 20;
    const s = 0.7 + rand() * 0.6 + (i === Math.floor(count / 2) ? 0.35 : 0);
    // Stepped, square-shouldered tiers rising to a lotus bud: temple geometry,
    // not a spike.
    const halves = [50, 40, 31, 22, 14].map((h) => h * s);
    const step = 30 * s;
    const leftSide: Pt[] = [[cx - halves[0], base]];
    let y = base;
    for (let k = 0; k < 4; k += 1) {
      y -= step;
      leftSide.push([cx - halves[k], y], [cx - halves[k + 1], y]);
    }
    const neck = y - 26 * s;
    leftSide.push([cx - halves[4], neck]);
    const rightSide = [...leftSide].reverse().map(([x, py]): Pt => [2 * cx - x, py]);
    d += `M${leftSide.map(([x, py]) => `${r1(x)} ${r1(py)}`).join("L")}`;
    d += `Q${r1(cx - 16 * s)} ${r1(neck - 42 * s)} ${r1(cx)} ${r1(neck - 78 * s)}`;
    d += `Q${r1(cx + 16 * s)} ${r1(neck - 42 * s)} ${r1(cx + halves[4])} ${r1(neck)}`;
    d += `L${rightSide.map(([x, py]) => `${r1(x)} ${r1(py)}`).join("L")}Z`;
  }
  return `${d}M0 ${SCENE_H}H${SCENE_W}V${base}H0Z`;
}

function cone(rand: Rand, cx: number, base: number, height: number, halfBase: number): string {
  const crater = 14 + rand() * 10;
  return `M${r1(cx - halfBase)} ${base}L${r1(cx - crater)} ${r1(base - height)}Q${r1(cx)} ${r1(base - height + 10)} ${r1(cx + crater)} ${r1(base - height)}L${r1(cx + halfBase)} ${base}Z`;
}

function pines(rand: Rand, base: number, minH: number, maxH: number, gap: number): string {
  let d = "";
  for (let x = -10; x < SCENE_W + 20; x += gap * (0.7 + rand() * 0.6)) {
    const h = minH + rand() * (maxH - minH);
    const w = h * 0.34;
    d += `M${r1(x - w)} ${base}L${r1(x)} ${r1(base - h)}L${r1(x + w)} ${base}Z`;
  }
  return `${d}M0 ${SCENE_H}H${SCENE_W}V${base}H0Z`;
}

function spires(rand: Rand, base: number, count: number): string {
  let d = "";
  for (let i = 0; i < count; i += 1) {
    const x = 500 + rand() * 640;
    const h = 60 + rand() * 90;
    d += `M${r1(x - 7)} ${base}V${r1(base - h * 0.6)}L${r1(x)} ${r1(base - h)}L${r1(x + 7)} ${r1(base - h * 0.6)}V${base}Z`;
  }
  return d;
}

function scallops(rand: Rand, base: number, minR: number, maxR: number): string {
  let d = `M0 ${SCENE_H}V${base}`;
  for (let x = 0; x < SCENE_W + 40; ) {
    const r = minR + rand() * (maxR - minR);
    d += `Q${r1(x + r)} ${r1(base - r * 1.5)} ${r1(x + r * 2)} ${base}`;
    x += r * 2;
  }
  return `${d}V${SCENE_H}Z`;
}

function waves(rand: Rand, base: number, amp: number): string {
  let d = `M0 ${SCENE_H}V${base}`;
  for (let x = 0; x < SCENE_W + 60; x += 60) d += `Q${x + 30} ${r1(base - amp - rand() * amp)} ${x + 60} ${base}`;
  return `${d}V${SCENE_H}Z`;
}

const layer = (d: string, tone: SceneLayer["tone"], opacity: number, depth: number, axis: "x" | "y" = "y", stroke = false): SceneLayer => ({
  d,
  tone,
  opacity,
  depth,
  axis,
  stroke,
});

export function sceneData(kinds: SceneKind[], seed: number, night: boolean): SceneData {
  const rand = seeded(seed * 13 + 5);
  const layers: SceneLayer[] = [];
  const lights: SceneLights[] = [];
  let reflection: SceneData["reflection"] = null;

  kinds.forEach((kind, k) => {
    const shift = k * 40; // a second scene sits a touch lower and nearer
    switch (kind) {
      case "skyline": {
        const base = night ? 560 : 640 - shift;
        const far = blocks(rand, base, 18, 44, 40, 120);
        const near = blocks(rand, base, 26, 60, 60, night ? 250 : 190, 20);
        layers.push(layer(far.d, "far", 0.5, 0.25), layer(near.d, "near", 0.85, 0.5));
        lights.push(...near.windows, ...far.windows.slice(0, 20));
        if (night) reflection = { y: base, scaleY: 0.5 };
        break;
      }
      case "temple":
        layers.push(layer(close(ridge(rand, 560, 60, 260, 8)), "far", 0.45, 0.2));
        layers.push(layer(towers(rand, 600, 560, 1140, 5), "near", 0.88, 0.5));
        layers.push(layer(close(ridge(rand, 640, 18, 180, 6)), "near", 0.9, 0.8));
        break;
      case "volcano":
        layers.push(layer(`${cone(rand, 700, 640, 300, 360)}M0 ${SCENE_H}H${SCENE_W}V640H0Z`, "far", 0.5, 0.25));
        layers.push(layer(`${cone(rand, 980, 640, 230, 270)}M0 ${SCENE_H}H${SCENE_W}V640H0Z`, "near", 0.85, 0.5));
        layers.push(layer(close(ridge(rand, 640, 22, 160, 5)), "near", 0.9, 0.8));
        lights.push({ x: 700, y: 344, r: 9, o: 0.9 }, { x: 980, y: 412, r: 7, o: 0.85 });
        break;
      case "range-city": {
        layers.push(layer(close(peaks(rand, 600, 120, 330, 200)), "far", 0.5, 0.25));
        layers.push(layer(close(ridge(rand, 620, 90, 240, 14)), "near", 0.72, 0.45));
        const city = blocks(rand, 660, 10, 26, 14, 70, 520);
        layers.push(layer(city.d, "near", 0.9, 0.75));
        lights.push(...city.windows);
        break;
      }
      case "massif":
        layers.push(layer(close(peaks(rand, 470, 200, 420, 0)), "far", 0.32, 0.15));
        layers.push(layer(close(peaks(rand, 540, 150, 330, 60)), "far", 0.5, 0.3));
        layers.push(layer(close(peaks(rand, 610, 90, 240, 120)), "near", 0.75, 0.55));
        layers.push(layer(close(ridge(rand, 660, 20, 300, 6)), "near", 0.9, 0.85));
        break;
      case "highway": {
        const vp: Pt = [760, 392];
        const road = `M${vp[0] - 10} ${vp[1]}L${vp[0] + 10} ${vp[1]}L1080 ${SCENE_H}L180 ${SCENE_H}Z`;
        layers.push(layer(close(ridge(rand, 392, 30, 200, 5)), "far", 0.55, 0.2, "x"));
        layers.push(layer(road, "near", 0.92, 0.5, "y"));
        let lanes = "";
        for (let i = 1; i <= 7; i += 1) {
          const t = (i / 8) ** 2;
          const y0 = vp[1] + (SCENE_H - vp[1]) * t;
          const y1 = vp[1] + (SCENE_H - vp[1]) * Math.min(1, t + 0.05);
          const w0 = 1 + 9 * t;
          const w1 = 1 + 9 * Math.min(1, t + 0.05);
          const x0 = vp[0] + (630 - vp[0]) * t;
          const x1 = vp[0] + (630 - vp[0]) * Math.min(1, t + 0.05);
          lanes += `M${r1(x0 - w0)} ${r1(y0)}L${r1(x0 + w0)} ${r1(y0)}L${r1(x1 + w1)} ${r1(y1)}L${r1(x1 - w1)} ${r1(y1)}Z`;
        }
        layers.push(layer(lanes, "far", 0.85, 0.5, "y", true));
        const city = blocks(rand, 392, 6, 22, 8, 46, 420);
        layers.push(layer(city.d.replace(/M0 \d+H\d+V\d+H0Z$/, ""), "far", 0.6, 0.3, "x"));
        lights.push(...city.windows.map((l) => ({ ...l, o: Math.min(1, l.o + 0.25) })));
        break;
      }
      case "horizon": {
        layers.push(layer(close(ridge(rand, 470, 8, 400, 2)), "far", 0.4, 0.2, "x"));
        layers.push(layer(`M0 ${SCENE_H}V472H${SCENE_W}V${SCENE_H}Z`, "ink", 0.55, 0.35, "x"));
        layers.push(layer(`M596 472L604 472L668 ${SCENE_H}L520 ${SCENE_H}Z`, "ink", 0.85, 0.6, "y"));
        break;
      }
      case "alpine":
        layers.push(layer(close(peaks(rand, 520, 150, 300, 0)), "far", 0.22, 0.15));
        layers.push(layer(close(peaks(rand, 590, 100, 230, 70)), "far", 0.36, 0.3));
        layers.push(layer(close(peaks(rand, 650, 50, 130, 20)), "near", 0.85, 0.6));
        break;
      case "hills":
        layers.push(layer(close(ridge(rand, 520, 70, 300, 10)), "far", 0.4, 0.2));
        layers.push(layer(close(ridge(rand, 580, 60, 240, 8)), "far", 0.6, 0.4));
        layers.push(layer(close(ridge(rand, 640, 40, 200, 6)), "near", 0.88, 0.7));
        break;
      case "terraces": {
        for (let i = 0; i < 5; i += 1) {
          layers.push(layer(close(ridge(rand, 470 + i * 42, 34 - i * 4, 180 + i * 30, 4)), i < 3 ? "far" : "near", 0.35 + i * 0.13, 0.15 + i * 0.16));
        }
        break;
      }
      case "coast":
        layers.push(layer(close(ridge(rand, 540 - shift, 50, 320, 6)), "far", 0.4, 0.2));
        layers.push(layer(waves(rand, 600, 12), "far", 0.55, 0.4, "x"));
        layers.push(layer(waves(rand, 640, 16), "near", 0.85, 0.65, "x"));
        break;
      case "pines":
        layers.push(layer(pines(rand, 600, 70, 150, 26), "far", 0.5, 0.3));
        layers.push(layer(pines(rand, 660, 90, 190, 34), "near", 0.9, 0.65));
        break;
      case "plains":
        layers.push(layer(close(ridge(rand, 500, 10, 500, 3)), "far", 0.4, 0.2, "x"));
        layers.push(layer(close(ridge(rand, 560, 14, 420, 3)), "far", 0.6, 0.4, "x"));
        layers.push(layer(close(ridge(rand, 630, 10, 360, 2)), "near", 0.85, 0.7, "x"));
        break;
      case "spires":
        layers.push(layer(`${close(ridge(rand, 600 - shift, 46, 260, 6))}${spires(rand, 600 - shift, 6)}`, "near", 0.8, 0.5));
        break;
      case "canopy":
        layers.push(layer(scallops(rand, 590 - shift, 30, 60), "far", 0.55, 0.3));
        layers.push(layer(scallops(rand, 650 - shift, 34, 70), "near", 0.88, 0.65));
        break;
      case "peaks-soft":
        layers.push(layer(close(ridge(rand, 470, 130, 380, 8)), "far", 0.35, 0.2));
        layers.push(layer(close(ridge(rand, 580, 90, 300, 8)), "far", 0.55, 0.4));
        layers.push(layer(close(ridge(rand, 645, 40, 220, 5)), "near", 0.88, 0.7));
        break;
    }
  });

  return { layers, lights, reflection };
}
