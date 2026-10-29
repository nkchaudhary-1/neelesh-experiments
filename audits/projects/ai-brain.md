# AI Brain

- **Status:** Building (site entry). Featured on the home page.
- **Live URL:** Unknown / Needs Review. The repository is set up for a hosted Vercel and Supabase app, but no confirmed production URL exists. `my-ai-brain.vercel.app` appears only as an example in the docs.
- **Repository:** https://github.com/nkchaudhary-1/Claude-AI-Brain
- **Last reviewed:** 2026-10-29
- **Classification:** Major Update (priority High)

## What changed

Version 0.7 landed on 2026-10-27 (two commits): ways to remember what you read. **Recall** shows saved sentences with one word hidden and brings them back after 1, 3, 7, 16, 35 and 90 days; the **Library** lists every article, key idea, topic and note with search and a Markdown download; and each node can carry a personal note. All free, no AI. Signed in, notes and progress save to the account; otherwise they stay in the browser. The site entry was updated. Earlier: the last commit before this (30 Sep) was before the baseline.

## Why it changed

Not applicable this month. Earlier history: the move from a local prototype to a hosted, signed-in app (v0.5) was so imported Claude and ChatGPT history could live in an account.

## Design / UX changes

In order: a 3D brain prototype (v0.2), a history importer (v0.3), a spatial network with five morphing states (v0.4), then a step-by-step import guide, an "explain the map" panel (why nodes are linked and how to read it), and a single box for links or text (v0.6).

## Technical changes

Vanilla JavaScript with raw WebGL, no framework. Vercel Functions in front of Supabase with row-level security and session cookies. Learning from a link is free and uses no AI.

## Experiment insight

Tests whether a personal knowledge graph made from AI conversations can be legible, with five views of one mind and an explanation of how to read it.

## Next opportunity

Suggestions: confirm the hosted URL and set it on the entry; consider marking it live; record a short walk-through of the five views.

## History

- **2026-09-29 to 2026-09-30:** v0.2 to v0.6, 16 commits.
- **2026-10-01:** Entry published (featured).
- **2026-10-27:** v0.7: Recall, Library and notes.
- **2026-10-06:** Baseline audit. No change.
- **2026-10-29:** Interim review. Entry updated for v0.7.
