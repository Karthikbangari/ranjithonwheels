import type { Chapter } from "@/content/chapters";
import { seaCrossings } from "@/content/chapters";
import { site } from "@/content/site";
import { formatCoords } from "@/lib/coords";
import { arc, landPaths, outline, project, regionProjection } from "@/lib/chapterGeo";
import { Scene } from "./Scene";
import styles from "./Sections.module.css";

const WIDTH = 1200;
const HEIGHT = 520;

// Page 12 — Leaving the country. The road continues toward the next one, and
// this chapter turns from blue (the road ahead) to red (ridden): it has become
// a memory. For Slovakia there is no next country — the road leaves
// Bratislava as a dashed line running off the edge of the frame, unfinished,
// because the ride is.
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
  const route = to ? arc(projection, from, to) : `M${start[0]} ${start[1]}C${start[0] + 120} ${start[1] - 40} ${start[0] + 260} ${start[1] - 140} ${WIDTH + 80} ${-40}`;
  const dashed = crossing || !next ? "10 12" : undefined;

  return (
    <Scene name="departure" className={styles.departure} id="chapter-departure">
      <div className={styles.head}>
        <p className={styles.kicker} data-reveal>
          {next ? `Leaving ${country.name}` : `${site.latestCity}, and beyond`}
        </p>
        <h2 className={styles.h2} data-reveal>
          {next ? `${country.name}, behind us.` : "The road isn’t finished."}
        </h2>
        <p className={styles.lede} data-reveal>
          {next
            ? `Chapter ${country.order} is ridden. The road ahead turns toward ${next.name}.`
            : `${site.latestCountry} is where the ride stands today. It leaves ${site.latestCity} as a dashed line, running off the edge of the map.`}
        </p>
      </div>

      <div className={styles.mapCard} data-map>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.mapSvg} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
          <g fill="var(--land)" stroke="rgba(16,24,40,0.12)" strokeWidth={0.7}>
            {land.map((d, index) => (
              <path key={index} d={d} />
            ))}
          </g>
          {there ? (
            <path data-next d={there.d} fill="var(--support)" fillOpacity={0.16} stroke="var(--support)" strokeWidth={1.4} />
          ) : null}
          {here ? (
            <>
              <path data-blue opacity={0} d={here.d} fill="var(--support)" fillOpacity={0.3} stroke="var(--support)" strokeWidth={1.8} />
              <path data-red d={here.d} fill="var(--route)" fillOpacity={0.3} stroke="var(--route)" strokeWidth={1.8} />
            </>
          ) : null}
          <path
            data-out
            {...(dashed ? { "data-dashed": "" } : {})}
            d={route}
            fill="none"
            stroke="var(--support)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={dashed}
          />
          <circle cx={start[0]} cy={start[1]} r={9} fill="#fff" stroke="var(--route)" strokeWidth={4} />
          {end ? <circle data-next cx={end[0]} cy={end[1]} r={8} fill="#fff" stroke="var(--support)" strokeWidth={4} /> : null}
          {crossing && end ? (
            <text x={(start[0] + end[0]) / 2} y={(start[1] + end[1]) / 2 - 22} textAnchor="middle" className={styles.seaLabel}>
              SEA CROSSING
            </text>
          ) : null}
        </svg>
      </div>

      <dl className={styles.meta} data-reveal>
        <div>
          <dt>Behind</dt>
          <dd>
            {country.name} <span>{formatCoords(from)}</span>
          </dd>
        </div>
        {next && to ? (
          <div>
            <dt>Ahead</dt>
            <dd>
              {next.name} <span>{formatCoords(to)}</span>
            </dd>
          </div>
        ) : null}
        {crossing ? (
          <div>
            <dt>Sea crossing</dt>
            <dd>{crossing}</dd>
          </div>
        ) : null}
      </dl>
    </Scene>
  );
}
