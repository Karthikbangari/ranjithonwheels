import { siteContent } from "@/content/site";
import { socialLinks } from "@/content/socials";
import { SocialLink } from "@/components/ui/SocialLink";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <p className={styles.message}>{siteContent.message}</p>
        <div className={styles.socials}>
          {socialLinks.map((social) => (
            <SocialLink key={social.id} social={social} />
          ))}
        </div>
      </div>
      <div className={styles.meta}>
        <span>
          &copy; {year} {siteContent.name}
        </span>
        <a href={`mailto:${siteContent.collaborationEmail}`}>
          Collaborations &amp; partnerships
        </a>
      </div>
    </footer>
  );
}
