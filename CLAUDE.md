# Ranjith on Wheels - Claude Code Master Plan

> Use this document as the project specification. Copy it to the repository root as `CLAUDE.md` before starting implementation. Complete the work phase by phase and keep the site runnable after every phase.

## 1. Project goal

Build a premium, cinematic, story-led portfolio for **Ranjith on Wheels**, an Indian bicycle traveller and creator.

This must not feel like a conventional portfolio, blog template, dashboard, or collection of static cards. It should feel like one continuous travel film controlled by scrolling. The visual language can take high-level inspiration from premium adventure websites: full-bleed photography, oversized editorial typography, restrained navigation, cinematic map movement and dark storytelling sections. Do not copy any reference site's layout, branding, code, copy or distinctive composition.

The central experience is:

> One bicycle wheel becomes a route. The route becomes a world map. The world map becomes a collection of human stories. The route then continues beyond the final country into the social follow call-to-action.

Primary visitor action: **Follow Ranjith on YouTube and Instagram.**

Secondary visitor actions:

- Explore the journey and its 23 countries.
- Read the most powerful travel stories.
- Discover the book.
- Support the next stage of the journey through a transparent donation page.
- Contact Ranjith for collaborations, speaking and partnerships.

## 2. Current content baseline

All changing figures must live in one editable content file. Do not hard-code them throughout components.

- Display name: Ranjith on Wheels
- Traveller: Ranjith Kumar Dagara
- Message: Solution to Pollution
- Journey distance: 48,000+ km
- Countries: 23
- Latest confirmed country: Slovakia
- Journey duration: 4+ years
- Book: The Indian Cyclist - A Journey for Generations

Country order:

1. India
2. Sri Lanka
3. Vietnam
4. Cambodia
5. Thailand
6. Malaysia
7. Singapore
8. Indonesia
9. China
10. Japan
11. South Korea
12. Taiwan
13. Mongolia
14. Australia
15. France
16. Switzerland
17. Germany
18. Austria
19. Italy
20. Slovenia
21. Croatia
22. Hungary
23. Slovakia

Do not invent exact routes, dates, kilometre splits, names of helpers or environmental-impact numbers. Country coordinates may be used as display anchors, but must not be described as the exact cycling track. Replace the display anchors with GPX/KML route data if the owner provides it.

Do not connect to YouTube or Instagram APIs. Social numbers and the latest location are manually maintained.

## 3. Brand idea and visual system

### Theme name

**The Road Still Moves**

Use one visual system across the entire experience:

- One glowing route line connects every section.
- One wheel symbol acts as logo, loading indicator, route marker and next-country device.
- Photography is immersive and documentary, not decorative.
- Motion is smooth, deliberate and directional. Everything moves forward.
- Avoid bouncy, playful, glitch, neon, gaming or unrelated animation styles.

### Colour palette

Define these as CSS custom properties in `app/globals.css`:

```css
:root {
  --color-night: #050706;
  --color-forest: #0c1711;
  --color-ivory: #f4f0e5;
  --color-muted: #b9bcb4;
  --color-line: rgba(244, 240, 229, 0.24);
  --color-route: #ff7a36;
  --color-green: #1b6b4b;
  --color-green-light: #5ec18f;
  --header-height: 72px;
  --page-gutter: clamp(20px, 5vw, 80px);
}
```

Use ivory over photography, black/forest backgrounds for editorial sections, orange only for the moving route and key highlights, and green for primary follow/explore actions.

### Typography

- Display: Cormorant Garamond or another elegant editorial serif loaded with `next/font`.
- Interface/body: Inter loaded with `next/font`.
- Use very large, tightly spaced display headlines.
- Combine upright serif with one italic line for emotional emphasis.
- Uppercase labels use wide tracking.
- Keep paragraphs short and readable; aim for 45-60 characters per line.

### Image direction

- Hero: wide landscape image with a visible road and cyclist.
- Story images: candid people, difficult roads, weather, camps, bicycle details and local encounters.
- Prefer photographs with space for typography.
- Apply subtle dark gradients for readable text; do not heavily recolour every image.
- Use `next/image`, responsive `sizes`, meaningful `alt`, fixed aspect ratios and blur placeholders.
- Never stretch or crop faces awkwardly.

### Narrative spine

The website must follow one emotional sentence:

> A personal loss created a promise; the promise began a ride; the ride crossed borders; strangers helped carry it; challenges tested it; the journey continues because people choose to follow and support it.

Every section must advance that sentence. Remove any section that only repeats statistics or fills space.

Use this six-beat rhythm for every major story:

1. **Place** - Where are we?
2. **Desire** - What was Ranjith trying to reach or complete?
3. **Tension** - What made the moment difficult?
4. **Human turn** - Who, what or which decision changed the situation?
5. **Meaning** - What did the road teach him?
6. **Forward motion** - How did this moment carry the journey into the next chapter?

