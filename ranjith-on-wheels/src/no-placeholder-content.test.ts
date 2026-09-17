import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// CLAUDE.md §1/§8/§14.6: a missing fact must be marked with an `// OWNER:`
// comment and the section rendered without it — never a visible internal
// task label. "TODO_OWNER_APPROVAL" was previously used as a literal
// placeholder value across journey.ts, site.ts, socials.ts, support.ts and
// several page components, and rendered verbatim on live pages (the
// homepage Stories section, the global footer, /contact, /book, /about).
// This test fails the build if that pattern reappears anywhere in source.
const BANNED_PLACEHOLDER = "TODO_OWNER_APPROVAL";

function collectSourceFiles(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      collectSourceFiles(fullPath, files);
    } else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith(".test.ts") && !entry.endsWith(".test.tsx")) {
      files.push(fullPath);
    }
  }
  return files;
}

describe("no placeholder content", () => {
  it("never contains the internal TODO_OWNER_APPROVAL marker as visible or renderable text", () => {
    const srcDir = import.meta.dirname;
    const offenders = collectSourceFiles(srcDir)
      .filter((file) => readFileSync(file, "utf8").includes(BANNED_PLACEHOLDER))
      .map((file) => file.replace(srcDir + "/", ""));

    expect(offenders).toEqual([]);
  });
});
