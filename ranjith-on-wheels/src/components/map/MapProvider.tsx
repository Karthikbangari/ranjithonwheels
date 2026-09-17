"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { legs, type LegId } from "@/content/legs";
import { MAP_STYLE_URL, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "@/lib/mapConfig";
import type { MapState } from "@/lib/mapState";
import { buildRouteData } from "@/lib/routeGeometry";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { useMapTier } from "@/lib/mapTier";

// CLAUDE.md §3.1 tokens, duplicated here because MapLibre paint properties
// take literal values, not CSS custom properties.
const COLOR_ROUTE = "#f15b3a";
const COLOR_ROUTE_GLOW = "#ffbe63";

function addRouteLayers(map: MapLibreMap) {
  if (map.getSource("route-main")) return; // already added — the map outlives any one page

  const route = buildRouteData();

  map.addSource("route-main", { type: "geojson", lineMetrics: true, data: route.mainLine });
  map.addLayer({
    id: "route-main-line",
    type: "line",
    source: "route-main",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-width": 2.5,
      "line-gradient": ["interpolate", ["linear"], ["line-progress"], 0, COLOR_ROUTE, 1, COLOR_ROUTE_GLOW],
    },
  });

  map.addSource("route-crossings", {
    type: "geojson",
    data: { type: "FeatureCollection", features: route.crossingLines },
  });
  map.addLayer({
    id: "route-crossings-line",
    type: "line",
    source: "route-crossings",
    layout: { "line-cap": "round" },
    paint: { "line-width": 2, "line-color": COLOR_ROUTE, "line-dasharray": [2, 3], "line-opacity": 0.7 },
  });

  map.addSource("route-crossing-labels", { type: "geojson", data: route.crossingLabels });
  map.addLayer({
    id: "route-crossing-labels",
    type: "symbol",
    source: "route-crossing-labels",
    layout: {
      "text-field": ["get", "label"],
      "text-size": 10,
      "text-letter-spacing": 0.08,
      "text-font": ["Noto Sans Regular"],
    },
    paint: { "text-color": "#41515d", "text-halo-color": "#ffffff", "text-halo-width": 1.2 },
  });

  map.addSource("route-unfinished", { type: "geojson", lineMetrics: true, data: route.unfinishedLine });
  map.addLayer({
    id: "route-unfinished-line",
    type: "line",
    source: "route-unfinished",
    layout: { "line-cap": "round" },
    paint: {
      "line-width": 2,
      "line-color": COLOR_ROUTE,
      "line-dasharray": [2, 3],
      "line-opacity": ["interpolate", ["linear"], ["line-progress"], 0, 0.8, 1, 0],
    },
  });
}

const FLY_DEBOUNCE_MS = 180;
const SETTLE_MS = 1200;

type MapController = {
  mapRef: RefObject<MapLibreMap | null>;
  state: MapState;
  ready: boolean;
  requestMount: () => void;
  requestLeg: (legId: LegId, countryId?: string) => void;
  selectCountry: (legId: LegId, countryId: string) => void;
  registerTarget: (el: HTMLElement | null) => void;
};

const MapContext = createContext<MapController | null>(null);

export function useMapController(): MapController {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMapController must be used within MapProvider");
  return ctx;
}

