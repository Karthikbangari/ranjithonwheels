import type { Chapter } from "@/content/chapters";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./Sections.module.css";

// Page 7 — the road. The ride through the country: the distance the story
// states, and the places along it. Without those moments the page doesn't
// exist — the route itself is never invented.
export function ChapterRoad({ chapter }: { chapter: Chapter }) {
  const { story, road, country } = chapter;
  const distance = story?.stats.find((stat) => stat.unit === "km") ?? null;

  return (
    <section className={`${styles.road} fade`} id="chapter-road">
      <div className={styles.head}>
        <Eyebrow>The road</Eyebrow>
        <h2 className={styles.h2}>Through {country.name}, kilometre by kilometre.</h2>
      </div>

      <div className={styles.roadPanel}>
        {distance ? (
          <div className={styles.odometer}>
            <span>{distance.value.toLocaleString("en-US")}</span>
            <small>{distance.unit}</small>
            <p>{distance.label}</p>
          </div>
        ) : null}

        <ol className={styles.steps}>
          {road.map((moment, index) => (
            <li key={moment.label} className={styles.step}>
              <span className={styles.stepIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={styles.stepLabel}>{moment.label}</h3>
                <p className={styles.stepText}>{moment.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
