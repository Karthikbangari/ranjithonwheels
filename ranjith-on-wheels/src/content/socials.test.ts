import { describe, expect, it } from "vitest";
import { buildSocialLinks, socialConfig, socialLinks } from "./socials";

describe("social links", () => {
  it("shows no button at all until the owner supplies real URLs", () => {
    expect(socialConfig).toEqual({ instagramUrl: "", youtubeUrl: "" });
    expect(socialLinks).toEqual([]);
  });

  it("lists a profile only when its URL is a real https address", () => {
    expect(buildSocialLinks({ instagramUrl: "", youtubeUrl: "" })).toEqual([]);
    expect(buildSocialLinks({ instagramUrl: "  ", youtubeUrl: "youtube" })).toEqual([]);
    expect(buildSocialLinks({ instagramUrl: "http://insecure.example", youtubeUrl: "" })).toEqual([]);
    const both = buildSocialLinks({ instagramUrl: "https://instagram.example/handle", youtubeUrl: "https://youtube.example/@handle" });
    expect(both.map((link) => link.id)).toEqual(["youtube", "instagram"]);
    expect(buildSocialLinks({ instagramUrl: "https://instagram.example/handle", youtubeUrl: "" }).map((l) => l.id)).toEqual(["instagram"]);
  });
});
