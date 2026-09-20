import Image from "next/image";
import type { CSSProperties } from "react";
import { atlasChapters } from "@/content/atlas";
import { site } from "@/content/site";
import type { Chapter } from "@/content/chapters";
import { formatCoords } from "@/lib/coords";
import { coverPhoto } from "@/lib/cover";
import { heroMap, type HeroMap } from "@/lib/chapterGeo";
import { LineReveal } from "@/components/motion/LineReveal";
import { EffectLayer } from "./EffectLayer";
import { Scene } from "./Scene";
import { TerrainBackdrop } from "./TerrainBackdrop";
import styles from "./Hero.module.css";

// Page 5 — Country introduction. One strong full-screen picture with huge
// country type: the country's own photograph when there is one, and the
// country's terrain map (real outline, topographic lines, the road arriving
// and leaving) when there isn't. Both share this exact layout, so dropping a
// photograph into /public later changes the background and nothing else.
export function ChapterHero({ chapter }: { chapter: Chapter }) {
  const { country, atmosphere, opening, story } = chapter;
  const photo = coverPhoto(country);
  const chapterLabel = atlasChapters.find((item) => item.id === country.chapter)?.label;

  // Two fits of the same country: a wide frame for desktop, a tall one for a
  // phone. Only the small outline + route data is duplicated, never the terrain.
  const desktop = heroMap(country.slug, country.displayAnchor, 1600, 900, [
    [760, 130],
    [1500, 770],
  ]);
  const mobile = heroMap(country.slug, country.displayAnchor, 800, 1000, [
    [210, 120],
    [590, 590],
  ]);

  const style = {
    "--hero-from": atmosphere.hero.from,
    "--hero-to": atmosphere.hero.to,
  } as CSSProperties;

  return (
    <Scene name="hero" className={`${styles.hero} ${photo ? styles.withPhoto : ""}`} style={style} id="chapter-intro">
      <div className={styles.base} aria-hidden="true" />
      {photo ? (
        <div className={styles.photo} data-photo>
          <Image src={photo.src} alt={photo.alt} fill priority sizes="100vw" className={styles.photoImage} />
        </div>
      ) : null}
      <div className={styles.scrim} aria-hidden="true" />
      <TerrainBackdrop terrain={atmosphere.terrain} className={styles.terrain} />
      <MapLayer map={desktop} className={styles.mapDesktop} />
      <MapLayer map={mobile} className={styles.mapMobile} />
      <EffectLayer effect={atmosphere.effect} seed={atmosphere.terrain.seed} className={styles.effect} />

      <div className={styles.content}>
        <p className={styles.chapterLine} data-meta>
          <span>
            Chapter {String(country.order).padStart(2, "0")} of {site.countryCount}
          </span>
          {chapterLabel ? <span className={styles.region}>{chapterLabel}</span> : null}
        </p>
        <h1 className={styles.name}>
          <LineReveal lines={[country.name]} lineClassName={styles.nameMask} />
        </h1>
        <p className={styles.coords} data-meta>
          {formatCoords(country.displayAnchor)}
        </p>
        {opening ? (
          <p className={styles.opening} data-meta>
            {opening}
          </p>
        ) : null}
        {story && story.stats.length > 0 ? (
          <dl className={styles.stats} data-meta>
            {story.stats.map((stat) => (
              <div key={`${stat.value}-${stat.unit}`} className={styles.stat}>
                <dt>{stat.label}</dt>
                <dd>
                  {stat.prefix}
                  {stat.value.toLocaleString("en-US")} <span>{stat.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </Scene>
  );
}

// The country itself, drawn in the accent, with the road arriving in red
// (ridden) and the road ahead leaving in blue. A city-state with no outline at
// this resolution (Singapore) gets range rings and a crosshair instead.
function MapLayer({ map, className }: { map: HeroMap; className: string }) {
  const [ax, ay] = map.anchor;
  return (
    <svg
      className={`${styles.map} ${className}`}
      viewBox={`0 0 ${map.width} ${map.height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {map.outline ? (
        <path
          data-outline
          d={map.outline}
          fill="var(--story-glow)"
          fillOpacity={0.12}
          stroke="var(--story-glow)"
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      ) : (
        <g fill="none" stroke="var(--story-glow)">
          {[46, 104, 176, 262, 360].map((radius, index) => (
            <circle key={radius} data-outline cx={ax} cy={ay} r={radius} strokeWidth={index === 0 ? 2 : 1} opacity={1 - index * 0.16} />
          ))}
          <path data-outline d={`M${ax - 400} ${ay}H${ax + 400}M${ax} ${ay - 400}V${ay + 400}`} strokeWidth={1} opacity={0.4} />
        </g>
      )}
      <path
        data-route-in
        d={map.routeIn}
        fill="none"
        stroke="var(--route)"
        strokeWidth={4.5}
        strokeLinecap="round"
      />
      <path
        data-route-out
        d={map.routeOut}
        fill="none"
        stroke="var(--blue-lit)"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeDasharray="4 14"
      />
      <g data-marker>
        <circle cx={ax} cy={ay} r={22} fill="none" stroke="var(--route)" strokeWidth={2} opacity={0.55} />
        <circle cx={ax} cy={ay} r={8} fill="#fff9f0" stroke="var(--route)" strokeWidth={3} />
      </g>
    </svg>
  );
}
