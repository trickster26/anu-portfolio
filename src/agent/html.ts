/**
 * Static HTML for everything React does not render: the trust-anchor pages, the
 * 404, and the no-JavaScript fallback that sits inside #root.
 *
 * These are plain strings rather than React components on purpose. They have to
 * exist in the shipped HTML *before* any JavaScript runs, which is the whole
 * point of the exercise, and a component would only reach the page after
 * hydration. Class names are written literally so Tailwind's source scan picks
 * them up — this file is under src/, so it is scanned like any component.
 */

import {
  capabilities,
  contact,
  education,
  experience,
  hero,
  person,
  projects,
  stack,
  tenancy,
} from "../content";
import { agentPages, type AgentPage, type Block } from "./pages";
import { SITE_ORIGIN, url } from "./markdown";

export type Assets = {
  /** Hrefs of the built CSS files, in load order. */
  css: string[];
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** JSON-LD is embedded in a <script>, so `</` has to be broken up. */
function jsonLd(data: unknown): string {
  const json = JSON.stringify(data, null, 2).replace(/<\//g, "<\\/");
  return `<script type="application/ld+json">\n${json}\n</script>`;
}

const FONT_PRELOADS = [
  `<link rel="preload" href="/fonts/ClashDisplay-Variable.woff2" as="font" type="font/woff2" crossorigin />`,
  `<link rel="preload" href="/fonts/Satoshi-Variable.woff2" as="font" type="font/woff2" crossorigin />`,
].join("\n    ");

/**
 * Shell shared by the static pages. No script tag: these pages are text, they
 * do not need React, and shipping the app bundle to them would only delay the
 * one thing they are for.
 */
function shell(options: {
  title: string;
  description: string;
  canonical: string;
  markdownHref: string | null;
  structuredData: unknown[];
  body: string;
  assets: Assets;
  noindex?: boolean;
  /** Absolute URL of the link-preview image. Defaults to the site card. */
  image?: string;
}): string {
  const { title, description, canonical, markdownHref, structuredData, body, assets } = options;

  const styles = assets.css
    .map((href) => `<link rel="stylesheet" href="${escapeHtml(href)}" />`)
    .join("\n    ");

  const alternate = markdownHref
    ? `\n    <link rel="alternate" type="text/markdown" href="${escapeHtml(markdownHref)}" />`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#08090c" />

    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />${alternate}
    <meta name="author" content="${escapeHtml(person.name)}" />
    <meta name="robots" content="${options.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1"}" />

    <meta property="og:type" content="${options.image ? "article" : "website"}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(options.image ?? `${SITE_ORIGIN}/og.jpg`)}" />
    <meta property="og:site_name" content="${escapeHtml(person.name)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${escapeHtml(options.image ?? `${SITE_ORIGIN}/og.jpg`)}" />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate" type="application/rss+xml" title="${escapeHtml(person.name)}: Writing" href="/rss.xml" />
    ${FONT_PRELOADS}
    ${styles}

    ${structuredData.map(jsonLd).join("\n    ")}
  </head>
  <body>
${body}
  </body>
</html>
`;
}

/** Header and footer for the static pages, matching the app's own chrome. */
function pageChrome(inner: string): string {
  return `    <div class="grain min-h-[100dvh] bg-bg">
      <header class="border-b border-line">
        <nav class="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8">
          <a href="/" class="font-display text-[15px] font-semibold tracking-tight text-text transition-colors hover:text-accent">${escapeHtml(person.name)}</a>
          <ul class="flex items-center gap-1 sm:gap-2">
            <li><a href="/about" class="rounded-full px-3 py-2 text-[13px] text-muted transition-colors hover:text-text">About</a></li>
            <li><a href="/contact" class="rounded-full px-3 py-2 text-[13px] text-muted transition-colors hover:text-text">Contact</a></li>
            <li><a href="/privacy" class="rounded-full px-3 py-2 text-[13px] text-muted transition-colors hover:text-text">Privacy</a></li>
          </ul>
        </nav>
      </header>

${inner}

      <footer class="border-t border-line py-10">
        <div class="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p class="font-display text-[15px] font-medium tracking-tight text-text">${escapeHtml(person.name)}</p>
          <p class="text-[13px] text-dim">${escapeHtml(person.role)}. ${escapeHtml(person.location)}.</p>
        </div>
      </footer>
    </div>`;
}

/** Turn bare URLs and email addresses in generated copy into real links. */
function linkify(text: string): string {
  return escapeHtml(text)
    .replace(
      /https:\/\/[^\s,)]+[^\s,).]/g,
      (match) => `<a class="text-accent underline underline-offset-4" href="${match}">${match}</a>`,
    )
    .replace(
      /\b([\w.+-]+@[\w-]+\.[\w.]+)\b/g,
      (match) =>
        `<a class="text-accent underline underline-offset-4" href="mailto:${match}">${match}</a>`,
    );
}

function renderBlockHtml(block: Block): string {
  switch (block.kind) {
    case "p":
      return `<p class="mt-6 max-w-[68ch] text-[15px] leading-relaxed text-muted sm:text-base">${linkify(block.text)}</p>`;
    case "list":
      return `<ul class="mt-6 max-w-[68ch] list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted marker:text-dim">${block.items
        .map((item) => `<li>${linkify(item)}</li>`)
        .join("")}</ul>`;
    case "definitions":
      return `<dl class="mt-6 max-w-[68ch]">${block.items
        .map(
          (item) =>
            `<div class="border-t border-line py-4"><dt class="font-mono text-[12px] uppercase tracking-[0.14em] text-dim">${escapeHtml(item.term)}</dt><dd class="mt-2 text-[15px] leading-relaxed text-muted">${linkify(item.description)}</dd></div>`,
        )
        .join("")}</dl>`;
    case "posts":
      return `<ul class="mt-6 max-w-[72ch]">${block.items
        .map(
          (item) =>
            `<li class="border-t border-line py-6"><a class="group block" href="${escapeHtml(item.href)}"><span class="block font-display text-[1.3rem] font-semibold leading-snug tracking-[-0.015em] text-text group-hover:text-accent">${escapeHtml(item.title)}</span><span class="mt-2 block text-[15px] leading-relaxed text-muted">${escapeHtml(item.description)}</span><time class="mt-3 block font-mono text-[12px] text-dim" datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}</time></a></li>`,
        )
        .join("")}</ul>`;
    case "code":
      // Wraps rather than scrolls: a native scrollbar on a dark page is the loudest thing on it.
      return `<div class="mt-6 max-w-[68ch]"><pre class="whitespace-pre-wrap break-words rounded-[12px] border border-line bg-surface p-4 font-mono text-[13px] leading-relaxed text-text"><code>${escapeHtml(block.text)}</code></pre></div>`;
  }
}

function pageStructuredData(page: AgentPage): unknown[] {
  if (page.published) {
    return [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": url(page.path),
        url: url(page.path),
        headline: page.title,
        description: page.description,
        inLanguage: "en",
        datePublished: page.published,
        dateModified: page.updated,
        author: { "@type": "Person", "@id": `${SITE_ORIGIN}/#person`, name: person.name, url: SITE_ORIGIN },
        isPartOf: { "@type": "WebSite", "@id": `${SITE_ORIGIN}/#website` },
        image: page.image ? url(page.image.src) : `${SITE_ORIGIN}/og.jpg`,
      },
    ];
  }

  const type =
    page.path === "/about"
      ? "AboutPage"
      : page.path === "/contact"
        ? "ContactPage"
        : page.path === "/writing"
          ? "CollectionPage"
          : "WebPage";

  return [
    {
      "@context": "https://schema.org",
      "@type": type,
      "@id": url(page.path),
      url: url(page.path),
      name: page.title,
      description: page.description,
      inLanguage: "en",
      dateModified: page.updated,
      isPartOf: { "@type": "WebSite", "@id": `${SITE_ORIGIN}/#website` },
      about: { "@type": "Person", "@id": `${SITE_ORIGIN}/#person` },
      primaryImageOfPage: `${SITE_ORIGIN}/og.jpg`,
    },
  ];
}

