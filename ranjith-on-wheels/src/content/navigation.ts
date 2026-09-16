export type NavLink = {
  label: string;
  href: string;
};

export const primaryNavLinks: NavLink[] = [
  { label: "Story", href: "/#story" },
  { label: "Journey", href: "/journey" },
  { label: "Book", href: "/book" },
  { label: "Support", href: "/support" },
  { label: "About", href: "/about" },
];

export const followCta: NavLink = {
  label: "Follow the journey",
  href: "/#finale",
};
