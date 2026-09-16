"use client";

import dynamic from "next/dynamic";

const WorldJourneyMap = dynamic(
  () => import("@/components/map/WorldJourneyMap").then((mod) => mod.WorldJourneyMap),
  { ssr: false },
);

export function JourneyAtlas() {
  return <WorldJourneyMap />;
}
