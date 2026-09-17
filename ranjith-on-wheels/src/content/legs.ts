import { journeyCountries, type JourneyChapter } from "./journey";

// Leg camera parameters are placeholders until Phase 4 wires up MapLibre —
// center/zoom are derived from the existing display-anchor centroid per
// chapter so they stay honest (not hand-picked) until real GPX/leg framing
// is designed alongside the actual map.
export type LegId = JourneyChapter;

export type LegCamera = {
  center: [longitude: number, latitude: number];
  zoom: number;
  pitch: number;
  bearing: number;
};

export type Leg = {
  id: LegId;
  order: number;
  name: string;
  meaning: string;
  countryIds: string[];
  camera: LegCamera;
};

const LEG_META: Record<LegId, { order: number; name: string; meaning: string; zoom: number; pitch: number }> = {
  india: { order: 1, name: "The first roads", meaning: "Where the promise became a journey", zoom: 4.2, pitch: 40 },
  "southeast-asia": {
    order: 2,
    name: "Across Southeast Asia",
    meaning: "Learning to trust the unknown",
    zoom: 3.4,
    pitch: 30,
  },
  "east-asia": {
    order: 3,
    name: "The eastern arc",
    meaning: "Connection beyond language",
    zoom: 2.6,
    pitch: 25,
  },
  australia: {
    order: 4,
    name: "The far horizon",
    meaning: "Two rejections, one destination",
    zoom: 3.8,
    pitch: 30,
  },
  europe: {
    order: 5,
    name: "Europe, border by border",
    meaning: "The road reaches country twenty-three",
    zoom: 3.6,
    pitch: 35,
  },
};

function centroid(points: [number, number][]): [number, number] {
  const [lonSum, latSum] = points.reduce(
    ([lon, lat], [pointLon, pointLat]) => [lon + pointLon, lat + pointLat],
    [0, 0],
  );
  return [lonSum / points.length, latSum / points.length];
}

export const legs: Leg[] = (Object.keys(LEG_META) as LegId[])
  .map((id) => {
    const countries = journeyCountries.filter((country) => country.chapter === id);
    const meta = LEG_META[id];
    return {
      id,
      order: meta.order,
      name: meta.name,
      meaning: meta.meaning,
      countryIds: countries.map((country) => country.slug),
      camera: {
        center: centroid(countries.map((country) => country.displayAnchor)),
        zoom: meta.zoom,
        pitch: meta.pitch,
        bearing: 0,
      },
    };
  })
  .sort((a, b) => a.order - b.order);
