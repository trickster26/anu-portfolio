import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { MARKDOWN_PATHS } from "../../functions/_middleware";
import { agentArtifacts, robotsTxt, routesJson, sitemapXml } from "./build";
import { homeFallbackHtml, renderNotFoundHtml, renderPageHtml } from "./html";
import { homeMarkdown, llmsFullTxt, llmsTxt, notFoundMarkdown, pageMarkdown } from "./markdown";
import { about, agentPages, contactPage, privacy } from "./pages";
import { agentReady } from "./plugin";

const ASSETS = { css: ["/assets/index-abc123.css"] };

/** Visible text only, the way a crawler that ignores markup would count it. */
function textOf(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

describe("homeFallbackHtml", () => {
  const html = homeFallbackHtml();

  it("is wrapped in the element the inline style hides", () => {
    expect(html.startsWith('<div id="no-js-content">')).toBe(true);
  });

  it("has exactly one h1", () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  });

  it("carries well over the 500 characters a crawler needs", () => {
    expect(textOf(html).length).toBeGreaterThan(3000);
  });

  it("names the person, the role and the contact address", () => {
    const text = textOf(html);
    expect(text).toContain("Anu Kumar");
    expect(text).toContain("Senior AI Engineer");
    expect(text).toContain("anu2614kumar@gmail.com");
  });

  it("links the trust-anchor pages so a crawler can reach them", () => {
    for (const page of agentPages) expect(html).toContain(`href="${page.path}"`);
  });

  it("escapes content rather than interpolating it raw", () => {
    expect(html).not.toContain("<script");
  });
});

describe("index.html transform", () => {
  const source = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
  const plugin = agentReady();
  const handler = plugin.transformIndexHtml as {
    handler: (html: string) => string;
  };
  const output = handler.handler(source);

  it("injects the fallback inside #root", () => {
    expect(source).toContain('<div id="root"></div>');
    expect(output).toContain('<div id="root"><div id="no-js-content">');
  });

  it("sets the data-js flag before the fallback can paint", () => {
    expect(output).toContain('document.documentElement.dataset.js="1"');
    expect(output).toContain('html[data-js="1"] #no-js-content{display:none!important}');
    expect(output.indexOf("dataset.js")).toBeLessThan(output.indexOf('id="no-js-content"'));
  });

  it("advertises the markdown twin of the homepage", () => {
    expect(output).toContain('<link rel="alternate" type="text/markdown" href="https://anukumar.site/index.md" />');
  });

  it("keeps the raw HTML above the content threshold without any JavaScript", () => {
    expect(textOf(output).length).toBeGreaterThan(3000);
  });

  it("publishes a Person with both a name and a description", () => {
    const block = source.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(block).not.toBeNull();

    const graph = JSON.parse(block![1]) as { "@graph": Record<string, unknown>[] };
    const person = graph["@graph"].find((node) => node["@type"] === "Person")!;

    expect(person.name).toBe("Anu Kumar");
    expect(typeof person.description).toBe("string");
    expect((person.description as string).length).toBeGreaterThan(80);
    expect(person.url).toBe("https://anukumar.site/");
    expect(person.address).toMatchObject({ "@type": "PostalAddress", addressCountry: "IN" });
    expect(person.contactPoint).toMatchObject({
      "@type": "ContactPoint",
      email: "anu2614kumar@gmail.com",
    });
    expect(person.sameAs).toContain("https://github.com/trickster26");
  });
});

describe("trust-anchor pages", () => {
  for (const page of [about, contactPage, privacy]) {
    describe(page.path, () => {
      const html = renderPageHtml(page, ASSETS);

      it("clears 500 characters of real text", () => {
        expect(textOf(html).length).toBeGreaterThan(1200);
      });

      it("has one h1 and a canonical URL", () => {
        expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
        expect(html).toContain(`<link rel="canonical" href="https://anukumar.site${page.path}" />`);
      });

      it("links its own markdown twin", () => {
        expect(html).toContain(`type="text/markdown" href="https://anukumar.site${page.markdownPath}"`);
      });

      it("loads the hashed stylesheet so it matches the app's design", () => {
        expect(html).toContain('<link rel="stylesheet" href="/assets/index-abc123.css" />');
      });

      it("has a markdown twin of the same substance", () => {
        const markdown = pageMarkdown(page);
        expect(markdown.startsWith(`# ${page.heading}`)).toBe(true);
        expect(markdown.length).toBeGreaterThan(1200);
        for (const section of page.sections) expect(markdown).toContain(`## ${section.heading}`);
      });
    });
  }

  it("states plainly that nothing is collected", () => {
    expect(pageMarkdown(privacy)).toContain("collects nothing");
  });
});

