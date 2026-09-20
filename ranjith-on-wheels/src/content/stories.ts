import { journeyCountries, type JourneyCountry } from "./journey";

// The countries whose chapter pages carry story content. Each one has both a
// full narrative summary and a page-verified manuscript citation in
// journey.ts — the same selection rule /stories uses. Every other country's
// chapter is already built (see chapters.ts) and simply has no story pages
// yet: to add one, append an entry here and it renders around what exists.
//
// Everything below is a restatement of that country's own `summary`, split
// into short moments. CLAUDE.md §1: no new dates, distances, names or
// events — stories.test.ts fails the build if a number appears here that the
// country's summary doesn't already contain.
//
// OWNER: these pages carry only what the manuscript summaries already say.
// Richer per-story detail (a first-person line, a photograph of a specific
// moment, the Sri Lanka / Thailand / Australia / Europe stories) needs
// owner-supplied material.

export type StoryMotif =
  | "falls"
  | "terraces"
  | "towers"
  | "canopy"
  | "skyline"
  | "ferry"
  | "ink"
  | "petals"
  | "fireworks"
  | "horizon";

export type StoryStat = {
  value: number;
  unit: string;
  label: string;
  prefix?: string;
};

// Which chapter page a moment belongs to. A chapter only renders the pages
// its story actually has a moment for — nothing is invented to fill a slot.
//   arrival   — entering the country          (Page 6)
//   road      — the ride through the country  (Page 7, pinned, odometer)
//   challenge — a hardship the summary states (Page 8) — only where real
//   discovery — a destination / food / culture (Page 9)
//   people    — the people and the memory     (Page 10, film frames)
//   signature — the one wow moment            (Page 11, bespoke motif)
export type Beat = "arrival" | "road" | "challenge" | "discovery" | "people" | "signature";

export type StoryMoment = {
  beat: Beat;
  label: string;
  text: string;
};

export type Story = {
  slug: string;
  headline: string;
  // The signature page's bespoke illustration. Optional: a story with a
  // signature moment but no motif yet still gets the page, in typography.
  motif?: StoryMotif;
  stats: StoryStat[];
  moments: StoryMoment[];
};

