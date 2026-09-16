export type SocialLink = {
  id: "youtube" | "instagram";
  label: string;
  description: string;
  url: string;
};

export const socialLinks: SocialLink[] = [
  {
    id: "youtube",
    label: "YouTube",
    description: "Journey films",
    url: "TODO_OWNER_APPROVAL",
  },
  {
    id: "instagram",
    label: "Instagram",
    description: "Daily road stories",
    url: "TODO_OWNER_APPROVAL",
  },
];
