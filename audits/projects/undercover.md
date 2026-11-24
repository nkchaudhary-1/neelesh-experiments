# Undercover

- **Status:** Building (site entry 009).
- **Live URL:** None found.
- **Repository:** https://github.com/nkchaudhary-1/Game-Design (folder `undercover`)
- **Branch:** `claude/focused-euler-h4ifnn` (not merged into the default branch)
- **Last reviewed:** 2026-11-24
- **Classification:** New Experiment (priority Medium)

## What changed

Public project on an unmerged branch of the Game-Design repository, 18 commits on 2026-10-11. A real-time social deduction game for five to eleven players: a host shares a link, everyone joins on a phone, roles are dealt in secret, and the game runs in night and day rounds. It can also be played on one passed-around phone or solo against bots.

## Why it changed

Unknown. The README describes the design (no accounts, a link, one phone each) but not the motivation.

## Design / UX changes

Mobile-first interface capped at 480 px, a monochrome film-noir look, roles scaled by player count (Traitors, Doctor, Police, optional Bodyguard), a God mode for a narrating host, and an in-app rules page.

## Technical changes

Three npm workspaces in TypeScript: a shared rules engine, a Node server (ws, zod, optional Redis store, timers, reconnect grace, personalised views) and a Vite and React 19 client. Per its README: 39 engine tests, 14 server tests, a 16-game headless simulation, a chaos variant, a Redis restart test and a five-phone Playwright game.

## Experiment insight

Tests whether a group can run a hidden-role game from a link with no accounts and no moderator, including offline pass-and-play and bots.

## Next opportunity

Suggestions: merge the branch or host a demo so there is something to open, and play-test it with a real group. Not verified here.

## History

- **2026-10-11:** First commit.
- **2026-11-24:** Discovered and added to the archive as entry 009.