Present facts visually and emotion through short first-person-approved copy. Statistics establish scale; specific moments create connection. Never write generic inspiration copy when a real detail is available.

### Story transition system

The route line is not decoration. It is the narrative hand-off between scenes:

- Hero to origin: the line leaves the landscape road, narrows and enters the black story section.
- Origin to map: the line passes behind the final sentence and becomes the first India route segment.
- Map to featured story: the selected country marker expands into the next photograph while the map recedes.
- Featured story to kindness gallery: the line separates into small human connection points.
- Book to support: the line appears between book pages, then exits as the next unfinished route.
- Support to finale: the supporter action illuminates one more segment before the wheel moves toward country 24.

All transitions must preserve direction from left-to-right or bottom-to-top. Do not use random entrances from different directions.

## 4. Recommended technical architecture

Use:

- Next.js App Router with TypeScript, created with `create-next-app@latest`.
- CSS Modules for component-specific styling and `app/globals.css` for tokens/resets.
- GSAP, ScrollTrigger and `@gsap/react` for the complete motion system.
- D3 Geo, D3 Shape and TopoJSON Client for the interactive world map.
- Local JSON/TypeScript and MDX content. No database or CMS for version one.
- Next.js `Image`, font and metadata features.
- Vitest plus React Testing Library for unit/component tests.
- Playwright for critical responsive and reduced-motion flows.
- Deployment target: Vercel, unless the owner selects another host.

Install only the dependencies that are actually used:

```bash
npx create-next-app@latest ranjith-on-wheels --typescript --eslint --app --src-dir --import-alias "@/*"
cd ranjith-on-wheels
npm install gsap @gsap/react d3-geo d3-shape topojson-client world-atlas
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test @types/d3-geo @types/d3-shape @types/topojson-client
```

Do not add Framer Motion, Lenis, Three.js, a UI kit or another animation library unless a later requirement proves it necessary. GSAP and native browser scrolling are sufficient for version one.

All GSAP work must run in client components through `useGSAP()` with scoped refs and automatic cleanup. Register plugins once in a client-only animation module.

## 5. Site architecture

### Routes

```text
/
/journey
/journey/[country]
/book
/about
/support
/support/success
/support/cancel
/donate -> permanent redirect to /support
/contact
```

The homepage is the cinematic story. `/journey` is the full searchable country archive. Each `/journey/[country]` page provides a shareable chapter with photos, video, route context and story text.

### Homepage acts

1. Wheel-to-world hero
2. The reason the journey began
3. Animated world journey
4. Kindness and challenge stories
5. The road is still moving

The homepage includes a short, emotionally appropriate support invitation after the book. The full explanation and payment action live on `/support`.

### Storytelling presentation rules

- Start scenes with a strong visual moment, then reveal context.
- Keep one idea per screen on desktop; do not place long biography text beside a complex animation.
- Alternate scale: full-screen landscape, intimate portrait, world map, human detail, open road.
- Use chapter labels such as `COUNTRY 13 - MONGOLIA`, but let the headline communicate emotion.
- Let difficult stories breathe. Do not turn dangerous or painful moments into game-like achievements.
- End every challenge with the action that kept the journey moving.
- Use real ambient details from the book: weather, roads, food, shelter, waiting, rejection and unexpected help.
- Do not expose the whole story at once. Reveal place, tension and resolution in sequence.
- Keep homepage story summaries under 80 words; full detail belongs on the country page.
- The final action should feel earned: experience the journey first, then invite the visitor to follow or support it.

## 6. Homepage master sequence

### Global navigation

Desktop:

- Light ivory navigation bar above the hero, inspired by editorial travel products.
- Left: wheel mark plus RANJITH ON WHEELS.
- Centre: Story, Journey, Book, Support, About.
- Right: green **Follow the journey** button.
- Change to a translucent dark bar after the first scroll section, but do not use a heavy glass effect.

Mobile:

- Logo left, accessible menu button right.
- Full-screen dark menu with large text links.
- Social links visible in the menu.

### Act 1 - Wheel-to-world hero

Visual:

- Full-bleed landscape travel photograph.
- Dark top/bottom gradient for legibility.
- Oversized centred or left-aligned serif headline.
- Thin animated route line crossing the photograph.
- Begin with a close-up wheel rim occupying much of the screen. As it rotates, the camera appears to pull backward until the circle reads as the bicycle wheel inside the landscape.
- One small wheel marker then follows the route line across the photograph.
- The route should visually align with the road in the chosen hero photograph wherever possible.

Recommended copy:

```text
A JOURNEY FOR GENERATIONS

The world,
one pedal
at a time.

48,000+ kilometres. 23 countries. One bicycle carrying a promise,
a purpose and thousands of human stories.
```

Actions:

- Primary: **Ride the journey**
- Secondary: **Follow the next kilometre**

Statistics at the bottom:

