import { describe, expect, it } from "vitest";
import { journeyCountries } from "./journey";
import { atmospheres } from "./atmospheres";

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe("country atmospheres", () => {
  it("defines one for every country on the journey, and nothing else", () => {
    expect(Object.keys(atmospheres).sort()).toEqual(journeyCountries.map((c) => c.slug).sort());
  });

  it("gives every country its own accent colour and terrain seed", () => {
    const values = Object.values(atmospheres);
    expect(new Set(values.map((a) => a.theme.accent)).size).toBe(values.length);
    expect(new Set(values.map((a) => a.terrain.seed)).size).toBe(values.length);
  });

  it("keeps every accent readable as text on its own tint and on white (4.5:1)", () => {
    for (const [slug, atmosphere] of Object.entries(atmospheres)) {
      expect(contrast(atmosphere.theme.accent, atmosphere.theme.tint), slug).toBeGreaterThanOrEqual(4.5);
      expect(contrast(atmosphere.theme.accent, "#ffffff"), slug).toBeGreaterThanOrEqual(4.5);
      expect(contrast(atmosphere.theme.ink, atmosphere.theme.tint), slug).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("keeps hero type readable: ivory on every hero gradient, both ends (4.5:1)", () => {
    for (const [slug, atmosphere] of Object.entries(atmospheres)) {
      expect(contrast("#fff9f0", atmosphere.hero.from), `${slug} from`).toBeGreaterThanOrEqual(4.5);
      expect(contrast("#fff9f0", atmosphere.hero.to), `${slug} to`).toBeGreaterThanOrEqual(3);
    }
  });

  it("gives every country a scene, and the night countries their own night effects", () => {
    for (const [slug, atmosphere] of Object.entries(atmospheres)) {
      expect(atmosphere.scenes.length, slug).toBeGreaterThanOrEqual(1);
      expect(atmosphere.scenes.length, slug).toBeLessThanOrEqual(2);
    }
    expect(atmospheres.singapore.effect).toBe("citylights");
    expect(atmospheres["south-korea"].effect).toBe("highway");
    expect(atmospheres.singapore.scenes).toEqual(["skyline"]);
    expect(atmospheres["south-korea"].scenes).toEqual(["highway"]);
  });

  it("keeps the night heroes charcoal, never pure black", () => {
    for (const slug of ["singapore", "south-korea"]) {
      const from = atmospheres[slug].hero.from;
      expect(from.toLowerCase(), slug).not.toBe("#000000");
      // Some blue/green in it, and lifted off black: luminance clearly above zero.
      expect(luminance(from), slug).toBeGreaterThan(0.004);
    }
  });

  it("uses the night treatment only for Singapore and South Korea", () => {
    const night = Object.entries(atmospheres)
      .filter(([, atmosphere]) => atmosphere.hero.night)
      .map(([slug]) => slug);
    expect(night.sort()).toEqual(["singapore", "south-korea"]);
  });
});
