// A small pool of real, already-published photographs of Ranjith — reused
// (owner's explicit direction) as the cover for a chapter whose own country
// photograph hasn't been sourced yet, in place of the terrain-map
// illustration. Each entry's `alt` is the same real, accurate description
// already used where the photo first appears on the site (HeroJourney,
// SupportHero, OriginStory) — nothing claims the photo was taken in the
// country it's standing in for, since none of them were.
export type FallbackPhoto = {
  src: string;
  alt: string;
};

export const fallbackPhotos: FallbackPhoto[] = [
  {
    src: "/media/hero/open-road.jpg",
    alt: "Ranjith cycling a loaded touring bicycle down an open mountain road, Indian flag mounted on the handlebars",
  },
  {
    src: "/media/support/hero.jpg",
    alt: "Ranjith standing with his loaded touring bicycle on a snow-lined road",
  },
  {
    src: "/media/story/origin-portrait.jpg",
    alt: "Ranjith sitting quietly on a dock, looking out over open water",
  },
];

// Deterministic, not random per render (server and client must agree, and a
// visitor shouldn't see the photo change on every reload) — a country's own
// `order` picks a stable index into the pool.
export function fallbackPhotoFor(order: number): FallbackPhoto {
  return fallbackPhotos[order % fallbackPhotos.length];
}
