# After office hours

A public archive of prototypes, interfaces, AI experiments, motion studies and unfinished investigations. Every entry is a folder of Markdown and media in this repository. Publishing is a commit.

Next.js (App Router) · TypeScript strict · Tailwind CSS 4 · MDX · statically generated · no database, auth or backend.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000, drafts visible, content re-read on every request
npm run build      # production build; fails with a readable message on bad content
npm start          # serve the production build
npm run check      # lint + typecheck + format check + tests
```

Node 20.9 or newer.

## Publish an experiment

1. Create a numbered folder in `content/experiments/`, for example `012-signal-shelf/`.
2. Add `index.mdx` and the media it uses (`cover.png`, `detail-01.png`, …) to that folder.
3. Complete the frontmatter and write the entry. The full format, field rules, writing rules and a copy-and-paste prompt for drafting entries in any chat are in [`docs/content-format.md`](docs/content-format.md).
4. Preview locally with `npm run dev`. Set `draft: true` to keep an unfinished entry out of production.
5. Commit and push. Vercel builds every affected page.

That folder is the only change needed. It automatically produces the detail page, the directory entry, category counts, the archive entry, the sitemap item, the Open Graph image and the page metadata. Nothing in `app/`, `components/` or any data array is edited.

> While `npm run dev` is running, edits to existing entries and new media files show up on refresh. After adding a **brand-new entry folder**, restart the dev server once so the new route is registered. Production builds always pick up everything.

### Frontmatter

```yaml
---
id: '009' # required, unique, zero-padded string (quote it)
title: 'Signal Shelf' # required
slug: 'signal-shelf' # required, unique, lowercase-with-hyphens
date: '2026-10-01' # required, YYYY-MM-DD (quote it)
status: 'building' # required: live | building | archived
categories: ['AI', 'Tools'] # required, 1–3, from the controlled list below
tags: ['Research', 'Notes']
description: 'One plain sentence.' # required
cover: './cover.png' # optional; without it a type-led placeholder is drawn
coverAlt: 'What the cover shows' # required whenever cover is set
featured: false # the home page features the newest featured entry
demoUrl: '' # optional public URL
githubUrl: '' # optional public repository
stack: ['Next.js', 'TypeScript']
updated: '' # optional meaningful update date
draft: false # true = never built in production
ogImage: '' # optional; otherwise a type-led card is generated
---
```

Optional fields can be left as `""`. Unknown fields, bad dates, a missing file, a duplicate `id` or `slug`, or an unknown category fail the build with the file name and the reason.

The body uses the sections described in the format document (`## Overview`, `## The idea`, `## What I was testing`, `## Process`, `## Result`, `## Learnings`, `## Notes`, `## Stack`, plus `## Media` if wanted). They render in the order written, and a section with no content is never rendered.

- The `# Title` line and the paragraph under it become the page's opening summary. The page itself supplies the one `h1`.
- `![alt](./detail-01.png)` followed by `*Caption: …*` becomes a figure with a real `<figcaption>`.
- `![alt](./demo.mp4)` renders a video with controls (never autoplay). Put `demo.vtt` beside it for captions. Keep clips short, or host longer video elsewhere and link it.
- When frontmatter `stack` is set it is shown as metadata, so a `## Stack` section is not repeated.
- Remote images are not supported: keep media in the entry folder.

### Categories

The controlled list lives in `categoryDefinitions` in [`lib/site-config.ts`](lib/site-config.ts): AI, UI, UX, Interaction, Motion, Web, Tools, Experimental, Other. A typo in frontmatter fails the build instead of quietly creating a category. To introduce one, add a name, slug and one-line description there. Category pages, counts, filters and the directory are all derived, and only categories with published work appear.

### The current entries

`content/experiments/` holds seven entries: Inspira 2.0, OneMoment, AI Brain, Jarvis Wallpaper, this site, RDL Theme and Spinblade Arena. They were written from each project's own README and product docs, and from the project manifests, so the facts match the repositories. Everything except this site is marked `building` because none of the others has a confirmed public release yet. When one ships, change `status` to `live` and add `demoUrl`.

**Images are currently switched off** with `showImages: false` in `lib/site-config.ts`: no cover or article image is shown or loaded, tiles become text-only and the featured entry spans the full width. Set it to `true` to bring them all back; nothing is deleted from the entry folders.

The cover and detail images are schematic diagrams drawn from those documents (view names, hubs, modes, data flow, how the site is built), not screenshots, and their captions say so. RDL Theme and Spinblade Arena use real images instead: the first is the repository's own reference renders, the second is captured from the running game. Swap in real screenshots for the others whenever you have them: keep the file name and update `coverAlt`. Avoid screenshots of this site on its own entry, because the home page would then show a copy of itself.

OneMoment lives in a private repository, so its entry has no source link and stays high-level. Check that you are comfortable with everything it says before you deploy.

## Monthly audit

Once a month the whole set of projects is reviewed against the previous record. The brief is in [`docs/monthly-audit.md`](docs/monthly-audit.md), and the records are in [`audits/`](audits/): a snapshot and a report per month, plus one history file per project that is added to and never overwritten. The repository is public, so those files hold only public information.

## Deploy to Vercel

1. Push to GitHub.
2. Import the repository as a **Next.js** project in Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` (for example `https://experiments.yourdomain.com`, no trailing slash). See `.env.example`. Locally it falls back to `http://localhost:3000`.
4. Deploy.

