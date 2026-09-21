import Link from "next/link";
import type { Chapter } from "@/content/chapters";
import { followCta } from "@/content/navigation";
import { seaCrossings } from "@/content/chapters";
import { atlasChapters } from "@/content/atlas";
import { site } from "@/content/site";
import { formatCoords } from "@/lib/coords";
import { contourLayers } from "@/lib/contours";
import { getAtmosphere } from "@/content/atmospheres";
import { Scene } from "./Scene";
import { TransitionLink } from "./TransitionLink";
import styles from "./Sections.module.css";

// Page 13 — The chapter transition. Deliberately almost empty: this country's
// name fades behind us, the next country's coordinates appear, the road line
// carries on — and the button doesn't cut to the next page, it hands off (see
// TransitionLink). After Slovakia the hand-off is to the Follow ending.
export function ChapterTransition({ chapter }: { chapter: Chapter }) {
  const { country, next, previous } = chapter;
  // Everything the hand-off veil needs to already look like the next hero.
  const nextAtmosphere = next ? getAtmosphere(next.slug) : null;
  const sea = next ? Boolean(seaCrossings[next.slug]) : false;
  const nextRegion = next ? atlasChapters.find((item) => item.id === next.chapter)?.label ?? "" : "";

  return (
    <Scene name="transition" className={styles.transition} id="chapter-transition">
      <p className={styles.ghostName} data-fade aria-hidden="true">
        {country.name}
      </p>
      {/* One road, changing colour as it goes: the red already ridden, and the
          blue still ahead — dashed where the next crossing is a sourced sea
          crossing — already running on toward the next country. */}
      <span className={styles.roadLine} data-road aria-hidden="true">
        <span className={styles.roadRed} data-road-red />
        <span className={sea ? styles.roadBlueSea : styles.roadBlue} />
      </span>

      <div className={styles.nextBlock}>
        {next ? (
          <>
            <p className={styles.nextCoords} data-reveal>
              Next · {String(next.order).padStart(2, "0")} · {formatCoords(next.displayAnchor)}
            </p>
            <TransitionLink
              href={`/journey/${next.slug}`}
              name={next.name}
              from={chapter.nextHero.from}
              to={chapter.nextHero.to}
              chapterLine={`Chapter ${String(next.order).padStart(2, "0")} of ${site.countryCount}`}
              region={nextRegion}
              fromLonLat={country.displayAnchor}
              toLonLat={next.displayAnchor}
              contour={nextAtmosphere ? contourLayers(nextAtmosphere.terrain, 4)[1] : ""}
              glow={nextAtmosphere?.theme.glow ?? "#5aa2ff"}
              sea={sea}
              className={styles.nextLink}
            >
              <span data-reveal>Enter {next.name}</span>
            </TransitionLink>
          </>
        ) : (
          <>
            <p className={styles.nextCoords} data-reveal>
              The road goes on
            </p>
            <Link href={followCta.href} className={styles.nextLink}>
              <span data-reveal>{followCta.label}</span>
            </Link>
          </>
        )}
        <nav className={styles.chapterNav} aria-label="Chapter navigation" data-reveal>
          {previous ? <Link href={`/journey/${previous.slug}`}>← {previous.name}</Link> : <span />}
          <Link href="/journey">All chapters</Link>
        </nav>
      </div>
    </Scene>
  );
}
