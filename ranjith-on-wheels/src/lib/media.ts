import { existsSync } from "node:fs";
import { join } from "node:path";
import type { JourneyCountry, MediaImage } from "@/content/journey";

// The one place a chapter learns which photographs exist. Components never
// hard-code or check an image path: they ask for the country's media, and get
// back only images that are really on disk. Replacing a terrain cover with an
// original photograph is therefore one data change — set the path in
// journey.ts (or just drop a file at the country's `coverImage` path) — and
// the chapter picks it up on the next build.
const onDisk = (image: MediaImage | undefined | null): image is MediaImage =>
  Boolean(image) && existsSync(join(process.cwd(), "public", image!.src));

export type CountryMedia = {
  hero: MediaImage | null;
  gallery: MediaImage[];
  signature: MediaImage | null;
  videoUrl: string | null;
};

export function resolveMedia(country: JourneyCountry): CountryMedia {
  const cover: MediaImage = { src: country.coverImage, alt: country.coverAlt };
  const hero = [country.heroImage, cover].find(onDisk) ?? null;
  return {
    hero,
    gallery: country.gallery.filter(onDisk),
    signature: onDisk(country.signatureImage) ? country.signatureImage : null,
    videoUrl: country.videoUrl?.trim() ? country.videoUrl.trim() : null,
  };
}
