import Link from "next/link";
import { journeyCountries } from "@/content/journey";
import { site } from "@/content/site";
import { arc, landPaths, project, worldProjection } from "@/lib/chapterGeo";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MapScroll } from "./MapScroll";
import styles from "./Gateway.module.css";

const WIDTH = 1600;
const HEIGHT = 800;

// Page 4 — the chapter gateway on /journey. A plain world map: the whole
// route ridden so far, in red, ending at Slovakia with a dashed line running
// off the edge of the frame — the ride isn't finished. Every country is a
// link into its chapter; the full keyboard-accessible list of all 23 sits
// right below this, in JourneyArchive.
//
// The line is drawn between display anchors, so it is indicative until GPX
// data exists (CLAUDE.md §1) — the caption says so.
export function JourneyGateway() {
  const projection = worldProjection(WIDTH, HEIGHT);
  const land = landPaths(projection, WIDTH, HEIGHT);
  const points = journeyCountries.map((country) => project(projection, country.displayAnchor));
  const legs = journeyCountries
    .slice(1)
    .map((country, index) => arc(projection, journeyCountries[index].displayAnchor, country.displayAnchor));
  const [lastX, lastY] = points[points.length - 1];
  const unfinished = `M${lastX} ${lastY}C${lastX + 90} ${lastY - 70} ${lastX + 190} ${lastY - 210} ${lastX + 330} -80`;

  return (
    <section className={styles.gateway} id="chapter-gateway" aria-labelledby="gateway-heading">
      <div className={styles.copy}>
        <div>
          <Eyebrow>Chapter gateway</Eyebrow>
          <h2 className={styles.h2} id="gateway-heading">
            One road, {site.countryCount} chapters.
          </h2>
        </div>
        <dl className={styles.figures}>
          <div>
            <dt>Ridden</dt>
            <dd>
              {site.distanceKm.toLocaleString("en-US")}
              <small>+ km</small>
            </dd>
          </div>
          <div>
            <dt>Chapters</dt>
            <dd>{site.countryCount}</dd>
          </div>
        </dl>
      </div>

      <MapScroll className={styles.mapScroll}>
        <div className={styles.mapWrap}>
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className={styles.svg}
            role="group"
            aria-label="World map of the journey. Every country is a link to its chapter."
          >
            <g className={styles.land} aria-hidden="true">
              {land.map((d, index) => (
                <path key={index} d={d} />
              ))}
            </g>
            <g fill="none" strokeLinecap="round" aria-hidden="true">
              {legs.map((d, index) => (
                <path key={index} d={d} stroke="var(--route)" strokeWidth={2.5} />
              ))}
              <path d={unfinished} stroke="var(--support)" strokeWidth={2.5} strokeDasharray="4 10" />
            </g>
            {journeyCountries.map((country, index) => {
              const [x, y] = points[index];
              const labelLeft = x > WIDTH * 0.7;
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
                  <circle className={styles.core} cx={x} cy={y} r={5} />
                  <text className={styles.label} x={labelLeft ? x - 12 : x + 12} y={y + 4} textAnchor={labelLeft ? "end" : "start"}>
                    {country.order}. {country.name}
                  </text>
                </Link>
              );
            })}
          </svg>
        </div>
      </MapScroll>
      <p className={styles.caption}>Indicative route — drawn between display anchors, not the cycling track.</p>
    </section>
  );
}