- 48,000+ kilometres
- 23 countries
- 4+ years riding

### Act 2 - The origin

Lead with emotion, not biography.

Recommended headline:

```text
The journey did not begin with a bicycle.
It began with a promise.
```

Use a black editorial section with one portrait, one short paragraph and a quiet link to the full About page. Explain that the journey became connected to his father's memory and a decision to live with purpose. Have the owner approve the final wording before launch.

Do not show the complete explanation immediately. Reveal it in three beats:

1. `Loss changed the direction of his life.`
2. `A bicycle gave that direction a road.`
3. `The road became a promise to keep moving.`

These are draft narrative beats, not approved quotations. The owner must approve or replace them.

### Act 3 - The world

Recommended headline:

```text
The world became the road.
```

This is the signature experience. On desktop, pin the section while the visitor scrolls through five geographic chapters. On mobile, do not pin for a long distance; use a swipeable/step-based story with the map remaining above the text.

Five map chapters:

1. India - Where the promise became a journey
2. South and Southeast Asia - Learning to trust the unknown
3. East Asia - Connection beyond language
4. Australia - Two rejections, one destination
5. Europe - The road reaches country twenty-three

The final map state shows all 23 countries and the route ending at Slovakia.

At every geographic chapter, use a location-specific visual and emotional beat:

- India: first wheel turn and the decision to leave.
- Southeast Asia: humidity, unfamiliar roads, limited money and unexpected help.
- East Asia: language barriers, hospitality and Mongolia's scale.
- Australia: rejection before arrival, then the road opening.
- Europe: rapid border changes and the latest chapter in Slovakia.

The visitor should always understand three things without reading a long paragraph: where the journey is, what changed there and why it matters.

Map modes:

- **Route:** orange line, ordered country markers and chapter progress.
- **Kindness:** keep the base route visible at low opacity; show expanding green rings at India, Vietnam, Malaysia, South Korea and Australia. Each opens a short human story.
- **Challenge:** keep the route visible at low opacity; use orange diamond markers at Sri Lanka, Thailand, Indonesia, Mongolia and Australia. Each opens the challenge and how he continued.

Do not change the entire page colour between modes. The mode changes meaning, marker shape, emphasis and copy while preserving the single visual theme.

Each selected country/story reveals one compact editorial panel:

- Country and chapter number
- Story title
- 40-80 word summary
- One image thumbnail
- Link: **Open full chapter**

Desktop route animation may use display-anchor coordinates until GPX data is available. Generate smooth great-circle segments by sampling `d3.geoInterpolate()` between successive points. Do not connect country centres with visually harsh straight SVG segments.

### Act 4 - The real journey

Use three full-width editorial story sequences rather than a card grid:

1. **The elephant escape** - Sri Lanka
2. **When only Rs 150 remained** - Thailand
3. **Two rejections, one destination** - Australia

Follow these with a horizontal or stacked human gallery titled:

```text
The road was carried by strangers.
```

Every story follows the same structure:

- What happened
- Who or what helped
- What the road taught him

Avoid fake quotations. Only use direct quotes supplied or approved by the owner.

### Book section

Treat the book as a physical travel object, not a product card.

- Large book-cover image with a subtle 3D tilt on fine-pointer devices.
- Headline: **The complete journey lives between these pages.**
- Short description.
- Actions: Read a sample / Buy or enquire.
- Disable the tilt on touch devices and reduced-motion settings.

### Homepage support invitation

Place a restrained support invitation between the book and Act 5. It should feel like a continuation of the story, not an advertisement.

Recommended copy:

```text
THE JOURNEY IS SELF-POWERED, BUT NEVER SOLO.

Help the next kilometre happen.

Support can become a meal, a safe night, a bicycle repair,
a border crossing or the next story shared from the road.
```

Actions:

- Primary: **Support the journey** -> `/support`
- Secondary: **See how support is used** -> transparency section on `/support`

Do not show a fake donation total, fake urgency, countdown or fabricated supporter count.

### Dedicated Support the Journey / Donate page

Public route: `/support`. Add a permanent redirect from `/donate` so either term reaches the same canonical page. Use **Support the Journey** in navigation because it feels more human and less transactional.

#### Required owner decisions before payments go live

Do not choose or activate a payment provider until the owner confirms:

- Legal name of the payment recipient.
- Recipient country and whether the recipient is an individual, business, association or registered charity.
- Accepted currencies.
- One-time only or one-time plus recurring support.
- Payment provider/account already approved for that recipient.
- Refund/contact policy.
- Whether a public funding goal is real and can be kept current.

If these are not confirmed, complete the page design with a disabled **Support options coming soon** state. Never insert a developer's personal payment details or create a financial account on the owner's behalf.

#### Page narrative

The page follows a four-part emotional flow:

