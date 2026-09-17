export type SocialLink = {
  id: "youtube" | "instagram";
  label: string;
  description: string;
  url: string;
};

// OWNER: no confirmed YouTube/Instagram URLs yet. CLAUDE.md's never-invent
// rule (§1) means these render nowhere — every consumer (SiteFooter,
// MobileMenu, FinaleSection, /contact) maps over this array, so leaving it
// empty is enough to keep a fake/broken link off every page — until the
// owner supplies the real handles.
export const socialLinks: SocialLink[] = [];
