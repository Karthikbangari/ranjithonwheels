import Image from "next/image";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./BookFeature.module.css";

export function BookFeature() {
  return (
    <section className={`${styles.section} fade`} id="book">
      <div className={styles.cover}>
        <Image src={site.bookCoverImage} alt={site.bookCoverAlt} fill sizes="280px" className={styles.coverImage} />
        <span className={styles.coverTitle}>{site.book}</span>
      </div>
      <div className={styles.copy}>
        <Eyebrow>The book</Eyebrow>
        <h2 className={styles.headline}>The complete journey lives between these pages.</h2>
        {site.bookDescription ? <p className={styles.description}>{site.bookDescription}</p> : null}
        <div className={styles.actions}>
          <ButtonLink href="/book">Read a sample</ButtonLink>
          {site.bookUrl ? (
            <ButtonLink href={site.bookUrl} variant="secondary">
              Buy or enquire
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
