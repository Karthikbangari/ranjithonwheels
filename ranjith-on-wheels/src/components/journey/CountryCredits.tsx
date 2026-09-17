import type { CountrySource } from "@/content/journey";
import styles from "./CountryCredits.module.css";

// CLAUDE.md §8: credits live in a collapsible drawer at the foot of the
// page, never the headline. Renders nothing when a country has no verified
// source yet — an absent drawer isn't an empty state, a placeholder one
// pretending to cite something would be.
export function CountryCredits({ source }: { source?: CountrySource }) {
  if (!source) return null;

  return (
    <details className={styles.details}>
      <summary className={styles.summary}>Credits</summary>
      <p className={styles.body}>
        {source.url ? (
          <a href={source.url} target="_blank" rel="noreferrer">
            {source.label}
          </a>
        ) : (
          source.label
        )}
        {source.pages ? `, ${source.pages}` : ""}
        {source.accessed ? ` — accessed ${source.accessed}` : ""}
      </p>
    </details>
  );
}
