# After office hours

Formerly NEEL / EXPERIMENTS.

- **Status:** Live. Changed from Building in this review.
- **Live URL:** https://neelesh-experiments.vercel.app (the repository homepage field). Not fetched from the review environment; Vercel reports every Production deployment through the latest commit as successful.
- **Repository:** https://github.com/nkchaudhary-1/neelesh-experiments
- **Last reviewed:** 2026-10-06
- **Classification:** Major Update (priority High)

## What changed

Since the record of 2026-10-01 (five entries, named NEEL / EXPERIMENTS):

- Renamed to After office hours, with a new home heading, a label ("Experiment archive") and two lines of subtext.
- Two new entries, RDL Theme and Spinblade Arena, bringing the archive to seven.
- About page rewritten from the resume, with LinkedIn and portfolio links, also added to the footer.
- Visual system tightened: smaller sentence-case headings, double rules between sections, more space around section labels and the hero, and the index action arrows aligned with the section links.
- The entry's own claim "It is not deployed yet" was out of date and has been corrected.

## Why it changed

Requested by the owner: the first heading looked too large and all caps, the archive needed its own name, and the hero needed to say what the site and the owner do.

## Design / UX changes

- **Visual design:** sentence case, smaller display type, double rules, 12px and 16px hero spacing.
- **Information architecture:** one continuous 007 to 001 ID sequence across Latest, Index and Archive. The home Archive shows its true yearly total.
- **Navigation:** footer gains LinkedIn and Portfolio.
- **Images:** a site-wide switch hides all entry images. It is off for now.

## Technical changes

Production deployments on Vercel on every push. A Vercel Web Analytics component was added behind a config switch and is off until Analytics is enabled in Vercel. No change to the content pipeline.

## Experiment insight

Tests whether a folder of Markdown can be the whole CMS for a design lab, and how little client-side code a site like this needs. Naming and hero copy turned out to need as many iterations as layout.

## Next opportunity

Suggestions: enable Analytics for a traffic baseline before the next audit; set the site URL for share previews; add real screenshots and switch images on; consider a public changelog page generated from `audits/`.

## History

- **2026-09-30:** First commit, as NEEL / EXPERIMENTS.
- **2026-10-01:** Five real entries replace samples; images switch added; sentence case and double rules; About rewritten; first Production deployment.
- **2026-10-06:** Renamed After office hours; seven entries; hero rewritten; status set to Live. Baseline audit.
