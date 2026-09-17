import { journeyCountries } from "@/content/journey";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroJourney } from "@/components/home/HeroJourney";
import { OriginStory } from "@/components/home/OriginStory";
import { JourneyAtlas } from "@/components/home/JourneyAtlas";
import { StoryFeature } from "@/components/home/StoryFeature";
import { HumanGallery } from "@/components/home/HumanGallery";
import { BookFeature } from "@/components/home/BookFeature";
import { FinaleSection } from "@/components/home/FinaleSection";
import styles from "./page.module.css";

const featuredStories = journeyCountries.filter((country) => country.featured);

export default function Home() {
  return (
    <>
      <HeroJourney />

      <OriginStory />

      <JourneyAtlas />

      <div id="real-journey">
        {featuredStories.map((country, index) => (
          <StoryFeature key={country.slug} country={country} reverse={index % 2 === 1} />
        ))}
      </div>

      <section className={`${styles.section} ${styles.storiesInvite}`}>
        <ButtonLink href="/stories" variant="secondary">
          Read the ten fully documented stories
        </ButtonLink>
      </section>

      <HumanGallery />

      <BookFeature />

      <section className={`${styles.section} ${styles.supportInvite}`} id="support-invite">
        <Eyebrow>The journey is self-powered, but never solo.</Eyebrow>
        <h2 className={styles.headline}>Help the next kilometre happen.</h2>
        <p className={styles.lede}>
          Support can become a meal, a safe night, a bicycle repair, a border crossing or the
          next story shared from the road.
        </p>
        <div className={styles.actions}>
          <ButtonLink href="/support">Support the journey</ButtonLink>
          <ButtonLink href="/support#where-support-goes" variant="secondary">
            See how support is used
          </ButtonLink>
        </div>
      </section>

      <FinaleSection />
    </>
  );
}
