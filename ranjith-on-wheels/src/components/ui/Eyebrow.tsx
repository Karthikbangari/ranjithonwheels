import type { ReactNode } from "react";
import styles from "./Eyebrow.module.css";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className={styles.eyebrow}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </span>
  );
}
