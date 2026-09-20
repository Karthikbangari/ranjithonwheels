"use client";

import type { ComponentPropsWithoutRef } from "react";
import { choreographies, type SceneName } from "./choreography";
import { useChapterMotion } from "./useChapterMotion";

// The one client boundary for a chapter page's motion. The markup inside is
// rendered on the server and complete; `name` picks the choreography that
// animates it (see choreography.ts).
export function Scene({
  name,
  children,
  ...props
}: { name: SceneName } & ComponentPropsWithoutRef<"section">) {
  const ref = useChapterMotion<HTMLElement>(choreographies[name]);
  return (
    <section ref={ref} {...props}>
      {children}
    </section>
  );
}
