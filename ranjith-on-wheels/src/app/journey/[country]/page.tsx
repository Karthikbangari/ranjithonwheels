import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildChapter } from "@/content/chapters";
import { journeyCountries } from "@/content/journey";
import { ChapterPage } from "@/components/chapter/ChapterPage";

export function generateStaticParams() {
  return journeyCountries.map((country) => ({ country: country.slug }));
}

type CountryPageProps = {
  params: Promise<{ country: string }>;
};

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const chapter = buildChapter(slug);
  if (!chapter) return {};

  const { country, story } = chapter;
  return {
    title: story ? `${country.name} — ${story.headline}` : `${country.name} — Chapter ${country.order}`,
    description: country.summary,
    openGraph: {
      images: [{ url: country.coverImage }],
    },
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country: slug } = await params;
  const chapter = buildChapter(slug);
  if (!chapter) notFound();

  return <ChapterPage chapter={chapter} />;
}
