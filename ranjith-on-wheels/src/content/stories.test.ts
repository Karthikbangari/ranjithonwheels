import { describe, expect, it } from "vitest";
import { journeyCountries } from "./journey";
import { getStory, stories, storiesWithCountry } from "./stories";

const numberTokens = (text: string) => text.match(/\d[\d,]*/g) ?? [];

describe("story content", () => {
  it("has exactly ten stories, each with a unique slug", () => {
    expect(stories).toHaveLength(10);
    expect(new Set(stories.map((story) => story.slug)).size).toBe(10);
  });

  it("only covers countries with a full summary and a page-verified citation", () => {
    for (const { story, country } of storiesWithCountry) {
      expect(country.summary, story.slug).toBeTruthy();
      expect(country.source?.pages, story.slug).toBeTruthy();
    }
    expect(storiesWithCountry).toHaveLength(stories.length);
  });

  it("covers every country that qualifies, so /stories and the story pages never drift", () => {
    const qualifying = journeyCountries
      .filter((country) => country.summary && country.source?.pages)
      .map((country) => country.slug);
    expect(stories.map((story) => story.slug)).toEqual(qualifying);
  });

  it("never states a number its country summary does not already contain (CLAUDE.md §1)", () => {
    for (const { story, country } of storiesWithCountry) {
      const summary = country.summary ?? "";
      const claimed = [
        story.headline,
        ...story.moments.map((moment) => moment.text),
        ...story.stats.map((stat) => stat.value.toLocaleString("en-US")),
      ].flatMap(numberTokens);

      for (const token of claimed) {
        expect(summary, `${story.slug}: "${token}" is not in the summary`).toContain(token);
      }
    }
  });

  it("gives every story at least two moments and unique moment labels", () => {
    for (const story of stories) {
      expect(story.moments.length, story.slug).toBeGreaterThanOrEqual(2);
      const labels = story.moments.map((moment) => moment.label);
      expect(new Set(labels).size, story.slug).toBe(labels.length);
    }
  });

  it("gives every story its own signature motif", () => {
    expect(new Set(stories.map((story) => story.motif)).size).toBe(10);
  });

  it("gives every story a signature moment, so the wow page is never missing", () => {
    for (const story of stories) {
      expect(story.moments.filter((m) => m.beat === "signature"), story.slug).toHaveLength(1);
    }
  });

  it("looks stories up by slug and returns null for anything else", () => {
    expect(getStory("india")?.slug).toBe("india");
    expect(getStory("sri-lanka")).toBeNull();
  });
});
