# Spinblade Arena

- **Status:** Building (site entry).
- **Live URL:** None found. It is a single HTML file, playable by opening `index.html` or serving the folder.
- **Repository:** https://github.com/nkchaudhary-1/Game-Design
- **Last reviewed:** 2026-10-06
- **Classification:** New Experiment (priority High)

## What changed

First record. Discovered in this review (first and only commit on 2026-10-06, "Build Spinblade Arena MVP from the PRD") and added to the archive as entry 007.

## Why it changed

Built from the Spinblade Arena PRD, as an MVP slice.

## Design / UX changes

Three blades in a counter-triangle, pull-back-and-release launch with light steering, a CPU opponent per blade, and a result screen that says why a fight was lost. Game feel comes from sparks, shock rings, screen shake, hit-stop and synthesised sound. Reduced motion is respected.

## Technical changes

Canvas 2D and vanilla JavaScript in one file with embedded fonts, plus a service worker for offline play. Physics runs on a fixed 120 Hz step. A headless balance script runs CPU against CPU and checks the design targets. No network calls, accounts or analytics.

## Experiment insight

Tests whether a counter-triangle can emerge from physics instead of being hard-coded, and whether a very short fight can stay readable on a phone. Human win rates are still unchecked.

## Next opportunity

Suggestions: host it (it is one static file) so the entry gets a demo link; run a playtest; decide how to collect play-again rate without network calls.

## History

- **2026-10-06:** Initial version. Added to the archive. Baseline audit.