/** One trust-anchor page as a standalone document. */
export function renderPageHtml(page: AgentPage, assets: Assets): string {
  const sections = page.sections
    .map(
      (section) =>
        `        <section class="border-t border-line py-10">
          <h2 class="font-display text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-tight tracking-[-0.02em] text-text">${escapeHtml(section.heading)}</h2>
${section.blocks.map((block) => `          ${renderBlockHtml(block)}`).join("\n")}
        </section>`,
    )
    .join("\n");

  const body = pageChrome(`      <main class="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28">
        <div class="max-w-[72ch]">
          <h1 class="font-display text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-text">${escapeHtml(page.heading)}</h1>${
            page.published
              ? `\n          <p class="mt-5 text-[14px] text-dim"><a class="text-text hover:text-accent" href="/">${escapeHtml(person.name)}</a>, <time datetime="${escapeHtml(page.published)}">${escapeHtml(page.published)}</time></p>`
              : ""
          }
          <p class="mt-8 text-[17px] leading-relaxed text-text/90 sm:text-lg">${linkify(page.lede)}</p>${
            page.image
              ? `\n          <figure class="mt-10"><img class="w-full rounded-[12px] border border-line" src="${escapeHtml(page.image.src)}" alt="${escapeHtml(page.image.alt)}" width="1200" height="630" fetchpriority="high" /></figure>`
              : ""
          }

${sections}

          <p class="mt-12 border-t border-line pt-6 text-[13px] text-dim">
            Last updated ${escapeHtml(page.updated)}. A markdown copy of this page is at
            <a class="text-accent underline underline-offset-4" href="${escapeHtml(page.markdownPath)}">${escapeHtml(page.markdownPath)}</a>,
            and agent guidance is at <a class="text-accent underline underline-offset-4" href="/llms.txt">/llms.txt</a>.
          </p>
        </div>
      </main>`);

  return shell({
    title: page.title.includes(person.name) ? page.title : `${page.title} — ${person.name}`,
    description: page.description,
    canonical: url(page.path),
    markdownHref: url(page.markdownPath),
    structuredData: pageStructuredData(page),
    body,
    assets,
    image: page.image ? url(page.image.src) : undefined,
  });
}

