import { formatCoords, type LonLat } from "@/lib/coords";
import { ease, dur } from "@/lib/motion";
import type { gsap as Gsap } from "@/lib/gsap";
import { playOnView, scrubOnView } from "./useChapterMotion";

// The motion for each chapter page, kept apart from the markup. Every scene
// follows the same contract as the motifs: the server renders the finished
// picture (that is what no-JS and reduced-motion visitors get), and these
// functions only animate *from* a hidden or early state *to* it, reading the
// data-* hooks the markup declares. Nothing here runs under reduced motion.
//
// Motion rules (CLAUDE.md §5.2): transform and opacity, apart from the two
// justified exceptions marked below — stroke-dashoffset to trace a path along
// its length, and textContent for counters and coordinate readouts.
//
// Robustness rule (CLAUDE.md §0 decision #21): a scrubbed timeline must be
// correct wherever the visitor arrives — a reload half way down, back/forward,
// an anchor jump, a resize, a fling to the bottom. ScrollTrigger applies an
// already-scrolled position with tween callbacks suppressed, so anything
// written as *text* is also written from the trigger's own onRefresh/onUpdate
// (see `withSync`), and anything set to an "early" state is set only where the
// trigger will bring it back.
type Api = typeof Gsap;
type Node = HTMLElement | SVGElement;
type Scene = (stage: HTMLElement, gsap: Api) => void | (() => void);

const all = (stage: HTMLElement, selector: string) => Array.from(stage.querySelectorAll<Node>(selector));
const one = <T extends Element>(stage: HTMLElement, selector: string) => stage.querySelector<T>(selector);
const depthOf = (el: Node) => Number(el.dataset.depth ?? 0.5);
// Elements hidden by CSS (the half of a particle layer a phone drops) are
// neither painted nor worth animating.
const shown = (el: Node) => getComputedStyle(el).display !== "none";

// Trace a path along its length. Not a transform — but the only way to draw a
// line on, and the rest state (no dasharray at all) is the complete line.
function prepareDraw(path: SVGGeometryElement) {
  const length = path.getTotalLength();
  path.style.strokeDasharray = `${length}`;
  return length;
}

// Text written from a scrub trigger's own callbacks as well as its tweens.
function withSync<T extends object>(vars: T, sync: () => void) {
  return { ...vars, onRefresh: sync, onUpdate: sync };
}

// Shapes drift at different speeds as the page scrolls: depth without ever
// moving text (parallax on text is banned). One timeline and one trigger for
// the whole group — not a trigger per particle.
function drift(gsap: Api, stage: HTMLElement, els: Node[], distance: number, start = "top top") {
  const moving = els.filter(shown);
  if (moving.length === 0) return;
  const tl = gsap.timeline({
    defaults: { ease: "none", duration: 1 },
    scrollTrigger: { trigger: stage, start, end: "bottom top", scrub: true },
  });
  moving.forEach((el) => {
    const amount = -distance * depthOf(el);
    tl.to(el, el.dataset.axis === "x" ? { x: amount * 1.4 } : { y: amount }, 0);
  });
}

// One reveal per section: the text arrives bottom to top, once.
function reveal(gsap: Api, stage: HTMLElement, selector = "[data-reveal]", start = "top 72%") {
  const items = all(stage, selector);
  if (items.length === 0) return;
  gsap.fromTo(
    items,
    { y: 28, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: dur.reveal,
      ease: ease.reveal,
      stagger: Math.min(0.06, 0.3 / items.length),
      scrollTrigger: { trigger: stage, start, toggleActions: "play none none none" },
    },
  );
}

