import type { MetadataRoute } from "next";
import { journeyCountries } from "@/content/journey";
import { siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/journey", "/book", "/about", "/support", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const countryRoutes = journeyCountries.map((country) => ({
    url: `${siteUrl}/journey/${country.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...countryRoutes];
}
