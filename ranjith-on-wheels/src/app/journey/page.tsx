import type { Metadata } from "next";
import { siteContent } from "@/content/site";
import { JourneyArchive } from "@/components/journey/JourneyArchive";
import styles from "@/components/journey/JourneyArchive.module.css";

export const metadata: Metadata = {
  title: "The Journey",
  description: `Every country in ${siteContent.personName}'s ${siteContent.distanceKm.toLocaleString()}${siteContent.distanceSuffix} kilometre ride, in order.`,
};

export default function JourneyPage() {
  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.headline}>The full journey, country by country.</h1>
        <p className={styles.lede}>
          {siteContent.countryCount} countries, {siteContent.distanceKm.toLocaleString()}
          {siteContent.distanceSuffix} kilometres. Search or filter by chapter to open any
          country&apos;s chapter.
        </p>
      </section>
      <JourneyArchive />
    </>
  );
}
