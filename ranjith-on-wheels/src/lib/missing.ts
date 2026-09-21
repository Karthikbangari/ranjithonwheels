import { journeyCountries } from "@/content/journey";
import { bhagira } from "@/content/bhagira";
import { buildChapter } from "@/content/chapters";
import { socialConfig } from "@/content/socials";
import { resolveMedia } from "./media";

// What the site is still waiting on, derived from the data itself so it can
// never drift from reality. Nothing here blocks the build: every item is a
// gap the site already handles gracefully (see CLAUDE.md §15). Run
// `npm run content:status` to print it.
export type MissingContent = {
  media: string[];
  content: string[];
  links: string[];
};

export function missingContent(): MissingContent {
  const media = journeyCountries
    .filter((country) => resolveMedia(country).hero === null)
    .map((country) => `${country.name} cover/hero`);

  const content = journeyCountries
    .filter((country) => buildChapter(country.slug)?.contentStatus !== "verified")
    .map((country) => `${country.name} manuscript`);
  if (!bhagira || bhagira.status !== "verified") content.push("Bhagira details");

  const links: string[] = [];
  if (!socialConfig.youtubeUrl.trim()) links.push("official YouTube URL");
  if (!socialConfig.instagramUrl.trim()) links.push("official Instagram URL");

  return { media, content, links };
}
