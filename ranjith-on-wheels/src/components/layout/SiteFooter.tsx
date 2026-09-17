import { site } from "@/content/site";
import { socialLinks } from "@/content/socials";
import { SocialLink } from "@/components/ui/SocialLink";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <p className={styles.message}>{site.message}</p>
        <div className={styles.socials}>
          {socialLinks.map((social) => (
            <SocialLink key={social.id} social={social} />
          ))}
        </div>
      </div>
      <div className={styles.meta}>
        <span>
          &copy; {year} {site.name}
        </span>
        {site.collaborationEmail ? (
          <a href={`mailto:${site.collaborationEmail}`}>Collaborations &amp; partnerships</a>
        ) : null}
      </div>
    </footer>
  );
}
