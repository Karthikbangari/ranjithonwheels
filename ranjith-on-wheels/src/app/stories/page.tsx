import type { Metadata } from "next";
import { journeyCountries } from "@/content/journey";
import { site } from "@/content/site";
import { StoryFeature } from "@/components/home/StoryFeature";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Top Stories",
  description: `The ten most fully documented chapters of ${site.traveller}'s journey, each verified against the manuscript.`,
};

// The only ten countries with both a complete narrative summary and a
// page-verified manuscript citation (see the `source.pages` fields in
// journey.ts) — every other entry is either an unverified one-line teaser
// or (the nine Europe countries) has no sourced content yet. This keeps the
// selection principled rather than an arbitrary top ten.
const topStories = journeyCountries.filter((country) => country.summary && country.source?.pages);

export default function StoriesPage() {
  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.headline}>Ten stories, fully told.</h1>
        <p className={styles.lede}>
          Of the {site.countryCount} countries on the map, these are the {topStories.length} whose
          stories are complete and checked directly against the manuscript. The rest are still
          being written — see the full journey for every country reached so far.
        </p>
      </section>
      {topStories.map((country, index) => (
        <StoryFeature key={country.slug} country={country} reverse={index % 2 === 1} />
      ))}
    </>
  );
}
