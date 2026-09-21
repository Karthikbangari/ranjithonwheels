import { describe, expect, it } from "vitest";
import { journeyCountries } from "./journey";
import { arrivalRows, buildChapter, chapterPages, isPublic, seaCrossings } from "./chapters";
import { bhagiraFor, type BhagiraEntry } from "./bhagira";
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

  it("only offers an environment page where the summary names the setting (Indonesia, Taiwan) — and never as an event", () => {
    const withEnvironment = stories.filter((story) => story.moments.some((m) => m.beat === "environment")).map((s) => s.slug);
    expect(withEnvironment.sort()).toEqual(["indonesia", "taiwan"]);
    expect(buildChapter("indonesia")!.atmosphere.environment?.label).toBe("Regional terrain");
    expect(buildChapter("taiwan")!.atmosphere.environment?.label).toBe("Natural environment");
    // No wording that turns a hazard into something that happened to him.
    for (const slug of ["indonesia", "taiwan"]) {
      const moment = buildChapter(slug)!.environment!;
      expect(`${moment.label} ${moment.text}`, slug).not.toMatch(/erupt|struck|hit|survived|escaped|felt|shook|danger|encounter/i);
    }
  });

  it("has at most one arrival, challenge and signature moment per story", () => {
    for (const story of stories) {
      for (const beat of ["arrival", "environment", "signature"] as const) {
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
        chapter.environment?.text ?? "",
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

  it("marks every chapter's content status: verified stories are verified, everyone else is pending", () => {
    const verified = journeyCountries.filter((c) => buildChapter(c.slug)!.contentStatus === "verified").map((c) => c.slug);
    expect(verified).toHaveLength(10);
    for (const country of journeyCountries) {
      const chapter = buildChapter(country.slug)!;
      if (chapter.contentStatus === "pending") {
        expect(chapter.interlude, country.slug).toBe(true);
        expect(chapter.story, country.slug).toBeNull();
      } else {
        expect(chapter.interlude, country.slug).toBe(false);
      }
    }
  });

  it("treats only verified copy as final (drafts stay out of the public site)", () => {
    expect(isPublic("verified")).toBe(true);
    expect(isPublic("pending")).toBe(false);
    expect(isPublic("draft")).toBe(false);
    expect(isPublic("draft", true)).toBe(true); // a preview build only
    expect(isPublic("pending", true)).toBe(false);
  });

  it("lays the arrival row out as location, coordinates — and a date only when one is supplied", () => {
    const vietnam = buildChapter("vietnam")!;
    expect(arrivalRows(vietnam)).toEqual(["location", "coordinates", "from", "chapter"]);
    const dated = { ...vietnam, country: { ...vietnam.country, arrivalDate: "supplied by the owner" } };
    expect(arrivalRows(dated)).toEqual(["location", "coordinates", "date", "from", "chapter"]);
    // Empty or whitespace is the same as none: no empty slot.
    const blank = { ...vietnam, country: { ...vietnam.country, arrivalDate: "   " } };
    expect(arrivalRows(blank)).toEqual(["location", "coordinates", "from", "chapter"]);
    // India begins the road: nothing behind it.
    expect(arrivalRows(buildChapter("india")!)).toEqual(["location", "coordinates", "chapter"]);
    expect(arrivalRows(buildChapter("indonesia")!)).toContain("crossing");
  });

  it("holds no date for any country until the owner supplies a verified one", () => {
    for (const country of journeyCountries) {
      expect(country.arrivalDate, country.slug).toBeUndefined();
      expect(country.departureDate, country.slug).toBeUndefined();
    }
  });

  it("leaves Bhagira unresolved: nothing is shown until a verified entry names a chapter", () => {
    for (const country of journeyCountries) expect(buildChapter(country.slug)!.bhagira, country.slug).toBeNull();
    const entry: BhagiraEntry = { status: "verified", countrySlug: "india", text: "Owner-approved wording." };
    expect(bhagiraFor("india", entry)).toBe(entry);
    expect(bhagiraFor("vietnam", entry)).toBeNull();
    expect(bhagiraFor("india", { ...entry, status: "draft" })).toBeNull();
    expect(bhagiraFor("india", { ...entry, status: "pending" })).toBeNull();
    expect(bhagiraFor("india", { ...entry, text: "  " })).toBeNull();
    expect(bhagiraFor("india", null)).toBeNull();
  });

  it("marks a sea crossing only where the manuscript states one", () => {
    expect(Object.keys(seaCrossings)).toEqual(["indonesia"]);
    expect(buildChapter("indonesia")!.crossing).toContain("32-hour ferry");
    expect(buildChapter("sri-lanka")!.crossing).toBeNull();
  });
});
