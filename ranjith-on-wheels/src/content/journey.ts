export type JourneyChapter =
  | "india"
  | "southeast-asia"
  | "east-asia"
  | "australia"
  | "europe";

// CLAUDE.md §8: credits belong in a collapsible drawer at the foot of the
// page, never the headline. `pages` is only ever set when directly verified
// against the manuscript text (a page range confirmed by searching that
// page's actual text, not inferred) — left unset rather than guessed.
export type CountrySource = {
  label: string;
  pages?: string;
  url?: string;
  accessed?: string;
};

// One image, wherever it is used. The path is resolved against /public at
// build time (lib/media.ts): a path that has no file behind it renders nothing
// rather than a broken image, so listing a photograph here before the file
// arrives is harmless — and replacing a terrain cover with a real photograph
// is one data change, never a component change.
export type MediaImage = {
  src: string;
  alt: string;
  credit?: string;
};

export type JourneyCountry = {
  order: number;
  slug: string;
  name: string;
  iso3: string;
  displayAnchor: [longitude: number, latitude: number];
  chapter: JourneyChapter;
  featured: boolean;
  // The country's media object (CLAUDE.md §0 decision #21). Everything but
  // `coverImage`/`coverAlt` is optional; components read it only through
  // lib/media.ts, never by path.
  //   coverImage — the card / social-share image, and the hero's default
  //   heroImage  — the full-screen chapter hero, when it differs from the cover
  //   gallery    — documentary photographs; each becomes a Page 10 film frame
  //   signatureImage — the real photograph for Page 11, replacing the illustration
  //   videoUrl   — the original video or post, linked from the chapter
  coverImage: string;
  coverAlt: string;
  heroImage?: MediaImage;
  signatureImage?: MediaImage;
  // Optional, and displayed exactly as supplied — never parsed, never guessed.
  // OWNER: no verified crossing or departure dates yet; leave unset until then.
  arrivalDate?: string;
  departureDate?: string;
  // CLAUDE.md §14.6: the manuscript has no Europe-leg content (France
  // through Slovakia) — left unset rather than invented. Consumers must
  // handle its absence instead of rendering a placeholder string.
  summary?: string;
  lesson?: string;
  whoHelped?: string;
  kindnessStory?: string;
  challengeStory?: string;
  videoUrl?: string;
  source?: CountrySource;
  gallery: MediaImage[];
};

const THE_INDIAN_CYCLIST = "The Indian Cyclist — A Journey for Generations";

