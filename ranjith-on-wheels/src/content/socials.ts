export type SocialLink = {
  id: "youtube" | "instagram" | "x";
  label: string;
  description: string;
  url: string;
};

// The official profiles, configured in one place. Leave a URL as "" until the
// owner supplies the real one (CLAUDE.md §1: never a guessed profile). An
// empty URL hides that button everywhere — the footer, the mobile menu, the
// finale and /contact all map over `socialLinks`, which only lists the
// profiles that have a valid https address.
//
// Owner-confirmed 2026-09-23: @Ranjithonwheels (YouTube), @ranjithonwheels
// (Instagram) and @ranjith_on (X) are the real, correct handles.
export const socialConfig = {
  instagramUrl: "https://www.instagram.com/ranjithonwheels/",
  youtubeUrl: "https://www.youtube.com/@Ranjithonwheels",
  xUrl: "https://x.com/ranjith_on",
};

const isProfileUrl = (value: string) => /^https:\/\/[^\s/]+\.[^\s/]+/.test(value.trim());

// Pure, so it can be tested with any config: a profile is listed only when its
// URL is a real https address. An empty (or malformed) one is simply absent.
export function buildSocialLinks(config: typeof socialConfig): SocialLink[] {
  const candidates: SocialLink[] = [
    { id: "youtube", label: "YouTube", description: "Every ride, as it happened.", url: config.youtubeUrl.trim() },
    { id: "instagram", label: "Instagram", description: "The road, day by day.", url: config.instagramUrl.trim() },
    { id: "x", label: "X", description: "Short updates from the road.", url: config.xUrl.trim() },
  ];
  return candidates.filter((link) => isProfileUrl(link.url));
}

export const socialLinks: SocialLink[] = buildSocialLinks(socialConfig);
