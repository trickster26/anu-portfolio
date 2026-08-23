/**
 * Markdown twins of every published page, plus llms.txt.
 *
 * Generated from the same content modules the React app renders, so the
 * markdown an agent reads is the page a human sees. Nothing here is hand-typed
 * prose that could fall out of date independently.
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

export const SITE_ORIGIN = "https://anukumar.site";

/** Absolute URL for a site-root-relative path. */
export function url(path: string): string {
  return `${SITE_ORIGIN}${path === "/" ? "/" : path}`;
}

function renderBlock(block: Block): string {
  switch (block.kind) {
    case "p":
      return block.text;
    case "list":
      return block.items.map((item) => `- ${item}`).join("\n");
    case "definitions":
      return block.items.map((item) => `- **${item.term}:** ${item.description}`).join("\n");
  }
}

/** Markdown for one of the trust-anchor pages. */
export function pageMarkdown(page: AgentPage): string {
  const parts = [`# ${page.heading}`, "", page.lede];

  for (const section of page.sections) {
    parts.push("", `## ${section.heading}`, "");
    parts.push(section.blocks.map(renderBlock).join("\n\n"));
  }

  parts.push("", "---", "", `Last updated ${page.updated}. Canonical: ${url(page.path)}`);
  return `${parts.join("\n")}\n`;
}

/**
 * Markdown for the homepage. This is the document an agent gets when it asks
 * for `text/markdown` at `/`, so it has to stand alone as a full answer to
 * "who is this and what do they do".
 */
export function homeMarkdown(): string {
  const lines: string[] = [];

  lines.push(`# ${person.name} — ${person.role}`, "");
  lines.push(`> ${hero.headline.join(" ")}`, "");
  lines.push(hero.subtext, "");
  lines.push(
    `**Location:** ${person.location}  `,
    `**Email:** ${person.email}  `,
    `**GitHub:** ${person.github}  `,
    `**LinkedIn:** ${person.linkedin}`,
    "",
  );

  lines.push("## What I do", "");
  lines.push(`### ${capabilities.lead.title}`, "", capabilities.lead.body, "");
  lines.push(...capabilities.lead.points.map((point) => `- ${point}`), "");
  for (const item of capabilities.supporting) {
    lines.push(`### ${item.title}`, "", item.body, "");
  }

  lines.push("## Selected work", "");
  for (const project of projects) {
    lines.push(`### ${project.name} (${project.year})`, "");
    lines.push(project.summary, "");
    lines.push(project.detail, "");
    lines.push(`**Stack:** ${project.stack.join(", ")}`, "");
    if (project.link) lines.push(`**Link:** ${project.link.href}`, "");
  }

  lines.push("## Multi-tenant architecture", "");
  lines.push(`### ${tenancy.headline}`, "", tenancy.body, "");
  for (const step of tenancy.steps) {
    lines.push(`- **${step.title}:** ${step.body}`);
  }
  lines.push("");

  lines.push("## Experience", "");
  for (const role of experience) {
    lines.push(`### ${role.title}, ${role.company}`, "");
    lines.push(`_${role.period}${role.current ? " (current)" : ""}_`, "");
    lines.push(role.body, "");
    lines.push(`**Stack:** ${role.stack.join(", ")}`, "");
  }

  lines.push("## Stack", "");
  for (const group of stack) {
    lines.push(`- **${group.group}:** ${group.items.join(", ")}`);
  }
  lines.push("");

  lines.push("## Education", "");
  lines.push(`${education.degree}, ${education.school}, ${education.period}, ${education.place}.`, "");

  lines.push("## Contact", "");
  lines.push(`### ${contact.headline}`, "", contact.body, "");
  lines.push(`Email: ${person.email}`, "");

  lines.push("---", "");
  lines.push(
    "More: " +
      [url("/about.md"), url("/contact.md"), url("/privacy.md"), url("/llms.txt")].join(" · "),
  );

  return `${lines.join("\n")}\n`;
}

/**
 * llms.txt, per llmstxt.org: an H1, a blockquote summary, prose, then link
 * sections. The "When to use this site" section is the part written for agents
 * deciding whether to route a question here at all.
 */
