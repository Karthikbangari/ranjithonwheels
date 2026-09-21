import type { MediaImage } from "./journey";
import type { ContentStatus } from "./stories";

// BHAGIRA — a dedicated, unresolved content item.
//
// The owner has confirmed Bhagira is real, but has not yet said who or what
// Bhagira is, the relationship, the story, the dates, the location or why it
// matters. None of that is guessed anywhere in this codebase: this file holds
// only the *shape* a verified entry will take, and `bhagira` stays null.
//
// When the details arrive, fill in one object here — set `countrySlug` to the
// chapter it belongs in, `status: "verified"`, and the copy the owner approved
// — and a dedicated section appears in that chapter (ChapterBhagira.tsx). No
// page is restructured and no animation is rebuilt.
//
// OWNER: everything about Bhagira — who/what, relationship, story, dates,
// location, importance, and any photograph.
export type BhagiraEntry = {
  status: ContentStatus;
  // Which country's chapter Bhagira appears in.
  countrySlug: string;
  // Owner-approved wording only.
  label?: string;
  text: string;
  image?: MediaImage;
};

export const bhagira = null as BhagiraEntry | null;

// Only a verified entry with words, for the chapter it belongs to.
export function bhagiraFor(slug: string, entry: BhagiraEntry | null = bhagira): BhagiraEntry | null {
  if (!entry || entry.status !== "verified") return null;
  if (entry.countrySlug !== slug || entry.text.trim() === "") return null;
  return entry;
}

export const bhagiraStatus: ContentStatus = bhagira?.status ?? "pending";
