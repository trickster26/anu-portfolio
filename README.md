# anu-portfolio

Personal site for Anu Kumar, Senior AI Engineer. Single page, dark, with two
WebGL scenes.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the built output
npm test         # vitest, covers everything under src/agent and functions/
```

## What still needs you

### 1. Project screenshots (required)

Four slots render a labelled placeholder until the file exists:

| File | Aspect | Suggested size |
| --- | --- | --- |
| `public/work/supermanager.jpg` | 16:10 | 1600 x 1000 |
| `public/work/napcrm.jpg` | 4:5 | 1200 x 1500 |
| `public/work/adnosaur.jpg` | 3:2 | 1400 x 933 |
| `public/work/napseo.jpg` | 16:9 | 1600 x 900 |

Covix has no slot on purpose. It is a trained model with no interface, so its
card runs as type alone rather than holding an empty frame open.

`npm run capture` opens a visible browser at each app, waits while you sign in,
then captures at the right aspect and writes into `public/work/` for you. Run
`npm run capture napcrm` to redo a single one. Logins persist in
`.capture-profile/` between runs.

Capture on a dark UI where possible so the shots sit inside the page rather than
punching a white hole in it.

### 2. Social preview image

`public/og.jpg` at 1200 x 630. Referenced by the Open Graph and Twitter card
tags in `index.html`. Without it, links unfurl with no image.

## Agent readiness

The page is React, but agents are not going to run it. Everything an AI crawler
or answer engine needs exists in the raw HTML, generated at build time by
`src/agent/plugin.ts` from the same `src/content.ts` the components render — so
the machine-readable copy cannot drift from the human one.

What ships beside the app:

| File | What it is |
| --- | --- |
| `index.html` | The homepage text is inlined inside `#root` before any JS runs. React replaces it on first render; an inline `data-js` flag hides it first, so a browser never flashes it. ~5,300 characters and one `<h1>` with JavaScript disabled. |
| `about.html`, `contact.html`, `privacy.html` | Trust-anchor pages. Static, no React, same stylesheet as the app. Served at `/about` with no redirect hop. |
| `<page>.md` | A markdown twin of every page, including `404.md`. |
| `llms.txt` | Per llmstxt.org, with a **When to use this site** section naming the jobs the site is right for and how to call it. |
| `llms-full.txt` | Every page concatenated, for agents that prefer one fetch. |
| `sitemap.xml`, `robots.txt` | Generated, so they cannot list a page that does not exist. |
| `_headers`, `_routes.json` | Cloudflare Pages config. Ignored by GitHub Pages. |
| `404.html` | Real 404 status on both hosts, with a body that links the sitemap, llms.txt and every real page. |

`functions/_middleware.ts` implements acceptmarkdown.com content negotiation:
`Accept: text/markdown` on any page returns the markdown twin with
`Vary: Accept`, and HTML responses advertise their twin with a `Link` header.
**It only runs on Cloudflare Pages.** GitHub Pages cannot execute code, so on
GitHub the `.md` files are reachable by path but never negotiated. Verify a
deploy with:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://anukumar.site/no-such-path   # 404
curl -sI -H "Accept: text/markdown" https://anukumar.site/ | grep -i "content-type\|vary"
```

Editing `src/content.ts` or `src/agent/pages.ts` regenerates all of it. The
tests in `src/agent/*.test.ts` and `functions/_middleware.test.ts` assert the
exact bytes, and CI runs them before every deploy.

## Where things live

```
src/
  content.ts             every visible string, one file
  components/            page sections, one per file
  three/
    AgentGraph.tsx       hero scene: agent runtime as a live graph
    TenantLattice.tsx    systems section: isolated tenant cells
  agent/                 machine-readable build: markdown twins, llms.txt,
                         static pages, 404, sitemap, robots, the Vite plugin
  index.css              design tokens (@theme), fonts, base layer
functions/
  _middleware.ts         Cloudflare Pages markdown content negotiation
public/fonts/            self-hosted Clash Display + Satoshi variable faces
```

Editing copy means editing `src/content.ts`. Nothing else holds strings, except
`src/agent/pages.ts`, which holds the about/contact/privacy prose.

## Design decisions worth keeping

**One accent.** Amber `#ffb020`, used for CTAs, links, and the graph. The green
dot next to SuperManager AGI is the only other colour on the page, and it means
one thing: that role is current. Adding a second accent breaks the system.

**Mono is for numbers.** JetBrains Mono renders dates, tech tags, and file paths.
Prose never uses it. That contrast is doing the work that decoration usually
does.

**The 3D is a diagram, not decoration.** The hero graph's nodes are the parts of
an agent runtime and the moving dots are calls in flight. If the node labels get
edited into something generic, the scene stops earning its bundle size.

**No invented numbers.** There are no metrics on this page that did not come from
the CV. If you add a figure, make sure it is real. A portfolio that fakes
precision is worse than one that describes the work.

## Performance notes

Both scenes are `React.lazy` and split into a `three` chunk that loads after the
text paints, so the headline is the LCP element. The chunk is around 240KB
gzipped, which is the price of three.js. Everything else on the initial load is
about 108KB gzipped.

`prefers-reduced-motion` is honoured throughout: reveals become instant, the
graph renders one static frame and stops its render loop, and the lattice lights
a single cell and holds it.

## Deploy

GitHub Pages, via `.github/workflows/deploy.yml`. Every push to `main` typechecks,
builds, and publishes `dist/`. There is also a manual trigger in the Actions tab.

One-time setup on the repo:

1. Settings > Pages > Build and deployment > Source: **GitHub Actions**.
2. Settings > Pages > Custom domain: `anukumar.site`, then Save.
3. Tick **Enforce HTTPS** once the certificate is issued (can take a few minutes).

DNS, in the GoDaddy panel for `anukumar.site`. GoDaddy does not support a CNAME at
the apex, so the root is served by GitHub's four anycast A records:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `trickster26.github.io` |

Two records that ship with the domain have to go first: the parked `A @` record,
and the `CNAME www` pointing back at `anukumar.site`. Both conflict with the rows
above. Leave the NS, SOA, `_domainconnect`, and `_dmarc` records alone.

Optionally add AAAA records at `@` for `2606:50c0:8000::153` through
`2606:50c0:8003::153` so the site answers over IPv6 as well.

Note there is deliberately no `public/CNAME` file. GitHub ignores it when the site
publishes from a custom Actions workflow; the domain lives in repo settings.

The repo must be **public** for Pages to serve it on a free GitHub account.

### Moving to Cloudflare Pages

Markdown content negotiation needs a server, so it is dark on GitHub Pages. To
turn it on: create a Cloudflare Pages project from this repo (build command
`npm run build`, output directory `dist`), add `anukumar.site` as a custom
domain, then repoint the GoDaddy apex from GitHub's A records to the CNAME
Cloudflare gives you. `functions/`, `_headers` and `_routes.json` are already in
place and take effect on the first Cloudflare deploy with no code change.

Test it locally before switching anything:

```bash
npm run build
npx wrangler pages dev dist
curl -sI -H "Accept: text/markdown" http://127.0.0.1:8788/
```
