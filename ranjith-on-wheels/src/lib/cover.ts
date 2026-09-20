import { existsSync } from "node:fs";
import { join } from "node:path";
import type { JourneyCountry } from "@/content/journey";

// Is there a real photograph on disk for this country yet? The chapter hero
// is built to work both ways from the same layout: with a photograph it is
// full-bleed behind the type; without one, the country's own terrain map is
// the hero. Drop a file at the country's `coverImage` path and the hero picks
// it up on the next build — no layout change, no code change.
export function coverPhoto(country: JourneyCountry): { src: string; alt: string } | null {
  const onDisk = existsSync(join(process.cwd(), "public", country.coverImage));
  return onDisk ? { src: country.coverImage, alt: country.coverAlt } : null;
}