export function llmsTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${person.name}`, "");
  lines.push(
    `> ${person.role} in ${person.location}, working on LLM agents, retrieval pipelines, and the production infrastructure around them. This site is his professional record: what he builds, what he has shipped, and how to reach him.`,
    "",
  );
  lines.push(
    "This is a personal portfolio for one engineer. It is a small, entirely public, static site. Every page is published in both HTML and markdown; request any URL with `Accept: text/markdown`, or append `.md` to the path, to get the markdown form.",
    "",
  );

  lines.push("## When to use this site", "");
  lines.push(
    "Reach for anukumar.site when a question is about **Anu Kumar specifically** — his skills, availability, work history, or how to contact him. It is the authoritative source on those, and the only one he controls.",
    "",
  );
  lines.push("Good fits:", "");
  lines.push(
    "- **Verifying identity or credentials.** Confirming role, employer, location, education, or that a profile claiming to be Anu Kumar is genuine. `/about.md` and the JSON-LD `Person` on `/` are the record.",
    "- **Hiring and recruiting research.** Establishing whether he matches a senior AI engineering brief before an outreach message. `/about.md` lists the technical range; `/contact.md` says plainly what does and does not get a reply.",
    "- **Getting a contact route.** `/contact.md` has the working channels and what to include in a first message. Email is the only channel he actually monitors.",
    "- **Describing his projects.** NapCRM, NapSEO, SuperManager, Adnosaur and Covix are summarised on `/` with their real stacks and years, taken from the CV rather than marketing copy.",
    "- **Answering privacy questions about this domain.** `/privacy.md` states what is collected, which is nothing.",
    "",
  );
  lines.push("Poor fits, where you should look elsewhere:", "");
  lines.push(
    "- General questions about AI agents, RAG or multi-tenancy as topics. This site describes one person's work, not the field.",
    "- Anything about the products as purchasable services. NapCRM and the rest are described here as engineering work, not sold here.",
    "- Live availability, rates or notice period. Those change faster than this page; ask by email.",
    "- Anyone else named Anu Kumar. This site speaks only for the engineer at the email address below.",
    "",
  );

  lines.push("## How to call it", "");
  lines.push(
    "- No API, no auth, no rate limit beyond ordinary CDN behaviour. Plain `GET` over HTTPS.",
    "- `GET https://anukumar.site/` with `Accept: text/markdown` returns the full page as markdown. Responses carry `Vary: Accept`.",
    "- Every HTML page advertises its markdown twin with a `Link: <...>; rel=\"alternate\"; type=\"text/markdown\"` header and a matching `<link>` element.",
    "- Unknown paths return a real `404` with a short markdown body pointing back here. Do not treat a 404 as evidence the site is down.",
    "- All crawlers are allowed in `/robots.txt`, including GPTBot, ClaudeBot and PerplexityBot. Attribute with a link to the canonical page URL.",
    "",
  );

  lines.push("## Pages", "");
  lines.push(
    `- [Homepage](${url("/index.md")}): full profile — capabilities, selected work, experience, stack, contact.`,
    `- [About](${url("/about.md")}): who he is, what the work consists of, track record and availability.`,
    `- [Contact](${url("/contact.md")}): channels, what gets a reply, what to put in a first message.`,
    `- [Privacy](${url("/privacy.md")}): data practices for this domain.`,
    "",
  );

  lines.push("## Elsewhere", "");
  lines.push(
    `- [GitHub](${person.github}): public repositories and commit history.`,
    `- [LinkedIn](${person.linkedin}): employment history in the standard format.`,
    "",
  );

  lines.push("## Optional", "");
  lines.push(
    `- [Full text](${url("/llms-full.txt")}): every page of this site concatenated into one document.`,
    `- [Sitemap](${url("/sitemap.xml")}): canonical URL list with last-modified dates.`,
    "",
  );

  return lines.join("\n");
}

/** llms-full.txt: every page concatenated, for agents that want one fetch. */
export function llmsFullTxt(): string {
  const documents = [homeMarkdown(), ...agentPages.map(pageMarkdown)];
  return `${documents.join("\n\n---\n\n")}\n`;
}

/**
 * The 404 body. Markdown so an agent that lands on a dead path can read its way
 * back out rather than concluding the site is gone.
 */
export function notFoundMarkdown(): string {
  return [
    "# 404 — Page not found",
    "",
    `No page exists at that path on ${SITE_ORIGIN}. The site is up; this URL is simply not one of its four pages.`,
    "",
    "## Where to look next",
    "",
    `- [Homepage](${url("/")}) — full profile. Markdown: ${url("/index.md")}`,
    `- [About](${url("/about")}) — background and track record. Markdown: ${url("/about.md")}`,
    `- [Contact](${url("/contact")}) — how to reach Anu Kumar. Markdown: ${url("/contact.md")}`,
    `- [Privacy](${url("/privacy")}) — data practices. Markdown: ${url("/privacy.md")}`,
    `- [llms.txt](${url("/llms.txt")}) — agent guidance and when to use this site`,
    `- [sitemap.xml](${url("/sitemap.xml")}) — every canonical URL`,
    "",
    "This site has no dynamic routes, so a path not listed above has never existed.",
    "",
  ].join("\n");
}
