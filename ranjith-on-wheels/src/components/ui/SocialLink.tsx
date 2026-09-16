import type { SocialLink as SocialLinkData } from "@/content/socials";
import styles from "./SocialLink.module.css";

export function SocialLink({ social }: { social: SocialLinkData }) {
  return (
    <a href={social.url} className={styles.link} rel="me noreferrer">
      <span className={styles.label}>{social.label}</span>
      <span className={styles.description}>{social.description}</span>
    </a>
  );
}
