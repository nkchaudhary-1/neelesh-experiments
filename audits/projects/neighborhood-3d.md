# Neighborhood 3D

- **Status:** Building (site entry 013).
- **Live URL:** https://claude.ai/artifact/3qJEAMv3jwdWydq8u6KuYQ (a published Claude artifact titled "Neighborhood Maple Street (newer of two same-day copies)", added 2026-11-27 from the owner's artifact list; it is not a Vercel site, and whether it is shared publicly has not been verified).
- **Repository:** https://github.com/nkchaudhary-1/Game-Design (folder `neighborhood`)
- **Branch:** `claude/neighborhood-3d-game-concept-94hg1d` (not merged into the default branch)
- **Last reviewed:** 2026-11-24
- **Classification:** New Experiment (priority Medium)

## What changed

New work on an unmerged branch of the Game-Design repository, 12 commits on 2026-11-19 and 2026-11-20. The first slice of a persistent, multiplayer, browser-based 3D neighbourhood: a walkable street, two enterable houses, a three-floor apartment block with a working lift, a park, chat and emotes, with state that persists across restarts.

## Why it changed

The README says the bet is whether the place is enjoyable to walk through before any game is layered on it.

## Design / UX changes

Walk, sprint, jump and a camera with pointer lock, doors, switches, benches and a lift UI, flat-colour low-poly 3D, a minimap and zone names.

## Technical changes

TypeScript, Three.js, ws and Vite with an authoritative server, client prediction and reconciliation, an all-axis-aligned-box collision world and a lift state machine. Per its README: 54 tests, and a single-file demo that runs the server inside the page with simulated neighbours.

## Experiment insight

Tests the walkability and feel of a shared 3D place before adding any game rules.

## Next opportunity

Suggestions: the README's own unverified list (real-GPU frame rate, pointer-lock mouse look, touch, roof and park by hand, guard chase in a browser).

## History

- **2026-11-19:** First commit.
- **2026-11-24:** Discovered and added to the archive as entry 013.
- **2026-11-27:** Published-artifact link added to the entry.
