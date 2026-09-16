import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import styles from "./SupportReturnMessage.module.css";

type Action = { href: string; label: string; variant?: "primary" | "secondary" };

export function SupportReturnMessage({
  headline,
  children,
  actions,
}: {
  headline: string;
  children: ReactNode;
  actions: Action[];
}) {
  return (
    <section className={styles.section}>
      <Eyebrow>Returning from checkout</Eyebrow>
      <h1 className={styles.headline}>{headline}</h1>
      <p className={styles.body}>{children}</p>
      <div className={styles.actions}>
        {actions.map((action) => (
          <ButtonLink key={action.href} href={action.href} variant={action.variant}>
            {action.label}
          </ButtonLink>
        ))}
      </div>
    </section>
  );
}
