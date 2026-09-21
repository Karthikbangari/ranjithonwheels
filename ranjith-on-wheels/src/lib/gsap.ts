import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

let registered = false;

export function registerGsap() {
  if (registered) return gsap;
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  registered = true;
  return gsap;
}

// A read-only probe for tests and profiling: how many ScrollTriggers are alive
// right now. Chapter pages must clean up after themselves on every navigation,
// so this number returns to its baseline when a chapter unmounts.
declare global {
  interface Window {
    __rowMotion?: { triggers: () => number };
  }
}
if (typeof window !== "undefined") {
  window.__rowMotion = { triggers: () => ScrollTrigger.getAll().length };
}

export { gsap, ScrollTrigger, MotionPathPlugin };
