import { describe, expect, it } from "vitest";
import { journeyCountries, type JourneyCountry } from "@/content/journey";
import { resolveMedia } from "./media";
import { missingContent } from "./missing";

const country = (slug: string) => journeyCountries.find((c) => c.slug === slug)!;

describe("country media", () => {
  it("uses a photograph that exists as the hero, and nothing where there is none", () => {
    expect(resolveMedia(country("india")).hero?.src).toBe("/media/journey/india/cover.jpg");
    expect(resolveMedia(country("cambodia")).hero?.src).toBe("/media/journey/cambodia/cover.jpg");
    expect(resolveMedia(country("china")).hero?.src).toBe("/media/journey/china/cover.jpg");
    expect(resolveMedia(country("singapore")).hero, "singapore").toBeNull();
  });

  it("swaps a terrain cover for a photograph with one data change (heroImage), and ignores a path with no file", () => {
    const singapore = country("singapore");
    // A real file on disk, supplied as the hero: picked up with no component change.
    const withHero: JourneyCountry = { ...singapore, heroImage: { src: "/media/journey/india/cover.jpg", alt: "supplied" } };
    expect(resolveMedia(withHero).hero?.alt).toBe("supplied");
    // A path with no file behind it renders nothing rather than a broken image.
    const missing: JourneyCountry = { ...singapore, heroImage: { src: "/media/journey/singapore/not-yet.jpg", alt: "x" } };
    expect(resolveMedia(missing).hero).toBeNull();
  });

  it("keeps only gallery and signature photographs that exist, and trims the video URL", () => {
    const base = country("vietnam");
    const media = resolveMedia({
      ...base,
      gallery: [
        { src: "/media/journey/vietnam/cover.jpg", alt: "real" },
        { src: "/media/journey/vietnam/soon.jpg", alt: "not yet" },
      ],
      signatureImage: { src: "/media/journey/vietnam/soon.jpg", alt: "not yet" },
      videoUrl: "  https://video.example/watch  ",
    });
    expect(media.gallery.map((g) => g.alt)).toEqual(["real"]);
    expect(media.signature).toBeNull();
    expect(media.videoUrl).toBe("https://video.example/watch");
    expect(resolveMedia(base).videoUrl).toBeNull();
  });
});

describe("content status tracker", () => {
  it("lists exactly what is still missing, derived from the data", () => {
    const missing = missingContent();
    expect(missing.media).toEqual(expect.arrayContaining(["Singapore cover/hero"]));
    expect(missing.media).not.toEqual(expect.arrayContaining(["Cambodia cover/hero", "China cover/hero"]));
    for (const name of ["Sri Lanka", "Thailand", "Australia", "South Korea", "France", "Slovakia"]) {
      expect(missing.content).toContain(`${name} manuscript`);
    }
    expect(missing.content).toContain("Bhagira details");
    expect(missing.links).toEqual(["official YouTube URL", "official Instagram URL"]);
  });

  it("prints the tracker (npm run content:status)", () => {
    const { media, content, links } = missingContent();
    console.log(["MEDIA REQUIRED", ...media.map((m) => `  * ${m}`), "CONTENT REQUIRED", ...content.map((c) => `  * ${c}`), "LINKS REQUIRED", ...links.map((l) => `  * ${l}`)].join("\n"));
  });
});
