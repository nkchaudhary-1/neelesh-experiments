# Inspira 2.0

- **Status:** Building (site entry). Chrome Web Store publication Unknown / Needs Review.
- **Live URL:** Web Store listing linked on the entry. Not verified from the review environment.
- **Repository:** https://github.com/nkchaudhary-1/Inspira
- **Last reviewed:** 2026-10-06
- **Classification:** No Change (priority Low)

## What changed

First record. No commits since the entry was written on 2026-10-01. The README and docs no longer contain a Web Store link, so the earlier ID mismatch cannot be reproduced. Needs Review.

## Why it changed

Not applicable this month. Earlier history: the commits "Chrome Web Store readiness" (26 Sep) and "security hardening for the Web Store" (27 Sep) show the project was being prepared for a store release.

## Design / UX changes

Visible in the history, in order: the Figma light and dark themes were adopted, then time-of-day "Sky" backgrounds became the default, the dock was restyled as the Figma navigation and Settings became a floating glass panel (26 Sep). Next came tinted project cards, directional page transitions, a custom background colour and a calendar Day view as three soft cards (27 Sep). The Year view is a 4 x 3 grid, and spacing was unified on a 4px scale.

## Technical changes

No build step, plain ES modules, unit tests with `node --test`. Sync uses `chrome.storage.sync` and calendars come from a private iCal link. Reliability work: pending edits are saved when a tab is hidden or the browser quits.

## Experiment insight

Tests whether a calm new-tab page can also be a quiet personal workspace, with the date as the backbone for tasks, notes and events, and no account required.

## Next opportunity

Suggestions, not findings: confirm the store listing and mark the entry live; add real screenshots; write up how Sky backgrounds were designed.

## History

- **2026-09-26 to 2026-09-29:** Initial build, 54 commits, version 2.0.0. Docs added: product decisions and "how Inspira 2.0 was made".
- **2026-10-01:** Entry published on the archive.
- **2026-10-06:** Baseline audit. No change.
