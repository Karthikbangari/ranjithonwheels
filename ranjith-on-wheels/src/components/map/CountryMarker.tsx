import type { MapMode } from "@/content/atlas";
import styles from "./CountryMarker.module.css";

type CountryMarkerProps = {
  name: string;
  x: number;
  y: number;
  mode: MapMode;
  completed: boolean;
  selected: boolean;
  showRing: boolean;
  showDiamond: boolean;
  onSelect: () => void;
};

export function CountryMarker({
  name,
  x,
  y,
  completed,
  selected,
  showRing,
  showDiamond,
  onSelect,
}: CountryMarkerProps) {
  const classNames = [
    styles.marker,
    completed ? styles.completed : "",
    selected ? styles.selected : "",
    showDiamond ? styles.diamond : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classNames}
      style={{ left: `${x}%`, top: `${y}%` }}
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={name}
    >
      {showRing ? <span className={styles.ring} aria-hidden="true" /> : null}
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{name}</span>
    </button>
  );
}
