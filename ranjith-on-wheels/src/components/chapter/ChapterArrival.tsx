import type { CSSProperties } from "react";
import { arrivalRows, type Chapter } from "@/content/chapters";
import { site } from "@/content/site";
import { formatCoords } from "@/lib/coords";
import { arc, landPaths, outline, project, regionProjection } from "@/lib/chapterGeo";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Scene } from "./Scene";
import styles from "./Sections.module.css";

const WIDTH = 1200;
const HEIGHT = 560;

// Page 6 — The arrival. Entering the country, told as a crossing: the road
// from the last country to this one, blue (still ahead) until the visitor
// rides it, then red. Everything on the page comes from the data — the
// anchors, the order, the sourced sea crossing, and (where the manuscript has
// one) the arrival moment. There are no dates yet.
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
  // India is where the road begins: nothing behind it, the road ahead only.
  const ahead = `M${dest[0]} ${dest[1]}C${dest[0] + 140} ${dest[1] - 30} ${dest[0] + 300} ${dest[1] + 40} ${WIDTH + 60} ${dest[1] - 10}`;
  const dashed = crossing ? "10 12" : undefined;

  return (
    <Scene name="arrival" className={styles.arrival} id="chapter-arrival" style={{ "--map-h": `${HEIGHT}` } as CSSProperties}>
      <div className={styles.head}>
        <div data-reveal>
          <Eyebrow>{previous ? `Crossing ${country.order - 1} → ${country.order}` : "Where the road begins"}</Eyebrow>
        </div>
        <h2 className={styles.h2} data-reveal>
          {arrival?.label ?? (previous ? `The road into ${country.name}` : `The road out of ${country.name}`)}
        </h2>
        {arrival ? (
          <p className={styles.lede} data-reveal>
            {arrival.text}
          </p>
        ) : null}
      </div>

      <div className={styles.mapCard} data-map>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className={styles.mapSvg}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
        >
          <g fill="var(--land)" stroke="rgba(16,24,40,0.12)" strokeWidth={0.7}>
            {land.map((d, index) => (
              <path key={index} d={d} />
            ))}
          </g>
          {there ? <path d={there.d} fill="var(--route)" fillOpacity={0.22} stroke="var(--route)" strokeWidth={1.4} /> : null}
          {here ? (
            <path d={here.d} fill="var(--support)" fillOpacity={0.18} stroke="var(--support)" strokeWidth={1.6} />
          ) : null}
          {route ? (
            <>
              <path d={route} fill="none" stroke="var(--support)" strokeWidth={4} strokeLinecap="round" strokeDasharray={dashed} />
              <path
                data-progress
                {...(crossing ? { "data-dashed": "" } : {})}
                d={route}
                fill="none"
                stroke="var(--route)"
                strokeWidth={4.5}
                strokeLinecap="round"
                strokeDasharray={dashed}
              />
            </>
          ) : (
            <path d={ahead} fill="none" stroke="var(--support)" strokeWidth={4} strokeLinecap="round" strokeDasharray="4 14" />
          )}
          {origin ? <circle cx={origin[0]} cy={origin[1]} r={8} fill="var(--route)" stroke="#fff" strokeWidth={3} /> : null}
          <circle data-traveller cx={dest[0]} cy={dest[1]} r={9} fill="#fff" stroke="var(--route)" strokeWidth={4} />
          {crossing && origin ? (
            <text
              x={(origin[0] + dest[0]) / 2}
              y={(origin[1] + dest[1]) / 2 - 22}
              textAnchor="middle"
              className={styles.seaLabel}
            >
              SEA CROSSING
            </text>
          ) : null}
        </svg>
        <span className={styles.mapTag}>Indicative route</span>
      </div>

      {/* Location · coordinates · date — and the date only exists once the
          owner has supplied a verified one (`arrivalDate`). With none, the
          row is simply location and coordinates: no empty slot, no separator. */}
      <dl className={styles.meta} data-reveal>
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
                  <dd>
                    {previous && from ? (
                      <span data-coords data-from={from.join(",")} data-to={to.join(",")}>
                        {formatCoords(to)}
                      </span>
                    ) : (
                      <span>{formatCoords(to)}</span>
                    )}
                  </dd>
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
    </Scene>
  );
}
