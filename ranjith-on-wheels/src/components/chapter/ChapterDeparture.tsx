import type { Chapter } from "@/content/chapters";
import { seaCrossings } from "@/content/chapters";
import { site } from "@/content/site";
import { arc, landPaths, outline, project, regionProjection } from "@/lib/chapterGeo";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Sections.module.css";

const WIDTH = 1200;
const HEIGHT = 420;

// Page 12 — leaving the country. The road continues toward the next one. For
// Slovakia there is no next country: the road leaves Bratislava as a dashed
// line running off the edge of the map, because the ride is unfinished.
export function ChapterDeparture({ chapter }: { chapter: Chapter }) {
  const { country, next } = chapter;
  const from = country.displayAnchor;
  const to = next?.displayAnchor ?? null;
  const crossing = next ? (seaCrossings[next.slug] ?? null) : null;

  const projection = regionProjection(from, to ?? from, WIDTH, HEIGHT);
  const land = landPaths(projection, WIDTH, HEIGHT);
  const here = outline(projection, country.slug);
  const there = next ? outline(projection, next.slug) : null;
  const start = project(projection, from);
  const end = to ? project(projection, to) : null;
  const route = to
    ? arc(projection, from, to)
    : `M${start[0]} ${start[1]}C${start[0] + 120} ${start[1] - 40} ${start[0] + 260} ${start[1] - 140} ${WIDTH + 80} ${-20}`;
  const dashed = crossing || !next ? "8 10" : undefined;

  return (
    <section className={`${styles.departure} fade`} id="chapter-departure">
      <div className={styles.head}>
        <Eyebrow>{next ? `Leaving ${country.name}` : `${site.latestCity}, and beyond`}</Eyebrow>
        <h2 className={styles.h2}>{next ? `${country.name}, behind us.` : "The road isn't finished."}</h2>
        <p className={styles.lede}>
          {next
            ? `Chapter ${country.order} is ridden. The road ahead turns toward ${next.name}.`
            : `${site.latestCountry} is where the ride stands today. It leaves ${site.latestCity} as a dashed line, running off the edge of the map.`}
        </p>
      </div>

      <div className={styles.mapCard}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.mapSvg} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
          <g fill="var(--land)" stroke="var(--white)" strokeWidth={0.5}>
            {land.map((d, index) => (
              <path key={index} d={d} />
            ))}
          </g>
          {there ? <path d={there.d} fill="var(--support)" fillOpacity={0.12} stroke="var(--support)" strokeWidth={1.2} /> : null}
          {here ? <path d={here.d} fill="var(--route)" fillOpacity={0.16} stroke="var(--route)" strokeWidth={1.4} /> : null}
          <path
            d={route}
            fill="none"
            stroke={next ? "var(--support)" : "var(--support)"}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={dashed}
          />
          <circle cx={start[0]} cy={start[1]} r={8} fill="var(--white)" stroke="var(--route)" strokeWidth={3.5} />
          {end ? <circle cx={end[0]} cy={end[1]} r={7} fill="var(--white)" stroke="var(--support)" strokeWidth={3} /> : null}
          {crossing && end ? (
            <text x={(start[0] + end[0]) / 2} y={(start[1] + end[1]) / 2 - 18} textAnchor="middle" className={styles.seaLabel}>
              SEA CROSSING
            </text>
          ) : null}
        </svg>
        <span className={styles.mapTag}>Indicative route</span>
      </div>

      <dl className={styles.meta}>
        <div>
          <dt>Behind</dt>
          <dd>{country.name}</dd>
        </div>
        {next ? (
          <div>
            <dt>Ahead</dt>
            <dd>{next.name}</dd>
          </div>
        ) : null}
        {crossing ? (
          <div>
            <dt>Sea crossing</dt>
            <dd>{crossing}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
