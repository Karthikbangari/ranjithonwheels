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
