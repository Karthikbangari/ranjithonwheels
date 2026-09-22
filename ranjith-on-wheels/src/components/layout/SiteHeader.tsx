import Link from "next/link";
import { site } from "@/content/site";
import { primaryNavLinks, followCta } from "@/content/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MobileMenu } from "./MobileMenu";
import styles from "./SiteHeader.module.css";

// One plain white bar, the same on every page and at every scroll position.
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <span className={styles.wheelMark} aria-hidden="true" />
        {site.name}
      </Link>
      <nav className={styles.nav} aria-label="Primary">
        {primaryNavLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className={styles.actions}>
        <span className={styles.follow}>
          <ButtonLink href={followCta.href} variant="primary">
            {followCta.label}
          </ButtonLink>
        </span>
        <MobileMenu />
      </div>
    </header>
  );
}
