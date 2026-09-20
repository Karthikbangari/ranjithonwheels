import Link from "next/link";
import { journeyCountries } from "@/content/journey";
import { site } from "@/content/site";
import { arc, landPaths, project, worldProjection } from "@/lib/chapterGeo";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Scene } from "./Scene";
import styles from "./Gateway.module.css";

const WIDTH = 1600;
const HEIGHT = 800;

// Page 4 — Journey map / chapter gateway. A full-screen dark world map: the
// whole road first appears blue (the road ahead), then turns red country by
// country behind a wave (the road ridden), each country's marker an entry
// point into its chapter. After the last country the road leaves as a dashed
// blue line running off the frame — the ride isn't finished. No photographs.
//
// The line is drawn between display anchors, so it is *indicative* until GPX
// data exists (CLAUDE.md §1); the caption says so.
export function JourneyGateway() {
  const projection = worldProjection(WIDTH, HEIGHT);
  const land = landPaths(projection, WIDTH, HEIGHT);
  const points = journeyCountries.map((country) => project(projection, country.displayAnchor));
  const legs = journeyCountries.slice(1).map((country, index) => arc(projection, journeyCountries[index].displayAnchor, country.displayAnchor));
  const [lastX, lastY] = points[points.length - 1];
  const unfinished = `M${lastX} ${lastY}C${lastX + 90} ${lastY - 70} ${lastX + 190} ${lastY - 210} ${lastX + 330} -80`;

  return (
    <Scene name="gateway" className={styles.gateway} id="chapter-gateway" aria-labelledby="gateway-heading">
      <div className={styles.copy}>
        <div className={styles.intro}>
          <Eyebrow>Chapter gateway</Eyebrow>
          <h2 className={styles.h2} id="gateway-heading">
            One road, {site.countryCount} chapters.
          </h2>
          <p className={styles.legend}>
            <span>
              <i className={styles.swatchBlue} /> Blue — the road ahead
            </span>
            <span>
              <i className={styles.swatchRed} /> Red — the road ridden
            </span>
          </p>
        </div>
        <dl className={styles.figures}>
          <div>
            <dt>Ridden</dt>
            <dd>
              <span data-count data-total={site.distanceKm}>
                {site.distanceKm.toLocaleString("en-US")}
              </span>
              <small>+ km</small>
            </dd>
          </div>
          <div>
            <dt>Chapters</dt>
            <dd>{site.countryCount}</dd>
          </div>
        </dl>
      </div>

      <style>
        {journeyCountries
          .map(
            (country) =>
              `.${styles.svg}:has(a[data-slug="${country.slug}"]:is(:hover,:focus-visible)) [data-label="${country.slug}"]{opacity:1}`,
          )
          .join("")}
      </style>
      <div className={styles.mapScroll}>
        <div className={styles.mapWrap}>
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.svg} role="group" aria-label="World map of the journey. Every country is a link to its chapter.">
            <defs>
              <linearGradient id="gateway-unfinished" gradientUnits="userSpaceOnUse" x1={lastX} y1={lastY} x2={lastX + 330} y2={-80}>
                <stop offset="0%" stopColor="#5aa2ff" />
                <stop offset="100%" stopColor="#5aa2ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g data-land className={styles.land} aria-hidden="true">
              {land.map((d, index) => (
                <path key={index} d={d} />
              ))}
            </g>
            <g fill="none" strokeLinecap="round" aria-hidden="true">
              {legs.map((d, index) => (
                <path key={index} data-seg d={d} stroke="var(--blue-lit)" strokeWidth={3} />
              ))}
              {legs.map((d, index) => (
                <path key={index} data-ride d={d} stroke="var(--route)" strokeWidth={3.5} />
              ))}
              <path data-unfinished d={unfinished} stroke="url(#gateway-unfinished)" strokeWidth={3} strokeDasharray="4 12" />
            </g>
            {journeyCountries.map((country, index) => {
              const [x, y] = points[index];
              return (
                <Link
                  key={country.slug}
                  href={`/journey/${country.slug}`}
                  data-dot
                  data-slug={country.slug}
                  className={styles.marker}
                  aria-label={`Chapter ${country.order}: ${country.name}`}
                >
                  <circle className={styles.hit} cx={x} cy={y} r={16} />
                  <circle className={styles.ring} cx={x} cy={y} r={11} />
                  <circle className={styles.core} cx={x} cy={y} r={5.5} />
                </Link>
              );
            })}
            {/* Labels live in their own layer, painted after every marker, so a
                neighbouring dot in a crowded cluster can never cover one. */}
            <g aria-hidden="true" className={styles.labels}>
              {journeyCountries.map((country, index) => {
                const [x, y] = points[index];
                const labelLeft = x > WIDTH * 0.7;
                return (
                  <text
                    key={country.slug}
                    data-label={country.slug}
                    className={styles.label}
                    x={labelLeft ? x - 16 : x + 16}
                    y={y + 5}
                    textAnchor={labelLeft ? "end" : "start"}
                  >
                    {country.order}. {country.name}
                  </text>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
      <p className={styles.caption}>Indicative route — drawn between display anchors, not the cycling track.</p>
    </Scene>
  );
}
