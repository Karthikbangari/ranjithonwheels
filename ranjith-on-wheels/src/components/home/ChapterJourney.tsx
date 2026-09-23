import { journeyCountries, type JourneyCountry } from "@/content/journey";
import { getStory, type Story } from "@/content/stories";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ChapterSection } from "./ChapterSection";
import { ChapterProgressRail } from "./ChapterProgressRail";
import { Reveal } from "./Reveal";
import styles from "./ChapterJourney.module.css";

// One immersive section per documented country, in place of the old card
// grid — the same ten-country selection /stories uses (a full summary and a
// page-verified manuscript citation). The other fourteen countries are real
// too; they just don't have a full story yet, so they stay reachable from
// /journey rather than being forced into this format with nothing to fill it.
type DocumentedChapter = { country: JourneyCountry; story: Story };

const documented: DocumentedChapter[] = journeyCountries
  .filter((country) => country.summary && country.source?.pages)
  .map((country) => ({ country, story: getStory(country.slug) }))
  .filter((entry): entry is DocumentedChapter => entry.story !== null);

export function ChapterJourney() {
  const total = documented.length;
  const railItems = documented.map(({ country }) => ({
    slug: country.slug,
    name: country.name,
    order: country.order,
  }));

  return (
    <section className={styles.section} id="chapters">
      <Reveal className={styles.intro}>
        <Eyebrow>The journey so far</Eyebrow>
        <h2 className={styles.headline}>Ten countries, told in full.</h2>
        <p className={styles.lede}>
          Every country reached so far has its own chapter — these ten are the ones checked in full
          against the manuscript. Scroll through them here, or open any of the site&apos;s 24 chapters
          directly.
        </p>
      </Reveal>

      {documented.map(({ country, story }, index) => (
        <ChapterSection
          key={country.slug}
          country={country}
          story={story}
          index={index}
          total={total}
          previous={index > 0 ? documented[index - 1].country : null}
          next={index < total - 1 ? documented[index + 1].country : null}
        />
      ))}

      <div className={styles.closing}>
        <ButtonLink href="/journey">See every country&apos;s chapter</ButtonLink>
      </div>

      <ChapterProgressRail items={railItems} />
    </section>
  );
}
