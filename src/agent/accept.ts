/**
 * Accept-header content negotiation, per acceptmarkdown.com.
 *
 * The rule the spec cares about: a client that explicitly asks for
 * `text/markdown` gets markdown, and the response carries `Vary: Accept` so a
 * CDN never hands the cached HTML variant to an agent that asked for markdown.
 *
 * Deliberately conservative. Markdown is served only when the header *names*
 * `text/markdown`. A browser sending `text/html,application/xhtml+xml,...,*​/*;q=0.8`
 * matches markdown only through the wildcard, and must keep getting HTML.
 */

export const MARKDOWN_TYPE = "text/markdown; charset=utf-8";

type Entry = { type: string; q: number };

/** Parse an Accept header into media types with their q-values, invalid parts dropped. */
export function parseAccept(header: string | null | undefined): Entry[] {
  if (!header) return [];

  return header
    .split(",")
    .map((part) => {
      const [rawType, ...params] = part.split(";");
      const type = rawType.trim().toLowerCase();
      if (!type) return null;

      let q = 1;
      for (const param of params) {
        const [key, value] = param.split("=");
        if (key?.trim().toLowerCase() !== "q") continue;
        const parsed = Number.parseFloat(value ?? "");
        // An unparseable q is treated as the default 1, which is what every
        // major server does rather than dropping the entry entirely.
        q = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 1) : 1;
      }

      return { type, q };
    })
    .filter((entry): entry is Entry => entry !== null);
}

/** Highest q-value the header gives to an exactly-named media type. 0 if unnamed. */
function explicitQ(entries: Entry[], type: string): number {
  return entries.reduce((best, entry) => (entry.type === type ? Math.max(best, entry.q) : best), 0);
}

/**
 * Does this request want markdown?
 *
 * True when `text/markdown` is named with a non-zero q and no explicitly named
 * HTML type outranks it. Ties go to markdown: an agent that bothered to name
 * markdown at the same weight as HTML is asking for markdown.
 */
export function prefersMarkdown(header: string | null | undefined): boolean {
  const entries = parseAccept(header);
  const markdown = explicitQ(entries, "text/markdown");
  if (markdown === 0) return false;

  const html = Math.max(explicitQ(entries, "text/html"), explicitQ(entries, "application/xhtml+xml"));
  return markdown >= html;
}

/**
 * Map a request pathname to the markdown twin published beside it.
 * Returns null for paths that have no markdown representation.
 */
export function markdownPathFor(pathname: string, known: readonly string[]): string | null {
  // Trailing slashes are normalised away so /about and /about/ agree.
  const path = pathname.replace(/\/+$/, "") || "/";
  const candidate = path === "/" ? "/index.md" : `${path}.md`;
  return known.includes(candidate) ? candidate : null;
}

/** Merge a token into a Vary header without duplicating what is already there. */
export function withVary(existing: string | null | undefined, token: string): string {
  const tokens = (existing ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!tokens.some((t) => t.toLowerCase() === token.toLowerCase())) tokens.push(token);
  return tokens.join(", ");
}
