import type { ReactNode } from "react";
import styles from "./LineReveal.module.css";

type LineRevealProps = {
  lines: ReactNode[];
  lineClassName?: string;
  innerClassName?: string;
};

export function LineReveal({ lines, lineClassName, innerClassName }: LineRevealProps) {
  return (
    <>
      {lines.map((line, index) => (
        <span key={index} className={`${styles.mask} ${lineClassName ?? ""}`}>
          <span className={`line-inner ${styles.inner} ${innerClassName ?? ""}`}>{line}</span>
        </span>
      ))}
    </>
  );
}
