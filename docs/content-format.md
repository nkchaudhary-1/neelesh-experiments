# NEEL / EXPERIMENTS — experiment content format

Use this document as the standard format for every experiment entry in the NEEL / EXPERIMENTS archive.

It has two purposes:

1. It is the Markdown/MDX file structure that the website reads.
2. It is a prompt you can paste into any chat when you want that chat to write an experiment entry for you.

The result should read like a concise research note from a personal digital lab. It should be honest about what was made, what was tested, what worked, and what did not. Do not turn a small experiment into a corporate case study.

## Folder format

Store one experiment per folder:

~~~text
content/
  experiments/
    009-example-slug/
      index.mdx
      cover.png
      detail-01.png
      detail-02.png
      demo.mp4
~~~

Use a zero-padded ID in the folder name. Keep all media used by the entry in the same folder. Use clear asset names such as cover.png, prototype-overview.png, interaction-loop.gif, or system-diagram.svg.

## Required frontmatter

Every index.mdx file begins with this YAML frontmatter. Do not omit required fields.

~~~yaml
---
id: "009"
title: "Experiment title"
slug: "experiment-title"
date: "2026-10-01"
status: "live"
categories:
  - "AI"
  - "Interaction"
tags:
  - "Workflow"
  - "Prototype"
  - "Context"
description: "One clear sentence describing what the experiment is and the interaction, system, or question it explores."
cover: "./cover.png"
coverAlt: "Describe the visible interface, image, diagram, or composition in the cover image."
featured: false
demoUrl: ""
githubUrl: ""
stack:
  - "Next.js"
  - "TypeScript"
updated: ""
draft: false
ogImage: ""
---
~~~

### Field rules

| Field | Rule |
| --- | --- |
| id | Required. A unique, zero-padded string, for example 009 or 014. |
| title | Required. Use title case for a named project, such as Calendar Lab or AI Brain. |
| slug | Required. Lowercase with hyphens only. Must be unique. |
| date | Required. ISO format: YYYY-MM-DD. Use the first public or archive date. |
| status | Required. Exactly one of live, building, archived. |
| categories | Required. One to three categories. Prefer AI, UI, UX, Interaction, Motion, Web, Tools, Experimental, or Other. |
| tags | Use two to five specific labels. Avoid repeating the same word as a category unless it adds detail. |
| description | Required. One plain sentence, ideally 16–30 words. Describe the thing and its focus. |
| cover | Local relative path. Leave blank only when the design can render a suitable fallback. |
| coverAlt | Required when a cover is present. Describe the content, not just “cover image.” |
| featured | true for one prominent entry only; otherwise false. |
| demoUrl | Optional absolute URL. Use only for a public, working demo. |
| githubUrl | Optional absolute URL. Use only for a repository intended to be public. |
| stack | Optional. List the meaningful tools, framework, platform, model, or material used. Keep it short. |
| updated | Optional ISO date. Use only for a meaningful update. |
| draft | true keeps an unfinished entry out of the public production archive. |
| ogImage | Optional local relative path. The site generates a text-based sharing image if empty. |

## Status rules

Use the status that matches the current state:

- **live**: a stable public demo, tool, page, or documented experiment is available.
- **building**: active work or a documented prototype that is still changing.
- **archived**: finished, paused, superseded, or intentionally preserved without ongoing work.

Do not call something live only because a screenshot exists. Do not call something archived merely because it is small.

## Content structure

After frontmatter, use the following sections in this order. Keep only sections that have useful content. The website must not render empty sections.

~~~mdx
# Experiment title

A short opening paragraph of 35–70 words. State what you made, why it caught your attention, and what kind of interaction or system is at the centre of it.

## Overview

One or two short paragraphs that give a visitor enough context to understand the experiment without reading the full entry.

## The idea

Explain the starting question, observation, constraint, or curiosity. Describe the idea in direct language.

## What I was testing

- A specific interaction, behaviour, visual rule, workflow, or technical question.
- A second concrete thing being tested.
- A third point only if it adds distinct value.

## Process

Describe the main steps, iterations, references, materials, or implementation decisions. Use short paragraphs or a compact numbered list.

![Meaningful description of the image](./detail-01.png)

*Caption: State what this visual shows and why it matters.*

## Result

Describe the current outcome. If it is a public demo, say what visitors can do. If it is a prototype, say what exists now.

## Learnings

- One concrete observation.
- One constraint, trade-off, or failure.
- One next step, if there is a real next step.

## Notes

Use this for small details, references, caveats, version changes, or a short personal observation.

## Stack

- Next.js
- TypeScript
- Figma
~~~

Do not write a section just to fill the template. A small experiment may only need Overview, The idea, What I was testing, Result, and Learnings. A larger one may use every section.

## Writing rules

Use this style:

- First person is welcome: “I wanted to see…”, “I tested…”, “I changed…”.
- Lead with the actual work. Avoid scene-setting and promotional language.
- Use short paragraphs, usually 1–4 sentences.
- Be specific about inputs, decisions, constraints, and outcomes.
- Say when something is unfinished, fragile, or exploratory.
- Use plain language. Terms such as prototype, interaction, system, model, or workflow are fine when they describe the work.
- Describe images with useful alt text and add captions when the image has a point.
- Use headings in sentence case as shown above.
- Keep the total entry proportionate to the project. Typical range: 350–900 words.

Avoid:

- “This groundbreaking project…”
- “I leveraged…”
- “A seamless experience…”
- generic claims such as “improves usability” without explaining how
- invented metrics, user research, or results
- long project-management narratives
- repeating the title or metadata in every paragraph
- presenting a study as a finished product when it is a sketch