export const journeyCountries: JourneyCountry[] = [
  {
    order: 1,
    slug: "india",
    name: "India",
    iso3: "IND",
    displayAnchor: [78.9629, 20.5937],
    chapter: "india",
    featured: false,
    coverImage: "/media/journey/india/cover.jpg",
    coverAlt: "Ranjith sitting on a rock at the base of Nohkalikai Falls in Meghalaya, India",
    summary:
      "The first leg covered 15,000 kilometres across Tamil Nadu, Karnataka and beyond — an oil massage and waterfall bath near the Hogenakkal Falls, the tragic legend behind Meghalaya's Nohkalikai Falls, then north through Ladakh and Pangong Tso before the first border.",
    // OWNER: no verified "who helped" moment found in the manuscript for
    // India yet — left unset rather than invented.
    source: { label: THE_INDIAN_CYCLIST, pages: "pp. 74–82" },
    gallery: [],
  },
  {
    order: 2,
    slug: "sri-lanka",
    name: "Sri Lanka",
    iso3: "LKA",
    displayAnchor: [80.7718, 7.8731],
    chapter: "southeast-asia",
    featured: true,
    coverImage: "/media/journey/sri-lanka/cover.jpg",
    coverAlt: "A cartographic view of Sri Lanka, standing in until a journey photograph is sourced",
    summary: "The elephant escape.",
    // OWNER: only the one-line teaser above is sourced so far — the
    // challenge/who-helped/lesson beats for the six-beat story treatment
    // are not yet in the manuscript excerpt. Left unset rather than invented.
    gallery: [],
  },
  {
    order: 3,
    slug: "vietnam",
    name: "Vietnam",
    iso3: "VNM",
    displayAnchor: [108.2772, 14.0583],
    chapter: "southeast-asia",
    featured: false,
    coverImage: "/media/journey/vietnam/cover.jpg",
    coverAlt: "Aerial view of terraced rice paddies cultivated on standing water in Vietnam",
    summary:
      "Vietnam brought Ranjith's first real culture shock of the journey — different gods, greetings, currency and cuisine — but also an unmistakable warmth from strangers who offered food and stories with no expectations. Two days at Tam Coc, where farmers cultivate rice on standing water, and a crawl through the Cu Chi Tunnels near Ho Chi Minh City closed out the chapter.",
    source: { label: THE_INDIAN_CYCLIST, pages: "pp. 87–92" },
    gallery: [],
  },
  {
    order: 4,
    slug: "cambodia",
    name: "Cambodia",
    iso3: "KHM",
    displayAnchor: [104.991, 12.5657],
    chapter: "southeast-asia",
    featured: false,
    coverImage: "/media/journey/cambodia/cover.jpg",
    coverAlt:
      "Ranjith and a fellow cyclist with their loaded touring bicycles, surrounded by local children, outside a temple in Cambodia",
    summary:
      "Buddhism shaped daily life at every turn — temple chants echoing through small villages, children sent to monasteries to learn discipline and meditation. Angkor Wat, a Hindu temple to Vishnu that later became Buddhist with a hidden shrine to Shiva inside, was the chapter's centrepiece.",
    // OWNER: this photograph was pulled from the manuscript PDF (p. 97) at
    // your request — please confirm the rider beside Ranjith and the temple
    // location, and that this image is cleared to publish on the website
    // (the manuscript's licensing may only cover the book itself).
    source: { label: THE_INDIAN_CYCLIST, pages: "pp. 93–96" },
    gallery: [],
  },
  {
    order: 5,
    slug: "thailand",
    name: "Thailand",
    iso3: "THA",
    displayAnchor: [100.9925, 15.87],
    chapter: "southeast-asia",
    featured: true,
    coverImage: "/media/journey/thailand/cover.jpg",
    coverAlt: "A cartographic view of Thailand, standing in until a journey photograph is sourced",
    summary: "When only Rs 150 remained.",
    // OWNER: only the one-line teaser above is sourced so far — see the
    // matching note on Sri Lanka above.
    gallery: [],
  },
  {
    order: 6,
    slug: "malaysia",
    name: "Malaysia",
    iso3: "MYS",
    displayAnchor: [101.9758, 4.2105],
    chapter: "southeast-asia",
    featured: false,
    coverImage: "/media/journey/malaysia/cover.jpg",
    coverAlt: "Ranjith riding a loaded touring bicycle with arms outstretched down a farm track in Malaysia",
    summary:
      "1,500 kilometres through tiger and elephant reserve zones, tasting durian, mangosteen and snake fruit along the way. The hospitality of both ethnic Malaysians and Malaysian Tamilians left a lasting impression, and the air quality made for some of the most refreshing riding of the whole journey.",
    source: { label: THE_INDIAN_CYCLIST, pages: "pp. 101–104" },
    gallery: [],
  },
  {
    order: 7,
    slug: "singapore",
    name: "Singapore",
    iso3: "SGP",
    displayAnchor: [103.8198, 1.3521],
    chapter: "southeast-asia",
    featured: false,
    coverImage: "/media/journey/singapore/cover.jpg",
    coverAlt: "A cartographic view of Singapore, standing in until a journey photograph is sourced",
    summary:
      "A 200-kilometre ride through a country that blends cutting-edge technology with deep respect for people and environment — a metro system engineered through artificial waterfalls, and a waste-management culture that left Ranjith genuinely impressed.",
    source: { label: THE_INDIAN_CYCLIST, pages: "pp. 105–109" },
    gallery: [],
  },
  {
    order: 8,
    slug: "indonesia",
    name: "Indonesia",
    iso3: "IDN",
    displayAnchor: [113.9213, -0.7893],
    chapter: "southeast-asia",
    featured: false,
    coverImage: "/media/journey/indonesia/cover.jpg",
    coverAlt: "Aerial view of a cliff and turquoise cove on Nusa Penida island, Indonesia",
    summary:
      "2,100 kilometres that began with a 32-hour, signal-free ferry from Singapore — a rare, reflective break from the digital world. Roads named after Lord Rama and Ganesha shrines across Bali revealed an unexpected thread of Hindu mythology, alongside terraced rice fields and the volcanic risk of the Pacific Ring of Fire.",
    source: { label: THE_INDIAN_CYCLIST, pages: "pp. 109–112" },
    gallery: [],
  },
  {
    order: 9,
    slug: "china",
    name: "China",
    iso3: "CHN",
    displayAnchor: [104.1954, 35.8617],
    chapter: "east-asia",
    featured: false,
    coverImage: "/media/journey/china/cover.jpg",
    coverAlt: "Ranjith and two fellow cyclists in cycling gear and helmets, giving a thumbs up on a tree-lined road in China",
    summary:
      "2,000 kilometres beginning in Shanghai, China's most advanced metropolis. What struck Ranjith most wasn't the hyper-modern skyline or the precision mapping technology, but the local hospitality — strangers repeatedly offering food to travellers as a simple gesture of kindness.",
    // OWNER: this photograph was pulled from the manuscript PDF (p. 116) at
    // your request — please confirm the two riders beside Ranjith and where
    // on the route this was taken, and that this image is cleared to
    // publish on the website (the manuscript's licensing may only cover
    // the book itself).
    source: { label: THE_INDIAN_CYCLIST, pages: "pp. 113–116" },
    gallery: [],
  },
  {
    order: 10,
    slug: "japan",
    name: "Japan",
    iso3: "JPN",
    displayAnchor: [138.2529, 36.2048],
    chapter: "east-asia",
    featured: false,
    coverImage: "/media/journey/japan/cover.jpg",
    coverAlt: "Ranjith standing with his loaded touring bicycle on a snow-lined road in Japan",
    summary:
      "1,200 kilometres through a land of discipline and innovation, starting in Tokyo. Ranjith was moved by the humility of the Japanese people, the punctuality of the Shinkansen bullet trains, and a cherry blossom season that draws whole parks together for hanami.",
    source: { label: THE_INDIAN_CYCLIST, pages: "pp. 117–120" },
    gallery: [],
  },
  {
    order: 11,
    slug: "south-korea",
    name: "South Korea",
    iso3: "KOR",
    displayAnchor: [127.7669, 35.9078],
    chapter: "east-asia",
    featured: false,
    coverImage: "/media/journey/south-korea/cover.jpg",
    coverAlt: "Ranjith standing with his loaded bicycle beneath cherry blossom trees in South Korea",
    summary:
      "2,000 kilometres made easy by a traveller-friendly camping culture — clean washrooms and camping zones available almost anywhere — and by locals who repeatedly offered food and conversation on the road.",
    gallery: [],
  },
  {
    order: 12,
    slug: "taiwan",
    name: "Taiwan",
    iso3: "TWN",
    displayAnchor: [120.9605, 23.6978],
    chapter: "east-asia",
    featured: false,
    coverImage: "/media/journey/taiwan/cover.jpg",
    coverAlt: "Shifen Waterfall in Taiwan, viewed from above with the surrounding forest",
    summary:
      "1,000 kilometres across one of the world's most earthquake-prone countries, engineered to withstand it. Semiconductor factories, tropical humidity, and the fireworks that erupt from Taipei 101 every New Year's Eve marked the chapter.",
    source: { label: THE_INDIAN_CYCLIST, pages: "pp. 125–128" },
    gallery: [],
  },
  {
    order: 13,
    slug: "mongolia",
    name: "Mongolia",
    iso3: "MNG",
    displayAnchor: [103.8467, 46.8625],
    chapter: "east-asia",
    featured: false,
    coverImage: "/media/journey/mongolia/cover.jpg",
    coverAlt: "The view from Ranjith's bicycle along an unpaved steppe road in Mongolia",
    summary:
      "Over 2,000 kilometres of vast steppe and unpaved road — paradise for anyone drawn to true wilderness. Traditional dishes like buuz and khuushur, and the fermented mare's milk airag, tied every meal back to Mongolia's nomadic traditions.",
    source: { label: THE_INDIAN_CYCLIST, pages: "pp. 129–131" },
    gallery: [],
  },
  {
    order: 14,
    slug: "australia",
    name: "Australia",
    iso3: "AUS",
    displayAnchor: [133.7751, -25.2744],
    chapter: "australia",
    featured: true,
    coverImage: "/media/journey/australia/cover.jpg",
    coverAlt: "A cartographic view of Australia, standing in until a journey photograph is sourced",
    summary: "Two rejections, one destination.",
    // OWNER: only the one-line teaser above is sourced so far — see the
    // matching note on Sri Lanka above.
    gallery: [],
  },
  {
    order: 15,
    slug: "france",
    name: "France",
    iso3: "FRA",
    displayAnchor: [2.2137, 46.2276],
    chapter: "europe",
    featured: false,
    coverImage: "/media/journey/france/cover.jpg",
    coverAlt: "A cartographic view of France, standing in until a journey photograph is sourced",
    // OWNER: the manuscript excerpt available has no Europe-leg content —
    // France through Slovakia below are missing a summary for the same
    // reason. Needs owner-supplied copy or a fuller manuscript excerpt.
    gallery: [],
  },
  {
    order: 16,
    slug: "switzerland",
    name: "Switzerland",
    iso3: "CHE",
    displayAnchor: [8.2275, 46.8182],
    chapter: "europe",
    featured: false,
    coverImage: "/media/journey/switzerland/cover.jpg",
    coverAlt: "A cartographic view of Switzerland, standing in until a journey photograph is sourced",
    gallery: [],
  },
  {
    order: 17,
    slug: "germany",
    name: "Germany",
    iso3: "DEU",
    displayAnchor: [10.4515, 51.1657],
    chapter: "europe",
    featured: false,
    coverImage: "/media/journey/germany/cover.jpg",
    coverAlt: "A cartographic view of Germany, standing in until a journey photograph is sourced",
    gallery: [],
  },
  {
    order: 18,
    slug: "austria",
    name: "Austria",
    iso3: "AUT",
    displayAnchor: [14.5501, 47.5162],
    chapter: "europe",
    featured: false,
    coverImage: "/media/journey/austria/cover.jpg",
    coverAlt: "A cartographic view of Austria, standing in until a journey photograph is sourced",
    gallery: [],
  },
  {
    order: 19,
    slug: "italy",
    name: "Italy",
    iso3: "ITA",
    displayAnchor: [12.5674, 41.8719],
    chapter: "europe",
    featured: false,
    coverImage: "/media/journey/italy/cover.jpg",
    coverAlt: "A cartographic view of Italy, standing in until a journey photograph is sourced",
    gallery: [],
  },
  {
    order: 20,
    slug: "slovenia",
    name: "Slovenia",
    iso3: "SVN",
    displayAnchor: [14.9955, 46.1512],
    chapter: "europe",
    featured: false,
    coverImage: "/media/journey/slovenia/cover.jpg",
    coverAlt: "A cartographic view of Slovenia, standing in until a journey photograph is sourced",
    gallery: [],
  },
  {
    order: 21,
    slug: "croatia",
    name: "Croatia",
    iso3: "HRV",
    displayAnchor: [15.2, 45.1],
    chapter: "europe",
    featured: false,
    coverImage: "/media/journey/croatia/cover.jpg",
    coverAlt: "A cartographic view of Croatia, standing in until a journey photograph is sourced",
    gallery: [],
  },
  {
    order: 22,
    slug: "hungary",
    name: "Hungary",
    iso3: "HUN",
    displayAnchor: [19.5033, 47.1625],
    chapter: "europe",
    featured: false,
    coverImage: "/media/journey/hungary/cover.jpg",
    coverAlt: "A cartographic view of Hungary, standing in until a journey photograph is sourced",
    gallery: [],
  },
  {
    order: 23,
    slug: "slovakia",
    name: "Slovakia",
    iso3: "SVK",
    displayAnchor: [19.699, 48.669],
    chapter: "europe",
    featured: false,
    coverImage: "/media/journey/slovakia/cover.jpg",
    coverAlt: "A cartographic view of Slovakia, standing in until a journey photograph is sourced",
    gallery: [],
  },
];
