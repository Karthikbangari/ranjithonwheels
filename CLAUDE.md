# Ranjith on Wheels — Master Build Specification (V5)

**Supersedes:** `ranjith-on-wheels-CLAUDE.md` (V1) and `Ranjith_on_Wheels_Premium_Site_Revision_V4.md`.
Where those documents disagree with this one, this one wins. Place at repository root as `CLAUDE.md`.

**Companion file (keep alongside, do not merge):** `Ranjith_on_Wheels_Country_Content_and_Image_Register.md` — the authority for all 23 country introductions, image choices and sources.

---

## 0. Decision log — what changed from V1/V4 and why

Read this first. If the owner disagrees with any decision, change it here before building.

| # | Decision | Reasoning |
|---|---|---|
| 1 | **Dark forest palette is removed entirely.** Daylight only. | V4 called this. V1's `--color-night` system is fully retired — no leftover dark sections except the finale and footer. |
| 2 | **One deep-navy anchor is reinstated for the finale and footer only.** | A site that is bright everywhere has no value structure, so nothing lands. The Follow ending is the primary conversion — it needs to be the darkest screen on the site to carry weight. This is the single exception to the daylight rule. |
| 3 | **D3-geo + topojson replaced by MapLibre GL JS.** | V4 requires a living terrain/vector map with camera flight. D3 draws a flat projected SVG and cannot do this. MapLibre is open-source, supports globe projection, 3D terrain and `flyTo`, and needs no Mapbox billing account. |
| 4 | **23 countries are grouped into 5 legs.** | 23 scroll-triggered camera flights is unwatchable and unscrollable. Five legs give the map five flights, give the story five chapters, and keep all 23 countries individually reachable. This is the single biggest structural improvement. |
| 5 | **The unfinished route becomes the narrative spine.** | The journey is not over. The last segment leaving Bratislava is drawn dashed and runs off the edge of the map. That makes "Follow" the ending the story earns, rather than a CTA bolted on. |
| 6 | **Display typeface changed to Fraunces.** | DM Serif Display is heavily used and has no italic or weight range. Fraunces is variable (optical size, weight, soft axis), has a genuine italic for the emphasis lines the story needs, and reads as editorial rather than default. Instrument Serif is the approved alternate if the owner prefers something lighter. |
| 7 | **The map is one persistent instance, mounted once.** | V4 wants the map present across home, journey and country pages. Remounting a WebGL map per route destroys performance and kills the continuity that is the whole point. |
| 8 | **Scroll position maps to kilometres ridden.** | A thin coral progress line and a counter that climbs toward 48,000 km. The reader's scroll *is* the ride. Cheap to build, and it ties navigation to story. |
| 9 | **Journey archive deferred out of V1.** | V1 scope was too large to finish well. Ship: home film, 23 country pages, support, about, book, contact. Archive comes later. |
| 10 | **QR/VPA mismatch flagged for owner verification.** | The QR resolves to `7020346416@axl` and the typed ID is `7020346416@ybl`. Both may be legitimate handles on the same number, but an unexplained mismatch reads as fraud to a careful donor. See §9.2 — this needs an owner-approved explanatory line before launch. |
| 11 | **MapLibre GL / globe / terrain (decision #3, §4.1) is superseded by a minimal illustrated SVG map.** | After seeing the live MapLibre map (real basemap tiles, bilingual place labels, POI icons), the owner asked for something cleaner instead: flat landmasses, no real place names, a coral route that draws itself in and connects country dots as the visitor scrolls. Built as one `JourneyMap` component (`src/components/map/JourneyMap.tsx`) using d3-geo + topojson, animated via GSAP/ScrollTrigger driving SVG `stroke-dashoffset` — no WebGL, no live tiles, no Mapbox-style degradation tiers, since this same lightweight render works identically for every visitor (reduced motion / narrow viewports just skip straight to the complete state). This replaces §4's MapProvider/tier-1-2-3 architecture and §4.1's technology table wherever they conflict. |
| 12 | **QR/VPA mismatch (decision #10) confirmed a non-issue by the owner.** | `7020346416@axl` (from the QR) is correct; `7020346416@ybl` never matched anything in the codebase and needed no explanatory copy. `/support` continues to show only the QR and `@axl` — see §9.3. |
| 13 | **§3.1 tokens replaced with a richer "Sunset Adventure" palette.** | The owner found the daylight palette washed out and asked for something richer. Paper warmed from grey-white to cream (`#FFF8F0`); route deepened from `#F15B3A` to a burnt-orange `#C83507` and support from `#0F8C78` to a deeper teal `#1C7A6E` — both specifically chosen to pass 4.5:1 as text and as a button background under white text, which the original brighter values did not (verified by computing WCAG contrast ratios directly). `route-glow` (`#FFB703`, golden amber) stays bright since it's decorative-only, never text. Also fixed a pre-existing bug this surfaced: the map's `.sea`/`--sky` and `.mapFrame`/`--sea` token pairings were inverted, so the water fill and the frame's letterbox backdrop were swapped. |
| 14 | **Illustrated SVG route map (decision #11) replaced with a two-image raster reveal.** | Owner supplied two AI-generated world map images (plain blue, and the same map with visited countries pre-highlighted red) and asked for a scroll-triggered blue→red cross-reveal, built as `TravelMap.tsx`. Implemented faithfully, but flagged two real defects found in the supplied images rather than silently shipping around them: (1) the two images use different map projections/scale — verified by diffing the same crop region — so the clip-path wipe visibly ghosts/duplicates labels (e.g. "Greenland" appears twice) mid-transition; (2) the highlighted image colors in "Czechia" (never visited) and appears to fuse Myanmar/Laos into the same red landmass as the real Southeast Asia countries. Both are asset problems, not implementation bugs — the final revealed state and everything else (2s pause, once-only trigger, reduced motion, a11y list, mobile `object-fit: contain`) work correctly. Regenerating the blue map by desaturating the highlighted one (rather than an independent render) would fix the alignment; a real ISO-country-driven map (like decision #11's SVG) would fix both at once. |
| 15 | **§5.2's "banned: looping glow" relaxed for two specific, very subtle instances.** | Owner asked for a richer, more animated, more "premium" feel across the whole site. Added a slow (6-8s) low-opacity breathing glow behind the hero content and around the TravelMap's revealed highlight layer — both purely ambient, both invisible before their section is otherwise visible, neither competing with text. Also added: a gradient + hover sheen sweep to every `ButtonLink` (one shared component, so it reaches every page at once), a small coral accent dot on every `Eyebrow` label (same reach), and hover-zoom on `StoryFeature` images (bringing it in line with `HumanGallery`/`JourneyArchive`, which already had it). Along the way, fixed leftover decimal-RGB color literals from before the Sunset Adventure repaint (decision #13) that a hex-only grep had missed — old route/navy tones baked into `rgba(...)` scrims in the hero, support hero, finale, and country chapter pages. |
| 16 | **"Red Line Across a Blue World" — full V5 rebrand, superseding §3.1 and decision #13.** | Owner-issued revision: deep journey blue (`#0B4EA2`), india-red (`#E6242A`), night-blue finale (`#071C3B`), ivory reading surface (`#FFF9F0`). Red is now scarce by design — the route, visited-country emphasis, and one strong CTA per screen (`ButtonLink`'s new `route` variant) — never the default button color; blue (`--support`) carries navigation, most buttons and the map. Implemented so far: full token swap (plus another decimal-RGB sweep, same lesson as #15 — caught before it shipped this time); hero rebuilt with an ivory glass content panel (max 40% width) replacing the heavy navy photo scrim, owner-supplied headline/subhead, red primary CTA; header now turns blue past the hero (reusing the existing scroll-70%-of-viewport threshold), with its own CTA swapping to an outline variant so it doesn't vanish blue-on-blue; Origin/page 2 rewritten with the owner's verbatim "original inspiration text," split into its own three sentences to match the spec's "three calm blocks" motion note with zero mechanism changes; Support's QR and manual UPI ID are now shown as two explicitly distinct methods (`@axl` via QR, `@ybl` typed) per direct owner instruction, superseding decision #12's "one identifier only" resolution. **Blocked pending owner input:** story #2's "Bhagira" companion-animal detail (owner confirmed it's real but hasn't yet supplied the specifics needed to write it honestly); stories #9-10 (Europe/Slovakia) still have zero manuscript-sourced content, so their copy stays thin and honest rather than invented, per owner's explicit choice when asked. **Ten dedicated, individually-themed story pages:** not yet built, still a large separate effort. |
| 17 | **Page 3 interactive map built, replacing the two-image `TravelMap` (decision #14) entirely.** | A real geographic map, not an illustration or raster reveal — `JourneyMap.tsx` renders every journey country from its actual topojson polygon (the same 110m dataset `CountryTerrainFallback` already used) so the camera can genuinely glide between real shapes, computed as a single pan/zoom transform on one `<g>` rather than re-deriving the projection per move. Countries fill blue-to-red as the visitor reaches them (an ordinal "reached" state tied to which country is focused, not a live feed); a solid red line connects reached countries in route order, a dashed blue line previews the rest; Route/People/Challenge modes surface `kindnessCountrySlugs`/`challengeCountrySlugs` (both restored — deleted as dead code in #14, needed again now) as small gold/deep-red markers. Navigation is click-driven (Next/Previous, or jump to any country from the keyboard-accessible list) rather than scroll-linked, since the brief describes the visitor "choosing" the next country rather than scrolling to it. "Open story" links to that country's existing `/journey/[slug]` chapter page — the ten bespoke story pages the brief separately describes don't exist yet. Caught and fixed during testing, not after: `useReducedMotion` reads `false` during SSR/first paint and flips to the real value post-hydration (the established pattern elsewhere in this codebase), so the mount effect's original `useEffect(() => {...}, [])` only ever ran once with the stale value and never re-fired once reduced-motion was actually detected — camera stuck at world view, panel stuck on India. Fixed by deriving `activeIndex` during render (React's own "adjust state when a prop changes" pattern) rather than inside the effect, which also resolved a `set-state-in-effect` lint error the naive fix first introduced. |
| 18 | **Decision #17's camera-glide/route-line map simplified to match the owner's reference images exactly.** | The owner's two reference images (a plain blue world map and the same map with visited countries pre-filled red) have no connecting line and no zoomed-in camera — just a whole-world view with countries filled solid. Removed the camera pan/zoom transform, the solid/dashed route line, and the edge-riding dot entirely; kept everything else from #17 (real topojson country fills, blue-to-red "reached" progression, Route/People/Challenge modes, click-driven Next/Previous/list navigation, the ivory glass panel, "Open story"). The map now always shows the whole world at a fixed `aspect-ratio` (matching the reference images' proportions) rather than a viewport-height frame sized for a camera that no longer moves. `lib/journeyRoute.ts` (only ever used for the removed route line) deleted as dead code. |
| 19 | **Ten dedicated story pages built (`/stories/[slug]`), each in its own colour world with its own bespoke motion.** | The Pages 4–13 brief was not in the repo or this session's context, so the themes and motifs are my design, built to be easy to swap: one shared `StoryPage` shell, and everything that differs per story lives in `src/content/stories.ts` (theme tokens applied as `--story-*` custom properties, a `motif` key, stats, and short "moments"). The ten are exactly the countries with both a full summary and a page-verified citation (India, Vietnam, Cambodia, Malaysia, Singapore, Indonesia, China, Japan, Taiwan, Mongolia) — a test fails if that set and the story list ever drift. **Content is only a restatement of each country's existing manuscript summary:** `stories.test.ts` fails the build if a story states a number its summary doesn't contain (it caught a "2 days" stat for Vietnam, which the summary spells "Two days"). Motifs: odometer + wheels (India, scroll-scrubbed — the scroll *is* the ride, per #8), stepped rice terraces (Vietnam), lotus-bud towers over a moat (Cambodia), fronds + the three fruits (Malaysia), skyline / waterfall wall / metro line (Singapore), 32-hour ferry clock with "No signal" (Indonesia, scrubbed), ink ridgelines + three steaming bowls (China), drifting petals + a Shinkansen that decelerates to a precise stop (Japan), stacked-tower fireworks + seismograph trace (Taiwan), a lone rider crossing an empty steppe (Mongolia, scrubbed). Every accent is verified ≥4.5:1 as text on its tint, and every page stays daylight (no dark sections) so #1 holds — Taiwan's fireworks sit on pale lavender rather than a night sky for that reason. Every motif *rests* in its finished state in plain SVG/CSS, and its animation only ever runs toward that state, so no-JS and reduced motion show the complete picture. **Bug caught in testing, not after:** the first cut keyed its animation setup on `useReducedMotion()`, which reads `false` on the first client effect and flips later, so reduced-motion visitors were left with hidden start states (moments at opacity 0, counters at "0"). Fixed by reading `matchMedia` directly inside the effects (`prefersReducedMotion()` in `useStoryMotion.ts`), so the first run already has the true value. A `stroke-dashoffset` (ink strokes, seismograph) and a text counter (odometer, ferry clock) are the only non-transform/opacity properties, each with a justifying comment per §5.2. **Still open:** Cambodia, Singapore and China have no cover photograph yet (they show the country terrain map, as on their chapter pages); Sri Lanka, Thailand, Australia, South Korea and the Europe leg have no story page because their manuscript content isn't complete — see the OWNER notes in `journey.ts`. | **Superseded by #20:** the pages now live at `/journey/[country]`, the same bespoke motifs are the chapters' Page 11, and `/stories/[slug]` redirects there. |
| 20 | **Cinematic country chapters (Pages 4–13) built for all 23 countries, replacing the plain chapter pages and the `/stories/[slug]` pages (#19).** | Owner-issued direction, applied as given: blue = journey ahead, red = journey completed, the road line = continuity between countries, topographic lines = terrain, film frames = memories, odometer = distance; keep the strongest photographs still and animate the environment around them; and **don't give every country the same rhythm**. **Structure** — `/journey/[country]` is one chapter per country, in the owner's order: **5** hero (huge name, coordinates, chapter number, opening line) → **6** arrival (route from the previous country: blue underlay, red progress, traveller, ticking coordinates) → **7** road (pinned on desktop: odometer, wheels, place markers) → **8** challenge → **9** discovery → **10** people (film frames) → **11** signature moment (the bespoke motifs from #19) → **12** leaving (this country's outline turns blue→red; the next road draws out ahead) → **13** transition (name fades behind, next coordinates, road line continues, and the button *hands off* through a veil in the next country's colours instead of a hard cut). **Page 4** is the chapter gateway on `/journey`: a full-screen dark world map where the whole road is first blue, then turns red country by country behind a wave, with 23 keyboard-reachable marker links and the dashed blue road leaving Slovakia. **Nothing is invented; pages come from data.** A page renders only if `stories.ts` has a moment tagged with its beat (`arrival/road/challenge/discovery/people/signature`); the always-present pages (hero, arrival route, leaving, transition) use only coordinates, order and the sourced sea crossing. So Sri Lanka, Thailand, Australia, South Korea and the nine Europe countries — no manuscript yet — build exactly four pages and stop, with no placeholder text (a test asserts this); adding a story later rebuilds its chapter with no animation work. South Korea's existing long summary stays as plain "story so far" notes. **Each country has its own atmosphere** (`atmospheres.ts`, all 23 defined up front): its own colour world, its own seeded topographic terrain (marching-squares contours: dense altitude rings for China, stacked terraces for Vietnam, tight alpine relief for Switzerland/Austria, near-empty negative space for Australia, long flat steppe for Mongolia, a precise lattice with range rings for Singapore), and its own ambient effect (warm dust, mist, night-city light streaks, petals) — all scroll-linked, never a loop. The hero uses the country's photograph when one exists on disk and its terrain map otherwise, from the *same layout*: Cambodia, Singapore and China (no photograph yet) get the terrain hero with the real outline, the road arriving in red and leaving in blue, and topographic drift, and dropping a file at the country's `coverImage` path swaps the background with no code change. **Deviations from earlier decisions, all on the owner's direction:** the gateway map, every hero, the challenge page and the Singapore/South Korea night treatment are dark (supersedes #1's "daylight only" for those); a route line is drawn again on the gateway, arrival, leaving and hero pages (#18 removed it from the Page 3 map and that map is unchanged); the gateway sequences its markers country by country rather than staggering ≤5 items, because it follows the road it describes; `--blue-lit` (`#5aa2ff`) is the road-ahead blue on dark grounds. **Honest limits:** Page 8 exists only for Indonesia (volcanic risk) and Taiwan (earthquake-prone) — conditions the summaries state, not narrated incidents, so the weather (embers / tremor) claims nothing more; there are no dates anywhere (arrival dates are an `// OWNER:` in `ChapterArrival.tsx`); routes are drawn between display anchors and captioned "indicative"; only the Singapore→Indonesia crossing is marked as sea (it is the one the manuscript states); Page 10's film frames hold the country outline until real photographs are added to a country's `gallery`; Page 11 is an illustration per memory, not the photograph. **Caught in testing, not after:** the road panel jumped left when pinned (GSAP pinning drops `margin: auto` — pin a full-width wrapper); wheels and petals orbited the SVG origin mid-scroll (only correct at the end of a whole turn — set an explicit `transformOrigin`); Australia's sunset hero gave ivory type 2.8:1 (a contrast test now covers every hero gradient); the challenge art was cropped out of its short section; hover labels on the gateway were covered by neighbouring markers (labels moved to a top layer). | **Refined by #21** (the "challenge" page is now the *environment* page, the dark sections gained layered depth, transitions and the journey rail were added, and content status / media / dates / Bhagira / social links became explicit data).
| 21 | **Owner refinements to the chapters — do not reverse these.** Dark/night, route, environment, film frames, signature, dates, transitions, content status, Bhagira, social links, media, performance, and the "one continuous expedition" rule. | **Dark and night sections** stay dark (gateway, Singapore, South Korea) but are never a plain black screen: very dark *charcoal* (`#0e141d`→`#0a0f18` gateway; `#0b1116`/`#0c0d15` night heroes), a faint terrain texture, a pool of atmospheric light, a blue route glow (a wide faint underlay stroke — never a blur filter), restrained red for the completed route, and a static film grain (`Grain.tsx`, one tiled SVG image). Singapore is modern, precise, controlled: architectural grid, range rings, a skyline with its own waterline **reflection**, distant city lights. South Korea is cinematic night driving: a perspective highway, lane marks, city lights, red/white light trails kept to the right of the type; a daytime photograph is taken down to dusk rather than overlaid. **Page 3 (`JourneyMap`) is not touched.** **Route:** BLUE = road ahead / active journey, RED = travelled / completed memory, and the change is *progressive with scroll*: the gateway's blue road turns red country by country as the visitor scrolls (scrubbed, reversible; the km counter follows), the arrival road draws red under the traveller, the leaving map fades this country blue→red. The next blue road is already on screen when a chapter opens (glowing dotted line leaving the hero from the first frame; a blue stub on the interlude and transition). **Environment page (was "challenge"):** hazards are *geography, never events*. Beat renamed `environment`; the tag reads "Regional terrain" (Indonesia: volcanic geography, ambient embers) or "Natural environment" (Taiwan: seismic terrain, seismograph) — never anything like danger encountered; a test forbids eruption/felt/struck/escaped wording. No earthquake or eruption is implied to have been experienced unless a manuscript later confirms it. **Film frames (Page 10):** a frame with no photograph is a deliberate stand-in — the country outline in warm print tones, the location name, the route coordinates and "Memory 01" (the frame number; the owner's "memory slot", worded so it never reads as a task label) — and the moment `gallery` has a photograph for that frame the frame swaps to it by itself; the page also appears for a country whose only memories are gallery photographs. **Signature (Page 11):** illustrations stay, labelled "Visual interpretation"; a real photograph (`signatureImage`) takes the same stage with the same entrance and the label "Photograph" (+ credit). **Dates:** `arrivalDate`/`departureDate` are optional on every country and shown exactly as supplied; the arrival row is LOCATION · COORDINATES · DATE, and with no date it is LOCATION · COORDINATES — no empty slot, no separator (`arrivalRows()`, tested). No date is invented; none exists yet. **Indicative routes:** every route is captioned only by a small "Indicative route" tag inside the map, not a paragraph; only Singapore→Indonesia is identified as a sea crossing (dashed, "SEA CROSSING") — no other crossing is called ferry/air/land without evidence. **Counters and timelines** are correct from any arrival (reload half way, back/forward, anchor jump, resize/orientation, a fling, opening directly on a route): ScrollTrigger applies an already-scrolled position with tween callbacks *suppressed*, so counter text is also written from `onRefresh`/`onUpdate` (`withSync`), and 16 e2e scenarios on Chromium and mobile-safari pin it. **Country differentiation:** on top of #20's colour, terrain and effect, every country now has an *environment scene* (`scenes` in `atmospheres.ts`, drawn by `lib/silhouette.ts`): Cambodia stepped temple towers and warm dust; Singapore skyline and reflected lights; Indonesia volcano cones; Taiwan a mountain range over a dense city; China three vast layered massifs; South Korea a highway; Australia a lone road to an empty horizon; Sri Lanka coast; and Europe country by country (Switzerland ragged alpine peaks, Austria peaks and spires, Germany pines, Italy hills and cypress, Slovenia lakes, Croatia coast, Hungary plains, France rolling hills, Slovakia Carpathian ridges) — never one Europe theme. Motion differs too: long flat scenes and light trails drift *sideways* (`data-axis="x"`), mountains and buildings rise. **Transitions (a major priority):** the hand-off (`TransitionLink`) plays as one move in the next country's colours — the red road exits the frame → the next blue road appears → the coordinates tick from here to there → the next country's terrain morphs in → its chapter line, name and coordinates enter *exactly where the next hero's will be* — and the hero, seeing the veil, does not replay its type, so the name simply stays and the veil lifts. A sourced sea crossing turns the road into a dashed navigation line (in the veil, the hero and the transition page); nothing is claimed as a confirmed land crossing, so land transitions keep the road visually continuous. **The journey rail** (`ChapterRail`, fixed to the bottom of every chapter) always shows where we came from, where we are and where we go next — names, chapter number, coordinates, 23 ticks (red ridden, blue ahead, current ringed) and this chapter's scroll progress; it steps aside at the very end of a page. **Content status:** every story has `contentStatus: "pending" | "draft" | "verified"`; only `verified` copy is ever public (drafts render only in a preview build with `NEXT_PUBLIC_SHOW_DRAFTS=1`); a country with no story is `pending`. A pending chapter shows a *wordless atmospheric interlude* (its landscape, the red road running through it, chapter number and coordinates) instead of any developer placeholder — no copy, so nothing to invent and nothing to remove later. **Bhagira** is a dedicated unresolved item (`content/bhagira.ts`, `ChapterBhagira.tsx`): who/what, relationship, story, dates, location and importance are **not guessed anywhere**; the entry is `null`, the slot renders nothing, and one verified object naming a country adds a film-frame section to that chapter with no restructuring. **Social links:** `socialConfig = { instagramUrl: "", youtubeUrl: "" }`; a profile is listed only with a real https URL, an empty one hides the button everywhere, never a guessed profile. **Media object:** `coverImage`, `heroImage?`, `gallery[]`, `signatureImage?`, `videoUrl?` per country, read only through `lib/media.ts` (which ignores any path with no file on disk) — components never hard-code an image path, and replacing Cambodia/Singapore/China's terrain covers is one data change. **Performance:** one ScrollTrigger and one timeline per particle group instead of one per particle (a chapter holds 14–21 triggers, not ~60); particles CSS-hidden on a phone are neither painted nor animated (half of every layer is dropped); no blur filters (glows are wide faint strokes; the grain is a static image); media lazy-loads via `next/image`; the journey rail updates one CSS variable from a passive rAF-throttled scroll listener; **no Three.js / WebGL**; a test navigates between chapters and asserts ScrollTriggers do not accumulate (`window.__rowMotion.triggers()`). **Experience rule:** the site is one continuous expedition, not 23 web pages — the visitor always knows where we came from, where we are, where we go next, through route continuity, chapter numbers, coordinates and the rail. **Caught in testing:** hover labels on the gateway; the odometer/ferry clock stuck at 0 when arriving already scrolled (#20); a `publicStory` self-recursion from a blind find-and-replace; peaks that read as triangles and temples that read as pines (both redrawn after looking at them); the seismograph running through Taiwan's paragraph. |

---

## 1. Project truth

Single editable source at `src/content/site.ts`. Never hard-code any of this in a component.

```ts
export const site = {
  name: "Ranjith on Wheels",
  traveller: "Ranjith Kumar Dagara",
  message: "Solution to Pollution",
  distanceKm: 48000,          // "48,000+"
  countryCount: 23,
  latestCountry: "Slovakia",
  latestCity: "Bratislava",
  years: 4,                   // "4+"
  book: "The Indian Cyclist — A Journey for Generations",
} as const;
```

### Never-invent rules

These are hard constraints, not style preferences.

- No invented dates, kilometre splits, elevation figures, road names, weather events or environmental-impact numbers.
- No invented names of people who helped, and no identifiable person named without written permission.
- Country coordinates are **display anchors**, not the cycling track. The route line must be explicitly described as indicative until GPX arrives.
- No sentence, chapter title, subtitle or quote copied from the book, vlogs, captions or articles. Sources are research only. All website copy is newly written.
- No social API. Follower counts and latest location are manually edited in `site.ts`.
- No charity, tax-deductibility, funding-target or progress claims.
- Where a fact is missing, write `// OWNER: <question>` in source and render the section without it. Never fill the gap with invention.

---

## 2. Narrative spine

One sentence the whole site must serve:

> A promise made at home became a ride; the ride crossed twenty-three borders on the strength of strangers; it has not finished, and where it goes next depends on who is watching.

### 2.1 The five legs

| Leg | Name | Countries | Map camera |
|---|---|---|---|
| I | The first roads | India, Sri Lanka | Starts over India, low zoom, tilted |
| II | Across Southeast Asia | Vietnam, Cambodia, Thailand, Malaysia, Singapore, Indonesia | Sweeps south-east, ferry crossing to Indonesia |
| III | The eastern arc | China, Japan, South Korea, Taiwan, Mongolia | Climbs north, widest camera move of the site |
| IV | The far horizon | Australia | Long single flight south — the emptiest screen, deliberately |
| V | Europe, border by border | France, Switzerland, Germany, Austria, Italy, Slovenia, Croatia, Hungary, Slovakia | Tight zoom, borders crossing quickly, ends at Bratislava |

Leg IV is one country and gets a full screen anyway. Australia was the original goal and took two visa refusals to reach — giving it the same weight as six countries is the point.

After Leg V the route does not stop cleanly. It leaves Bratislava as a **dashed line running off the edge of the frame**, unlabelled. That dashed segment is the transition into the Follow finale.

### 2.2 Six-beat rhythm (retained from V1)

Every featured story and every leg panel follows: **Place → Desire → Tension → Human turn → Meaning → Forward motion.** Cut any section that only restates a statistic.

### 2.3 Copy rules

- Third person by default. First person only on lines the owner has explicitly approved, held in `src/content/approved-voice.ts`.
- 45–60 characters per line. Two to four sentences per panel. The map and photograph carry the rest.
- Figures establish scale; specific moments create connection. Prefer the specific.
- Every country panel ends with a link to the original video or post, labelled with what it is (`VLOG-68 · Bratislava`), not "read more".

---

## 3. Visual system

### 3.1 Tokens

Superseded by decision #13 ("Sunset Adventure" palette) — the live values are in `src/app/globals.css`, reproduced here so this table stays a working reference rather than drifting from the code:

```css
:root {
  /* surfaces */
  --paper:        #FFF8F0;
  --white:        #FFFFFF;
  --navy:         #14213D;   /* finale + footer ONLY */

  /* type */
  --ink:          #1B1B1F;
  --ink-soft:     #5C5552;
  --ink-inverse:  #FBF0E4;

  /* map */
  --sky:          #D6EEF0;   /* pale backdrop behind the map frame */
  --sea:          #1D8FA6;   /* the actual water fill */
  --land:         #C7B682;

  /* accents — route/support are deliberately darker than a "vivid" first
     pass would suggest: both must pass 4.5:1 as text color AND as a button
     background under white text (verified against WCAG, not eyeballed). */
  --route:        #C83507;   /* the route line, and nothing else structural */
  --route-glow:   #FFB703;   /* decorative only (never text) — stays bright */
  --support:      #1C7A6E;   /* follow + support actions only */

  /* structure */
  --line:         rgba(27, 27, 31, 0.14);
  --glass:        rgba(255, 255, 255, 0.82);
  --glass-stroke: rgba(255, 255, 255, 0.55);
  --shadow-soft:  0 12px 40px rgba(27, 27, 31, 0.12);

  --header-height: 72px;
  --gutter: clamp(20px, 5vw, 88px);
  --radius-media: 20px;
  --radius-control: 16px;
}
```

**Value-structure rule.** Every screen must contain all three of: a near-white surface, a photographic mid-tone, and one ink-dark element (type, a marker, or the navy finale). A screen made only of pastels reads as washed out no matter how good the photography is. Check every section against this.

**Accent discipline.** Coral is the route and active state. Teal is follow and support. Gold is a map highlight at small sizes only. Three accents is the ceiling — do not introduce a fourth for "variety".

### 3.2 Typography

| Role | Face | Setting |
|---|---|---|
| Display | **Fraunces** variable (`opsz`, `wght`, `SOFT`) | `opsz 96`, `wght 420`, `-0.02em`, line-height `0.98` |
| Emphasis line | Fraunces *italic* | One line per section maximum |
| UI / body | **Manrope** variable | `wght 400/500/600`, line-height `1.65` |
| Data | **Geist Mono** | 11–12px, `0.14em` tracking — distances, coordinates, vlog numbers, dates only |

Alternate display if the owner prefers lighter: Instrument Serif. Do not use both.

```
display-xl   clamp(46px, 8.5vw, 132px)   /* hero, finale */
display-l    clamp(34px, 5vw, 76px)      /* act openers */
h2           clamp(26px, 3.4vw, 46px)
h3           21px
lede         clamp(17px, 1.9vw, 22px)
body         17px
caption      14px
data         11.5px
```

Load both with `next/font` and self-host. Mono is reserved for real measurements — never as decorative small caps.

### 3.3 Photography

- Real, bright, editorial. Natural correction, optional light grain, one soft shadow (`--shadow-soft`).
- **No site-wide dark overlay.** Where text sits on an image, use a localised gradient scrim behind that text block only, and verify 4.5:1.
- `next/image` throughout, explicit `sizes`, fixed aspect ratios, blur placeholders, meaningful `alt` describing the scene rather than "photo of Ranjith".
- Crops: hero 3:2, mobile 4:5, country cards 3:2. Never crop through a face or cut the bicycle in half.
- **Exception: the support QR is never processed.** See §9.

### 3.4 Layout

- Container `1280px`, gutter `--gutter`. Media breaks full bleed; type never does.
- One visual focus per screen. If a section has two competing focal points, split it.
- Generous vertical rhythm: `clamp(96px, 12vh, 180px)` between acts.
- Story panels over the map are glass: `--glass` background, `backdrop-filter: blur(20px)`, `--glass-stroke` 1px border, `--shadow-soft`. Max width `520px`, left-anchored on desktop, bottom sheet on mobile.

---

## 4. The living map

### 4.1 Technology

```
maplibre-gl  ^5          — globe projection, terrain, flyTo
pmtiles or a hosted style — basemap
```

Basemap: a light outdoor/terrain style with minimal labels. Use **MapTiler Outdoor** if the owner provides a key (better relief shading), otherwise **OpenFreeMap Liberty** with a custom light paint override — no key required. Put the choice behind `NEXT_PUBLIC_MAP_STYLE_URL` so it can be swapped without a code change.

Water `--sea`, land `--land`, minimal labels at 60% opacity, no POIs, no road labels below zoom 6. 3D terrain via `setTerrain` with `exaggeration: 1.3` on desktop only.

### 4.2 Architecture — one instance, many consumers

The map is mounted **once**, in the root layout, inside a `<MapProvider>`. It persists across route changes. Sections do not animate the map; they *request states* from a single controller.

```ts
type MapState =
  | { kind: "idle" }
  | { kind: "flying";   legId: LegId }
  | { kind: "settling"; legId: LegId }
  | { kind: "reading";  legId: LegId; countryId?: CountryId };
```

Rules:
- Story text swaps **only** in `reading`. Never during `flying`. This is what V4 meant by the 1.2s settle.
- Fast scrolling must not queue flights. Debounce leg requests by 180ms and fly only to the *latest* requested leg, cancelling any in-flight camera move.
- Route / Kindness / Challenge modes change the marker layer and panel content. They **never** reset the camera.

### 4.3 Route rendering

- One GeoJSON `LineString` through the 23 country anchors, smoothed with a Catmull-Rom resample so it curves rather than zig-zags.
- `lineMetrics: true` + `line-gradient` — coral core, `--route-glow` at the leading edge.
- Progressive draw driven by scroll: `line-gradient` stop position is the completion fraction.
- **The unfinished segment:** after Bratislava, one dashed segment running to the frame edge, `line-dasharray: [2, 3]`, opacity fading to 0. It is never labelled and never completes.
- A small bicycle dot moves **only** during `flying`. It is stationary while the visitor reads.
- Ocean sections (India→Sri Lanka, Malaysia→Indonesia, →Australia) render dashed and are labelled `SEA CROSSING` in mono. Do not draw a solid cycling line across water.

### 4.4 Degradation tiers

| Tier | Trigger | Behaviour |
|---|---|---|
| 1 | Desktop, WebGL, `deviceMemory ≥ 4` | Globe, terrain, tilt, full camera flight |
| 2 | Mobile or low memory | Flat projection, no terrain, `pitch: 0`, tap-driven country changes, no pinned scroll |
| 3 | No WebGL, `prefers-reduced-motion`, or `Save-Data` | Pre-rendered static map image per leg (generated at build), route as an SVG overlay, complete and readable immediately |

Tier 3 must look deliberate. Generate the static images at build time with a headless render and commit them — do not ship a grey box.

---

## 5. Motion system

### 5.1 Authority

**One orchestrator owns scroll.** `src/motion/orchestrator.ts` holds every `ScrollTrigger` and is the only thing that talks to the map controller. Components declare what they need via a hook; they never create their own scroll-linked map animation. Use `useGSAP()` with scoped refs and clean up on unmount without exception.

### 5.2 Tokens

```ts
export const ease = {
  travel: "power2.inOut",             // camera, route draw
  reveal: "expo.out",                 // content entrances
  ui:     "power2.out",               // hover, controls
};
export const dur = {
  micro: 0.18, ui: 0.32, reveal: 0.8, travel: 2.2, settle: 1.2,
};
```

Rules:
- `transform` and `opacity` only. Anything else requires a justifying comment.
- All entrances are directional: left-to-right or bottom-to-top, matching the route. No entrances from the right, and no scale-in-from-centre.
- One reveal per viewport. Stagger capped at 5 items, 60ms apart.
- Trigger-once motion never replays. Scroll-linked motion is always reversible.
- Banned: looping glow, typewriter, spinning wheel loaders, bounce/elastic easing, parallax on text.

### 5.3 Signature transition — the wheel becomes the world

The opening move, and the thing the site is remembered for.

1. Hero holds a real photograph with the bicycle's front wheel prominent.
2. An SVG circle traces the rim in coral over 1.1s (`ease.reveal`).
3. On first scroll, that circle scales up and the photograph crossfades away while the MapLibre globe fades in **centred on India with the globe's limb aligned to where the circle was**. The circle is the globe.
4. The route's first coral segment leaves the wheel's contact point.

Build this as a dedicated component with its own reduced-motion branch (photo → map, straight crossfade, no trace).

### 5.4 Choreography per act

| Act | Motion |
|---|---|
| 1 Hero | Wheel trace → globe morph. Distance counter climbs 0 → 48,000 once, on entry only. |
| 2 Origin | Map recedes to 30% opacity behind a paper panel. Type reveals line by line via mask wipe, not fade. |
| 3 Journey | Five pinned legs on desktop. Each: fly (2.2s) → settle (1.2s) → panel swaps → hold. Mobile: tap-driven, no pin. |
| 4 Stories | Selected country marker expands into the story photograph while the map dims to 20%. |
| 5 Book | Map hidden. Full paper section. The route reappears between the book spread and exits below. |
| 6 Support | Route arrives at the support card and stops. Card fades up. **The QR itself never animates.** |
| 7 Finale | Navy. Route resumes as the dashed unfinished segment and runs off the top edge toward the Follow buttons. |

### 5.5 Reduced motion

`prefers-reduced-motion: reduce` disables: the loader, all ScrollTrigger scrubbing, every camera flight, the counter, the route draw, the wheel morph. The map renders Tier 3 static with all 23 markers and the complete route. Every panel shows its final content. **Nothing is hidden behind an animation that no longer runs** — test by forcing the flag on and reading the whole page.

---

## 6. Page architecture

### Home — seven acts

```
1  HERO            paper + photo    wheel → globe, distance counter, one CTA
2  ORIGIN          paper            the promise; map at 30% behind
3  JOURNEY         map              5 pinned legs, glass panel, 3 modes
4  STORIES         paper + photo    3 featured moments, six-beat each
5  BOOK            paper            cover, one honest paragraph, buy link
6  SUPPORT         white            QR + UPI side by side (§9)
7  FOLLOW          navy             YouTube + Instagram, unfinished route
```

Support is the **second-last** section. Follow is last. Do not reorder.

### Routes

| Route | Ship in V1 | Notes |
|---|---|---|
| `/` | Yes | The seven acts |
| `/journey/[country]` | Yes — all 23 | Never empty (§8) |
| `/support` | Yes | Full destination, §9 |
| `/about`, `/book`, `/contact` | Yes | Concise |
| `/donate` | Yes | Permanent redirect to `/support` |
| `/journey` archive | Defer | V2 |

---

## 7. Content model

```
src/content/
  site.ts                 site-wide facts
  legs.ts                 5 legs: id, name, countryIds, camera {center,zoom,pitch,bearing}
  countries.ts            23 entries (below)
  stories.ts              3 featured, six-beat fields
  approved-voice.ts       owner-approved first-person lines only
  support.ts              UPI config + disclosure copy
```

```ts
type Country = {
  id: string;            // "slovakia"
  order: number;         // 1..23
  name: string;
  legId: LegId;
  anchor: [number, number];      // display anchor, NOT the track
  intro: string;                 // from the Image Register, verbatim
  image: { src: string; alt: string; credit: string } | null;
  source: { label: string; url: string; accessed: string };
  mode: ("route" | "kindness" | "challenge")[];
};
```

Country `intro` strings come from `Ranjith_on_Wheels_Country_Content_and_Image_Register.md` and are used exactly as written there. Do not paraphrase or extend them.

A test must assert: 23 entries, `order` 1–23 with no gaps, matching the canonical list, every entry has a non-empty `intro` and a `source.url`.

---

## 8. Country pages — no empty states

Every country page and map panel ships complete. A visitor must never see "photograph pending", an empty card, a blank image frame or an internal task label.

**Image resolution order:**
1. Approved book photograph (countries 1–14).
2. Selected frame or official thumbnail from Ranjith's own reel/vlog (countries 15–23).
3. **Fallback treatment:** a large, styled light terrain map of that country rendered at the same aspect ratio as a photograph, with the country outline in coral and its marker placed. Full-bleed, with the completed intro copy over it.

Tier 3 is a designed state, not a placeholder. It should look like an editorial cartography choice. Build it first so no page is ever broken.

Credits live in a collapsible drawer at the foot of the page: book page range, or post/video URL plus date accessed. Never in the headline.

---

## 9. Support

### 9.1 Layout

`/support` and the home support act share one component. Left: a real travel photograph and three sentences of original copy about keeping the ride going. Right: both payment methods, visible simultaneously, no gate, no "learn how support is used" interstitial.

Above the two methods: **"Choose the option that works in your UPI app."**

| Method | Display | Behaviour |
|---|---|---|
| Scan and pay | The supplied PhonePe JPEG, **unmodified** | Expand to lightbox, download original |
| Pay with UPI ID | `7020346416@ybl`, large, selectable | Copy button with confirmation; optional `upi://` deep link on mobile only |

### 9.2 QR integrity — technical requirements

These prevent a QR that scans wrong or not at all:

- Render with a plain `<img>`, **not** `next/image`, **not** a CSS background. No blur placeholder, no optimisation pass, no format conversion, no responsive resizing below native resolution.
- No CSS `filter`, `opacity < 1`, `border-radius`, `transform`, `mix-blend-mode` or overlay of any kind on the QR element.
- Minimum rendered width 240px, on pure `--white`, with at least 16px of white quiet zone on all four sides.
- The QR never animates. The card around it may fade in; the QR may not.
- Explicit `width`/`height` attributes to prevent layout shift.

### 9.3 QR/VPA pair — resolved

The QR resolves to `7020346416@axl`; the typed identifier `7020346416@ybl` referenced elsewhere in this spec never matched anything in the codebase. **Owner confirmed this is a non-issue** (see §0 decision #12): `@axl` is correct and the only identifier the site shows. No second, unverified ID has been added.

### 9.4 Prohibited

No supporter counter, funding goal, progress bar, scanning animation, fake success message, charity or tax-deductibility claim, or statement about exactly how funds are used unless the owner supplies verified wording. The site never collects or stores card or bank details.

---

## 10. Accessibility

- [ ] 4.5:1 body contrast everywhere, including glass panels over map and text over photography
- [ ] Glass panels tested over both dark terrain and bright sea — if either fails, raise `--glass` opacity rather than darkening the type
- [ ] Every country reachable by keyboard: the map has a parallel visually-ordered list of 23 links, not a canvas-only interaction
- [ ] Map canvas `aria-hidden`; the journey's meaning lives in the panels
- [ ] Route/Kindness/Challenge are real radio inputs with `aria-checked`
- [ ] Visible focus ring: 2px `--route`, 3px offset
- [ ] Sequential heading order, one `h1` per route
- [ ] Reduced motion pass: all content present, nothing hidden
- [ ] JS disabled: copy, images, country links and the UPI ID all render
- [ ] `alt` text describes the scene, never "image" or "photo"

---

## 11. Performance budget

| Metric | Target |
|---|---|
| LCP (mobile 4G) | < 2.2s — the hero photograph, not the map |
| CLS | < 0.05 |
| Initial JS (gzip) | < 210 KB |
| MapLibre | Dynamically imported, mounts when Act 2 is within one viewport |
| Country image | ≤ 260 KB AVIF, WebP fallback |
| Map frame rate | 60fps desktop, ≥ 30fps mobile during flight |

The hero must be fully readable and photographic before any map JavaScript is parsed. The map is an enhancement to the story, never a prerequisite for it.

---

## 12. Implementation phases

Every phase ends runnable, lint-clean, type-clean, with a production build passing. Do not begin a phase with errors outstanding in the previous one.

**Phase 0 — Audit.** Inspect the repo. Report stack, structure, conflicts with this file, and the exact Phase 1 file list. Change nothing.

**Phase 1 — Foundation.** Next.js App Router + TS. Tokens, fonts, layout shells, header, footer, metadata. All content files with real copy from the Image Register. Tests for the 23-country invariant. *Reviewable: static site, correct type and spacing, no motion, no map.*

**Phase 2 — Country system.** All 23 country pages and the Tier 3 terrain-map fallback treatment. Build the fallback before any real imagery so no page is ever empty. *Reviewable: 23 complete pages.*

**Phase 3 — Hero and origin.** Photographic hero, wheel-trace, distance counter, origin act. Reduced motion implemented in the same commit, not later. *Reviewable: Acts 1–2.*

**Phase 4 — Map.** MapLibre provider, persistent instance, state machine, route geometry with sea crossings and the unfinished segment, five legs, three modes, keyboard list, all three degradation tiers. *Reviewable: Act 3 on desktop and mobile.*

**Phase 5 — Wheel-to-globe.** The signature transition joining Acts 1 and 3. Built last of the motion work because it depends on both sides existing. *Reviewable: the opening, end to end.*

**Phase 6 — Stories, book, support, finale.** Three featured stories, book act, support (QR rules in §9 are non-negotiable), navy finale with the unfinished route. *Reviewable: the full home film.*

**Phase 7 — Secondary routes and quality.** About, book, contact, `/donate` redirect, metadata, OG images, sitemap. Then: 320/375/768/1024/1440/1920 responsive pass, keyboard pass, reduced-motion pass, axe, Lighthouse, Playwright smoke tests.

---

## 13. Acceptance criteria

- [ ] Reads as a bright travel film, not a template — no dark theme remnants outside finale and footer
- [ ] One coral route visually connects hero → map → support → finale
- [ ] The wheel-to-globe transition works, and degrades to a clean crossfade
- [ ] 23 countries, correct order, every one with completed copy, a visible image treatment and a linked source
- [ ] No visitor-facing placeholder, empty panel or task label anywhere
- [ ] Desktop tells the journey in five legs; mobile reaches every leg without a long pinned scroll
- [ ] Route/Kindness/Challenge change markers and panel without resetting the camera
- [ ] Text never swaps while the camera is flying
- [ ] Sea crossings are dashed and labelled, never drawn as cycling
- [ ] The route after Bratislava is dashed, unfinished, and leads into Follow
- [ ] Support sits immediately before Follow; both methods visible at once; QR unmodified and unanimated
- [ ] No supporter counter, progress bar, charity or tax claim
- [ ] All changing figures editable in `site.ts`
- [ ] No social API
- [ ] Reduced motion shows everything
- [ ] No copied sentence from book, vlog or article anywhere in the site
- [ ] `npm run build`, lint, unit tests and Playwright pass

---

## 14. Working rules for Claude Code

1. Read this file completely before changing anything.
2. Audit before choosing tools. Preserve unrelated files.
3. One phase at a time, small reviewable commits.
4. Semantic HTML and progressive enhancement. The story must survive JS failure.
5. Content stays in `src/content/`, never inside components.
6. Never invent a travel fact. Mark gaps `// OWNER: <question>` and report them.
7. `useGSAP()` with scoped refs; clean up every animation and every MapLibre listener.
8. Reduced motion and mobile are tested inside each phase, not at the end.
9. After each phase: format, lint, test, production build. Report what changed, what was verified, what owner assets are still missing.
10. Never commit payment secrets or unapproved checkout URLs. Never present an unverified provider return as a successful payment.
11. If an instruction here conflicts with your default approach, follow this file and flag the conflict in your report.

---

## 15. Missing content tracker

These are the things the site is waiting on. **None of them blocks development** — every one is a gap the site already handles gracefully, and filling one is a data change, never a rebuild. Run `npm run content:status` to print this list derived from the data itself (`src/lib/missing.ts`), so it cannot drift from reality.

**MEDIA REQUIRED** — the terrain cover is intentional until then; to replace it, drop the file at the country's `coverImage` path in `public/media/journey/<slug>/` (or set `heroImage` in `journey.ts`) and rebuild.
- [ ] Cambodia cover / hero
- [ ] Singapore cover / hero
- [ ] China cover / hero
- Also optional per country: `gallery[]` (each photograph becomes a Page 10 film frame), `signatureImage` (replaces the Page 11 illustration), `videoUrl` (linked from the signature page).

**CONTENT REQUIRED** — each is a story entry in `src/content/stories.ts` (`contentStatus: "verified"` only once checked against the manuscript); until then the chapter shows its wordless atmospheric interlude.
- [ ] Sri Lanka manuscript
- [ ] Thailand manuscript
- [ ] Australia manuscript
- [ ] South Korea manuscript
- [ ] Remaining Europe manuscripts (France, Switzerland, Germany, Austria, Italy, Slovenia, Croatia, Hungary, Slovakia)
- [ ] Bhagira details (`src/content/bhagira.ts`) — who/what, relationship, story, dates, location, importance, photograph. None guessed.

**LINKS REQUIRED** — `socialConfig` in `src/content/socials.ts`; empty means the button is hidden everywhere.
- [ ] Official YouTube URL (`youtubeUrl`)
- [ ] Official Instagram URL (`instagramUrl`)

**OPTIONAL, WHEN VERIFIED** — never estimated: crossing dates (`arrivalDate` / `departureDate`), and whether any crossing besides Singapore→Indonesia was by sea, air or land (`seaCrossings` in `chapters.ts`).


---

## Appendix A — Master kickoff prompt

Save this file as `CLAUDE.md` at the repository root alongside `Ranjith_on_Wheels_Country_Content_and_Image_Register.md`, then paste:

```text
Read CLAUDE.md completely, then read Ranjith_on_Wheels_Country_Content_and_Image_Register.md.

Before writing any code, give me:

1. Confirmation you understand §0 (Decision log), §2 (Narrative spine), §5 (Motion
   system) and §9 (Support) — five lines each, in your own words.
2. An audit of the current repository: stack, structure, package manager, existing
   work that must be preserved.
3. Every conflict between the repository and this specification.
4. The exact file list you will create or modify for Phase 1.
5. Blockers for Phase 1, separated into real blockers and items that can proceed
   with the designed fallback treatments described in §8.

Then execute Phase 1 only. Stop at the end of Phase 1 and wait for review.

Constraints for Phase 1:
- Next.js App Router, TypeScript, CSS Modules, self-hosted fonts via next/font
- Tokens from §3.1 as CSS custom properties in app/globals.css — not Tailwind config
- No map, no GSAP, no motion of any kind in this phase
- All 23 country entries populated with the exact intro copy from the Image Register
- A passing test asserting the 23-country invariant described in §7
- Run lint, typecheck, unit tests and a production build before reporting

If anything in CLAUDE.md conflicts with how you would normally build this, follow
CLAUDE.md and list the conflict in your report.
```

## Appendix B — Later phase prompts

**Phase 4 (the map) — the one most likely to go wrong:**

```text
Continue with Phase 4 from CLAUDE.md: the living map.

Build in this order and show me each before moving on:
1. MapProvider with a single persistent MapLibre instance in the root layout,
   dynamically imported, mounting when Act 2 is within one viewport.
2. The MapState machine from §4.2. Prove that text swaps only in "reading" and
   that rapid scrolling cancels in-flight camera moves rather than queueing them.
3. Route geometry: smoothed line through the 23 anchors, dashed sea crossings with
   SEA CROSSING labels, and the unfinished dashed segment after Bratislava.
4. Five legs with the camera parameters from legs.ts, three marker modes that do
   not reset the camera, and the parallel keyboard-accessible country list.
5. All three degradation tiers from §4.4, including build-time static map images
   for Tier 3.

Do not build the wheel-to-globe transition — that is Phase 5.
Test at 375px and 1440px, with reduced motion forced on, and on a throttled
mid-range mobile profile. Run lint, typecheck, tests and the production build.
```

**Phase 6 (support) — the one with legal and trust exposure:**

```text
Continue with Phase 6 from CLAUDE.md, support section only, before the stories work.

First check src/content/support.ts against §9.3. If the VPA pair is not confirmed
by the owner with approved explanatory wording, render the QR method only, add the
// OWNER comment, and list exactly what you need — do not guess an explanation and
do not hide the discrepancy.

Implement §9.2 QR integrity requirements literally: plain <img>, no next/image, no
filters, no radius, no transform, no animation, 240px minimum, 16px quiet zone on
white. Add a test that fails if any CSS transform, filter or border-radius is
applied to the QR element.

No supporter counter, progress bar, scanning animation or success message.
```
