/**
 * Capture the project screenshots for the work section.
 *
 * These are real UIs behind real logins, so this cannot be fully automated. The
 * script opens a visible browser, walks you to each app, waits while you log in,
 * then captures at the exact aspect ratio each card expects and writes straight
 * into public/work/.
 *
 *   node scripts/capture-work.mjs             # all targets
 *   node scripts/capture-work.mjs napcrm      # one target
 *
 * The browser profile persists in .capture-profile/, so logins survive between
 * runs and you only sign in once per app.
 */

import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");

// Playwright is not a dependency of this site. Use whichever copy is around.
let chromium;
for (const candidate of ["playwright", "D:/Nexspire/qa/node_modules/playwright"]) {
  try {
    ({ chromium } = require(candidate));
    break;
  } catch {
    /* try the next one */
  }
}

if (!chromium) {
  console.error(
    "Playwright not found. Either run this from a machine with D:/Nexspire/qa\n" +
      "installed, or: npm i -D playwright && npx playwright install chromium",
  );
  process.exit(1);
}

/**
 * viewport drives the aspect ratio. Every width stays comfortably desktop so no
 * target renders its mobile layout.
 */
const TARGETS = [
  {
    name: "supermanager",
    url: "https://www.supermanager.co/",
    viewport: { width: 1440, height: 900 }, // 16:10
    note: "Open the app and land on an agent run or workflow view, not the marketing page.",
  },
  {
    name: "napcrm",
    url: "https://admin.napnix.in/",
    viewport: { width: 1280, height: 1600 }, // 4:5
    note: "Sign in, then navigate to the tenants list or a tenant dashboard.",
  },
  {
    name: "adnosaur",
    url: "https://app.adnosaur.com/",
    viewport: { width: 1400, height: 933 }, // 3:2
    note: "Last checked this host returned 502. Bring it up first or skip this one.",
  },
  {
    name: "napseo",
    url: "http://localhost:5174/",
    viewport: { width: 1600, height: 900 }, // 16:9
    note: "Start the napseo frontend and backend locally first.",
  },
  {
    name: "covix",
    url: "about:blank",
    viewport: { width: 1600, height: 900 }, // 16:9
    note: "No UI exists. Open a notebook showing a prediction or the confusion matrix, or skip.",
  },
];

const wanted = process.argv.slice(2);
const targets = wanted.length
  ? TARGETS.filter((t) => wanted.includes(t.name))
  : TARGETS;

if (targets.length === 0) {
  console.error(`No target matched. Known: ${TARGETS.map((t) => t.name).join(", ")}`);
  process.exit(1);
}

const outDir = resolve(repoRoot, "public/work");
mkdirSync(outDir, { recursive: true });

const rl = readline.createInterface({ input: stdin, output: stdout });

const context = await chromium.launchPersistentContext(
  resolve(repoRoot, ".capture-profile"),
  { headless: false, viewport: null },
);

for (const target of targets) {
  console.log(`\n--- ${target.name}`);
  console.log(`    ${target.note}`);

  const page = await context.newPage();
  await page.setViewportSize(target.viewport);

  try {
    if (target.url !== "about:blank") {
      await page.goto(target.url, { waitUntil: "domcontentloaded", timeout: 60000 });
    }
  } catch (error) {
    console.log(`    could not load: ${error.message.split("\n")[0]}`);
  }

  const answer = await rl.question(
    "    Get the page how you want it, then press Enter to capture (or type s to skip): ",
  );

  if (answer.trim().toLowerCase() === "s") {
    console.log("    skipped");
    await page.close();
    continue;
  }

  // Re-assert the viewport: navigating or opening devtools can change it.
  await page.setViewportSize(target.viewport);
  await page.waitForTimeout(400);

  const file = resolve(outDir, `${target.name}.jpg`);
  await page.screenshot({ path: file, type: "jpeg", quality: 82, scale: "device" });
  console.log(`    wrote ${file}`);

  await page.close();
}

await rl.close();
await context.close();
console.log("\nDone. Rebuild to see them: npm run build");
