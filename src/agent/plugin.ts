/**
 * Vite plugin that makes the site legible to agents.
 *
 * Two jobs:
 *
 * 1. Put the homepage's real text into index.html before any JavaScript runs.
 *    The markup goes inside #root, so React's first render replaces it; an
 *    inline script sets data-js on <html> first, and CSS hides the block on
 *    that attribute, so a scripted browser never sees it. A crawler that does
 *    not execute JavaScript reads the full page.
 *
 * 2. Emit the machine-readable siblings: the static /about, /contact and
 *    /privacy pages, a 404 with a markdown body, a .md twin of every page,
 *    llms.txt, llms-full.txt, sitemap.xml, robots.txt and _headers.
 */

import type { Plugin } from "vite";
import { agentArtifacts } from "./build";
import { homeFallbackHtml } from "./html";
import { url } from "./markdown";

/**
 * Runs before anything paints. Kept inline and tiny: if it were deferred, the
 * fallback would flash before it was hidden.
 */
const JS_FLAG_SCRIPT = `<script>document.documentElement.dataset.js="1"</script>`;

/**
 * Hiding rule. Inline rather than in index.css so it applies even if the
 * stylesheet has not arrived yet.
 */
const JS_FLAG_STYLE = `<style>html[data-js="1"] #no-js-content{display:none!important}</style>`;

const MARKDOWN_ALTERNATE = `<link rel="alternate" type="text/markdown" href="${url("/index.md")}" />`;

export function agentReady(): Plugin {
  return {
    name: "agent-ready",

    transformIndexHtml: {
      order: "pre",
      handler(html) {
        let output = html;

        // </head> is the last safe anchor: the flag script has to come after
        // nothing in particular, but the style has to precede first paint.
        output = output.replace(
          "</head>",
          `  ${MARKDOWN_ALTERNATE}\n    ${JS_FLAG_STYLE}\n    ${JS_FLAG_SCRIPT}\n  </head>`,
        );

        output = output.replace(
          '<div id="root"></div>',
          `<div id="root">${homeFallbackHtml()}</div>`,
        );

        return output;
      },
    },

    generateBundle(_options, bundle) {
      const css = Object.keys(bundle)
        .filter((fileName) => fileName.endsWith(".css"))
        .map((fileName) => `/${fileName}`)
        .sort();

      for (const artifact of agentArtifacts({ css })) {
        this.emitFile({ type: "asset", fileName: artifact.fileName, source: artifact.source });
      }
    },
  };
}
