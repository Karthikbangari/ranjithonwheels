import type { MapMode } from "@/content/atlas";
import styles from "./MapModeControls.module.css";

const MODES: { id: MapMode; label: string }[] = [
  { id: "route", label: "Route" },
  { id: "kindness", label: "Kindness" },
  { id: "challenge", label: "Challenge" },
];

export function MapModeControls({
  mode,
  onChange,
}: {
  mode: MapMode;
  onChange: (mode: MapMode) => void;
}) {
  return (
    <div className={styles.controls} role="group" aria-label="Map mode">
      {MODES.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`${styles.button} ${mode === option.id ? styles.active : ""}`}
          aria-pressed={mode === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
