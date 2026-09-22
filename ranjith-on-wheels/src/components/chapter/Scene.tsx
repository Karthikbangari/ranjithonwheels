import type { ComponentPropsWithoutRef } from "react";

// A plain section. `name` is accepted so call sites don't need to change, but
// nothing reads it — there is no per-section choreography any more (CLAUDE.md
// §0 decision #23). The only motion on the whole site is the shared CSS
// `fade` class every section already carries.
export function Scene({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- accepted so call sites don't change, never read
  name,
  children,
  className,
  ...props
}: { name: string } & ComponentPropsWithoutRef<"section">) {
  return (
    <section className={`${className ?? ""} fade`} {...props}>
      {children}
    </section>
  );
}
