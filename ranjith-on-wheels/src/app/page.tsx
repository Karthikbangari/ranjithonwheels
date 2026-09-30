import { HeroJourney } from "@/components/home/HeroJourney";
import { OriginStory } from "@/components/home/OriginStory";
import { JourneyMap } from "@/components/map/JourneyMap";
import { ChapterJourney } from "@/components/home/ChapterJourney";
import { HumanGallery } from "@/components/home/HumanGallery";
import { BookFeature } from "@/components/home/BookFeature";
import { SupportUPI } from "@/components/support/SupportUPI";
import { FinaleSection } from "@/components/home/FinaleSection";

export default function Home() {
  return (
    <>
      <HeroJourney />

      <OriginStory />

      <JourneyMap />

      <ChapterJourney />

      <HumanGallery />

      <BookFeature />

      {/* The real payment panel, directly on the homepage — not a button
          that sends the visitor to another page to find it. The same
          component /support renders, so there is exactly one place this
          UI is built and both are always in sync. */}
      <div className="fade" id="support-invite">
        <SupportUPI />
      </div>

      <FinaleSection />
    </>
  );
}
