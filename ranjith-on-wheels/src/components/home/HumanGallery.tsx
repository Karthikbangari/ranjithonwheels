import Link from "next/link";
import { journeyCountries } from "@/content/journey";
import { kindnessCountrySlugs } from "@/content/atlas";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FallbackImage } from "@/components/ui/FallbackImage";
import styles from "./HumanGallery.module.css";

export function HumanGallery() {
  // Only countries with a real kindnessStory qualify — never show an empty
  // caption. See the OWNER notes beside journeyCountries in journey.ts for
  // which of these slugs currently lack sourced content.
  const kindnessCountries = kindnessCountrySlugs
    .map((slug) => journeyCountries.find((country) => country.slug === slug))
    .filter((country): country is NonNullable<typeof country> => Boolean(country?.kindnessStory));

  return (
    <section className={styles.section}>
      <div>
        <Eyebrow>Kindness along the way</Eyebrow>
        <h2 className={styles.headline}>The road was carried by strangers.</h2>
      </div>
      <div className={styles.track}>
        {kindnessCountries.map((country) => (
          <Link key={country.slug} href={`/journey/${country.slug}`} className={styles.card}>
            <div className={styles.cardMedia}>
              <FallbackImage
                src={country.coverImage}
                alt={country.coverAlt}
                sizes="260px"
                pendingLabel={`${country.name} photograph pending`}
              />
            </div>
            <span className={styles.cardName}>{country.name}</span>
            <p className={styles.cardText}>{country.kindnessStory}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
