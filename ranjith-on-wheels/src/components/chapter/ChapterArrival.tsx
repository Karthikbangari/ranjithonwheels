import { arrivalRows, type Chapter } from "@/content/chapters";
import { site } from "@/content/site";
import { formatCoords } from "@/lib/coords";
import { arc, landPaths, outline, project, regionProjection } from "@/lib/chapterGeo";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Sections.module.css";

const WIDTH = 1200;
const HEIGHT = 460;

// Page 6 — the arrival. Entering the country: a plain regional map showing the
// road from the previous country, and what we know about the crossing —
// order, coordinates, the sourced sea crossing where one exists. Nothing here
// is invented; there are no dates yet.
// OWNER: crossing dates and border details, when there are verified ones.
export function ChapterArrival({ chapter }: { chapter: Chapter }) {
  const { country, previous, arrival, crossing } = chapter;
  const to = country.displayAnchor;
  const from = previous?.displayAnchor ?? null;

  const projection = regionProjection(from ?? to, to, WIDTH, HEIGHT);
  const land = landPaths(projection, WIDTH, HEIGHT);
  const here = outline(projection, country.slug);
  const there = previous ? outline(projection, previous.slug) : null;
  const dest = project(projection, to);
  const origin = from ? project(projection, from) : null;
  const route = from ? arc(projection, from, to) : null;
  const ahead = `M${dest[0]} ${dest[1]}C${dest[0] + 140} ${dest[1] - 30} ${dest[0] + 300} ${dest[1] + 40} ${WIDTH + 60} ${dest[1] - 10}`;
  const dashed = crossing ? "8 10" : undefined;

  return (
    <section className={`${styles.arrival} fade`} id="chapter-arrival">
      <div className={styles.head}>
        <Eyebrow>{previous ? `Crossing ${country.order - 1} → ${country.order}` : "Where the road begins"}</Eyebrow>
        <h2 className={styles.h2}>
          {arrival?.label ?? (previous ? `The road into ${country.name}` : `The road out of ${country.name}`)}
        </h2>
        {arrival ? <p className={styles.lede}>{arrival.text}</p> : null}
      </div>

      <div className={styles.mapCard}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.mapSvg} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
          <g fill="var(--land)" stroke="var(--white)" strokeWidth={0.5}>
            {land.map((d, index) => (
              <path key={index} d={d} />
            ))}
          </g>
          {there ? <path d={there.d} fill="var(--support)" fillOpacity={0.14} stroke="var(--support)" strokeWidth={1.2} /> : null}
          {here ? <path d={here.d} fill="var(--route)" fillOpacity={0.16} stroke="var(--route)" strokeWidth={1.4} /> : null}
          {route ? (
            <path d={route} fill="none" stroke="var(--route)" strokeWidth={3} strokeLinecap="round" strokeDasharray={dashed} />
          ) : (
            <path d={ahead} fill="none" stroke="var(--support)" strokeWidth={3} strokeLinecap="round" strokeDasharray="4 12" />
          )}
          {origin ? <circle cx={origin[0]} cy={origin[1]} r={7} fill="var(--white)" stroke="var(--route)" strokeWidth={3} /> : null}
          <circle cx={dest[0]} cy={dest[1]} r={8} fill="var(--white)" stroke="var(--route)" strokeWidth={3.5} />
          {crossing && origin ? (
            <text x={(origin[0] + dest[0]) / 2} y={(origin[1] + dest[1]) / 2 - 18} textAnchor="middle" className={styles.seaLabel}>
              SEA CROSSING
            </text>
          ) : null}
        </svg>
        <span className={styles.mapTag}>Indicative route</span>
      </div>

      {/* Location · coordinates · date — and the date only once the owner has
          supplied a verified one (`arrivalDate`); with none, no empty slot. */}
      <dl className={styles.meta}>
        {arrivalRows(chapter).map((row) => {
          switch (row) {
            case "location":
              return (
                <div key={row}>
                  <dt>Location</dt>
                  <dd>{country.name}</dd>
                </div>
              );
            case "coordinates":
              return (
                <div key={row}>
                  <dt>Coordinates</dt>
                  <dd>{formatCoords(to)}</dd>
                </div>
              );
            case "date":
              return (
                <div key={row}>
                  <dt>Date</dt>
                  <dd>{country.arrivalDate}</dd>
                </div>
              );
            case "from":
              return (
                <div key={row}>
                  <dt>From</dt>
                  <dd>{previous?.name}</dd>
                </div>
              );
            case "chapter":
              return (
                <div key={row}>
                  <dt>Chapter</dt>
                  <dd>
                    {country.order} of {site.countryCount}
                  </dd>
                </div>
              );
            case "crossing":
              return (
                <div key={row}>
                  <dt>Sea crossing</dt>
                  <dd>{crossing}</dd>
                </div>
              );
          }
        })}
      </dl>
    </section>
  );
}
