import { describe, expect, it } from "vitest";
import { MARKDOWN_PATHS, onRequest } from "./_middleware";

/**
 * A stand-in for the Pages asset store. It knows the four markdown twins, the
 * HTML pages, and returns a 404 with the 404 page for anything else — which is
 * what Pages itself does.
 */
function makeContext(url: string, init: RequestInit = {}) {
  const request = new Request(url, init);
  const served: string[] = [];

  const assets = {
    async fetch(assetRequest: Request) {
      const path = new URL(assetRequest.url).pathname;
      served.push(path);

      if ((MARKDOWN_PATHS as readonly string[]).includes(path)) {
        return new Response(`# markdown for ${path}\n`, {
          status: 200,
          headers: { "Content-Type": "text/markdown" },
        });
      }

      return new Response("missing", { status: 404 });
    },
  };

  const context = {
    request,
    env: { ASSETS: assets },
    async next() {
      const path = new URL(request.url).pathname;
      const known = ["/", "/about", "/about/", "/contact", "/privacy"];

      if (known.includes(path)) {
        return new Response("<!doctype html><html><body>page</body></html>", {
          status: 200,
          headers: { "Content-Type": "text/html; charset=utf-8", Vary: "accept-encoding" },
        });
      }

      if (path === "/og.jpg") {
        return new Response("binary", { status: 200, headers: { "Content-Type": "image/jpeg" } });
      }

      return new Response("<!doctype html><html><body>404</body></html>", {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    },
  };

  return { context, served };
}

const MARKDOWN_ACCEPT = { Accept: "text/markdown" };

describe("markdown negotiation", () => {
  it("serves the homepage as markdown when it is asked for", async () => {
    const { context } = makeContext("https://anukumar.site/", { headers: MARKDOWN_ACCEPT });
    const response = await onRequest(context);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
    expect(await response.text()).toContain("# markdown for /index.md");
  });

  it("sets Vary: Accept on the markdown response", async () => {
    const { context } = makeContext("https://anukumar.site/", { headers: MARKDOWN_ACCEPT });
    const response = await onRequest(context);

    expect(response.headers.get("Vary")).toContain("Accept");
  });

  it("serves a page's own twin, not the homepage's", async () => {
    const { context } = makeContext("https://anukumar.site/about", { headers: MARKDOWN_ACCEPT });
    expect(await (await onRequest(context)).text()).toContain("/about.md");
  });

  it("treats a trailing slash as the same page", async () => {
    const { context } = makeContext("https://anukumar.site/about/", { headers: MARKDOWN_ACCEPT });
    expect(await (await onRequest(context)).text()).toContain("/about.md");
  });

  it("returns markdown with a real 404 status for a dead path", async () => {
    const { context } = makeContext("https://anukumar.site/nope", { headers: MARKDOWN_ACCEPT });
    const response = await onRequest(context);

    expect(response.status).toBe(404);
    expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
    expect(await response.text()).toContain("/404.md");
  });

  it("gives a HEAD request the headers without a body", async () => {
    const { context } = makeContext("https://anukumar.site/", {
      method: "HEAD",
      headers: MARKDOWN_ACCEPT,
    });
    const response = await onRequest(context);

    expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
    expect(await response.text()).toBe("");
  });
});

describe("HTML responses", () => {
  it("serves HTML to a browser and merges Accept into the existing Vary", async () => {
    const browser =
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";
    const { context } = makeContext("https://anukumar.site/", { headers: { Accept: browser } });
    const response = await onRequest(context);

    expect(response.headers.get("Content-Type")).toContain("text/html");
    expect(response.headers.get("Vary")).toBe("accept-encoding, Accept");
    expect(await response.text()).toContain("page");
  });

  it("advertises the markdown twin in a Link header", async () => {
    const { context } = makeContext("https://anukumar.site/about");
    const response = await onRequest(context);

    expect(response.headers.get("Link")).toBe(
      '</about.md>; rel="alternate"; type="text/markdown"',
    );
  });

  it("points a dead HTML path at the 404 twin", async () => {
    const { context } = makeContext("https://anukumar.site/nope");
    const response = await onRequest(context);

    expect(response.status).toBe(404);
    expect(response.headers.get("Link")).toContain("/404.md");
    expect(response.headers.get("Vary")).toContain("Accept");
  });

  it("leaves non-HTML responses untouched", async () => {
    const { context } = makeContext("https://anukumar.site/og.jpg", { headers: MARKDOWN_ACCEPT });
    const response = await onRequest(context);

    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
    expect(response.headers.get("Vary")).toBeNull();
  });

  it("does not negotiate a POST", async () => {
    const { context, served } = makeContext("https://anukumar.site/", {
      method: "POST",
      headers: MARKDOWN_ACCEPT,
    });
    await onRequest(context);

    expect(served).toEqual([]);
  });
});
