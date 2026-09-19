"use client";

import type { ImageProps } from "next/image";
import { FallbackImage } from "@/components/ui/FallbackImage";
import { CountryTerrainFallback } from "./CountryTerrainFallback";

type CountryCoverImageProps = Omit<ImageProps, "onError" | "fill"> & {
  slug: string;
  anchor: [number, number];
};

// Thin client-boundary wrapper: Server Components (CountryChapter,
// JourneyArchive) can't pass a renderFallback function prop straight into
// FallbackImage, so this takes plain serialisable props instead and builds
// that closure on the client side.
export function CountryCoverImage({ slug, anchor, ...imageProps }: CountryCoverImageProps) {
  return (
    <FallbackImage {...imageProps} renderFallback={() => <CountryTerrainFallback slug={slug} anchor={anchor} />} />
  );
}
