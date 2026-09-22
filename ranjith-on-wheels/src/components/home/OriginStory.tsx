import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./OriginStory.module.css";

// CLAUDE.md §0 decision #16: the owner-supplied "original inspiration text",
// word for word, split into the three sentences it is already written in.
const beats = [
  "Ranjith did not set out to collect country names.",
  "He began with a bicycle, a personal reason to keep moving, and a belief that the road can connect people who may never share the same language.",
  "Every border since then has become part of one longer promise: keep going, keep learning and leave the road kinder than it was found.",
];

export function OriginStory() {
  return (
    <section className={`${styles.section} fade`} id="story">
      <div className={styles.media}>
        <Image
          src="/media/story/origin-portrait.jpg"
          alt="Ranjith sitting quietly on a dock, looking out over open water"
          fill
          sizes="(max-width: 899px) 100vw, 45vw"
          className={styles.image}
        />
      </div>
      <div className={styles.copy}>
        <Eyebrow>The origin</Eyebrow>
        <h2 className={styles.headline}>A promise can become a road.</h2>
        <ul className={styles.beats}>
          {beats.map((beat) => (
            <li key={beat}>{beat}</li>
          ))}
        </ul>
        <Link href="/about" className={styles.link}>
          Read the full story
        </Link>
      </div>
    </section>
  );
}
