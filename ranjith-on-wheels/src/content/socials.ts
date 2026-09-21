export type SocialLink = {
  id: "youtube" | "instagram";
  label: string;
  description: string;
  url: string;
};

// The two official profiles, configured in one place. Leave a URL as "" until
// the owner supplies the real one (CLAUDE.md §1: never a guessed profile). An
// empty URL hides that button everywhere — the footer, the mobile menu, the
// finale and /contact all map over `socialLinks`, which only lists the
// profiles that have a valid https address.
// OWNER: official YouTube URL and official Instagram URL are still required.
export const socialConfig = {
  instagramUrl: "",
  youtubeUrl: "",
};

const isProfileUrl = (value: string) => /^https:\/\/[^\s/]+\.[^\s/]+/.test(value.trim());

// Pure, so it can be tested with any config: a profile is listed only when its
// URL is a real https address. An empty (or malformed) one is simply absent.
export function buildSocialLinks(config: typeof socialConfig): SocialLink[] {
  const candidates: SocialLink[] = [
    { id: "youtube", label: "YouTube", description: "Every ride, as it happened.", url: config.youtubeUrl.trim() },
    { id: "instagram", label: "Instagram", description: "The road, day by day.", url: config.instagramUrl.trim() },
  ];
  return candidates.filter((link) => isProfileUrl(link.url));
}

export const socialLinks: SocialLink[] = buildSocialLinks(socialConfig);
