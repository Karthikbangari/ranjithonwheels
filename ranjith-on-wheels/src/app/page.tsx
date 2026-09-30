import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroJourney } from "@/components/home/HeroJourney";
import { OriginStory } from "@/components/home/OriginStory";
import { JourneyMap } from "@/components/map/JourneyMap";
import { ChapterJourney } from "@/components/home/ChapterJourney";
import { HumanGallery } from "@/components/home/HumanGallery";
import { BookFeature } from "@/components/home/BookFeature";
import { FinaleSection } from "@/components/home/FinaleSection";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <HeroJourney />

      <OriginStory />

      <JourneyMap />

      <ChapterJourney />

      <HumanGallery />

      <BookFeature />

      <section className={`${styles.section} ${styles.support} fade`} id="support-invite">
        <Eyebrow>The journey is self-powered, but never solo.</Eyebrow>
        <h2 className={styles.headline}>Help the next kilometre happen.</h2>
        <div className={styles.actions}>
          <ButtonLink href="/support">Support the journey</ButtonLink>
        </div>
      </section>

      <FinaleSection />
    </>
  );
}
