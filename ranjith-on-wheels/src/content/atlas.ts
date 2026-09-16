import type { JourneyChapter } from "./journey";

export type MapMode = "route" | "kindness" | "challenge";

export type AtlasChapter = {
  id: JourneyChapter;
  label: string;
  meaning: string;
};

export const atlasChapters: AtlasChapter[] = [
  { id: "india", label: "India", meaning: "Where the promise became a journey" },
  {
    id: "southeast-asia",
    label: "South and Southeast Asia",
    meaning: "Learning to trust the unknown",
  },
  { id: "east-asia", label: "East Asia", meaning: "Connection beyond language" },
  { id: "australia", label: "Australia", meaning: "Two rejections, one destination" },
  { id: "europe", label: "Europe", meaning: "The road reaches country twenty-three" },
];

export const kindnessCountrySlugs = [
  "india",
  "vietnam",
  "malaysia",
  "south-korea",
  "australia",
];

export const challengeCountrySlugs = [
  "sri-lanka",
  "thailand",
  "indonesia",
  "mongolia",
  "australia",
];
