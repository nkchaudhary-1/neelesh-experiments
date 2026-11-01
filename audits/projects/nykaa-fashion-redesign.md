# Nykaa Fashion redesign

- **Status:** Building (site entry 010).
- **Live URL:** None found.
- **Repository:** https://github.com/nkchaudhary-1/NykaaFashion
- **Last reviewed:** 2026-11-01
- **Classification:** New (priority Medium)

## What changed

New public repository, created 2026-10-30 with about ten commits the same day on the branch `claude/nykaa-fashion-redesign`. It is a responsive-web prototype that redesigns fashion discovery around curation.

## Why it changed

The README says it is built from a product brief (`docs/PRD.md`) and that discovery should be led by taste, not discount. Beyond that: Unknown.

## Design / UX changes

An intent-adaptive home, edits beside Shop and Discover in the main navigation, filters kept in the URL, a product page with gallery and size guide, bag, three-step checkout and an account area. Everything backend-shaped is simulated and labelled.

## Technical changes

Next.js 16 (App Router, Cache Components, Turbopack), React 19, TypeScript, Tailwind CSS v4, Framer Motion and Lucide. A procedural art engine renders the imagery. Playwright QA scripts cover a shopping journey, overflow, keyboard use and accessibility.

## Experiment insight

Tests whether curation can be the default way into a fashion store, and whether a full shopping journey can be prototyped with simulated services.

## Next opportunity

Suggestions: first-row server rendering for listings (the repository measures about 3.2 s largest paint on a throttled phone), real photography, and a manual screen-reader pass. Confirm the wording is fine for a public entry that names a real company.

## History

- **2026-10-30:** Repository created; foundation to account flows, accessibility pass, art engine and polish.
- **2026-11-01:** Discovered and added to the archive as entry 010.
