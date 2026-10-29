# Bollywood Night Awards

- **Status:** Building (site entry). Whether it has been used at an event, and any hosted copy, are Unknown / Needs Review.
- **Live URL:** None found. The README says to deploy it on Vercel with the root directory set to `bollywood-vote`, and a commit sets Vercel's static preset, but no URL is documented.
- **Repository:** https://github.com/nkchaudhary-1/Game-Design (folder `bollywood-vote`, in the same repository as Spinblade Arena)
- **Last reviewed:** 2026-10-29
- **Classification:** New Experiment (priority Medium)

## What changed

First record. Discovered in this review. Ten commits across 2026-10-28 and 2026-10-29 take it from a first voting app to a static site with a curtain reveal and a design pass.

## Why it changed

The README describes a Best Dressed award for a Bollywood Night: the host shares a screen on a projector and guests vote on their phones. On 29 October it moved from a hosted-first version with a live leaderboard to a static site with hidden results and no backend.

## Design / UX changes

Guest details first (name and character, or a pasted list), then the award page with a QR code already on screen, a 2 or 5 minute clock, names that light up as people vote, a drumroll and curtain reveal with confetti, joint winners or a 60-second tie-break, and a design pass: Rozha One and Plus Jakarta Sans, a plum, marigold and rani pink palette, aligned layouts and an optional stage backdrop.

## Technical changes

Plain HTML, CSS and JavaScript, no build step. The host's browser is the server: phones connect to it over WebRTC through PeerJS's public broker, and votes live in the host's `localStorage`. Voting rules are in one file with tests, and the phone link is tested against a fake PeerJS network. A script builds a click-through demo with sample guests.

## Experiment insight

Tests whether a live vote can run with no server, database or login, with secret scores and an honest way to handle ties.

## Next opportunity

Suggestions: record the event date and a hosted address; try a real run with guests and note where WebRTC fails on venue networks; write up the move from a hosted leaderboard to hidden results.

## History

- **2026-10-28:** First commit; voting rules extracted and a click-through demo added.
- **2026-10-29:** Names setup, vote clock, curtain reveal and tie-break; moved to a static site; Vercel static preset; design pass.
- **2026-10-29:** Discovered and added to the archive as entry 009.