1. **Why help** - The road continues and the work is independently created.
2. **What support enables** - Practical, specific categories.
3. **How it is handled** - Secure payment and transparent disclosure.
4. **What happens next** - Return to the ongoing journey and follow updates.

#### Support hero

Use a full-bleed road image with Ranjith and the loaded bicycle. Continue the orange route line from the homepage into this page.

Recommended copy:

```text
SUPPORT THE ROAD AHEAD

Help the next kilometre happen.

Every contribution helps keep the bicycle moving,
the camera recording and the next story possible.
```

Primary action: **Choose your support**

Secondary action: **How support is used**

#### Support choices

Use editable options from `src/content/support.ts`. Suggested labels:

- **A meal on the road**
- **A safe night's rest**
- **An essential bicycle repair**
- **Help carry the next chapter**
- **Choose another amount**

Do not claim a contribution buys an exact item unless the owner supplies and maintains a truthful amount for that claim. Otherwise describe the labels as examples of what support may help cover.

Only show recurring support if the approved payment provider and recipient account support it. The default should be one-time.

#### Where support goes

Present a quiet editorial breakdown, not a sales chart:

- Food and water
- Safe accommodation when camping is not possible
- Bicycle parts, repairs and safety equipment
- Visas, permits and unavoidable transport
- Camera, connectivity and story production

Add `Last updated: <date>` to the transparency content. If percentages or totals are shown, they must come from owner-provided records and sum correctly. If no verified records are supplied, list categories without numeric claims.

#### Payment architecture

Version one must redirect to a provider-hosted checkout or payment link. The portfolio must not collect, transmit or store card or bank details.

Create a small provider-neutral configuration:

```ts
export type SupportOption = {
  id: string;
  label: string;
  description: string;
  amount?: number;
  currency?: string;
  checkoutUrl?: string;
  enabled: boolean;
};

export const supportConfig = {
  recipientDisplayName: "REPLACE_ME",
  recipientType: "REPLACE_ME",
  providerName: "REPLACE_ME",
  oneTimeEnabled: false,
  recurringEnabled: false,
  transparencyUpdatedAt: "REPLACE_ME",
  options: [] satisfies SupportOption[],
} as const;
```

Rules:

- Never expose secret keys in client code or the repository.
- Never build a fake card-number form.
- Validate allowlisted checkout hosts before rendering links.
- Open checkout in the same tab unless the provider requires otherwise.
- Do not include donation amount, financial identifiers or sensitive data in analytics events.
- A success page may say payment succeeded only when a signed provider response or server-side verified session proves it. Otherwise show neutral return copy.
- Do not call support `tax deductible`, `charitable` or a `charitable donation` unless the owner provides documented legal status and approved wording.
- Add clear contact, privacy, payment-processing and refund information.

#### Support page animation

- Hero route draws from the previous page's visual entry point.
- As support choices enter, the wheel pauses at a junction and the choices appear as road signs.
- Selecting an option illuminates one short route segment and updates the summary. Do not use flashing, confetti, artificial scarcity or emotional pressure.
- The checkout button uses a simple forward-arrow movement on hover/focus.
- On a verified success page, the route extends one segment and the copy reads: **You helped carry the journey forward.**
- Reduced motion shows the selected state instantly.

#### Support page sections

```text
SupportHero
SupportWhy
SupportOptions
SupportUseBreakdown
SupportTransparency
PaymentDisclosure
SupportFAQ
SupportFinalCTA
```

Suggested FAQ topics:

- Is this a charitable donation?
- Which currencies are accepted?
- Can I support monthly?
- How is support used?
- Who processes the payment?
- How do I request payment help or a refund?

### Act 5 - Still moving

The orange route must visibly leave the map section and enter the finale. This makes the whole page feel like one continuous experience.

Use another full-bleed image with a stronger dark gradient.

Recommended copy:

```text
SLOVAKIA - COUNTRY 23 - NOT THE FINISH

The map ends here.
The journey doesn't.

Country twenty-three is only the newest chapter.
Follow the next kilometre as it happens.
```

Primary social actions:

- YouTube - Journey films
- Instagram - Daily road stories

Place the wheel on a dotted route near the bottom. It rolls toward a circle labelled `24 - ?`, followed by:

```text
THE NEXT COUNTRY IS STILL BEING WRITTEN
```

Final footer includes collaboration email, social links, copyright and the Solution to Pollution message.

## 7. Motion direction and exact choreography

Create one reusable motion vocabulary. Most reveals should use `power3.out`; route/camera movement should use `power2.inOut`. Avoid elastic and bounce easing.

### Motion hierarchy

Motion must communicate one of four meanings:

1. **Forward travel** - route drawing, wheel movement and section hand-offs.
2. **Discovery** - image masks, map focus and chapter reveals.
3. **Memory** - slower portrait movement and quiet text reveals.
4. **Decision** - selected map mode, story or support option becoming clear.

If an animation does not serve one of those meanings, remove it.

