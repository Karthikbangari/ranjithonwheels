import type { Metadata } from "next";
import Image from "next/image";
import { siteContent } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "The Book",
  description: siteContent.bookTitle,
};

export default function BookPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.coverWrap}>
          <Image
            src={siteContent.bookCoverImage}
            alt={siteContent.bookCoverAlt}
            fill
            sizes="260px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.copy}>
          <h1 className={styles.headline}>{siteContent.bookTitle}</h1>
          <p className={styles.body}>{siteContent.bookDescription}</p>
          <div className={styles.actions}>
            <ButtonLink href="#sample">Read a sample</ButtonLink>
            <ButtonLink href={siteContent.bookUrl} variant="secondary">
              Buy or enquire
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className={styles.sample} id="sample">
        <h2 className={styles.sectionLabel}>Sample</h2>
        <p className={styles.body}>TODO_OWNER_APPROVAL</p>
      </section>
    </>
  );
}
