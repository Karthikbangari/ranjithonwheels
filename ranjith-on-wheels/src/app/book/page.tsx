import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "The Book",
  description: site.book,
};

export default function BookPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.coverWrap}>
          <Image
            src={site.bookCoverImage}
            alt={site.bookCoverAlt}
            fill
            sizes="260px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.copy}>
          <h1 className={styles.headline}>{site.book}</h1>
          {site.bookDescription ? <p className={styles.body}>{site.bookDescription}</p> : null}
          {site.bookUrl ? (
            <div className={styles.actions}>
              <ButtonLink href={site.bookUrl} variant="secondary">
                Buy or enquire
              </ButtonLink>
            </div>
          ) : null}
        </div>
      </section>
      {/* OWNER: no approved sample excerpt yet — CLAUDE.md's never-invent
          rule (§1) means this section stays out until real sample text is
          supplied, rather than shipping a placeholder paragraph. */}
    </>
  );
}
