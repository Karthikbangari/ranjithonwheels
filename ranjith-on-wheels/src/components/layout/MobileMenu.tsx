"use client";

import { useEffect, useRef, useState } from "react";
import { primaryNavLinks, followCta } from "@/content/navigation";
import { socialLinks } from "@/content/socials";
import styles from "./MobileMenu.module.css";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const toggleButton = toggleRef.current;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      (previouslyFocused ?? toggleButton)?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        Menu
      </button>
      {open ? (
        <div
          id="mobile-menu"
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <button
            type="button"
            className={styles.close}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            Close
          </button>
          <nav className={styles.links}>
            {primaryNavLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <a href={followCta.href} onClick={() => setOpen(false)}>
              {followCta.label}
            </a>
          </nav>
          <div className={styles.socials}>
            {socialLinks.map((social) => (
              <a key={social.id} href={social.url} rel="me noreferrer">
                {social.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