export function MapProvider({ children }: { children: ReactNode }) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<MapState>({ kind: "idle" });
  const stateRef = useRef<MapState>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const reducedMotion = useReducedMotion();
  const tier = useMapTier();

  const targetElRef = useRef<HTMLElement | null>(null);
  const latestRequestRef = useRef(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestMount = useCallback(() => setShouldMount(true), []);

  // One instance, mounted lazily so it never delays the hero/LCP — dynamic
  // import keeps maplibre-gl's ~200KB out of the initial bundle entirely.
  // Only Tier 1/2 visitors ever call requestMount at all (Tier 3 renders
  // StaticWorldMap instead, gated in JourneyAtlas) — reducedMotion is still
  // read below purely to pick jumpTo vs flyTo in requestLeg.
  useEffect(() => {
    if (!shouldMount || mapRef.current || !canvasHostRef.current) return;
    let cancelled = false;

    import("maplibre-gl").then(({ Map, setWorkerUrl }) => {
      if (cancelled || !canvasHostRef.current) return;
      // maplibre-gl v6 loads its tile-processing worker as a separate .mjs
      // file (plus a sibling maplibre-gl-shared.mjs it imports), resolved by
      // the library relative to its own package location at runtime. That
      // resolution doesn't survive Next's bundling — the worker silently
      // fails to start, so the map hangs forever just before "load" with
      // tiles fetched but never parsed. Both files are copied into
      // /public (see package.json's postinstall) so the browser can always
      // fetch them directly, independent of the bundler.
      setWorkerUrl("/maplibre-gl-worker.mjs");
      // CLAUDE.md §4.4 Tier 1: capable desktops get the globe. Tier 2
      // (mobile / low memory) stays on the flat projection — this
      // component never mounts at all for Tier 3, which is gated out one
      // level up in JourneyAtlas before maplibre-gl is even imported.
      const map = new Map({
        container: canvasHostRef.current,
        style: MAP_STYLE_URL,
        center: DEFAULT_MAP_CENTER,
        zoom: DEFAULT_MAP_ZOOM,
        pitch: 0,
        attributionControl: false,
        cooperativeGestures: true,
      });
      mapRef.current = map;
      map.once("load", () => {
        if (cancelled) return;
        // setProjection throws until the style has finished loading, so
        // this can't happen right after construction.
        if (tier === 1) map.setProjection({ type: "globe" });
        addRouteLayers(map);
        setReady(true);
      });
    });

    return () => {
      cancelled = true;
    };
    // reducedMotion/tier are read once, at mount time — the mapRef.current
    // guard above means this effect can never actually re-mount the map if
    // either changes later, so it's safe to depend on them here.
  }, [shouldMount, reducedMotion, tier]);

  // The instance belongs to the provider, not to whichever page happened to
  // trigger its creation — only torn down when the provider itself unmounts
  // (i.e. never, short of leaving the whole app), not on route change.
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const registerTarget = useCallback((el: HTMLElement | null) => {
    targetElRef.current = el;
  }, []);

  const requestLeg = useCallback(
    (legId: LegId, countryId?: string) => {
      const requestId = Date.now();
      latestRequestRef.current = requestId;

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);

      debounceTimerRef.current = setTimeout(() => {
        // A newer request landed while this one was debouncing — drop it
        // rather than queue a flight that's already stale.
        if (latestRequestRef.current !== requestId) return;

        const leg = legs.find((candidate) => candidate.id === legId);
        const map = mapRef.current;
        if (!leg || !map) return;

        setState({ kind: "flying", legId });

        if (reducedMotion) {
          map.jumpTo({ center: leg.camera.center, zoom: leg.camera.zoom, pitch: 0, bearing: 0 });
          setState({ kind: "reading", legId, countryId });
          return;
        }

        // stop() cancels whatever flight is already in progress, so a fast
        // scroller never queues flights — only the latest survives.
        map.stop();
        map.flyTo({
          center: leg.camera.center,
          zoom: leg.camera.zoom,
          pitch: leg.camera.pitch,
          bearing: leg.camera.bearing,
          duration: 2200,
          essential: true,
        });

        map.once("moveend", () => {
          if (latestRequestRef.current !== requestId) return;
          setState({ kind: "settling", legId });
          settleTimerRef.current = setTimeout(() => {
            if (latestRequestRef.current !== requestId) return;
            setState({ kind: "reading", legId, countryId });
          }, SETTLE_MS);
        });
      }, FLY_DEBOUNCE_MS);
    },
    [reducedMotion],
  );

  // Clicking a marker inside the leg that's already settled and being read
  // shouldn't trigger a fresh 2.2s flight to the exact spot the visitor is
  // already looking at — just update which country's panel is showing.
  // Anything else (a different leg, or mid-flight) goes through the full
  // requestLeg flow so the camera actually gets there first.
  const selectCountry = useCallback(
    (legId: LegId, countryId: string) => {
      const current = stateRef.current;
      if (current.kind === "reading" && current.legId === legId) {
        setState({ kind: "reading", legId, countryId });
        return;
      }
      requestLeg(legId, countryId);
    },
    [requestLeg],
  );

  return (
    <MapContext.Provider
      value={{ mapRef, state, ready, requestMount, requestLeg, selectCountry, registerTarget }}
    >
      <div
        ref={canvasHostRef}
        data-map-canvas-host
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: shouldMount ? "100%" : 0,
          height: shouldMount ? "100%" : 0,
          visibility: shouldMount ? "visible" : "hidden",
          pointerEvents: "none",
          zIndex: -1,
        }}
        aria-hidden="true"
      />
      {children}
    </MapContext.Provider>
  );
}
