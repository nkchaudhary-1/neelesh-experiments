# Hostile Skies

- **Status:** Building (site entry 010).
- **Live URL:** None found.
- **Repository:** https://github.com/nkchaudhary-1/Game-Design (folder `hostile-skies`)
- **Branch:** `claude/wonderful-gates-r2alu6` (not merged into the default branch)
- **Last reviewed:** 2026-11-24
- **Classification:** New Experiment (priority Medium)

## What changed

Public project on an unmerged branch of the Game-Design repository, 6 commits from 2026-10-27 to 2026-11-19. An arcade flight simulator in the browser: fly the Sparrow interceptor against an alien fleet, defend three coastal cities across five waves that end in a mothership.

## Why it changed

Unknown. The README says it lives beside Spinblade Arena and shares its dependencies.

## Design / UX changes

Four enemy kinds with distinct behaviour, a heat-limited cannon and lock-on missiles, difficulty that changes the aliens rather than the aircraft, assisted or manual flight, keyboard, mouse, gamepad and touch controls, a hands-off demo reel, and (2026-11-19) a reference-painting theme as the default.

## Technical changes

TypeScript, Three.js and Vite, with no art assets and no server: terrain, ships, cockpit, sky and sound are generated in code. Per its README: 42 simulation tests, a single-file build and a recording script for the demo reel.

## Experiment insight

Tests how much of a 3D arcade game can be made from generated code alone, with a scripted demo pilot standing in for footage.

## Next opportunity

Suggestions: host the single-file build so the entry can link a playable version. Confirm what 'building' still means for it. Not verified here.

## History

- **2026-10-27:** First commit.
- **2026-11-24:** Discovered and added to the archive as entry 010.