const hero: Scene = (stage, gsap) => {
  // Arriving through the hand-off (see TransitionLink): the veil already shows
  // this chapter's coordinates and name in exactly this position, so the hero
  // must not replay its type — it just lifts the veil and lets the road, the
  // terrain and the environment settle in around what is already there.
  const veil = document.getElementById("chapter-veil");
  if (veil) gsap.to(veil, { opacity: 0, duration: 0.9, ease: ease.ui, delay: 0.2, onComplete: () => veil.remove() });

  const tl = gsap.timeline({ defaults: { ease: ease.reveal } });
  tl.fromTo(all(stage, "[data-photo]"), { scale: 1.14 }, { scale: 1, duration: 2.6, ease: ease.travel }, 0)
    .fromTo(
      all(stage, "[data-layer]"),
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 1.4, stagger: { amount: 0.5 } },
      0.1,
    )
    .fromTo(all(stage, "[data-marker]"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.9);
  if (!veil) {
    tl.fromTo(all(stage, ".line-inner"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.25).fromTo(
      all(stage, "[data-meta]"),
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.06 },
      0.8,
    );
  }

  all(stage, "[data-outline]").forEach((path) => {
    const length = prepareDraw(path as unknown as SVGGeometryElement);
    tl.fromTo(path, { strokeDashoffset: length }, { strokeDashoffset: 0, duration: 2, ease: ease.travel }, 0.3);
  });
  all(stage, "[data-route-in]").forEach((path) => {
    // A sea crossing arrives dashed (a navigation line across water), which
    // can't be traced, so it fades in instead.
    if (path.hasAttribute("data-dashed")) {
      tl.fromTo(path, { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0.4);
      return;
    }
    const length = prepareDraw(path as unknown as SVGGeometryElement);
    tl.fromTo(path, { strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.6, ease: ease.travel }, 0.4);
  });

  drift(gsap, stage, all(stage, "[data-drift]"), 150);
  drift(gsap, stage, all(stage, "[data-fx]"), 240);
  gsap.to(all(stage, "[data-photo]"), {
    yPercent: 9,
    ease: "none",
    scrollTrigger: { trigger: stage, start: "top top", end: "bottom top", scrub: true },
  });
};

const arrival: Scene = (stage, gsap) => {
  reveal(gsap, stage);

  const progress = one<SVGPathElement>(stage, "[data-progress]");
  const traveller = one<SVGCircleElement>(stage, "[data-traveller]");
  const coords = one<HTMLElement>(stage, "[data-coords]");
  const map = one<HTMLElement>(stage, "[data-map]");
  if (!progress || !map) return;

  // A sea crossing is dashed and never drawn as cycling, so it cross-fades
  // from blue to red instead of tracing on (a dashed line can't be traced).
  const dashed = progress.hasAttribute("data-dashed");
  const length = dashed ? progress.getTotalLength() : prepareDraw(progress);
  const from = coords?.dataset.from?.split(",").map(Number) as LonLat | undefined;
  const to = coords?.dataset.to?.split(",").map(Number) as LonLat | undefined;
  const trip = { p: 0 };

  // The traveller and the coordinates follow `trip.p`, written from the
  // trigger's own refresh/update so they are right however the visitor arrived.
  const sync = () => {
    const point = progress.getPointAtLength(trip.p * length);
    traveller?.setAttribute("cx", `${point.x}`);
    traveller?.setAttribute("cy", `${point.y}`);
    if (coords && from && to) {
      coords.textContent = formatCoords([from[0] + (to[0] - from[0]) * trip.p, from[1] + (to[1] - from[1]) * trip.p]);
    }
  };

  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: withSync({ trigger: map, start: "top 75%", end: "bottom 45%", scrub: 0.6 }, sync),
    })
    // The road ahead (blue, underneath) becomes the road ridden (red) as the
    // visitor scrolls: the line, the traveller and the coordinates travel together.
    .fromTo(
      progress,
      dashed ? { opacity: 0 } : { strokeDashoffset: length },
      dashed ? { opacity: 1 } : { strokeDashoffset: 0 },
      0,
    )
    .fromTo(trip, { p: 0 }, { p: 1, onUpdate: sync }, 0);
  sync();
};

const DASH_PERIOD = 120;

