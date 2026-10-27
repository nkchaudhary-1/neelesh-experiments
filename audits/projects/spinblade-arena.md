# Spinblade Arena

- **Status:** Building (site entry).
- **Live URL:** None found. It runs from a build (`npm run build:single` makes one self-contained HTML file). No hosted version linked.
- **Repository:** https://github.com/nkchaudhary-1/Game-Design
- **Last reviewed:** 2026-10-27
- **Classification:** Major Update (priority High)

## What changed

Since the review of 2026-10-19: three commits on 2026-10-20. Moves, Supers and effects were added for all 21 blades, and the Hangar of a local build reads "21 playable, 21 in roster" (it read 3 before). A realism pass changed visuals and audio only: gyroscope-style tilt and precession, 3D sparks, floor scuffs, synthesised metal sounds. Two commits are marked work in progress, covering arena mechanics and a progression core; the README does not describe them yet. Tests went from 86 to 97. The site entry was updated.

Earlier, since the baseline of 2026-10-06 the project moved from a 2D prototype to a 3D game. Six commits (all dated 6 Oct, pushed by 11 Oct): a 3D rebuild from a second PRD and a blades-and-skills spec, retuned matchups, a visual overhaul, a realism pass, smoother steering and longer spin, and faster controls with a distinct look per blade. The 2D version is kept in `v1-solo/`. The site entry was written against the 2D version and has been rewritten.

## Why it changed

Stated in the README: the build spec asked for a 3D top-down game (Three.js and Rapier), and PRD v2 added a browser-only functional test with the controller and arena side by side. The README flags that the PRD's 2D decision needs updating.

## Design / UX changes

Three-dimensional blades and a concrete arena with PBR textures; cream, navy and red UI; a Hangar for 21 blades, a Workshop with about 35 parts, 22 Supers and a pad with three moves. Three graphics tiers. Spin lasts up to three minutes by Stamina.

## Technical changes

Vite and TypeScript, Three.js, Rapier (WebAssembly), 86 tests, a headless balance script, a BroadcastChannel two-tab controller mode. Fixed 120 Hz simulation with no DOM. The old single-file build is replaced by a bundled build; a single-file output is still available.

## Experiment insight

Tests whether a counter-triangle can emerge from ratings and physics, and whether a short fight stays readable. v2 adds a question: can the controller and the arena be separate parts from the start (the shape of a phone-and-big-screen version).

## Next opportunity

Suggestions: host the single-file build for a demo link; measure frame rate on a real GPU (only a software renderer was used); a playtest for human win rates; give Hard difficulty its own balance pass (the README says the Attack counter does not hold there).

## History

- **2026-10-06:** Initial version, a single-file 2D prototype, built from the PRD. Added to the archive. Baseline audit.
- **2026-10-06 to 2026-10-11:** Rebuilt as a 3D game (v2); 2D version kept in `v1-solo/`.
- **2026-10-20:** All 21 blades playable; realism pass on visuals and audio; arena mechanics and progression work started.
- **2026-10-27:** Interim review. Entry updated; screenshots retaken from a local build.
- **2026-10-19:** Interim review. Site entry rewritten for v2 with new screenshots (captured from a local build in a software-rendered browser).
