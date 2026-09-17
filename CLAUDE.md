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

```css
:root {
  /* surfaces */
  --paper:        #F7F5F0;
  --white:        #FFFFFF;
  --navy:         #0B1A26;   /* finale + footer ONLY */

  /* type */
  --ink:          #10212F;
  --ink-soft:     #41515D;
  --ink-inverse:  #F4F1EA;

  /* map */
  --sky:          #D8EEF7;
  --sea:          #5EB6D6;
  --land:         #C9DBC7;

  /* accents */
  --route:        #F15B3A;   /* the route line, and nothing else structural */
  --route-glow:   #FFBE63;   /* route edge, active marker halo */
  --support:      #0F8C78;   /* follow + support actions only */

  /* structure */
  --line:         rgba(16, 33, 47, 0.14);
  --glass:        rgba(255, 255, 255, 0.80);
  --glass-stroke: rgba(255, 255, 255, 0.55);
  --shadow-soft:  0 12px 40px rgba(16, 33, 47, 0.10);

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
