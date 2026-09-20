import { journeyCountries, type JourneyCountry } from "./journey";
import { getStory, momentsFor, type Story, type StoryMoment } from "./stories";
import { getAtmosphere, type Atmosphere } from "./atmospheres";

// Turns a country entry into the chapter the site renders (Pages 5–13). It
// only ever *reads* content: a section exists exactly when the data for it
// does, and nothing here writes or invents a fact. That is what keeps the
// chapters for countries without a manuscript yet honest — they build the
// pages they have data for (the hero, the route in, the route out, the
// hand-off to the next country) and stop there.

// Sea crossings that the manuscript states outright. A crossing is only drawn
// dashed and labelled when it is listed here — the ferry from Singapore is in
// Indonesia's summary. OWNER: India→Sri Lanka, Australia and the Europe leg
// aren't sourced yet, so they aren't marked.
export const seaCrossings: Record<string, string> = {
  indonesia: "The 32-hour ferry from Singapore",
};

// A one-line teaser (Sri Lanka, Thailand, Australia) is a fine opening line;
// a long summary is not, so it is left to the chapter notes instead.
const OPENING_LINE_MAX = 80;

export type Chapter = {
  country: JourneyCountry;
  story: Story | null;
  atmosphere: Atmosphere;
  previous: JourneyCountry | null;
  next: JourneyCountry | null;
  // The next chapter's hero colours, so the hand-off veil is already in them.
  nextHero: { from: string; to: string };
  opening: string | null;
  // A long summary for a country with no story pages yet, shown as plain
  // chapter notes so nothing already on the site is lost.
  notes: string | null;
  crossing: string | null;
  arrival: StoryMoment | null;
  road: StoryMoment[];
  challenge: StoryMoment | null;
  discovery: StoryMoment[];
  people: StoryMoment[];
  signature: StoryMoment | null;
};

const atmosphereFallback = { from: "#071c3b", to: "#0b4ea2" };

export function buildChapter(slug: string): Chapter | null {
  const country = journeyCountries.find((entry) => entry.slug === slug);
  if (!country) return null;

  const story = getStory(slug);
  const next = journeyCountries.find((entry) => entry.order === country.order + 1) ?? null;
  const summary = country.summary ?? null;
  const opening = story?.headline ?? (summary && summary.length <= OPENING_LINE_MAX ? summary : null);
  const notes = !story && summary && summary.length > OPENING_LINE_MAX ? summary : null;

  return {
    country,
    story,
    atmosphere: getAtmosphere(slug),
    previous: journeyCountries.find((entry) => entry.order === country.order - 1) ?? null,
    next,
    nextHero: next ? getAtmosphere(next.slug).hero : atmosphereFallback,
    opening,
    notes,
    crossing: seaCrossings[slug] ?? null,
    arrival: momentsFor(story, "arrival")[0] ?? null,
    road: momentsFor(story, "road"),
    challenge: momentsFor(story, "challenge")[0] ?? null,
    discovery: momentsFor(story, "discovery"),
    people: momentsFor(story, "people"),
    signature: momentsFor(story, "signature")[0] ?? null,
  };
}

// Which of the optional pages a chapter has data for — used by the chapter
// itself and by tests that pin the coverage down.
export function chapterPages(chapter: Chapter) {
  return {
    road: chapter.road.length > 0,
    challenge: chapter.challenge !== null,
    discovery: chapter.discovery.length > 0,
    people: chapter.people.length > 0,
    signature: chapter.signature !== null,
  };
}
