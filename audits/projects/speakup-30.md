# SpeakUp 30

- **Status:** Building (site entry 016).
- **Live URL:** None found.
- **Repository:** https://github.com/nkchaudhary-1/Ideas (folder `speakup-30`)
- **Branch:** `claude/speakup-30-speaking-coach-e3e7co` (not merged into the default branch)
- **Last reviewed:** 2026-11-24
- **Classification:** New Experiment (priority Medium)

## What changed

New work on an unmerged branch of the Ideas repository, three commits on 2026-11-24. A working web app that runs a daily practice session, a teleprompter, a recorder and a rule-based report over a 30-day programme, with all data on the device.

## Why it changed

Unknown. The README states the principle that nothing is faked and an unscorable answer says so.

## Design / UX changes

A dashboard with streaks and a 30-day timeline, a teleprompter with pauses and cues, a challenge question with recording and replay, per-answer reports with a 'how this was scored' section, progress charts, backup and restore, and an installable phone layout.

## Technical changes

TypeScript, React, Vite, Tailwind CSS and Zustand, with localStorage and IndexedDB. Analysis is rule-based on the device; an optional AI review uses the owner's own API key and sends transcript text only. Live transcription uses the browser's speech service, which can send audio to the browser maker.

## Experiment insight

Tests whether a speaking coach can stay honest about what it can measure while keeping everything local.

## Next opportunity

Suggestions: host it over https so it can be used on a phone, and test the optional AI review path, which was only tested up to the request.

## History

- **2026-11-24:** First commit.
- **2026-11-24:** Discovered and added to the archive as entry 016.