Create a shared motion configuration in `src/lib/motion.ts`:

```ts
export const motion = {
  ease: {
    reveal: "power3.out",
    travel: "power2.inOut",
    settle: "power2.out",
  },
  duration: {
    micro: 0.22,
    reveal: 0.8,
    scene: 1.2,
    route: 4.8,
  },
  stagger: {
    text: 0.1,
    markers: 0.06,
  },
} as const;
```

Use a single `ReducedMotionProvider` so components do not implement conflicting checks.

### Initial page load: 0-6 seconds

| Time | Animation |
| --- | --- |
| 0.0-1.4s | Hero image scales from 1.07 to 1.00. Never start from blur. |
| 0.2-0.8s | Navigation enters from `y: -16`, opacity 0 to 1. |
| 0.25-1.10s | Close wheel rim rotates 240 degrees while the camera pulls back to reveal the full bicycle/road image. |
| 0.45-1.8s | Headline lines reveal upward from overflow-hidden masks with a 0.10s stagger. |
| 1.0-2.0s | Supporting copy and CTAs rise 20px and appear. |
| 0.8-5.8s | SVG route draws using `strokeDashoffset`; wheel follows the same path. |
| 1.8-3.3s | Statistics count to their final values once. Preserve `+` signs. |
| 3.0-4.0s | Scroll cue appears. |

Do not hide the page behind a long loading screen. If a loader is required while the hero image decodes, keep it under 1.5 seconds and use the wheel mark.

### Hero scroll transition

- Scrub hero image vertically by no more than 8% for gentle depth.
- Reduce the hero copy opacity only after it has moved above 35% of the viewport.
- Route line should appear to continue into Act 2.
- Do not pin the hero.
- Use a shared route connector positioned from measured DOM anchors. Do not rely on one giant absolute SVG with hard-coded page coordinates.

### Act 2 reveal

- Headline reveals by lines.
- Portrait uses a vertical `clip-path` reveal.
- Supporting paragraph appears after the image is 30% revealed.
- Background chapter number may move horizontally by 4-6% with scroll.

### Act 3 pinned map timeline

Desktop `ScrollTrigger`:

```text
trigger: map section
start: top top
end: +=500%
pin: true
scrub: 0.8
anticipatePin: 1
```

Timeline labels:

```text
0.00 india
0.18 southeast-asia
0.38 east-asia
0.58 australia
0.76 europe
0.94 slovakia
1.00 complete
```

At each label:

- Extend the route line to the chapter endpoint.
- Move the wheel to the endpoint.
- Apply a restrained camera translate/scale toward the active region.
- Highlight only completed country markers.
- Replace the story panel using a horizontal mask transition, not a plain crossfade.
- Update `aria-live` only at chapter boundaries, never on every scroll frame.

Between geographic chapters, briefly reveal one approved image inside the active story panel. The sequence is map -> place label -> image detail -> meaning. Do not crossfade multiple large photographs over the map at once.

Keep camera scale moderate so the visitor never loses geographic context. The final state zooms back to the full world route.

### Map mode transition

Duration: 600-900ms.

- Route mode: all markers scale from 0.7 to 1 with order-based stagger.
- Kindness mode: route opacity goes to 0.28; rings expand once and settle.
- Challenge mode: route opacity goes to 0.28; diamond markers rise 8px and settle.
- Selected story panel masks out left and masks in from right.
- Cancel and clean previous timelines before starting a new mode transition.

### Story sequences

- Image enters with `clip-path` and a 1.03 to 1.00 scale.
- Headline lines reveal 100ms apart.
- Small country/date labels precede the headline by 150ms.
- Reveal narrative beats in order: place, tension, human turn, meaning.
- Use a thin reading-progress line for long country pages; do not add floating progress widgets to the homepage.
- On scroll past, do not reverse every animation; preserve the read state.

### Cross-section cinematic transitions

- **Hero -> origin:** the final hero route point remains visible while the background darkens; the point becomes the dot above the origin label.
- **Origin -> world:** the dot expands into the India map marker and the world outline resolves around it.
- **World -> challenge story:** the active marker enlarges while its story photograph reveals inside the circle, then expands to the story frame.
- **Story -> book:** the vertical image edge becomes the book spine.
- **Book -> support:** a page-turn shadow reveals the support headline; keep this subtle and under 700ms.
- **Support -> still moving:** the selected support route segment joins the unfinished route leading toward `24 - ?`.

Implement these as independent, testable section transitions. Do not create one fragile timeline spanning the entire document.

### Micro-interactions

- Links: underline or arrow travels 4-6px on hover/focus.
- Country markers: grow by no more than 15% and reveal the country name.
- Story thumbnails: scale from 1.00 to a maximum of 1.025.
- Buttons: translate upward a maximum of 2px; never bounce.
- Mobile menu: reveal links with a 60ms stagger and restore focus on close.
- Never animate the pointer cursor, replace the native cursor or create motion that follows every mouse movement.

