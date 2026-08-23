import { describe, expect, it } from "vitest";
import { markdownPathFor, parseAccept, prefersMarkdown, withVary } from "./accept";

const KNOWN = ["/index.md", "/about.md", "/contact.md", "/privacy.md", "/404.md"];

describe("parseAccept", () => {
  it("returns an empty list for a missing header", () => {
    expect(parseAccept(null)).toEqual([]);
    expect(parseAccept("")).toEqual([]);
  });

  it("reads q-values and lower-cases types", () => {
    expect(parseAccept("Text/Markdown;q=0.9, text/html;q=0.1")).toEqual([
      { type: "text/markdown", q: 0.9 },
      { type: "text/html", q: 0.1 },
    ]);
  });

  it("defaults an unparseable q to 1 rather than dropping the entry", () => {
    expect(parseAccept("text/markdown;q=banana")).toEqual([{ type: "text/markdown", q: 1 }]);
  });

  it("clamps q into range", () => {
    expect(parseAccept("text/markdown;q=7")).toEqual([{ type: "text/markdown", q: 1 }]);
    expect(parseAccept("text/markdown;q=-3")).toEqual([{ type: "text/markdown", q: 0 }]);
  });
});

describe("prefersMarkdown", () => {
  it("is true when markdown is asked for on its own", () => {
    expect(prefersMarkdown("text/markdown")).toBe(true);
  });

  it("is true when markdown outranks html", () => {
    expect(prefersMarkdown("text/markdown;q=1.0, text/html;q=0.5")).toBe(true);
  });

  it("breaks a tie in favour of markdown", () => {
    expect(prefersMarkdown("text/markdown, text/html")).toBe(true);
  });

  it("is false when html explicitly outranks markdown", () => {
    expect(prefersMarkdown("text/html, text/markdown;q=0.2")).toBe(false);
  });

  it("is false for a browser's default header", () => {
    const browser =
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";
    expect(prefersMarkdown(browser)).toBe(false);
  });

  it("is false for a bare wildcard, which names nothing", () => {
    expect(prefersMarkdown("*/*")).toBe(false);
    expect(prefersMarkdown("text/*")).toBe(false);
  });

  it("is false when markdown is explicitly refused", () => {
    expect(prefersMarkdown("text/markdown;q=0, text/html")).toBe(false);
  });

  it("is false for a missing header", () => {
    expect(prefersMarkdown(null)).toBe(false);
  });
});

describe("markdownPathFor", () => {
  it("maps the root to index.md", () => {
    expect(markdownPathFor("/", KNOWN)).toBe("/index.md");
  });

  it("maps a page path to its twin", () => {
    expect(markdownPathFor("/about", KNOWN)).toBe("/about.md");
  });

  it("treats a trailing slash as the same page", () => {
    expect(markdownPathFor("/about/", KNOWN)).toBe("/about.md");
  });

  it("returns null for a path with no twin", () => {
    expect(markdownPathFor("/nope", KNOWN)).toBeNull();
    expect(markdownPathFor("/og.jpg", KNOWN)).toBeNull();
  });
});

describe("withVary", () => {
  it("adds the token to an empty header", () => {
    expect(withVary(null, "Accept")).toBe("Accept");
  });

  it("appends without disturbing what is there", () => {
    expect(withVary("Accept-Encoding", "Accept")).toBe("Accept-Encoding, Accept");
  });

  it("does not duplicate, regardless of case", () => {
    expect(withVary("accept, Accept-Encoding", "Accept")).toBe("accept, Accept-Encoding");
  });
});
