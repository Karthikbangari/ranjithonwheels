import { describe, expect, it } from "vitest";
import { buildSocialLinks, socialConfig, socialLinks } from "./socials";

describe("social links", () => {
  it("uses the owner-confirmed handles, and lists all three", () => {
    expect(socialConfig).toEqual({
      instagramUrl: "https://www.instagram.com/ranjithonwheels/",
      youtubeUrl: "https://www.youtube.com/@Ranjithonwheels",
      xUrl: "https://x.com/ranjith_on",
    });
    expect(socialLinks.map((link) => link.id)).toEqual(["youtube", "instagram", "x"]);
  });

  it("lists a profile only when its URL is a real https address — an unconfirmed one hides the button entirely", () => {
    expect(buildSocialLinks({ instagramUrl: "", youtubeUrl: "", xUrl: "" })).toEqual([]);
    expect(buildSocialLinks({ instagramUrl: "  ", youtubeUrl: "youtube", xUrl: "" })).toEqual([]);
    expect(buildSocialLinks({ instagramUrl: "http://insecure.example", youtubeUrl: "", xUrl: "" })).toEqual([]);
    const both = buildSocialLinks({
      instagramUrl: "https://instagram.example/handle",
      youtubeUrl: "https://youtube.example/@handle",
      xUrl: "",
    });
    expect(both.map((link) => link.id)).toEqual(["youtube", "instagram"]);
    expect(
      buildSocialLinks({ instagramUrl: "https://instagram.example/handle", youtubeUrl: "", xUrl: "" }).map(
        (l) => l.id,
      ),
    ).toEqual(["instagram"]);
  });
});
