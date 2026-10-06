# RDL Theme

- **Status:** Building (site entry).
- **Live URL:** None. It is installed as a Claude Code plugin or skill, not hosted.
- **Repository:** https://github.com/nkchaudhary-1/RDL-Theme
- **Last reviewed:** 2026-10-06
- **Classification:** New Experiment (priority High)

## What changed

First record. Discovered in this review and added to the archive as entry 006. Version 3.3.0. The last commit is from 2026-10-01.

## Why it changed

The repository's own changelog states the goal of version 3: screens that come out consistent, minimal and well spaced by construction, not by eye.

## Design / UX changes

A style study of 220 RonDesignLab shots turned into rules: a glass and a flat look, eleven accent colours, a 4pt spacing ladder, a screen skeleton, a 12-column bento, a control-height ladder, and a concentric corner-radius rule with strict and soft nesting.

## Technical changes

One `tokens.json` generates CSS, a Tailwind preset and SwiftUI constants. An audit script checks type, spacing, radii, control heights and contrast on rendered pixels. A single-file `RDL/SKILL.md` carries the whole skill. SwiftUI files were written without a compiler and are untested.

## Experiment insight

Tests whether a visual style can be written down precisely enough that a model builds consistent screens in it.

## Next opportunity

Suggestions: build the SwiftUI files once in Xcode; test the plugin install on a clean machine; turn the radius rule into a short public write-up.

## History

- **2026-09-27:** First commit (flat look), then v2 with the glass language, the same day.
- **2026-10-01:** v3 with layout system, anatomy, guidelines and the audit; then radius work (3.1 to 3.2) and the single-file skill (3.3.0).
- **2026-10-06:** Added to the archive. Baseline audit.
