/**
 * Renders scripts/diagrams/diagrams.html to PNG with headless Chrome.
 *
 *   node scripts/diagrams/render.mjs [linkedinOutDir]
 *
 * Landscape 1200x630 goes to public/writing/<slug>.png (article figure + link
 * preview). With an out dir, also writes 1080x1350 portrait PNGs for LinkedIn
 * and an animated GIF of the human-in-the-loop flow (needs ImageMagick).
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const page = join(here, "diagrams.html");
const chrome = process.env.CHROME ?? "google-chrome";

const SLUGS = [
  "multi-tenant-architecture",
  "human-in-the-loop-ai-agents",
  "agentic-ai-tool-design",
  "rag-retrieval-hybrid-search",
  "multi-agent-systems",
  "llm-evaluation-llm-as-a-judge",
];

function shot(query, [width, height], out) {
  execFileSync(chrome, [
    "--headless=new",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    "--force-device-scale-factor=1",
    `--window-size=${width},${height}`,
    // Lets fonts and the inline script settle before capture.
    "--virtual-time-budget=3000",
    `--screenshot=${out}`,
    `file://${page}?${query}`,
  ], { stdio: "ignore" });
}

const siteDir = join(root, "public/writing");
mkdirSync(siteDir, { recursive: true });
for (const slug of SLUGS) shot(`d=${slug}`, [1200, 630], join(siteDir, `${slug}.png`));

const linkedinDir = process.argv[2];
if (linkedinDir) {
  mkdirSync(linkedinDir, { recursive: true });
  for (const slug of SLUGS) shot(`d=${slug}`, [1080, 1350], join(linkedinDir, `${slug}.png`));

  // GIF: walk the highlight through the six steps of the approval flow.
  const frames = join(linkedinDir, "frames");
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames);
  const paths = [];
  for (let step = 0; step < 6; step++) {
    const p = join(frames, `f${step}.png`);
    shot(`d=human-in-the-loop-ai-agents&step=${step}`, [1080, 1350], p);
    paths.push(p);
  }
  execFileSync("magick", [
    "-delay", "110", ...paths,
    "-delay", "260", paths.at(-1),
    "-loop", "0", "-layers", "Optimize",
    join(linkedinDir, "human-in-the-loop-ai-agents.gif"),
  ]);
}
