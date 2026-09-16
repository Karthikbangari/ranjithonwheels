// Set NEXT_PUBLIC_SITE_URL in the deployment environment once a real domain
// is chosen. Falls back to localhost so metadata still resolves in dev.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteContent = {
  name: "Ranjith on Wheels",
  personName: "Ranjith Kumar Dagara",
  message: "Solution to Pollution",
  distanceKm: 48000,
  distanceSuffix: "+",
  countryCount: 23,
  yearsOnRoad: 4,
  yearsSuffix: "+",
  currentCountry: "Slovakia",
  bookTitle: "The Indian Cyclist - A Journey for Generations",
  bookCoverImage: "/media/book/cover-placeholder.jpg",
  bookCoverAlt: "Placeholder cover artwork using a journey photograph, pending the final book cover from the owner",
  bookDescription: "TODO_OWNER_APPROVAL",
  youtubeUrl: "TODO_OWNER_APPROVAL",
  instagramUrl: "TODO_OWNER_APPROVAL",
  collaborationEmail: "TODO_OWNER_APPROVAL",
  bookUrl: "TODO_OWNER_APPROVAL",
  supportUrl: "/support",
} as const;
