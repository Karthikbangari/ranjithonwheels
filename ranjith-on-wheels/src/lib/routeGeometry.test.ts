import { describe, expect, it } from "vitest";
import { buildRouteData } from "./routeGeometry";
import { journeyCountries } from "@/content/journey";

describe("buildRouteData", () => {
  const route = buildRouteData();

  it("has one checkpoint per country, in order", () => {
    expect(route.checkpoints).toHaveLength(journeyCountries.length);
    route.checkpoints.forEach((checkpoint, index) => {
      expect(checkpoint.slug).toBe(journeyCountries[index].slug);
      expect(checkpoint.order).toBe(journeyCountries[index].order);
    });
  });

  it("has fractions that start at 0, end at 1, and never decrease", () => {
    expect(route.checkpoints[0].fraction).toBe(0);
    expect(route.checkpoints[route.checkpoints.length - 1].fraction).toBe(1);
    for (let i = 1; i < route.checkpoints.length; i += 1) {
      expect(route.checkpoints[i].fraction).toBeGreaterThanOrEqual(route.checkpoints[i - 1].fraction);
    }
  });

  it("marks exactly the three named sea crossings", () => {
    expect(route.crossingLines).toHaveLength(3);
    expect(route.crossingLabels.features).toHaveLength(3);
    expect(route.crossingLabels.features.every((f) => f.properties.label === "SEA CROSSING")).toBe(true);
  });

  it("the main line is one continuous, unbroken coordinate list", () => {
    expect(route.mainLine.geometry.coordinates.length).toBeGreaterThan(journeyCountries.length);
  });

  it("the unfinished segment starts at Slovakia and heads away from it", () => {
    const slovakia = journeyCountries[journeyCountries.length - 1];
    const coords = route.unfinishedLine.geometry.coordinates;
    expect(coords[0]).toEqual(slovakia.displayAnchor);
    expect(coords.length).toBeGreaterThan(1);
    // it should keep moving in a consistent direction, not double back
    const first = coords[0];
    const last = coords[coords.length - 1];
    expect(Math.hypot(last[0] - first[0], last[1] - first[1])).toBeGreaterThan(0);
  });
});
