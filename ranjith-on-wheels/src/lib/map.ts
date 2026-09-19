import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection } from "geojson";

export async function loadWorldFeatures(): Promise<FeatureCollection> {
  const response = await fetch("/data/countries-110m.json");
  const topology = (await response.json()) as Topology;
  const countries = topology.objects.countries as GeometryCollection;
  return feature(topology, countries) as unknown as FeatureCollection;
}
