import type { Metadata } from "next";
import { site } from "@/content/site";
import { socialLinks } from "@/content/socials";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for collaborations, speaking and partnerships.",
};

export default function ContactPage() {
  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.headline}>Collaborations, speaking and partnerships.</h1>
        <p className={styles.body}>
          For press, collaborations or anything else related to the journey, reach out directly or
          follow along on social media.
        </p>
      </section>
      <div className={styles.grid}>
        {site.collaborationEmail ? (
          <a className={styles.card} href={`mailto:${site.collaborationEmail}`}>
            <h2 className={styles.cardLabel}>Email</h2>
            <span className={styles.cardValue}>{site.collaborationEmail}</span>
          </a>
        ) : null}
        {socialLinks.map((social) => (
          <a key={social.id} className={styles.card} href={social.url} rel="me noreferrer">
            <h2 className={styles.cardLabel}>{social.description}</h2>
            <span className={styles.cardValue}>{social.label}</span>
          </a>
        ))}
      </div>
    </>
  );
}
