import type { Metadata } from "next";
import { siteContent } from "@/content/site";
import { FallbackImage } from "@/components/ui/FallbackImage";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description: `The story behind ${siteContent.personName} and the ${siteContent.message} journey.`,
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
            road became a promise to keep moving — {siteContent.distanceKm.toLocaleString()}
            {siteContent.distanceSuffix} kilometres across {siteContent.countryCount} countries so
            far, carried by the message: {siteContent.message}.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>The origin</span>
        <p className={styles.body}>TODO_OWNER_APPROVAL</p>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <span className={styles.sectionLabel}>Why cycle</span>
        <p className={styles.body}>TODO_OWNER_APPROVAL</p>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionLabel}>What comes next</span>
        <p className={styles.body}>
          The map currently ends in Slovakia — country twenty-three. The next country is still
          being written, and the journey continues for as long as the road allows it to.
        </p>
      </section>
    </>
  );
}
