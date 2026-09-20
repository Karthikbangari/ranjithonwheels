import { describe, expect, it } from "vitest";
import { journeyCountries } from "./journey";
import { buildChapter, chapterPages, seaCrossings } from "./chapters";
import { stories } from "./stories";

const numberTokens = (text: string) => text.match(/\d[\d,]*/g) ?? [];

describe("chapters", () => {
  it("builds a chapter for every one of the 23 countries", () => {
    for (const country of journeyCountries) {
      const chapter = buildChapter(country.slug);
      expect(chapter, country.slug).not.toBeNull();
      expect(chapter!.atmosphere.theme.accent, country.slug).toMatch(/^#/);
    }
    expect(buildChapter("atlantis")).toBeNull();
  });

  it("links every chapter to its neighbours, with no previous for India and no next for Slovakia", () => {
    expect(buildChapter("india")!.previous).toBeNull();
    expect(buildChapter("india")!.next?.slug).toBe("sri-lanka");
    expect(buildChapter("slovakia")!.next).toBeNull();
    expect(buildChapter("slovakia")!.previous?.slug).toBe("hungary");
  });

  it("gives countries with no story manuscript no story pages — nothing invented to fill the slots", () => {
    const pending = [
      "sri-lanka",
      "thailand",
      "australia",
      "south-korea",
      "france",
      "switzerland",
      "germany",
      "austria",
      "italy",
      "slovenia",
      "croatia",
      "hungary",
      "slovakia",
    ];
    for (const slug of pending) {
      const chapter = buildChapter(slug)!;
      expect(chapter.story, slug).toBeNull();
      expect(Object.values(chapterPages(chapter)).some(Boolean), slug).toBe(false);
    }
  });

  it("uses a country's own short teaser as its opening line, and never a long summary", () => {
    expect(buildChapter("sri-lanka")!.opening).toBe("The elephant escape.");
    expect(buildChapter("thailand")!.opening).toBe("When only Rs 150 remained.");
    expect(buildChapter("australia")!.opening).toBe("Two rejections, one destination.");
    // South Korea has a long summary: it becomes chapter notes, not a headline.
    expect(buildChapter("south-korea")!.opening).toBeNull();
    expect(buildChapter("south-korea")!.notes).toContain("camping culture");
    // Europe has neither.
    expect(buildChapter("france")!.opening).toBeNull();
    expect(buildChapter("france")!.notes).toBeNull();
  });

  it("only offers a challenge page where the summary states a hazard (Indonesia, Taiwan)", () => {
    const withChallenge = stories.filter((story) => story.moments.some((m) => m.beat === "challenge")).map((s) => s.slug);
    expect(withChallenge.sort()).toEqual(["indonesia", "taiwan"]);
  });

  it("has at most one arrival, challenge and signature moment per story", () => {
    for (const story of stories) {
      for (const beat of ["arrival", "challenge", "signature"] as const) {
        expect(story.moments.filter((m) => m.beat === beat).length, `${story.slug} ${beat}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it("never states a number in a chapter that its country summary does not contain (CLAUDE.md §1)", () => {
    for (const country of journeyCountries) {
      const chapter = buildChapter(country.slug)!;
      const summary = country.summary ?? "";
      const text = [
        chapter.opening ?? "",
        chapter.arrival?.text ?? "",
        chapter.challenge?.text ?? "",
        chapter.signature?.text ?? "",
        ...chapter.road.map((m) => m.text),
        ...chapter.discovery.map((m) => m.text),
        ...chapter.people.map((m) => m.text),
      ].join(" ");
      for (const token of numberTokens(text)) {
        expect(summary, `${country.slug}: "${token}"`).toContain(token);
      }
    }
  });

  it("marks a sea crossing only where the manuscript states one", () => {
    expect(Object.keys(seaCrossings)).toEqual(["indonesia"]);
    expect(buildChapter("indonesia")!.crossing).toContain("32-hour ferry");
    expect(buildChapter("sri-lanka")!.crossing).toBeNull();
  });
});