## Copy-and-paste prompt for any chat

Paste the text below into any chat, then replace the bracketed details. The chat should return only a completed MDX file, with no explanation before or after it.

~~~text
Write one finished MDX experiment entry for the NEEL / EXPERIMENTS archive.

Return only the completed MDX file. Do not include an introduction, explanation, markdown fence, or alternative versions.

Archive voice:
- Personal digital lab and research note, not a corporate case study or portfolio pitch.
- Clear, direct, curious, and honest about uncertainty.
- First person is allowed.
- Use plain language, short paragraphs, and specific details.
- Do not invent claims, metrics, research, users, links, or technical details.
- Keep it between 350 and 900 words unless the supplied material is too limited. If material is limited, write a shorter but complete entry.
- Do not add a section that has no meaningful content.

Use this exact frontmatter structure. Keep the values I provide. Fill empty optional values only when supported by the supplied information.

---
id: "[ID, for example 009]"
title: "[TITLE]"
slug: "[LOWERCASE-HYPHENATED-SLUG]"
date: "[YYYY-MM-DD]"
status: "[live | building | archived]"
categories:
  - "[CATEGORY 1]"
  - "[CATEGORY 2, if needed]"
tags:
  - "[TAG 1]"
  - "[TAG 2]"
  - "[TAG 3, if useful]"
description: "[ONE-SENTENCE SUMMARY]"
cover: "[for example ./cover.png]"
coverAlt: "[WHAT THE COVER IMAGE SHOWS]"
featured: false
demoUrl: "[PUBLIC URL OR EMPTY]"
githubUrl: "[PUBLIC URL OR EMPTY]"
stack:
  - "[TOOL OR TECHNOLOGY]"
updated: ""
draft: false
ogImage: ""
---

# [TITLE]

[OPENING: 35–70 words explaining what was made, why it was interesting, and the central interaction/system/question.]

## Overview

[One or two short paragraphs of context.]

## The idea

[Starting question, observation, constraint, or curiosity.]

## What I was testing

- [Concrete test 1]
- [Concrete test 2]
- [Concrete test 3 only if distinct]

## Process

[Main iterations, implementation decisions, references, constraints, or material choices.]

![DESCRIPTIVE ALT TEXT](./detail-01.png)

*Caption: [What the image shows and why it matters.]*

## Result

[What exists now. State whether it is a live demo, prototype, or archived study.]

## Learnings

- [Concrete learning]
- [Constraint, trade-off, or failure]
- [Real next step, only if applicable]

## Notes

[Optional caveat, version note, or reference.]

## Stack

- [Meaningful tool, framework, model, or material]

Source material to use:
- Experiment summary: [PASTE]
- What prompted it: [PASTE]
- What was tested: [PASTE]
- Process or implementation details: [PASTE]
- Current result: [PASTE]
- Learnings, constraints, and failures: [PASTE]
- Media available and what each shows: [PASTE]
- Links and stack: [PASTE]
~~~

## Example completed entry

~~~mdx
---
id: "009"
title: "Signal Shelf"
slug: "signal-shelf"
date: "2026-10-01"
status: "building"
categories:
  - "AI"
  - "Tools"
tags:
  - "Research"
  - "Notes"
  - "Workflow"
description: "A small shelf for collecting loose research signals and asking an AI to find useful connections between them."
cover: "./cover.png"
coverAlt: "A dark two-column interface showing saved research cards on the left and linked notes on the right."
featured: false
demoUrl: ""
githubUrl: ""
stack:
  - "Next.js"
  - "TypeScript"
  - "Local embeddings"
updated: ""
draft: false
ogImage: ""
---

# Signal Shelf

Signal Shelf is a small research tool for the fragments that usually end up scattered between notes, screenshots and browser tabs. I wanted to see whether an AI could help surface connections without turning the collection process into another complicated workspace.

## Overview

The experiment starts with a simple shelf of saved signals: a sentence, image, link or short note. Each item stays small. The useful part is the ability to place two or three unrelated pieces beside each other and ask what they have in common.

The current prototype is deliberately narrow. It is for collecting and reconnecting ideas, not for managing projects or replacing a note-taking app.

## The idea

I often recognise a pattern only after I have saved several partial references over a few days. The starting question was whether a tool could make that delayed recognition more visible while leaving the original material intact.

## What I was testing

- Whether compact cards make it easier to keep adding unfinished thoughts.
- Whether connection prompts feel more useful when they cite the original saved material.
- Whether the interface can stay calm when a collection grows past a few dozen items.

## Process

I began with a single-column list, then moved to a split layout after the connection output started competing with the saved items. The left side now holds the collection, while the right side holds a temporary working thread.

![A prototype showing research cards and a linked-note panel](./detail-01.png)

*Caption: The current split layout keeps the source material visible while a connection is being explored.*

## Result

The prototype can collect short items, group selected cards, and generate a short explanation of possible links. It is not public yet because the grouping controls still feel slower than the rest of the interface.

## Learnings

- Keeping source cards visible makes generated connections easier to trust and discard.
- The first version used too many labels, which made quick collection feel like data entry.
- Next I want to test manual grouping before adding more AI-generated structure.

## Stack

- Next.js
- TypeScript
- Local embeddings
~~~

## Pre-publish check

Before committing a new entry:

- The ID and slug are unique.
- Date, status, categories, title, and description are complete.
- All local media paths resolve from the experiment folder.
- Cover alt text describes the visual content.
- External links are live and intentional.
- The entry has no empty headings.
- Claims and learnings are true to the work.
- draft is false only when the entry should be public.

