/**
 * Cloudflare Pages middleware: markdown content negotiation, per
 * acceptmarkdown.com.
 *
 * A request for any page with `Accept: text/markdown` gets the markdown twin
 * that was published beside it at build time. Every negotiated response carries
 * `Vary: Accept`, which is the part that actually matters: without it a CDN can
 * hand an agent the HTML variant that happened to land in the cache first.
 *
 * HTML responses additionally advertise their markdown twin with a `Link`
 * header, so an agent can find it without guessing.
 *
 * This file only runs on Cloudflare Pages. On GitHub Pages the .md files are
 * still published and still reachable by path; they just are not negotiated,
 * because GitHub Pages cannot run code.
 */

import { MARKDOWN_TYPE, markdownPathFor, prefersMarkdown, withVary } from "../src/agent/accept";

/** Every markdown document the build emits. Kept in sync by a test. */
export const MARKDOWN_PATHS = [
  "/index.md",
  "/about.md",
  "/contact.md",
  "/privacy.md",
  "/404.md",
] as const;

/**
 * The only hostnames allowed into a search index.
 *
 * Cloudflare keeps serving this project on `anu-portfolio.pages.dev` and on a
 * `<hash>.anu-portfolio.pages.dev` URL for every deployment, all of them byte
 * identical to the real site. Left indexable, they compete with the apex for
 * the owner's own name, which is the one search result this site exists to win.
 * The canonical tags already point home; this closes the door properly.
 */
export const INDEXABLE_HOSTS = ["anukumar.site", "www.anukumar.site"] as const;

/** `nofollow` as well, so a preview host cannot pass link equity to itself. */
const NOINDEX = "noindex, nofollow, noarchive";

/** Should responses on this host carry X-Robots-Tag: noindex? */
export function isNoindexHost(hostname: string): boolean {
  return !(INDEXABLE_HOSTS as readonly string[]).includes(hostname.toLowerCase());
}

type AssetFetcher = { fetch: (request: Request) => Promise<Response> };

type Context = {
  request: Request;
  env: { ASSETS: AssetFetcher };
  next: () => Promise<Response>;
};

/** Absolute URL for a site-root-relative path, on the request's own origin. */
function resolve(request: Request, path: string): Request {
  return new Request(new URL(path, request.url).toString(), {
    method: "GET",
    headers: { Accept: "text/plain" },
  });
}

async function markdownResponse(
  context: Context,
  path: string,
  status: number,
): Promise<Response | null> {
  const asset = await context.env.ASSETS.fetch(resolve(context.request, path));
  if (!asset.ok) return null;

  const headers = new Headers();
  headers.set("Content-Type", MARKDOWN_TYPE);
  headers.set("Vary", "Accept, Accept-Encoding");
  headers.set("Cache-Control", "public, max-age=300, must-revalidate");
  headers.set("X-Content-Type-Options", "nosniff");
  if (isNoindexHost(new URL(context.request.url).hostname)) {
    headers.set("X-Robots-Tag", NOINDEX);
  }

  return new Response(context.request.method === "HEAD" ? null : asset.body, { status, headers });
}

export async function onRequest(context: Context): Promise<Response> {
  const { request } = context;

  // Negotiation is a read-only concern. Anything else passes straight through.
  if (request.method !== "GET" && request.method !== "HEAD") return context.next();

  const { pathname, hostname } = new URL(request.url);
  const accept = request.headers.get("Accept");
  const wantsMarkdown = prefersMarkdown(accept);
  const twin = markdownPathFor(pathname, MARKDOWN_PATHS);
  const noindex = isNoindexHost(hostname);

  if (wantsMarkdown && twin) {
    const response = await markdownResponse(context, twin, 200);
    if (response) return response;
  }

  const downstream = await context.next();

  // A dead path asked for in markdown still gets markdown, with the real 404
  // status intact so the agent knows the path is wrong, not the site.
  if (wantsMarkdown && downstream.status === 404) {
    const response = await markdownResponse(context, "/404.md", 404);
    if (response) return response;
  }

  const contentType = downstream.headers.get("Content-Type") ?? "";
  const isHtml = contentType.includes("text/html");

  // On the real domain a non-HTML response needs nothing from us, so it is
  // handed back untouched. On a preview host the markdown twins and llms.txt
  // get the noindex header too, which means cloning to add it.
  if (!isHtml && !noindex) return downstream;

  const headers = new Headers(downstream.headers);
  if (noindex) headers.set("X-Robots-Tag", NOINDEX);

  if (!isHtml) {
    return new Response(downstream.body, {
      status: downstream.status,
      statusText: downstream.statusText,
      headers,
    });
  }

  headers.set("Vary", withVary(headers.get("Vary"), "Accept"));

  const alternate = downstream.status === 404 ? "/404.md" : twin;
  if (alternate) {
    headers.append("Link", `<${alternate}>; rel="alternate"; type="text/markdown"`);
  }

  return new Response(downstream.body, {
    status: downstream.status,
    statusText: downstream.statusText,
    headers,
  });
}
