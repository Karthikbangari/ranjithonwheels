import type { CSSProperties } from "react";
import { CountryCredits } from "@/components/journey/CountryCredits";
import type { Chapter } from "@/content/chapters";
import { site } from "@/content/site";
import { formatCoords } from "@/lib/coords";
import { resolveMedia } from "@/lib/media";
import { ChapterArrival } from "./ChapterArrival";
import { ChapterBhagira } from "./ChapterBhagira";
import { ChapterDeparture } from "./ChapterDeparture";
import { ChapterDiscovery } from "./ChapterDiscovery";
import { ChapterEnvironment } from "./ChapterEnvironment";
import { ChapterHero } from "./ChapterHero";
import { ChapterInterlude } from "./ChapterInterlude";
import { ChapterMemory } from "./ChapterMemory";
import { ChapterNotes } from "./ChapterNotes";
import { ChapterRail } from "./ChapterRail";
import { ChapterRoad } from "./ChapterRoad";
import { ChapterSignature } from "./ChapterSignature";
import { ChapterTransition } from "./ChapterTransition";
import styles from "./Sections.module.css";

// One country's chapter, Pages 5–13, in the order the owner directed:
// introduction → arrival → road → environment → discovery → people → signature
// moment → leaving → transition. The same structure and the same blue→red
// route language everywhere; what differs is the country's own atmosphere
// (colour, terrain, environment, effect) and which pages it has data for. A
// page whose data doesn't exist is simply absent — no placeholder, nothing
// invented — so filling in a country's story later rebuilds its chapter with
// no new design. A chapter with no verified story shows a wordless
// atmospheric interlude instead, so it reads as designed, not empty.
export function ChapterPage({ chapter }: { chapter: Chapter }) {
  const { theme } = chapter.atmosphere;
  const media = resolveMedia(chapter.country);
  const vars = {
    "--story-tint": theme.tint,
    "--story-accent": theme.accent,
    "--story-ink": theme.ink,
    "--story-glow": theme.glow,
  } as CSSProperties;
  const hasMemory = chapter.people.length > 0 || media.gallery.length > 0;
  const { country, previous, next } = chapter;

  return (
    <div className={styles.chapter} style={vars} data-chapter={country.slug} data-content-status={chapter.contentStatus}>
      <ChapterHero chapter={chapter} />
      <ChapterArrival chapter={chapter} />
      <ChapterNotes chapter={chapter} />
      {chapter.interlude ? <ChapterInterlude chapter={chapter} /> : null}
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
      <ChapterRail
        previous={previous ? { name: previous.name, slug: previous.slug } : null}
        current={country.name}
        next={next ? { name: next.name, slug: next.slug } : null}
        order={country.order}
        total={site.countryCount}
        coords={formatCoords(country.displayAnchor)}
      />
    </div>
  );
}