/**
 * 404.html. Both hosts this site can run on (GitHub Pages, Cloudflare Pages)
 * serve this file with a real 404 status for unknown paths, so an agent gets
 * the correct signal *and* a readable way back.
 */
export function renderNotFoundHtml(assets: Assets): string {
  const links = [
    { href: "/", label: "Homepage", note: "Full profile: work, experience, contact." },
    { href: "/about", label: "About", note: "Background, track record, availability." },
    { href: "/contact", label: "Contact", note: "Channels and what gets a reply." },
    { href: "/privacy", label: "Privacy", note: "What this site collects, which is nothing." },
    { href: "/llms.txt", label: "llms.txt", note: "Agent guidance and when to use this site." },
    { href: "/sitemap.xml", label: "sitemap.xml", note: "Every canonical URL." },
  ];

  const body = pageChrome(`      <main class="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28">
        <div class="max-w-[72ch]">
          <p class="font-mono text-[12px] uppercase tracking-[0.18em] text-accent">404</p>
          <h1 class="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-text">Page not found</h1>
          <p class="mt-8 text-[17px] leading-relaxed text-muted sm:text-lg">
            No page exists at that path. The site is up; this URL is simply not one of its pages.
            There are no dynamic routes here, so a path not listed below has never existed.
          </p>

          <h2 class="mt-12 font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-text">Where to look next</h2>
          <ul class="mt-6">
${links
  .map(
    (link) =>
      `            <li class="border-t border-line py-4"><a class="text-[15px] text-text underline underline-offset-4 hover:text-accent" href="${link.href}">${escapeHtml(link.label)}</a> <span class="text-[14px] text-muted">— ${escapeHtml(link.note)}</span></li>`,
  )
  .join("\n")}
          </ul>

          <p class="mt-10 text-[13px] text-dim">
            A markdown copy of this page is at
            <a class="text-accent underline underline-offset-4" href="/404.md">/404.md</a>.
          </p>
        </div>
      </main>`);

  return shell({
    title: `404 — Page not found — ${person.name}`,
    description:
      "No page exists at this path on anukumar.site. Links to the homepage, about, contact, privacy, llms.txt and the sitemap.",
    canonical: url("/404"),
    markdownHref: url("/404.md"),
    structuredData: [],
    body,
    assets,
    noindex: true,
  });
}

/**
 * The no-JavaScript homepage.
 *
 * Lives inside #root, so React's first render replaces it. An inline script in
 * <head> sets data-js on <html> before this paints, and CSS hides it on that
 * attribute, so a JavaScript browser never flashes it. A crawler that does not
 * run scripts reads the whole thing.
 *
 * The text is the same text the React components render, from the same content
 * module — this is a second renderer for one source, not a second copy.
 */