### Act 5 finale

- Dark image rises behind the section with slow scroll-linked parallax.
- `The map ends here` appears first.
- Italic `The journey doesn't` follows 180ms later.
- Social actions rise together after the headline.
- The wheel rolls once across the dotted line toward `24 - ?`.
- The wheel stops before the question mark; never loop it.

### Animation reliability

- Wait for the hero image and fonts needed by the first scene before measuring its timeline.
- Call `ScrollTrigger.refresh()` after responsive images settle and after breakpoint changes.
- Use `gsap.matchMedia()` for desktop/tablet/mobile timelines; do not use deprecated `ScrollTrigger.matchMedia()`.
- Store requestAnimationFrame IDs and cancel them on unmount.
- Do not create more than one ScrollTrigger for the same narrative progress when one master section timeline is enough.
- On browser back/forward navigation, restore a readable section state before refreshing triggers.
- All content must remain visible when JavaScript fails.

### Reduced motion

When `prefers-reduced-motion: reduce` is active:

- Disable smooth scrubbing, parallax, long pins, counters, wheel travel and image scaling.
- Show the final readable state immediately.
- Keep simple opacity transitions under 150ms or remove them entirely.
- Make every route chapter available through buttons/links without animation.

## 8. Content model

Create `src/content/site.ts`:

```ts
export const siteContent = {
  name: "Ranjith on Wheels",
  personName: "Ranjith Kumar Dagara",
  message: "Solution to Pollution",
  distanceKm: 48000,
  distanceSuffix: "+",
  countryCount: 23,
  yearsOnRoad: 4,
  yearsSuffix: "+",
  currentCountry: "Slovakia",
  youtubeUrl: "REPLACE_ME",
  instagramUrl: "REPLACE_ME",
  collaborationEmail: "REPLACE_ME",
  bookUrl: "REPLACE_ME",
  supportUrl: "/support",
} as const;
```

Create `src/content/journey.ts` with this type:

```ts
export type JourneyCountry = {
  order: number;
  slug: string;
  name: string;
  iso3: string;
  displayAnchor: [longitude: number, latitude: number];
  chapter: "india" | "southeast-asia" | "east-asia" | "australia" | "europe";
  featured: boolean;
  coverImage: string;
  coverAlt: string;
  summary: string;
  lesson?: string;
  kindnessStory?: string;
  challengeStory?: string;
  videoUrl?: string;
  gallery: Array<{ src: string; alt: string }>;
};
```

Add all 23 countries in order. Mark uncertain copy as `TODO_OWNER_APPROVAL` rather than fabricating it.

Create `src/content/navigation.ts`, `src/content/socials.ts` and MDX chapter files only if they reduce duplication. Do not spread one fact across multiple files.

Create `src/content/support.ts` using the provider-neutral model in the dedicated Support the Journey section. Payment actions remain disabled until every required owner decision is complete.

Manual update workflow:

1. Change totals/current country in `site.ts`.
2. Add the new country object to `journey.ts`.
3. Add its images under `public/media/journey/<country-slug>/`.
4. Add or update the country chapter.
5. Run validation tests that compare `countryCount` with the journey array length.

## 9. Component and folder plan

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    journey/
      page.tsx
      [country]/page.tsx
    book/page.tsx
    about/page.tsx
    support/
      page.tsx
      success/page.tsx
      cancel/page.tsx
    contact/page.tsx
  components/
    layout/
      SiteHeader.tsx
      MobileMenu.tsx
      SiteFooter.tsx
    home/
      HeroJourney.tsx
      OriginStory.tsx
      JourneyAtlas.tsx
      JourneyChapterPanel.tsx
      StoryFeature.tsx
      HumanGallery.tsx
      BookFeature.tsx
      SupportInvitation.tsx
      StillMovingFinale.tsx
    map/
      WorldJourneyMap.tsx
      RoutePath.tsx
      CountryMarker.tsx
      MapModeControls.tsx
    motion/
      LineReveal.tsx
      ImageReveal.tsx
      CountUp.tsx
      RouteConnector.tsx
      ReducedMotionProvider.tsx
    support/
      SupportHero.tsx
      SupportOptions.tsx
      SupportUseBreakdown.tsx
      SupportTransparency.tsx
      PaymentDisclosure.tsx
      SupportFAQ.tsx
    ui/
      ButtonLink.tsx
      Eyebrow.tsx
      SocialLink.tsx
  content/
    site.ts
    journey.ts
    support.ts
  lib/
    gsap.ts
    map.ts
    metadata.ts
    validation.ts
  styles/
    tokens.css
    typography.css
public/
  media/
    hero/
    story/
    journey/
    book/
    support/
  data/
    countries-110m.json
