import { geoMercator, type GeoProjection } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";

// ISO 3166-1 numeric codes, matched against the `id` field topojson-client
// carries onto each converted GeoJSON feature in countries-110m.json.
// Singapore has no entry: Natural Earth's 110m admin-0 dataset (the one
// bundled via world-atlas) drops it for being too small to resolve at that
// zoom level. findCountryFeature returns undefined for it, and callers fall
// back to centring on the country's own display anchor instead of an outline.
const ISO_NUMERIC_BY_SLUG: Record<string, string> = {
  india: "356",
  "sri-lanka": "144",
  vietnam: "704",
  cambodia: "116",
  thailand: "764",
  malaysia: "458",
  indonesia: "360",
  china: "156",
  japan: "392",
  "south-korea": "410",
  taiwan: "158",
  mongolia: "496",
  australia: "036",
  france: "250",
  switzerland: "756",
  germany: "276",
  austria: "040",
  italy: "380",
  slovenia: "705",
  croatia: "191",
  hungary: "348",
  slovakia: "703",
};

export function findCountryFeature(
  world: FeatureCollection,
  slug: string,
): Feature | undefined {
  const id = ISO_NUMERIC_BY_SLUG[slug];
  if (!id) return undefined;
  return world.features.find((candidate) => candidate.id === id);
}

// Fits the target country's own outline tightly into the frame when we have
// one; otherwise centres a fixed, moderate zoom on its display anchor so the
// card still reads as "this place", not an empty rectangle.
export function computeCountryProjection(
  target: Feature | undefined,
  anchor: [number, number],
  width: number,
  height: number,
  padding = 28,
): GeoProjection {
  const projection = geoMercator();
  if (target) {
    projection.fitExtent(
      [
        [padding, padding],
        [width - padding, height - padding],
      ],
      target,
    );
  } else {
    projection.center(anchor).scale(width * 5).translate([width / 2, height / 2]);
  }
  return projection;
}
