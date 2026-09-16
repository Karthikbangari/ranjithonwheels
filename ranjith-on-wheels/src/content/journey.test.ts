import { describe, expect, it } from "vitest";
import { siteContent } from "./site";
import { journeyCountries } from "./journey";

describe("journey content", () => {
  it("matches the site-wide country count", () => {
    expect(journeyCountries).toHaveLength(siteContent.countryCount);
  });

  it("is ordered sequentially starting at 1", () => {
    journeyCountries.forEach((country, index) => {
      expect(country.order).toBe(index + 1);
    });
  });

  it("has a unique slug for every country", () => {
    const slugs = journeyCountries.map((country) => country.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("ends the route at the current country", () => {
    const last = journeyCountries[journeyCountries.length - 1];
    expect(last.name).toBe(siteContent.currentCountry);
  });
});