describe("404", () => {
  const html = renderNotFoundHtml(ASSETS);
  const markdown = notFoundMarkdown();

  it("is not indexable, since it is not a page", () => {
    expect(html).toContain('content="noindex, follow"');
  });

  it("points at every recovery route in both representations", () => {
    for (const target of ["/about", "/contact", "/privacy", "/llms.txt", "/sitemap.xml"]) {
      expect(html).toContain(target);
      expect(markdown).toContain(target);
    }
  });

  it("gives the markdown body a heading and a where-to-look-next section", () => {
    expect(markdown.startsWith("# 404")).toBe(true);
    expect(markdown).toContain("## Where to look next");
  });

  it("says the site is up, so an agent does not record an outage", () => {
    expect(markdown).toContain("The site is up");
  });
});

describe("llms.txt", () => {
  const text = llmsTxt();

  it("follows the llmstxt.org shape: h1 then blockquote", () => {
    const lines = text.split("\n");
    expect(lines[0]).toBe("# Anu Kumar");
    expect(lines[2].startsWith("> ")).toBe(true);
  });

  it("carries when-to-use guidance, not marketing copy", () => {
    expect(text).toContain("## When to use this site");
    expect(text).toContain("Good fits:");
    expect(text).toContain("Poor fits");
  });

  it("tells an agent how to call the site", () => {
    expect(text).toContain("## How to call it");
    expect(text).toContain("Accept: text/markdown");
    expect(text).toContain("Vary: Accept");
  });

  it("links every markdown twin it claims exists", () => {
    for (const path of ["/index.md", "/about.md", "/contact.md", "/privacy.md"]) {
      expect(text).toContain(`https://anukumar.site${path}`);
    }
  });

  it("has a full-text sibling containing every page", () => {
    const full = llmsFullTxt();
    expect(full).toContain("# Anu Kumar — Senior AI Engineer");
    for (const page of agentPages) expect(full).toContain(`# ${page.heading}`);
  });
});

describe("homeMarkdown", () => {
  const markdown = homeMarkdown();

  it("opens with an h1 naming the person and the role", () => {
    expect(markdown.startsWith("# Anu Kumar — Senior AI Engineer")).toBe(true);
  });

  it("covers every section a reader of the HTML page would see", () => {
    for (const heading of [
      "## What I do",
      "## Selected work",
      "## Multi-tenant architecture",
      "## Experience",
      "## Stack",
      "## Education",
      "## Contact",
    ]) {
      expect(markdown).toContain(heading);
    }
  });

  it("stands alone as an answer, not a stub", () => {
    expect(markdown.length).toBeGreaterThan(4000);
  });
});

describe("sitemap.xml", () => {
  const xml = sitemapXml();

  it("lists the homepage and every trust-anchor page, and nothing else", () => {
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locations).toEqual([
      "https://anukumar.site/",
      "https://anukumar.site/about",
      "https://anukumar.site/contact",
      "https://anukumar.site/privacy",
    ]);
  });

  it("does not list the 404, which must never be indexed", () => {
    expect(xml).not.toContain("404");
  });
});

describe("robots.txt", () => {
  const text = robotsTxt();

  it("allows the answer engines that cite sources", () => {
    for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "OAI-SearchBot"]) {
      expect(text).toContain(`User-agent: ${bot}`);
    }
  });

  it("points at the sitemap and llms.txt", () => {
    expect(text).toContain("Sitemap: https://anukumar.site/sitemap.xml");
    expect(text).toContain("https://anukumar.site/llms.txt");
  });
});

describe("agentArtifacts", () => {
  const artifacts = agentArtifacts(ASSETS);
  const names = artifacts.map((artifact) => artifact.fileName);

  it("emits every file the audit checks for", () => {
    expect(names).toEqual(
      expect.arrayContaining([
        "about.html",
        "about.md",
        "contact.html",
        "contact.md",
        "privacy.html",
        "privacy.md",
        "404.html",
        "404.md",
        "index.md",
        "llms.txt",
        "llms-full.txt",
        "sitemap.xml",
        "robots.txt",
        "_headers",
        "_routes.json",
      ]),
    );
  });

  it("emits no empty files", () => {
    for (const artifact of artifacts) expect(artifact.source.length).toBeGreaterThan(0);
  });

  it("emits each filename exactly once", () => {
    expect(new Set(names).size).toBe(names.length);
  });

  it("keeps the middleware's markdown list in step with what is published", () => {
    const published = names
      .filter((name) => name.endsWith(".md"))
      .map((name) => `/${name}`)
      .sort();

    expect([...MARKDOWN_PATHS].sort()).toEqual(published);
  });

  it("keeps the middleware off routes that can never be negotiated", () => {
    const routes = JSON.parse(routesJson()) as { include: string[]; exclude: string[] };
    expect(routes.include).toEqual(["/*"]);
    expect(routes.exclude).toContain("/assets/*");
    expect(routes.exclude).toContain("/fonts/*");
    // The .md files are served directly; running the negotiator on them would
    // only re-fetch what the client already asked for by path.
    expect(routes.exclude).toContain("/*.md");
  });

  it("pins the content type of the markdown twins for the CDN", () => {
    const headers = artifacts.find((artifact) => artifact.fileName === "_headers")!.source;
    expect(headers).toContain("Content-Type: text/markdown; charset=utf-8");
    expect(headers).toContain("Vary: Accept");
  });
});
