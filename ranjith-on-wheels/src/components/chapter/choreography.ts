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
type Api = typeof Gsap;
type Node = HTMLElement | SVGElement;
type Scene = (stage: HTMLElement, gsap: Api) => void | (() => void);

const all = (stage: HTMLElement, selector: string) => Array.from(stage.querySelectorAll<Node>(selector));
const one = <T extends Element>(stage: HTMLElement, selector: string) => stage.querySelector<T>(selector);
const depthOf = (el: Node) => Number(el.dataset.depth ?? 0.5);

// Trace a path along its length. Not a transform — but the only way to draw a
// line on, and the rest state (no dasharray at all) is the complete line.
function prepareDraw(path: SVGGeometryElement) {
  const length = path.getTotalLength();
  path.style.strokeDasharray = `${length}`;
  return length;
}

// Shapes drift at different speeds as the page scrolls: depth without ever
// moving text (parallax on text is banned).
function drift(gsap: Api, stage: HTMLElement, els: Node[], distance: number, start = "top top") {
  els.forEach((el) => {
    gsap.to(el, {
      y: -distance * depthOf(el),
      ease: "none",
      scrollTrigger: { trigger: stage, start, end: "bottom top", scrub: true },
    });
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
  // The previous chapter's hand-off veil (see TransitionLink) is still up:
  // this hero is what it was covering, so let it go.
  const veil = document.getElementById("chapter-veil");
  if (veil) gsap.to(veil, { opacity: 0, duration: 0.9, ease: ease.ui, delay: 0.25, onComplete: () => veil.remove() });

  const tl = gsap.timeline({ defaults: { ease: ease.reveal } });
  tl.fromTo(all(stage, "[data-photo]"), { scale: 1.14 }, { scale: 1, duration: 2.6, ease: ease.travel }, 0)
    .fromTo(all(stage, "[data-layer]"), { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1.4, stagger: 0.08 }, 0.1)
    .fromTo(all(stage, ".line-inner"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.25)
    .fromTo(all(stage, "[data-meta]"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.06 }, 0.8)
    .fromTo(all(stage, "[data-route-out], [data-marker]"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.4);

  all(stage, "[data-outline]").forEach((path) => {
    const length = prepareDraw(path as unknown as SVGGeometryElement);
    tl.fromTo(path, { strokeDashoffset: length }, { strokeDashoffset: 0, duration: 2, ease: ease.travel }, 0.3);
  });
  all(stage, "[data-route-in]").forEach((path) => {
    const length = prepareDraw(path as unknown as SVGGeometryElement);
    tl.fromTo(path, { strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.6, ease: ease.travel }, 0.5);
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

  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: map, start: "top 75%", end: "bottom 45%", scrub: 0.6 },
    })
    // The road ahead (blue, underneath) becomes the road ridden (red) as the
    // visitor scrolls: the line, the traveller and the coordinates travel together.
    .fromTo(
      progress,
      dashed ? { opacity: 0 } : { strokeDashoffset: length },
      dashed ? { opacity: 1 } : { strokeDashoffset: 0 },
      0,
    )
    .fromTo(
      trip,
      { p: 0 },
      {
        p: 1,
        onUpdate: () => {
          const point = progress.getPointAtLength(trip.p * length);
          traveller?.setAttribute("cx", `${point.x}`);
          traveller?.setAttribute("cy", `${point.y}`);
          if (coords && from && to) {
            const at: LonLat = [from[0] + (to[0] - from[0]) * trip.p, from[1] + (to[1] - from[1]) * trip.p];
            coords.textContent = formatCoords(at);
          }
        },
      },
      0,
    );
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
  const media = gsap.matchMedia();
  const build = (pinned: boolean) => {
    const odometer = { value: 0 };
    // Text, not a transform — the odometer is a counter. ScrollTrigger applies
    // an already-scrolled position (a reload mid-page, the End key) with tween
    // callbacks suppressed, so the text is also written from the trigger's own
    // refresh/update, which are not: otherwise it would sit at 0 beside a
    // finished road.
    const sync = () => {
      if (readout) readout.textContent = Math.round(odometer.value).toLocaleString("en-US");
    };
    sync();
    // The first stop starts lit; the rest light up as the ride reaches them.
    if (pinned) gsap.set(steps.slice(1), { opacity: 0.32 });
    gsap.set(pins.slice(1), { opacity: 0.32 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: pinned
        ? {
            trigger: panel,
            start: "top 88px",
            end: () => `+=${count * window.innerHeight * 0.7}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: sync,
            onUpdate: sync,
          }
        : { trigger: stage, start: "top 75%", end: "bottom 45%", scrub: 0.6, onRefresh: sync, onUpdate: sync },
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

const challenge: Scene = (stage, gsap) => {
  reveal(gsap, stage);

  // Tremor: the seismograph traces itself and the page trembles, faintly,
  // as the visitor scrolls through it.
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

  // Embers rise (bottom to top) as the section passes.
  const embers = all(stage, "[data-fx]");
  embers.forEach((ember) => {
    gsap.fromTo(
      ember,
      { y: 120 * depthOf(ember), opacity: 0 },
      {
        y: -220 * depthOf(ember),
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });
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
  const frames = all(stage, "[data-frame]");
  // Slow and quiet: each frame simply arrives, one after another.
  frames.forEach((frame) => {
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
  all(stage, "[data-rail]").forEach((rail, index) => {
    gsap.fromTo(
      rail,
      { x: index % 2 === 0 ? 24 : -24 },
      { x: index % 2 === 0 ? -24 : 24, ease: "none", scrollTrigger: scrubOnView(stage, "bottom top") },
    );
  });
  reveal(gsap, stage);
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
  // This chapter turns from blue (the road ahead) to red (ridden): it has
  // become a memory. The next road, still blue, draws out ahead of it.
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
  gsap.fromTo(
    all(stage, "[data-road]"),
    { scaleX: 0, transformOrigin: "0% 50%" },
    { scaleX: 1, ease: "none", scrollTrigger: { trigger: stage, start: "top 80%", end: "center 45%", scrub: true } },
  );
};

const gateway: Scene = (stage, gsap) => {
  const segments = all(stage, "[data-seg]") as unknown as SVGGeometryElement[];
  const rides = all(stage, "[data-ride]") as unknown as SVGGeometryElement[];
  const dots = all(stage, "[data-dot]");
  const odometer = one<HTMLElement>(stage, "[data-count]");
  const total = Number(odometer?.dataset.total ?? 0);
  const step = 0.1;
  const redStart = 0.4 + segments.length * step + 0.3;

  const tl = gsap.timeline({ scrollTrigger: { trigger: stage, start: "top 60%", toggleActions: "play none none none" } });
  // The route follows the road it describes, so it is sequenced country by
  // country rather than staggered in one burst — the one place the
  // five-item stagger cap yields (recorded in CLAUDE.md §0 decision #20).
  tl.fromTo(all(stage, "[data-land]"), { opacity: 0 }, { opacity: 1, duration: 1, ease: ease.ui }, 0);

  // First the whole route is blue — the road ahead, country by country…
  segments.forEach((path, index) => {
    const length = prepareDraw(path);
    tl.fromTo(
      path,
      { strokeDashoffset: length },
      { strokeDashoffset: 0, duration: 0.35, ease: ease.travel },
      0.4 + index * step,
    );
  });
  tl.fromTo(dots, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: ease.ui, stagger: { each: step, from: "start" } }, 0.4);

  // …then it turns red behind a wave that rides it end to end.
  rides.forEach((path, index) => {
    const length = prepareDraw(path);
    tl.fromTo(
      path,
      { strokeDashoffset: length },
      { strokeDashoffset: 0, duration: 0.4, ease: ease.travel },
      redStart + index * 0.11,
    );
  });
  tl.fromTo(all(stage, "[data-unfinished]"), { opacity: 0 }, { opacity: 1, duration: 1, ease: ease.ui }, redStart + rides.length * 0.11);

  if (odometer) {
    odometer.textContent = "0";
    const meter = { value: 0 };
    // Text, not a transform — the kilometre counter.
    tl.to(
      meter,
      {
        value: total,
        duration: rides.length * 0.11 + 0.4,
        ease: "none",
        onUpdate: () => {
          odometer.textContent = Math.round(meter.value).toLocaleString("en-US");
        },
      },
      redStart,
    );
  }
};

export const choreographies = { hero, arrival, road, challenge, discovery, memory, departure, transition, gateway };
export type SceneName = keyof typeof choreographies;