const road: Scene = (stage, gsap) => {
  reveal(gsap, stage, "[data-reveal]", "top 78%");

  const panel = one<HTMLElement>(stage, "[data-panel]");
  if (!panel) return;
  const steps = all(stage, "[data-step]");
  const pins = all(stage, "[data-pin]");
  const dashes = all(stage, "[data-dashes]");
  const wheels = all(stage, "[data-wheel]");
  const fill = all(stage, "[data-fill]");
  const readout = one<HTMLElement>(stage, "[data-count]");
  const total = Number(readout?.dataset.total ?? 0);
  const count = steps.length;

  // Pinned where there is room to hold the whole panel on screen; on a phone
  // (or a short window) the same ride simply scrubs as the section passes.
  // matchMedia rebuilds this on resize / orientation change.
  const media = gsap.matchMedia();
  const build = (pinned: boolean) => {
    const odometer = { value: 0 };
    // Text, not a transform — the odometer is a counter (see `withSync`).
    const sync = () => {
      if (readout) readout.textContent = Math.round(odometer.value).toLocaleString("en-US");
    };
    sync();
    // The first stop starts lit; the rest light up as the ride reaches them.
    if (pinned) gsap.set(steps.slice(1), { opacity: 0.32 });
    gsap.set(pins.slice(1), { opacity: 0.32 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: withSync(
        pinned
          ? {
              trigger: panel,
              start: "top 88px",
              end: () => `+=${count * window.innerHeight * 0.7}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            }
          : { trigger: stage, start: "top 75%", end: "bottom 45%", scrub: 0.6 },
        sync,
      ),
    });
    tl.to({}, { duration: count }, 0);
    // Whole dash periods and whole wheel turns, so the last frame is the
    // resting frame the page renders without JS.
    tl.fromTo(dashes, { x: 0 }, { x: -DASH_PERIOD * 3 * count, duration: count }, 0);
    // Spin each wheel about its own hub, not the SVG origin.
    tl.fromTo(wheels, { rotation: 0, transformOrigin: "50% 50%" }, { rotation: 720 * count, duration: count }, 0);
    tl.fromTo(fill, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: count }, 0);
    if (readout) tl.to(odometer, { value: total, duration: count, onUpdate: sync }, 0);

    steps.forEach((step, index) => {
      if (pinned) {
        if (index > 0) tl.to(step, { opacity: 1, duration: 0.2 }, index);
        if (index < count - 1) tl.to(step, { opacity: 0.32, duration: 0.2 }, index + 1);
      }
      if (index > 0 && pins[index]) tl.to(pins[index], { opacity: 1, duration: 0.2 }, index);
    });
  };
  media.add("(min-width: 900px) and (min-height: 620px)", () => build(true));
  media.add("(max-width: 899px), (max-height: 619px)", () => build(false));
  return () => media.revert();
};

const environment: Scene = (stage, gsap) => {
  reveal(gsap, stage);

  // Seismic terrain: the seismograph traces itself and the page trembles,
  // faintly, as the visitor scrolls through it. A description of the setting.
  const trace = one<SVGPathElement>(stage, "[data-trace]");
  if (trace) {
    const length = prepareDraw(trace);
    gsap.fromTo(
      trace,
      { strokeDashoffset: length },
      { strokeDashoffset: 0, ease: "none", scrollTrigger: scrubOnView(stage, "center 45%") },
    );
  }
  const jitter = all(stage, "[data-jitter]");
  if (jitter.length > 0) {
    gsap.fromTo(
      jitter,
      { x: 0 },
      {
        keyframes: [{ x: -4 }, { x: 4 }, { x: -3 }, { x: 3 }, { x: -1.5 }, { x: 0 }],
        ease: "none",
        scrollTrigger: scrubOnView(stage, "bottom 55%"),
      },
    );
  }

  // Volcanic geography: embers drift up (bottom to top) as the section passes
  // — one timeline, one trigger for all of them.
  const embers = all(stage, "[data-fx]").filter(shown);
  if (embers.length > 0) {
    const tl = gsap.timeline({
      defaults: { ease: "none", duration: 1 },
      scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: true },
    });
    embers.forEach((ember) => {
      tl.fromTo(ember, { y: 120 * depthOf(ember), opacity: 0 }, { y: -220 * depthOf(ember), opacity: 1 }, 0);
    });
  }
};

const discovery: Scene = (stage, gsap) => {
  reveal(gsap, stage);
  all(stage, "[data-outline]").forEach((path) => {
    const length = prepareDraw(path as unknown as SVGGeometryElement);
    gsap.fromTo(
      path,
      { strokeDashoffset: length },
      { strokeDashoffset: 0, duration: 2.2, ease: ease.travel, scrollTrigger: playOnView(stage) },
    );
  });
  // The big outlined words behind each discovery slide sideways, slowly.
  all(stage, "[data-word]").forEach((word) => {
    gsap.fromTo(
      word,
      { x: 60 },
      { x: -60, ease: "none", scrollTrigger: { trigger: word, start: "top bottom", end: "bottom top", scrub: true } },
    );
  });
};

const memory: Scene = (stage, gsap) => {
  // Slow and quiet: each frame simply arrives, one after another.
  all(stage, "[data-frame]").forEach((frame) => {
    gsap.fromTo(
      frame,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 1.8,
        ease: ease.ui,
        scrollTrigger: { trigger: frame, start: "top 82%", toggleActions: "play none none none" },
      },
    );
  });
  // The film's sprocket rails creep past, barely.
  const rails = all(stage, "[data-rail]");
  if (rails.length > 0) {
    const tl = gsap.timeline({
      defaults: { ease: "none", duration: 1 },
      scrollTrigger: scrubOnView(stage, "bottom top"),
    });
    rails.forEach((rail, index) => tl.fromTo(rail, { x: index % 2 === 0 ? 24 : -24 }, { x: index % 2 === 0 ? -24 : 24 }, 0));
  }
  reveal(gsap, stage);
};

// Page 11: the illustration (or, once supplied, the real photograph) settles
// in the same stage with the same entrance — swapping one for the other never
// changes the animation structure.
const signature: Scene = (stage, gsap) => {
  reveal(gsap, stage);
  const photo = all(stage, "[data-sig-photo]");
  if (photo.length > 0) {
    gsap.fromTo(
      photo,
      { scale: 1.08 },
      { scale: 1, duration: 2.4, ease: ease.travel, scrollTrigger: playOnView(stage) },
    );
  }
};

// Wordless atmosphere for a chapter with no manuscript yet: the country's own
// landscape drifts at depth while the red road runs through it as the visitor
// scrolls, and the coordinates tick across. No copy, so nothing to invent.
const interlude: Scene = (stage, gsap) => {
  drift(gsap, stage, all(stage, "[data-drift]"), 90, "top bottom");
  gsap.fromTo(
    all(stage, "[data-road]"),
    { scaleX: 0, transformOrigin: "0% 50%" },
    { scaleX: 1, ease: "none", scrollTrigger: { trigger: stage, start: "top 75%", end: "bottom 55%", scrub: 0.6 } },
  );
  reveal(gsap, stage, "[data-reveal]", "top 70%");
};

const departure: Scene = (stage, gsap) => {
  reveal(gsap, stage);
  const map = one<HTMLElement>(stage, "[data-map]");
  if (!map) return;

  const out = one<SVGPathElement>(stage, "[data-out]");
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: map, start: "top 75%", end: "bottom 45%", scrub: 0.6 },
  });
  // This chapter turns from blue (the road ahead) to red (ridden) as the
  // visitor scrolls — progressively, never a switch — and the next road, still
  // blue, draws out ahead of it.
  tl.fromTo(all(stage, "[data-blue]"), { opacity: 1 }, { opacity: 0 }, 0.1)
    .fromTo(all(stage, "[data-red]"), { opacity: 0 }, { opacity: 1 }, 0.1)
    .fromTo(all(stage, "[data-next]"), { opacity: 0 }, { opacity: 1 }, 0.55);
  if (out) {
    if (out.hasAttribute("data-dashed")) {
      tl.fromTo(out, { opacity: 0 }, { opacity: 1 }, 0.2);
    } else {
      const length = prepareDraw(out);
      tl.fromTo(out, { strokeDashoffset: length }, { strokeDashoffset: 0 }, 0.2);
    }
  }
};

const transition: Scene = (stage, gsap) => {
  reveal(gsap, stage, "[data-reveal]", "top 60%");
  gsap.fromTo(
    all(stage, "[data-fade]"),
    { opacity: 1 },
    { opacity: 0.12, ease: "none", scrollTrigger: { trigger: stage, start: "top 60%", end: "center 40%", scrub: true } },
  );
  // The red road (ridden) exits to the right while the blue road (ahead)
  // draws in behind it: one continuous line, changing colour as it goes.
  gsap.fromTo(
    all(stage, "[data-road]"),
    { scaleX: 0, transformOrigin: "0% 50%" },
    { scaleX: 1, ease: "none", scrollTrigger: { trigger: stage, start: "top 80%", end: "center 45%", scrub: true } },
  );
  gsap.fromTo(
    all(stage, "[data-road-red]"),
    { xPercent: 0 },
    { xPercent: 12, ease: "none", scrollTrigger: { trigger: stage, start: "top 60%", end: "bottom 60%", scrub: true } },
  );
};

const gateway: Scene = (stage, gsap) => {
  const segments = all(stage, "[data-seg]") as unknown as SVGGeometryElement[];
  const rides = all(stage, "[data-ride]") as unknown as SVGGeometryElement[];
  const dots = all(stage, "[data-dot]");
  const odometer = one<HTMLElement>(stage, "[data-count]");
  const total = Number(odometer?.dataset.total ?? 0);
  const step = 0.1;

  // First the whole route draws in blue — the road ahead, country by country —
  // once, when the map comes into view. The route follows the road it
  // describes, so it is sequenced country by country rather than staggered in
  // one burst (the one place the five-item stagger cap yields — §0 #20).
  const blue = gsap.timeline({ scrollTrigger: { trigger: stage, start: "top 75%", toggleActions: "play none none none" } });
  blue.fromTo(all(stage, "[data-land]"), { opacity: 0 }, { opacity: 1, duration: 1, ease: ease.ui }, 0);
  segments.forEach((path, index) => {
    const length = prepareDraw(path);
    blue.fromTo(
      path,
      { strokeDashoffset: length },
      { strokeDashoffset: 0, duration: 0.35, ease: ease.travel },
      0.3 + index * step,
    );
  });
  blue.fromTo(dots, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: ease.ui, stagger: { each: step, from: "start" } }, 0.3);

  // …then it turns red *with the scroll*: the wave that rides the road, and
  // the kilometre counter with it, follow the visitor's position on the page
  // — progressive and reversible, never a switch.
  const meter = { value: 0 };
  const sync = () => {
    if (odometer) odometer.textContent = Math.round(meter.value).toLocaleString("en-US");
  };
  sync();
  const red = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: withSync({ trigger: stage, start: "top 50%", end: "bottom 70%", scrub: 0.6 }, sync),
  });
  rides.forEach((path, index) => {
    const length = prepareDraw(path);
    red.fromTo(path, { strokeDashoffset: length }, { strokeDashoffset: 0, duration: 0.4 }, index * 0.11);
  });
  const span = rides.length * 0.11 + 0.4;
  red.fromTo(all(stage, "[data-unfinished]"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, span - 0.2);
  if (odometer) red.to(meter, { value: total, duration: span, onUpdate: sync }, 0);
};

export const choreographies = {
  hero,
  arrival,
  road,
  environment,
  discovery,
  memory,
  signature,
  interlude,
  departure,
  transition,
  gateway,
};
export type SceneName = keyof typeof choreographies;