```

Keep server components by default. Add `"use client"` only to components that need state, browser APIs or GSAP.

## 10. Responsive behaviour

### Desktop: 1024px and wider

- Full cinematic hero.
- Pinned five-stage map.
- Two-column editorial story layouts.
- Large photography and generous spacing.

### Tablet: 768-1023px

- Reduce display type and map zoom.
- Keep map pinning only if it remains stable in real-device tests.
- Stack copy below or above media when space is limited.

### Mobile: 320-767px

- No long pinned map sequence.
- Display map, then five native chapter buttons or a swipeable scroll-snap chapter strip.
- Keep controls at least 44px high.
- Stack social actions.
- Use shorter headline line breaks chosen specifically for mobile.
- Keep route/story content accessible without hover.
- Test Safari iOS address-bar changes; avoid relying only on `100vh`. Prefer `100svh`/`100dvh` with fallback.
- Support choices become one vertical list with a persistent but non-obstructive summary above the checkout action.

## 11. Accessibility requirements

- Semantic landmarks and one logical `h1`.
- Visible keyboard focus.
- Skip-to-content link.
- Navigation and menu fully keyboard accessible.
- Every informative image has meaningful alt text; decorative route imagery uses empty alt or `aria-hidden`.
- Map has a text equivalent listing countries in journey order.
- Country markers are real buttons or paired with a keyboard-operable country list.
- Dynamic map chapter changes use one polite live region.
- Colour is never the only signal; modes also use labels and marker shapes.
- No autoplay sound. Optional ambient sound must default off and have a persistent visible control.
- Donation/support choices, disclosures and payment-provider name must be readable before the checkout action receives focus.
- Never rely on route illumination alone to communicate a selected support option.
- Meet WCAG AA contrast.

## 12. Performance requirements

- Target Lighthouse: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+ on a production build.
- Keep initial JavaScript lean. Dynamically import the interactive map below the fold.
- Use `next/image` for responsive sizing, modern formats, lazy loading and layout stability.
- Hero image may be priority-loaded; all other images remain lazy.
- Preload only the display font styles actually used.
- Animate transforms and opacity. Avoid animating layout properties during scroll.
- Keep simultaneous filter/blur animations to a minimum.
- Do not render a WebGL globe for version one.
- Kill ScrollTriggers and animation frames on component unmount.
- Recalculate map dimensions with `ResizeObserver` and refresh ScrollTrigger after font/image layout settles.
- Keep checkout on a trusted provider-hosted page; never load a third-party card form merely for visual consistency.
- Add a strict Content Security Policy and allow only the confirmed payment-provider domains required for navigation or callbacks.

## 13. SEO and sharing

- Site-wide title template and description.
- Open Graph image using a hero photograph and readable Ranjith on Wheels title.
- Person/creator and website structured data where accurate.
- Country pages use canonical URLs and unique metadata.
- Generate sitemap and robots file.
- Every featured story and country page must have a clean share URL.
- Add social-profile links using real URLs supplied by the owner.
- Give `/support` unique metadata focused on supporting an independent bicycle journey. Do not use charity schema or tax-deductibility claims without verified legal status.

## 14. Asset checklist for the owner

Request these before final visual polish:

- Logo in SVG or high-resolution transparent PNG.
- 3-5 horizontal hero candidates, ideally 2400px wide or larger.
- One strong portrait with the loaded bicycle.
- 1-5 photos for each country.
- Exact YouTube, Instagram and contact URLs.
- Book cover and purchase/sample link.
- Approved father/origin story wording.
- Names and permissions for identifiable people featured in kindness stories.
- GPX/KML files, Strava exports or a city-by-city route list if an accurate route is required.
- Optional ambient road/audio recordings.
- Payment recipient legal name, country and entity type.
- Approved payment-provider account/link and supported currencies.
- Approved one-time/recurring support options.
- Support/refund contact and legally reviewed payment wording where required.
- Verified transparency categories, amounts or percentages if numeric claims will be shown.

Until final assets arrive, use clearly named local placeholders. Do not use images copied from the reference websites.

## 15. Implementation phases for Claude Code

### Phase 0 - Repository audit

- Inspect the existing repository, package manager and conventions.
- Do not overwrite unrelated user work.
- Report the current structure and any blockers.
- Confirm the dev, lint and test commands.

### Phase 1 - Foundation

- Create/confirm the Next.js App Router and TypeScript structure.
- Add fonts, tokens, global styles, header, footer and base metadata.
- Add content files and tests for the 23-country order.
- Build responsive layout shells with real copy.

### Phase 2 - Cinematic hero and origin

- Implement the photographic hero, route overlay, wheel marker, line-reveal typography and counters.
- Implement Act 2 editorial origin section.
- Add reduced-motion behaviour immediately, not later.

### Phase 3 - Journey map

- Implement the projected world map and smooth sampled route.
- Add the five desktop chapters and mobile step-based alternative.
- Add Route, Kindness and Challenge modes.
- Add keyboard-equivalent country navigation.

### Phase 4 - Stories and book

- Build the three featured challenge stories.
- Build the people/kindness gallery.
- Build book feature.

### Phase 5 - Support and finale

- Build the homepage support invitation.
- Build `/support`, `/support/success` and `/support/cancel`.
- Add the `/donate` permanent redirect.
- Keep payment actions disabled until the recipient, provider, URLs and disclosures are approved.
- Implement the provider-hosted checkout link only after validation.
- Build Act 5 and physically connect the route from map through support to the finale.

### Phase 6 - Secondary routes

- Journey archive and country pages.
- About, book and contact routes.
- Metadata, social sharing and structured data.

### Phase 7 - Quality pass

- Responsive tests at 320, 375, 768, 1024, 1440 and 1920px.
- Keyboard, screen-reader semantics and reduced-motion tests.
- Verify no overlapping text, image distortion or empty map.
- Production build, lint, unit tests and Playwright smoke tests.
- Lighthouse audit and image/font optimisation.

Do not move to the next phase while the current phase has TypeScript, lint or runtime errors.

## 16. Acceptance criteria

The work is complete only when:

- The design feels cinematic and photographic, not like a template.
- The same route line visually connects hero, map and finale.
- The opening animation completes smoothly and never blocks access.
- The 23 countries appear in the correct order.
- The desktop map tells the journey in five scroll stages.
- Mobile users can access all map chapters without a long pinned scroll.
- Route, Kindness and Challenge modes visibly change the map and story panel.
- The finale makes YouTube and Instagram the dominant actions.
- The support invitation feels like part of the story rather than an advertisement.
- `/support` explains why support matters, where it may be used and who processes payment before checkout.
- The site never collects or stores card/bank details.
- Payment buttons remain disabled until approved provider configuration is complete.
- No charity, tax-deductibility, funding-progress or exact-use claim appears without verification.
- All changing data is editable in `site.ts`/`journey.ts`.
- There is no social API or automatic update system.
- Reduced motion shows the complete content without animation dependence.
- No text overlaps at required breakpoints.
- No copied reference-site assets or copy are used.
- `npm run build`, lint and tests pass.

## 17. Working rules for Claude Code

1. Read this file completely before changing code.
2. Inspect the repository before choosing tools or replacing files.
3. Preserve user files and existing work.
4. Implement one phase at a time in small, reviewable changes.
5. Use semantic HTML and progressive enhancement.
6. Keep story content separate from presentation components.
7. Never invent travel facts. Mark missing facts for owner approval.
8. Do not add dependencies that duplicate existing capabilities.
9. Use `useGSAP()` and scoped refs; clean every animation on unmount.
10. Test reduced motion and mobile during each phase.
11. After each phase, run format, lint, tests and production build.
12. Report exactly what changed, what was verified and which owner assets remain missing.
13. Never commit payment secrets, personal banking details or unapproved checkout URLs.
14. Never present an unverified return from a payment provider as a confirmed successful payment.

## 18. First command to give Claude Code

Paste the following after placing this document at the repository root as `CLAUDE.md`:

```text
Read CLAUDE.md completely. Then inspect the current repository without changing anything.

