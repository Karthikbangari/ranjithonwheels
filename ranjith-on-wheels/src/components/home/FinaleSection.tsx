import Image from "next/image";
import { site } from "@/content/site";
import { socialLinks } from "@/content/socials";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./FinaleSection.module.css";

// Where the ride stands today. A white section: the sentence, one photograph,
// and — only once the owner has supplied real profiles — the follow links.
export function FinaleSection() {
  return (
    <section className={`${styles.section} fade`} id="finale">
      <div className={styles.copy}>
        <Eyebrow>
          {site.latestCountry} — country {site.countryCount} — not the finish
        </Eyebrow>
        <h2 className={styles.headline}>
          The map ends here. <em>The journey doesn&apos;t.</em>
        </h2>
        <p className={styles.next}>The next country is still being written.</p>
        {socialLinks.length > 0 ? (
          <div className={styles.socials}>
            {socialLinks.map((social) => (
              <a key={social.id} href={social.url} rel="me noreferrer" className={styles.social}>
                <strong>{social.label}</strong>
                <span>{social.description}</span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <div className={styles.media}>
        <Image
          src="/media/hero/finale.jpg"
          alt="Ranjith's loaded touring bicycle by the roadside with the Indian flag, mountains behind"
          fill
          sizes="(max-width: 899px) 100vw, 50vw"
          className={styles.image}
        />
      </div>
    </section>
  );
}
