import type { Metadata } from "next";
import { site } from "@/content/site";
import { FallbackImage } from "@/components/ui/FallbackImage";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description: `The story behind ${site.traveller} and the ${site.message} journey.`,
};

export default function AboutPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.portraitWrap}>
          <FallbackImage
            src="/media/story/origin-portrait.jpg"
            alt="Ranjith sitting quietly on a dock, looking out over open water"
            sizes="(max-width: 1023px) 100vw, 50vw"
          />
        </div>
        <div className={styles.copy}>
          <h1 className={styles.headline}>
            The journey did not begin with a bicycle. It began with a promise.
          </h1>
          <p className={styles.body}>
            Loss changed the direction of his life. A bicycle gave that direction a road. The
            road became a promise to keep moving — {site.distanceKm.toLocaleString()}
            + kilometres across {site.countryCount} countries so far, carried by the message:{" "}
            {site.message}.
          </p>
        </div>
      </section>

      {/* OWNER: "The origin" and "Why cycle" sections are pending sourced
          detail beyond the hero beat above — CLAUDE.md's never-invent rule
          (§1) means they stay out until real manuscript text or
          owner-supplied copy is available, rather than shipping placeholder
          paragraphs. */}

      <section className={styles.section}>
        <h2 className={styles.sectionLabel}>What comes next</h2>
        <p className={styles.body}>
          The map currently ends in Slovakia — country twenty-three. The next country is still
          being written, and the journey continues for as long as the road allows it to.
        </p>
      </section>
    </>
  );
}