export function homeFallbackHtml(): string {
  const parts: string[] = [];

  parts.push(`<div class="mx-auto max-w-[1400px] px-5 py-16 sm:px-8">`);

  parts.push(`<header>
  <p class="font-mono text-[12px] uppercase tracking-[0.18em] text-accent">${escapeHtml(person.name)} — ${escapeHtml(person.role)}</p>
  <h1 class="mt-6 font-display text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-text">${escapeHtml(hero.headline.join(" "))}</h1>
  <p class="mt-8 max-w-[60ch] text-[17px] leading-relaxed text-muted sm:text-lg">${escapeHtml(hero.subtext)}</p>
  <p class="mt-6 text-[15px] text-muted">${escapeHtml(person.location)} · <a class="text-accent underline underline-offset-4" href="mailto:${person.email}">${escapeHtml(person.email)}</a></p>
</header>`);

  parts.push(`<section class="mt-16 border-t border-line pt-10">
  <h2 class="font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-text">${escapeHtml(capabilities.lead.title)}</h2>
  <p class="mt-5 max-w-[68ch] text-[15px] leading-relaxed text-muted">${escapeHtml(capabilities.lead.body)}</p>
  <ul class="mt-5 list-disc space-y-1 pl-5 text-[15px] text-muted marker:text-dim">${capabilities.lead.points
    .map((point) => `<li>${escapeHtml(point)}</li>`)
    .join("")}</ul>
${capabilities.supporting
  .map(
    (item) => `  <h3 class="mt-8 font-display text-[1.2rem] font-semibold text-text">${escapeHtml(item.title)}</h3>
  <p class="mt-3 max-w-[68ch] text-[15px] leading-relaxed text-muted">${escapeHtml(item.body)}</p>`,
  )
  .join("\n")}
</section>`);

  parts.push(`<section class="mt-16 border-t border-line pt-10">
  <h2 class="font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-text">Selected work</h2>
${projects
  .map(
    (project) => `  <article class="mt-8">
    <h3 class="font-display text-[1.2rem] font-semibold text-text">${escapeHtml(project.name)} <span class="font-mono text-[12px] text-dim">${escapeHtml(project.year)}</span></h3>
    <p class="mt-2 max-w-[68ch] text-[15px] leading-relaxed text-text/90">${escapeHtml(project.summary)}</p>
    <p class="mt-2 max-w-[68ch] text-[15px] leading-relaxed text-muted">${escapeHtml(project.detail)}</p>
    <p class="mt-2 font-mono text-[12px] text-dim">${escapeHtml(project.stack.join(" · "))}</p>
  </article>`,
  )
  .join("\n")}
</section>`);

  parts.push(`<section class="mt-16 border-t border-line pt-10">
  <h2 class="font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-text">${escapeHtml(tenancy.headline)}</h2>
  <p class="mt-5 max-w-[68ch] text-[15px] leading-relaxed text-muted">${escapeHtml(tenancy.body)}</p>
  <ul class="mt-5 list-disc space-y-2 pl-5 text-[15px] text-muted marker:text-dim">${tenancy.steps
    .map((step) => `<li><strong class="text-text">${escapeHtml(step.title)}.</strong> ${escapeHtml(step.body)}</li>`)
    .join("")}</ul>
  <p class="mt-5"><a class="text-accent underline underline-offset-4" href="${tenancy.link.href}">${escapeHtml(tenancy.link.label)}</a></p>
</section>`);

  parts.push(`<section class="mt-16 border-t border-line pt-10">
  <h2 class="font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-text">Experience</h2>
${experience
  .map(
    (role) => `  <article class="mt-8">
    <h3 class="font-display text-[1.2rem] font-semibold text-text">${escapeHtml(role.title)}, ${escapeHtml(role.company)}</h3>
    <p class="mt-1 font-mono text-[12px] text-dim">${escapeHtml(role.period)}</p>
    <p class="mt-3 max-w-[68ch] text-[15px] leading-relaxed text-muted">${escapeHtml(role.body)}</p>
  </article>`,
  )
  .join("\n")}
  <p class="mt-8 text-[15px] text-muted">${escapeHtml(education.degree)}, ${escapeHtml(education.school)}, ${escapeHtml(education.period)}.</p>
</section>`);

  parts.push(`<section class="mt-16 border-t border-line pt-10">
  <h2 class="font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-text">Stack</h2>
  <dl class="mt-5">${stack
    .map(
      (group) =>
        `<div class="border-t border-line py-3"><dt class="font-mono text-[12px] uppercase tracking-[0.14em] text-dim">${escapeHtml(group.group)}</dt><dd class="mt-1 text-[15px] text-muted">${escapeHtml(group.items.join(", "))}</dd></div>`,
    )
    .join("")}</dl>
</section>`);

  parts.push(`<section class="mt-16 border-t border-line pt-10">
  <h2 class="font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-text">${escapeHtml(contact.headline)}</h2>
  <p class="mt-5 max-w-[68ch] text-[15px] leading-relaxed text-muted">${escapeHtml(contact.body)}</p>
  <ul class="mt-5 space-y-2 text-[15px] text-muted">
    <li><a class="text-accent underline underline-offset-4" href="mailto:${person.email}">${escapeHtml(person.email)}</a></li>
    <li><a class="text-accent underline underline-offset-4" href="${person.github}">${escapeHtml(person.github)}</a></li>
    <li><a class="text-accent underline underline-offset-4" href="${person.linkedin}">${escapeHtml(person.linkedin)}</a></li>
  </ul>
</section>`);

  parts.push(`<nav class="mt-16 border-t border-line pt-10 text-[15px] text-muted">
  <p>More pages: ${agentPages
    .map((page) => `<a class="text-accent underline underline-offset-4" href="${page.path}">${escapeHtml(page.heading)}</a>`)
    .join(" · ")} · <a class="text-accent underline underline-offset-4" href="/llms.txt">llms.txt</a> · <a class="text-accent underline underline-offset-4" href="/index.md">Markdown version</a></p>
</nav>`);

  parts.push(`</div>`);

  return `<div id="no-js-content">${parts.join("\n")}</div>`;
}
