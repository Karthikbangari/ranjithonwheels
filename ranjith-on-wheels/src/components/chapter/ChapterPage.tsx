import { CountryCredits } from "@/components/journey/CountryCredits";
import type { Chapter } from "@/content/chapters";
import { resolveMedia } from "@/lib/media";
import { ChapterArrival } from "./ChapterArrival";
import { ChapterBhagira } from "./ChapterBhagira";
import { ChapterDeparture } from "./ChapterDeparture";
import { ChapterDiscovery } from "./ChapterDiscovery";
import { ChapterEnvironment } from "./ChapterEnvironment";
import { ChapterHero } from "./ChapterHero";
import { ChapterMemory } from "./ChapterMemory";
import { ChapterNotes } from "./ChapterNotes";
import { ChapterRoad } from "./ChapterRoad";
import { ChapterSignature } from "./ChapterSignature";
import { ChapterTransition } from "./ChapterTransition";
import styles from "./Sections.module.css";

// One country's chapter, Pages 5–13, in order: introduction → arrival → road
// → environment → discovery → people → signature moment → leaving →
// transition. A page whose data doesn't exist is simply absent — no
// placeholder, nothing invented — so filling in a country's story later
// rebuilds its chapter with no new design.
export function ChapterPage({ chapter }: { chapter: Chapter }) {
  const media = resolveMedia(chapter.country);
  const hasMemory = chapter.people.length > 0 || media.gallery.length > 0;
  const { country } = chapter;

  return (
    <div data-chapter={country.slug} data-content-status={chapter.contentStatus}>
      <ChapterHero chapter={chapter} />
      <ChapterArrival chapter={chapter} />
      <ChapterNotes chapter={chapter} />
      {chapter.road.length > 0 ? <ChapterRoad chapter={chapter} /> : null}
      {chapter.environment ? <ChapterEnvironment chapter={chapter} /> : null}
      {chapter.discovery.length > 0 ? <ChapterDiscovery chapter={chapter} /> : null}
      {hasMemory ? <ChapterMemory chapter={chapter} media={media} /> : null}
      <ChapterBhagira chapter={chapter} />
      {chapter.signature ? <ChapterSignature chapter={chapter} media={media} /> : null}
      <div className={styles.credits}>
        <CountryCredits source={country.source} />
      </div>
      <ChapterDeparture chapter={chapter} />
      <ChapterTransition chapter={chapter} />
    </div>
  );
}
