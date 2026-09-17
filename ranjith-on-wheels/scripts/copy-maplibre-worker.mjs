// maplibre-gl's tile-processing worker is a separate .mjs file (plus a
// sibling module it imports) that the library resolves relative to its own
// package location at runtime — a resolution that doesn't survive Next's
// bundling, silently breaking the worker with no error. Copying both files
// into /public lets the browser fetch them directly. See MapProvider.tsx.
import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const files = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

for (const file of files) {
  const source = path.join(root, "..", "node_modules", "maplibre-gl", "dist", file);
  const destination = path.join(root, "..", "public", file);
  if (!existsSync(source)) {
    console.warn(`[copy-maplibre-worker] ${source} not found — skipping. Is maplibre-gl installed?`);
    continue;
  }
  copyFileSync(source, destination);
  console.log(`[copy-maplibre-worker] copied ${file} to public/`);
}
