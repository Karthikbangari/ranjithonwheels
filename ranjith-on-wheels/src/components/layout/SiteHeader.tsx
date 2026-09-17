"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { primaryNavLinks, followCta } from "@/content/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MobileMenu } from "./MobileMenu";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
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
          <ButtonLink href={followCta.href}>{followCta.label}</ButtonLink>
        </span>
        <MobileMenu />
      </div>
    </header>
  );
}