Give me:
1. A short audit of the existing stack and folder structure.
2. Conflicts between the repository and CLAUDE.md.
3. The exact files you will create or modify for Phase 1.
4. Any missing assets that block Phase 1, separating real blockers from items that can use temporary placeholders.
5. A concise implementation plan.

After the audit, proceed with Phase 1 unless there is a destructive conflict or a missing decision that would materially change the architecture. Preserve all unrelated files. Run lint, tests and the production build before reporting completion.
```

After approving Phase 1, use:

```text
Continue with Phase 2 from CLAUDE.md. Build the cinematic hero and origin section using the real supplied Ranjith photographs. Implement the full animation choreography and reduced-motion state. Do not start the map yet. Test at 320px, 768px and 1440px, then run lint, tests and production build.
```

For the support phase, use:

```text
Continue with Phase 5 from CLAUDE.md. Build the Support the Journey experience and Act 5 finale. First verify whether the support configuration is complete. If recipient identity, provider URL, currencies or disclosures are missing, render a polished disabled preview and list the exact owner decisions required; do not create or activate a payment account. Keep payment provider-hosted and do not collect card data. Implement the complete reduced-motion and mobile states, then run lint, tests and the production build.
```

Then continue through Phases 3-7 using the acceptance criteria in this file.

## 19. Technical references

- [Next.js Image Optimization](https://nextjs.org/docs/app/getting-started/images)
- [GSAP with React and useGSAP](https://gsap.com/resources/React/)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [D3 geographic projections and paths](https://d3js.org/d3-geo)
- [Claude Code project memory with CLAUDE.md](https://docs.anthropic.com/en/docs/claude-code/memory)
