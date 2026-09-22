import Link from "next/link";
import { journeyCountries } from "@/content/journey";
import { kindnessCountrySlugs } from "@/content/atlas";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CountryCoverImage } from "@/components/journey/CountryCoverImage";
import styles from "./HumanGallery.module.css";

// Only countries with a real, sourced kindnessStory qualify — and if none do
// yet, the whole section is simply absent: a headline over an empty row would
// be exactly the kind of empty state this site never shows.
export function HumanGallery() {
  const kindnessCountries = kindnessCountrySlugs
    .map((slug) => journeyCountries.find((country) => country.slug === slug))
    .filter((country): country is NonNullable<typeof country> => Boolean(country?.kindnessStory));

  if (kindnessCountries.length === 0) return null;

  return (
    <section className={`${styles.section} fade`}>
      <div>
        <Eyebrow>Kindness along the way</Eyebrow>
        <h2 className={styles.headline}>The road was carried by strangers.</h2>
      </div>
      <div className={styles.grid}>
        {kindnessCountries.map((country) => (
          <Link key={country.slug} href={`/journey/${country.slug}`} className={styles.card}>
            <div className={styles.media}>
              <CountryCoverImage
                slug={country.slug}
                anchor={country.displayAnchor}
                src={country.coverImage}
                alt={country.coverAlt}
                sizes="(max-width: 899px) 100vw, 25vw"
              />
            </div>
            <span className={styles.name}>{country.name}</span>
            <p className={styles.text}>{country.kindnessStory}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
