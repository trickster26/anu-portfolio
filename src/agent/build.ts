/**
 * The full set of machine-readable artefacts emitted beside the app bundle.
 *
 * One function returns every generated file so the Vite plugin stays dumb and
 * the tests can assert on the exact bytes that ship.
 */

import { agentPages } from "./pages";
import {
  SITE_ORIGIN,
  homeMarkdown,
  llmsFullTxt,
  llmsTxt,
  notFoundMarkdown,
  pageMarkdown,
  url,
} from "./markdown";
import { renderNotFoundHtml, renderPageHtml, type Assets } from "./html";

export type Artifact = { fileName: string; source: string };

/** Date the homepage content last changed, for sitemap lastmod. */
const HOME_UPDATED = "2026-10-16";

export function sitemapXml(): string {
  const entries = [
    { loc: url("/"), lastmod: HOME_UPDATED, priority: "1.0", changefreq: "monthly" },
    ...agentPages.map((page) => ({
      loc: url(page.path),
      lastmod: page.updated,
      priority: page.path === "/privacy" ? "0.4" : "0.7",
      changefreq: "yearly",
    })),
  ];

  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/**
 * Cloudflare Pages `_headers`. Ignored by GitHub Pages, which is fine: the
 * markdown files still serve there, they just do not get these headers.
 *
 * Negotiation itself lives in functions/_middleware.ts. This file only pins the
 * content type of the static markdown twins and points at them from the HTML.
 */
export function headersFile(): string {
  return `# Cloudflare Pages headers. Negotiation lives in functions/_middleware.ts.

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

# Markdown twins. Explicit type so no CDN sniffs them into octet-stream.
/*.md
  Content-Type: text/markdown; charset=utf-8
  Vary: Accept
  Cache-Control: public, max-age=300, must-revalidate

/llms.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=300, must-revalidate

/llms-full.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=300, must-revalidate
`;
}

/**
 * robots.txt. Generated rather than kept in public/ so the sitemap and llms.txt
 * lines cannot drift from what is actually published.
 */
export function robotsTxt(): string {
  return `User-agent: *
Allow: /

# Answer engines that cite sources. Nothing here is private, so let them read it.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml

# Agent guidance, per llmstxt.org. Every page also has a .md twin at <path>.md,
# and responds to Accept: text/markdown.
# ${SITE_ORIGIN}/llms.txt
`;
}

/**
 * Cloudflare Pages `_routes.json`.
 *
 * Without this, the middleware runs on every request including fonts and the
 * JS bundle, which costs invocations for nothing. Only routes that can be
 * negotiated need it. Ignored by GitHub Pages.
 */
export function routesJson(): string {
  return `${JSON.stringify(
    {
      version: 1,
      include: ["/*"],
      // Static media and the hashed bundle can never be negotiated and are
      // never indexed on their own, so they skip the worker entirely. The .md
      // and .txt documents stay in: they are cheap, and on a preview host the
      // middleware is what stamps them noindex.
      exclude: ["/assets/*", "/fonts/*", "/work/*", "/favicon.svg", "/og.jpg"],
    },
    null,
    2,
  )}
`;
}

export function agentArtifacts(assets: Assets): Artifact[] {
  const artifacts: Artifact[] = [];

  for (const page of agentPages) {
    // Flat file rather than <slug>/index.html. Both hosts serve `about.html`
    // at the extensionless `/about`, whereas the directory form makes
    // Cloudflare Pages 308 `/about` to `/about/` — a redirect hop, and a
    // mismatch with the canonical URL this page declares.
    artifacts.push({
      fileName: `${page.path.replace(/^\//, "")}.html`,
      source: renderPageHtml(page, assets),
    });
    artifacts.push({
      fileName: page.markdownPath.replace(/^\//, ""),
      source: pageMarkdown(page),
    });
  }

  artifacts.push({ fileName: "404.html", source: renderNotFoundHtml(assets) });
  artifacts.push({ fileName: "404.md", source: notFoundMarkdown() });
  artifacts.push({ fileName: "index.md", source: homeMarkdown() });
  artifacts.push({ fileName: "llms.txt", source: llmsTxt() });
  artifacts.push({ fileName: "llms-full.txt", source: llmsFullTxt() });
  artifacts.push({ fileName: "sitemap.xml", source: sitemapXml() });
  artifacts.push({ fileName: "robots.txt", source: robotsTxt() });
  artifacts.push({ fileName: "_headers", source: headersFile() });
  artifacts.push({ fileName: "_routes.json", source: routesJson() });

  return artifacts;
}
