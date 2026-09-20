import type { Metadata } from "next";
import { site } from "@/content/site";
import { JourneyGateway } from "@/components/chapter/JourneyGateway";
import { JourneyArchive } from "@/components/journey/JourneyArchive";
import styles from "@/components/journey/JourneyArchive.module.css";

export const metadata: Metadata = {
  title: "The Journey",
  description: `Every country in ${site.traveller}'s ${site.distanceKm.toLocaleString()}+ kilometre ride, in order.`,
};

export default function JourneyPage() {
  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.headline}>The full journey, country by country.</h1>
        <p className={styles.lede}>
          {site.countryCount} countries, {site.distanceKm.toLocaleString()}
          + kilometres. Search or filter by chapter to open any country&apos;s chapter.
        </p>
      </section>
      <JourneyGateway />
      <JourneyArchive />
    </>
  );
}
