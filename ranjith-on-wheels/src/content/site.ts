// Resolution order: an explicit NEXT_PUBLIC_SITE_URL (set this once a real
// custom domain is chosen — decision #26, still unconfirmed) beats Vercel's
// own stable production URL, which beats the current deployment's own URL
// (both auto-supplied by Vercel, no configuration needed), which beats
// localhost for local dev. Only NEXT_PUBLIC_SITE_URL and VERCEL_PROJECT_
// PRODUCTION_URL are read here, never the plain VERCEL_URL, so a preview
// deployment's metadata still points at production rather than its own
// throwaway URL.
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelProductionUrl ? `https://${vercelProductionUrl}` : "http://localhost:3000");

export const site = {
  name: "Ranjith on Wheels",
  traveller: "Ranjith Kumar Dagara",
  message: "Solution to Pollution",
  distanceKm: 48000,
  countryCount: 24,
  latestCountry: "Czech Republic",
  // OWNER: no specific city confirmed yet for the Czech Republic arrival —
  // left unset rather than guessed (the public vlog announcing country #24
  // names the country, not a city). Every consumer must handle its absence.
  latestCity: undefined as string | undefined,
  years: 4,
  book: "The Indian Cyclist — A Journey for Generations",
  bookCoverImage: "/media/book/cover-placeholder.jpg",
  bookCoverAlt: "Placeholder cover artwork using a journey photograph, pending the final book cover from the owner",
  // OWNER: none of these three are confirmed yet. CLAUDE.md's never-invent
  // rule (§1) means each consumer must render its section without the
  // field rather than fabricate a description, purchase link or contact
  // address — see BookFeature.tsx, book/page.tsx, SiteFooter.tsx and
  // contact/page.tsx.
  bookDescription: undefined as string | undefined,
  bookUrl: undefined as string | undefined,
  collaborationEmail: undefined as string | undefined,
} as const;
