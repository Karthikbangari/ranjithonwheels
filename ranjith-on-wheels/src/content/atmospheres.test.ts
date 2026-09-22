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

  it("gives every country its own accent colour", () => {
    const values = Object.values(atmospheres);
    expect(new Set(values.map((a) => a.theme.accent)).size).toBe(values.length);
  });

  it("keeps every accent readable as text on its own tint and on white (4.5:1)", () => {
    for (const [slug, atmosphere] of Object.entries(atmospheres)) {
      expect(contrast(atmosphere.theme.accent, atmosphere.theme.tint), slug).toBeGreaterThanOrEqual(4.5);
      expect(contrast(atmosphere.theme.accent, "#ffffff"), slug).toBeGreaterThanOrEqual(4.5);
      expect(contrast(atmosphere.theme.ink, atmosphere.theme.tint), slug).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("only tags a natural-environment label for Indonesia and Taiwan, whose summaries name a setting", () => {
    const labelled = Object.entries(atmospheres)
      .filter(([, atmosphere]) => atmosphere.environmentLabel)
      .map(([slug]) => slug);
    expect(labelled.sort()).toEqual(["indonesia", "taiwan"]);
  });
});