export const stories: Story[] = [
  {
    slug: "india",
    headline: "15,000 kilometres before the first border.",
    motif: "falls",
    stats: [{ value: 15000, unit: "km", label: "the first leg" }],
    moments: [
      {
        beat: "road",
        label: "The first leg",
        text: "The ride covered 15,000 kilometres across Tamil Nadu, Karnataka and beyond.",
      },
      {
        beat: "discovery",
        label: "Hogenakkal Falls",
        text: "Near the falls came an oil massage and a bath under the waterfall.",
      },
      {
        beat: "signature",
        label: "Nohkalikai Falls",
        text: "In Meghalaya, the falls carry a tragic legend of their own.",
      },
      {
        beat: "road",
        label: "Ladakh",
        text: "Then north, through Ladakh and Pangong Tso, before the first border.",
      },
    ],
  },
  {
    slug: "vietnam",
    headline: "The first real culture shock.",
    motif: "terraces",
    stats: [],
    moments: [
      {
        beat: "arrival",
        label: "Everything different",
        text: "Different gods, greetings, currency and cuisine — the first real culture shock of the journey.",
      },
      {
        beat: "people",
        label: "Strangers",
        text: "Yet strangers offered food and stories, with no expectations attached.",
      },
      {
        beat: "signature",
        label: "Tam Coc",
        text: "Two days at Tam Coc, where farmers cultivate rice on standing water.",
      },
      {
        beat: "discovery",
        label: "Cu Chi Tunnels",
        text: "A crawl through the Cu Chi Tunnels near Ho Chi Minh City closed out the chapter.",
      },
    ],
  },
  {
    slug: "cambodia",
    headline: "Buddhism shaped every day.",
    motif: "towers",
    stats: [],
    moments: [
      {
        beat: "discovery",
        label: "Daily life",
        text: "Temple chants echoed through small villages at every turn.",
      },
      {
        beat: "people",
        label: "The monasteries",
        text: "Children were sent to monasteries to learn discipline and meditation.",
      },
      {
        beat: "signature",
        label: "Angkor Wat",
        text: "A Hindu temple to Vishnu that later became Buddhist, with a hidden shrine to Shiva inside — the chapter's centrepiece.",
      },
    ],
  },
  {
    slug: "malaysia",
    headline: "Some of the most refreshing riding of the journey.",
    motif: "canopy",
    stats: [{ value: 1500, unit: "km", label: "through reserve zones" }],
    moments: [
      {
        beat: "road",
        label: "The road",
        text: "1,500 kilometres through tiger and elephant reserve zones.",
      },
      {
        beat: "signature",
        label: "The fruit",
        text: "Durian, mangosteen and snake fruit, tasted along the way.",
      },
      {
        beat: "people",
        label: "The welcome",
        text: "The hospitality of both ethnic Malaysians and Malaysian Tamilians left a lasting impression.",
      },
      {
        beat: "road",
        label: "The air",
        text: "The air quality made for some of the most refreshing riding of the whole journey.",
      },
    ],
  },
  {
    slug: "singapore",
    headline: "Where technology and respect met.",
    motif: "skyline",
    stats: [{ value: 200, unit: "km", label: "across the country" }],
    moments: [
      {
        beat: "road",
        label: "The ride",
        text: "A 200-kilometre ride through a country that blends cutting-edge technology with deep respect for people and environment.",
      },
      {
        beat: "signature",
        label: "The metro",
        text: "A metro system engineered through artificial waterfalls.",
      },
      {
        beat: "discovery",
        label: "The waste",
        text: "A waste-management culture that left Ranjith genuinely impressed.",
      },
    ],
  },
  {
    slug: "indonesia",
    headline: "32 hours without a signal.",
    motif: "ferry",
    stats: [
      { value: 2100, unit: "km", label: "across Indonesia" },
      { value: 32, unit: "hours", label: "on the ferry from Singapore" },
    ],
    moments: [
      {
        beat: "signature",
        label: "The ferry",
        text: "The chapter began with a 32-hour ferry from Singapore, with no signal at all — a rare, reflective break from the digital world.",
      },
      {
        beat: "road",
        label: "The road",
        text: "From there, 2,100 kilometres.",
      },
      {
        beat: "discovery",
        label: "Bali",
        text: "Roads named after Lord Rama, and Ganesha shrines across Bali, revealed an unexpected thread of Hindu mythology.",
      },
      {
        // A hazard the summary names (volcanic risk), not a narrated event —
        // the page claims nothing beyond this line.
        beat: "challenge",
        label: "Fields and fire",
        text: "Terraced rice fields, alongside the volcanic risk of the Pacific Ring of Fire.",
      },
    ],
  },
  {
    slug: "china",
    headline: "Not the skyline. The hospitality.",
    motif: "ink",
    stats: [{ value: 2000, unit: "km", label: "from Shanghai" }],
    moments: [
      {
        beat: "arrival",
        label: "Shanghai",
        text: "2,000 kilometres began in Shanghai, China's most advanced metropolis.",
      },
      {
        beat: "discovery",
        label: "The technology",
        text: "A hyper-modern skyline, and precision mapping technology.",
      },
      {
        beat: "signature",
        label: "The strangers",
        text: "Yet what struck Ranjith most was the local hospitality: strangers repeatedly offering food to travellers as a simple gesture of kindness.",
      },
    ],
  },
  {
    slug: "japan",
    headline: "A land of discipline and innovation.",
    motif: "petals",
    stats: [{ value: 1200, unit: "km", label: "from Tokyo" }],
    moments: [
      {
        beat: "arrival",
        label: "Tokyo",
        text: "1,200 kilometres began in Tokyo.",
      },
      {
        beat: "people",
        label: "The people",
        text: "Ranjith was moved by the humility of the Japanese people.",
      },
      {
        beat: "signature",
        label: "The trains",
        text: "The punctuality of the Shinkansen bullet trains.",
      },
      {
        beat: "discovery",
        label: "Hanami",
        text: "A cherry blossom season that draws whole parks together.",
      },
    ],
  },
  {
    slug: "taiwan",
    headline: "Engineered for earthquakes.",
    motif: "fireworks",
    stats: [{ value: 1000, unit: "km", label: "across Taiwan" }],
    moments: [
      {
        // The summary states the hazard (an earthquake-prone country,
        // engineered to withstand it), not an incident.
        beat: "challenge",
        label: "The ground",
        text: "1,000 kilometres across one of the world's most earthquake-prone countries, engineered to withstand it.",
      },
      {
        beat: "road",
        label: "Factories and humidity",
        text: "Semiconductor factories and tropical humidity marked the ride.",
      },
      {
        beat: "signature",
        label: "Taipei 101",
        text: "Fireworks erupt from Taipei 101 every New Year's Eve.",
      },
    ],
  },
  {
    slug: "mongolia",
    headline: "Over 2,000 kilometres of open steppe.",
    motif: "horizon",
    stats: [{ value: 2000, unit: "km", prefix: "Over ", label: "of steppe and unpaved road" }],
    moments: [
      {
        beat: "signature",
        label: "The road",
        text: "Vast steppe and unpaved road — paradise for anyone drawn to true wilderness.",
      },
      {
        beat: "discovery",
        label: "At the table",
        text: "Traditional dishes like buuz and khuushur, and the fermented mare's milk airag, tied every meal back to Mongolia's nomadic traditions.",
      },
    ],
  },
];

export function getStory(slug: string): Story | null {
  return stories.find((story) => story.slug === slug) ?? null;
}

export function momentsFor(story: Story | null, beat: Beat): StoryMoment[] {
  return story ? story.moments.filter((moment) => moment.beat === beat) : [];
}

export type StoryWithCountry = { story: Story; country: JourneyCountry };

// Story order follows the journey (country `order`), which is also how
// `stories` is written above; this joins each one to its country entry.
export const storiesWithCountry: StoryWithCountry[] = stories.flatMap((story) => {
  const country = journeyCountries.find((entry) => entry.slug === story.slug);
  return country ? [{ story, country }] : [];
});
