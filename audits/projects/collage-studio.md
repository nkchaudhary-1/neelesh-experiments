# Collage Studio

- **Status:** Building (site entry 014).
- **Live URL:** None found.
- **Repository:** https://github.com/nkchaudhary-1/Ideas (folder `collage-editor`)
- **Last reviewed:** 2026-11-24
- **Classification:** New Experiment (priority Medium)

## What changed

New folder in the Ideas repository, 38 commits from 2026-11-19 to 2026-11-21. A browser editor for Instagram posts, collages, typography and mixed photo and video carousels, with a separate Edit photos and videos mode.

## Why it changed

The README says its design language comes from an audit of a 'Photo Edits' Figma file.

## Design / UX changes

Figma-style canvas with a labelled tool rail, a properties card that opens only when needed, a mode chip that says where you are, a photo wheel and a quick adjust bar, a phone layout under 900 px, 60 templates, a front page of saved projects and an orange-on-black palette.

## Technical changes

Next.js 14, React, Konva, Zustand, Tailwind CSS and mp4 and webm muxers, with autosave to IndexedDB. Unit tests for the colour pipeline, browser tests, a scripted layout audit and a repository-level design-rules file (concentric corner radii).

## Experiment insight

Tests whether a calm, floating-card editor can cover collage, carousel and photo and video editing in one tool that never leaves the device.

## Next opportunity

Suggestions: host a build, and test iOS Safari, which the README says has not been tested.

## History

- **2026-11-19:** First commit.
- **2026-11-24:** Discovered and added to the archive as entry 014.
