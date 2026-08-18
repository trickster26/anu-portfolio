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

Five slots render a labelled placeholder until the file exists. Drop real
captures at these paths:

| File | Aspect | Suggested size |
| --- | --- | --- |
| `public/work/supermanager.jpg` | 16:10 | 1600 x 1000 |
| `public/work/napcrm.jpg` | 4:5 | 1200 x 1500 |
| `public/work/adnosaur.jpg` | 3:2 | 1400 x 933 |
| `public/work/napseo.jpg` | 16:9 | 1600 x 900 |
| `public/work/covix.jpg` | 16:9 | 1600 x 900 |

Capture on a dark UI where possible so they sit inside the page rather than
punching a white hole in it. Export at roughly 80% JPEG quality; anything over
about 300KB per image is wasted on this layout.

### 2. Social preview image

`public/og.jpg` at 1200 x 630. Referenced by the Open Graph and Twitter card
tags in `index.html`. Without it, links unfurl with no image.

### 3. Product naming

The multi-tenant CRM is written as **NapCRM** throughout, taken from the most
recent naming in the monorepo. If the public-facing name differs, it appears in
`src/content.ts` only (`projects[1]` and `tenancy.body`).

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
2. Settings > Pages > Custom domain: `anukumar.qd.je`, then Save.
3. Tick **Enforce HTTPS** once the certificate is issued (can take a few minutes).

DNS, at the DigitalPlat panel for `anukumar.qd.je`:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `anukumar` (or `@`, depending on how the panel scopes it) | `trickster26.github.io` |

If the panel refuses a CNAME at that name, use four A records to `185.199.108.153`,
`185.199.109.153`, `185.199.110.153`, `185.199.111.153` instead. Optionally add
AAAA records to `2606:50c0:8000::153` through `2606:50c0:8003::153` for IPv6.

Note there is deliberately no `public/CNAME` file. GitHub ignores it when the site
publishes from a custom Actions workflow; the domain lives in repo settings.

The repo must be **public** for Pages to serve it on a free GitHub account.
