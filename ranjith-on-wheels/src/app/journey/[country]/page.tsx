import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { journeyCountries } from "@/content/journey";
import { CountryChapter } from "@/components/journey/CountryChapter";

export function generateStaticParams() {
  return journeyCountries.map((country) => ({ country: country.slug }));
}

type CountryPageProps = {
  params: Promise<{ country: string }>;
};

function findCountry(slug: string) {
  return journeyCountries.find((entry) => entry.slug === slug) ?? null;
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const country = findCountry(slug);
  if (!country) return {};

  return {
    title: `${country.name} — Country ${country.order}`,
    description: country.summary,
    openGraph: {
      images: [{ url: country.coverImage }],
    },
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country: slug } = await params;
  const country = findCountry(slug);
  if (!country) notFound();

  const previous = journeyCountries.find((entry) => entry.order === country.order - 1) ?? null;
  const next = journeyCountries.find((entry) => entry.order === country.order + 1) ?? null;

  return <CountryChapter country={country} previous={previous} next={next} />;
}
