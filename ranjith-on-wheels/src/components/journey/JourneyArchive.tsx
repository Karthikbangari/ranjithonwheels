"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { journeyCountries, type JourneyChapter } from "@/content/journey";
import { atlasChapters } from "@/content/atlas";
import { FallbackImage } from "@/components/ui/FallbackImage";
import styles from "./JourneyArchive.module.css";

export function JourneyArchive() {
  const [query, setQuery] = useState("");
  const [chapter, setChapter] = useState<JourneyChapter | "all">("all");

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return journeyCountries.filter((country) => {
      const matchesChapter = chapter === "all" || country.chapter === chapter;
      const matchesQuery =
        normalizedQuery.length === 0 || country.name.toLowerCase().includes(normalizedQuery);
      return matchesChapter && matchesQuery;
    });
  }, [query, chapter]);

  return (
    <>
      <div className={styles.controls}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search a country…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search countries"
        />
        <div className={styles.chapterFilter} role="group" aria-label="Filter by chapter">
          <button
            type="button"
            className={`${styles.chapterButton} ${chapter === "all" ? styles.chapterButtonActive : ""}`}
            aria-pressed={chapter === "all"}
            onClick={() => setChapter("all")}
          >
            All chapters
          </button>
          {atlasChapters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.chapterButton} ${chapter === item.id ? styles.chapterButtonActive : ""}`}
              aria-pressed={chapter === item.id}
              onClick={() => setChapter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.grid}>
        {results.length === 0 ? (
          <p className={styles.empty}>No countries match that search.</p>
        ) : (
          results.map((country) => (
            <Link key={country.slug} href={`/journey/${country.slug}`} className={styles.card}>
              <div className={styles.cardMedia}>
                <FallbackImage
                  src={country.coverImage}
                  alt={country.coverAlt}
                  sizes="(max-width: 767px) 50vw, 25vw"
                  pendingLabel={`${country.name} photograph pending`}
                />
              </div>
              <span className={styles.cardOrder}>Country {country.order}</span>
              <span className={styles.cardName}>{country.name}</span>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