The URL drives `metadataBase`, canonical URLs, Open Graph, `sitemap.xml`, `robots.txt` and JSON-LD.

## Configuration

Everything that is not content lives in [`lib/site-config.ts`](lib/site-config.ts): site name and description, the “currently exploring” list, GitHub, LinkedIn, portfolio and email links, the category list, and the theme default.

- **Analytics.** `analytics` adds Vercel Web Analytics (page views, referrers, countries; no cookies). It is `false` for now. In Vercel, open the project, then Analytics, and click Enable; after that set `analytics: true` and push. Turning it on before enabling it in Vercel logs a failed request for `/_vercel/insights/script.js` on every page.
- **Images.** `showImages` hides or shows every entry image site-wide. It is `false` for now.
- **Email.** `links.email` is empty, so no email link is shown anywhere. Set it to show one in the footer and on the About page.
- **Theme default.** First visits open in dark. Set `theme.followSystem` to `true` to follow `prefers-color-scheme` instead (dark stays the final fallback). An explicit choice always wins.
- **About.** The text is `content/site/about.mdx`; the home page reuses its first paragraph.

## How it is built

```text
app/            routes, metadata, sitemap, robots, media + OG route handlers
components/     SiteHeader, MobileMenu, ThemeToggle, FilterBar, ExperimentRow/Tile/Visual/Meta,
                StatusBadge, SectionLabel, EmptyState, LoadingState, ErrorState, …
content/        experiments/ and site/: the only thing you edit to publish
docs/           the content format, authoring prompt and monthly audit brief
audits/         monthly audit snapshots, reports and one history file per project (not part of the site)
lib/content/    frontmatter schema, parsing, collection, filtering, asset loading
lib/theme/      theme resolution, persistence and the pre-paint script
styles/         tokens, base, grid rules, prose
```

- **Static everywhere.** Content is read and validated at build time. Every published entry, category and media file is prerendered. Production excludes drafts entirely.
- **One client footprint.** Browser-only code is limited to the theme toggle, mobile menu, nav highlighting, and the filter/view controls, plus the Vercel Analytics script when `analytics` is on. Everything else renders on the server.
- **Filters live in the URL.** `/experiments?category=ai&status=live&sort=oldest&view=index` is shareable, reloadable and works with the back button. Unknown values fall back to defaults. The static HTML contains the default list; the explorer takes over on hydration.
- **Media.** Files beside `index.mdx` are served through `/media/<slug>/…` and rendered with `next/image`, with real dimensions read at build time. Image URLs carry a short content hash (`/media/<slug>/v-<hash>/<file>`), so replacing `cover.png` under the same name always shows the new picture instead of a cached one. Only the main featured image and each detail cover are preloaded.
- **Open Graph.** `ogImage` if set, otherwise a generated type-led card at `/og/<slug>` (site default at `/og/default.png`).

### Design system

- **Grid.** Rules are 1px borders on the cells themselves (`.cell` inside `.rule-grid`, see `styles/grid.css`). The grid is 12 columns from tablet up with asymmetric spans, one column on mobile, and a last row that always closes. Tiles use subgrid so images and text align across a row. Sections and the footer are separated by a double rule (`DoubleRule`, `.rule-double`).
- **Tokens.** Colours are semantic CSS variables (`--color-bg`, `--color-fg-muted`, `--color-border`, …) defined once in `styles/tokens.css`; dark is the default and light is redefined on `[data-theme='light']`. Components never use raw colours.
- **Type.** Inter Tight for display and text, Geist Mono for metadata, both self-hosted (OFL, see `app/fonts/LICENSE.txt`). The scale is fluid and defined in `styles/tokens.css`. Headings are sentence case; nothing is set in all caps except small mono labels.
- **Icons.** Arrows and status symbols are inline SVG, not font glyphs: they are missing from the Latin font subsets and a fallback font would render them differently on every device.
- **Motion.** CSS only, short and functional. Reduced motion removes the non-essential animation.

#### Two deliberate deviations from the brief

- **Light accent is `#4a6a10`, not `#5b7e16`.** The original is 4.2:1 on the page background and 3.9:1 on surfaces, below the 4.5:1 AA floor for small text (LIVE labels, links). The darker value is 4.8:1 or better on every surface. `--color-fg-faint` is about 3:1 in both themes, so it is used only for decoration, never for information.
- **Nothing relies on the faint border tokens alone.** Borders are quiet rules at about 1.4:1; every control is identified by text or fill as well.

### Accessibility

Semantic landmarks, one `h1` per page, a skip link, native `button` filters with `aria-pressed` in labelled groups, `aria-current` on navigation, a modal `<dialog>` mobile menu that traps focus and closes on Escape, theme-aware focus rings on every interactive element (including whole-cell links), 44px targets on mobile, and `prefers-reduced-motion` support. axe-core reports no WCAG 2.1 A/AA or best-practice violations on the routes checked, in both themes at 375px and 1280px.

## Tests

`npm test` runs Vitest:

- frontmatter parsing, normalisation and error messages, including the example entry in `docs/content-format.md` parsed exactly as written
- section splitting, figure/caption transform, sorting, derived counts, archive grouping, previous/next
- filter and sort logic, URL parameter parsing/serialising, grid layout spans
- theme persistence, resolution, and the real pre-paint script run against the same cases

## Known limits

- Video is served as a static file. Safari expects HTTP range support for seeking, so keep local clips short or host longer ones elsewhere.
- The current year shown in the header and footer is fixed at build time.
