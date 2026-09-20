import type { Story } from "@/content/stories";
import { Canopy } from "./motifs/Canopy";
import { Ferry } from "./motifs/Ferry";
import { Fireworks } from "./motifs/Fireworks";
import { Horizon } from "./motifs/Horizon";
import { Ink } from "./motifs/Ink";
import { Falls } from "./motifs/Falls";
import { Petals } from "./motifs/Petals";
import { Skyline } from "./motifs/Skyline";
import { Terraces } from "./motifs/Terraces";
import { Towers } from "./motifs/Towers";

// Each story's bespoke animation. The motif is decorative — the meaning
// lives in the moments beside it — so every one is aria-hidden.
export function Motif({ story }: { story: Story }) {
  switch (story.motif) {
    case undefined:
      return null;
    case "falls":
      return <Falls />;
    case "terraces":
      return <Terraces />;
    case "towers":
      return <Towers />;
    case "canopy":
      return <Canopy />;
    case "skyline":
      return <Skyline />;
    case "ferry":
      return <Ferry story={story} />;
    case "ink":
      return <Ink />;
    case "petals":
      return <Petals />;
    case "fireworks":
      return <Fireworks />;
    case "horizon":
      return <Horizon />;
  }
}
