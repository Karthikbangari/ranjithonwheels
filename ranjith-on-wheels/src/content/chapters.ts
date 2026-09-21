import { journeyCountries, type JourneyCountry } from "./journey";
import { getStory, momentsFor, type ContentStatus, type Story, type StoryMoment } from "./stories";
import { getAtmosphere, type Atmosphere } from "./atmospheres";
import { bhagiraFor, type BhagiraEntry } from "./bhagira";

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

// Only verified copy is public. A `draft` story exists in the data but is not
// rendered (unless a preview build sets NEXT_PUBLIC_SHOW_DRAFTS=1), and a
// country with no story at all is `pending`.
export function isPublic(status: ContentStatus, showDrafts = false): boolean {
  return status === "verified" || (showDrafts && status === "draft");
}

export function publicStory(slug: string): Story | null {
  const story = getStory(slug);
  if (!story) return null;
  return isPublic(story.contentStatus, process.env.NEXT_PUBLIC_SHOW_DRAFTS === "1") ? story : null;
}

export type Chapter = {
  country: JourneyCountry;
  contentStatus: ContentStatus;
  story: Story | null;
  // A chapter with no public story shows a wordless, atmospheric interlude
  // (the country's landscape and the road through it) between arrival and
  // leaving, so it reads as designed rather than empty.
  interlude: boolean;
  bhagira: BhagiraEntry | null;
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
  environment: StoryMoment | null;
  discovery: StoryMoment[];
  people: StoryMoment[];
  signature: StoryMoment | null;
};

const atmosphereFallback = { from: "#071c3b", to: "#0b4ea2" };

export function buildChapter(slug: string): Chapter | null {
  const country = journeyCountries.find((entry) => entry.slug === slug);
  if (!country) return null;

  const story = publicStory(slug);
  const next = journeyCountries.find((entry) => entry.order === country.order + 1) ?? null;
  const summary = country.summary ?? null;
  const opening = story?.headline ?? (summary && summary.length <= OPENING_LINE_MAX ? summary : null);
  const notes = !story && summary && summary.length > OPENING_LINE_MAX ? summary : null;

  return {
    country,
    contentStatus: getStory(slug)?.contentStatus ?? "pending",
    story,
    interlude: story === null,
    bhagira: bhagiraFor(slug),
    atmosphere: getAtmosphere(slug),
    previous: journeyCountries.find((entry) => entry.order === country.order - 1) ?? null,
    next,
    nextHero: next ? getAtmosphere(next.slug).hero : atmosphereFallback,
    opening,
    notes,
    crossing: seaCrossings[slug] ?? null,
    arrival: momentsFor(story, "arrival")[0] ?? null,
    road: momentsFor(story, "road"),
    environment: momentsFor(story, "environment")[0] ?? null,
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
    environment: chapter.environment !== null,
    discovery: chapter.discovery.length > 0,
    people: chapter.people.length > 0,
    signature: chapter.signature !== null,
  };
}

// The rows of the arrival page's metadata, in order. Location and coordinates
// are always there; the date only when the owner has supplied a verified one
// (`arrivalDate`) — with none the row is just location and coordinates, with no
// empty slot and no separator; "From" only where there is a country behind us.
export type ArrivalRow = "location" | "coordinates" | "date" | "from" | "chapter" | "crossing";

export function arrivalRows(chapter: Pick<Chapter, "country" | "previous" | "crossing">): ArrivalRow[] {
  const rows: ArrivalRow[] = ["location", "coordinates"];
  if (chapter.country.arrivalDate?.trim()) rows.push("date");
  if (chapter.previous) rows.push("from");
  rows.push("chapter");
  if (chapter.crossing) rows.push("crossing");
  return rows;
}
