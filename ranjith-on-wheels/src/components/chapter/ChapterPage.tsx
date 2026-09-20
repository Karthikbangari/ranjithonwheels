import type { CSSProperties } from "react";
import { CountryCredits } from "@/components/journey/CountryCredits";
import type { Chapter } from "@/content/chapters";
import { ChapterArrival } from "./ChapterArrival";
import { ChapterChallenge } from "./ChapterChallenge";
import { ChapterDeparture } from "./ChapterDeparture";
import { ChapterDiscovery } from "./ChapterDiscovery";
import { ChapterHero } from "./ChapterHero";
import { ChapterMemory } from "./ChapterMemory";
import { ChapterNotes } from "./ChapterNotes";
import { ChapterRoad } from "./ChapterRoad";
import { ChapterSignature } from "./ChapterSignature";
import { ChapterTransition } from "./ChapterTransition";
import styles from "./Sections.module.css";

// One country's chapter, Pages 5–13, in the order the owner directed:
// introduction → arrival → road → challenge → discovery → people → signature
// moment → leaving → transition. The same structure and the same blue→red
// route language everywhere; what differs is the country's own atmosphere
// (colour, terrain, effect) and which pages it has data for. A page whose
// data doesn't exist is simply absent — no placeholder, nothing invented — so
// filling in a country's story later rebuilds its chapter with no new design.
export function ChapterPage({ chapter }: { chapter: Chapter }) {
  const { theme } = chapter.atmosphere;
  const vars = {
    "--story-tint": theme.tint,
    "--story-accent": theme.accent,
    "--story-ink": theme.ink,
    "--story-glow": theme.glow,
  } as CSSProperties;

  return (
    <div className={styles.chapter} style={vars} data-chapter={chapter.country.slug}>
      <ChapterHero chapter={chapter} />
      <ChapterArrival chapter={chapter} />
      <ChapterNotes chapter={chapter} />
      {chapter.road.length > 0 ? <ChapterRoad chapter={chapter} /> : null}
      {chapter.challenge ? <ChapterChallenge chapter={chapter} /> : null}
      {chapter.discovery.length > 0 ? <ChapterDiscovery chapter={chapter} /> : null}
      {chapter.people.length > 0 ? <ChapterMemory chapter={chapter} /> : null}
      {chapter.signature ? <ChapterSignature chapter={chapter} /> : null}
      <div className={styles.credits}>
        <CountryCredits source={chapter.country.source} />
      </div>
      <ChapterDeparture chapter={chapter} />
      <ChapterTransition chapter={chapter} />
    </div>
  );
}
