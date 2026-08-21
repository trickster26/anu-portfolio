# anu-portfolio

Personal site for Anu Kumar, Senior AI Engineer. Single page, dark, with two
WebGL scenes.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the built output
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

## Where things live

```
src/
  content.ts             every visible string, one file
  components/            page sections, one per file
  three/
    AgentGraph.tsx       hero scene: agent runtime as a live graph
    TenantLattice.tsx    systems section: isolated tenant cells
  index.css              design tokens (@theme), fonts, base layer
public/fonts/            self-hosted Clash Display + Satoshi variable faces
```

Editing copy means editing `src/content.ts`. Nothing else holds strings.

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
