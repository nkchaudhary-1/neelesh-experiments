# Monthly experiment and project audit

This repository keeps the records for the audit described below in `audits/`:

- `audits/snapshots/YYYY-MM.json`: the machine-readable state at each review. Never edited afterwards, so the next review can diff against it.
- `audits/YYYY-MM.md`: the monthly report and changelog.
- `audits/projects/<slug>.md`: one record per project. Each review adds a dated entry to its History. Nothing is overwritten.

The repository is public. Records hold only what is already public (public repositories, the published entries). Private projects stay at the level of their published entry, and anything from private tools (Notion, Drive, employer work) stays out of the repository and goes in the chat report instead.

How a review is run here: list the repositories, clone each public one with enough history to compare, read the previous snapshot, check each live URL (or mark it Unknown if it cannot be reached), classify, then add the new snapshot, report and history entries. Sources that cannot be checked are listed as Unknown / Needs Review in the report.

The text below is the brief, as written.

---

Monthly Experiment & Project Audit
Run this workflow once every month to review and maintain all my design experiments, projects, prototypes, and live websites.
Objective
Maintain an up-to-date overview of everything I have built, experimented with, or currently have live.
The goal is to identify what has changed since the previous review, update the project information, and keep the experiment archive accurate and current.
1. Discover All Projects
Check all available sources where my projects may exist, including:

* GitHub repositories
* Live websites and deployed projects
* Vercel deployments
* Framer projects
* Project documentation
* Design repositories
* Experiment archives
* Previously documented projects
* Any other connected project/source available to you

Do not assume that the existing project list is complete.
First, discover what is currently live or actively maintained.
2. Audit Every Project
For each project, check:
Project Status

* Is the project still live?
* Is the URL working?
* Is the repository still active?
* Has the project been archived?
* Has it been replaced by a newer version?

Product / Design Changes
Look for:

* New screens
* UI changes
* Layout changes
* Interaction changes
* New features
* Removed features
* New animations or motion
* Updated visual direction
* New content
* New experiments
* Major UX changes

Technical Changes
Check for:

* New deployments
* Repository updates
* Major code changes
* Framework or dependency changes
* New integrations
* Performance-related changes
* New functionality

3. Compare With Previous Month
For every project, compare the current state with the previous month's record.
Classify each project as:

* No Change
* Minor Update
* Major Update
* New Experiment
* Archived
* Broken / Offline
* Replaced
* Needs Review

Do not report insignificant technical noise as a meaningful project change.
Focus on changes that affect the product, design, experience, functionality, or experiment itself.
4. Update the Experiment Archive
For every project where meaningful changes are found, update its documentation.
Each project should contain:
Project
Project name
Status
Current status
Live URL
Current live URL, if available
Repository
Repository link, if available
Last Reviewed
Date of this monthly audit
What Changed
A concise summary of meaningful changes since the previous review.
Why It Changed
Explain the likely purpose or motivation behind the change when it can be determined.
Design / UX Changes
Document meaningful changes to:

* UI
* UX
* Interaction
* Navigation
* Information architecture
* Visual design
* Motion

Technical Changes
Document meaningful technical changes when relevant.
Experiment Insight
Capture what the experiment appears to be testing, learning, or demonstrating.
Next Opportunity
Identify what could be explored or improved next.
5. Maintain a Monthly Changelog
Create a monthly summary containing:
New Experiments
Projects discovered or created since the previous review.
Updated Experiments
Projects that received meaningful updates.
Archived Experiments
Projects that are no longer active.
Major Changes
The most important changes across all projects.
Interesting Discoveries
Unexpected or notable changes worth documenting.
Portfolio-Worthy Work
Identify experiments that have become strong enough to potentially become:

* Portfolio case studies
* Design explorations
* Product stories
* Social posts
* Visual experiments
* Reusable design patterns

6. Keep Historical Records
Never overwrite important historical information.
Maintain a chronological history so that I can understand how an experiment evolved over time.
Example:

```
Experiment
↓
Initial Version
↓
Month 1
↓
Month 2
↓
Major Redesign
↓
Current Version
```

Each monthly review should add a new entry rather than destroying the previous record.
7. Prioritize Meaningful Changes
Use this priority system:
High Priority
Major redesigns, new functionality, significant UX changes, major experiment iterations, or important launches.
Medium Priority
Meaningful UI improvements, content changes, interaction updates, or technical improvements affecting the experience.
Low Priority
Minor visual changes, copy changes, dependency updates, or small technical changes that do not materially affect the experiment.
Do not clutter the monthly report with low-value changes.
8. Final Monthly Report
At the end of every monthly audit, provide:
Monthly Experiment Summary
Total Projects Reviewed: X
New: X
Updated: X
Archived: X
Offline: X
No Meaningful Change: X
Top Changes

1. Project — what changed
2. Project — what changed
3. Project — what changed

Portfolio Opportunities
Highlight the experiments that are becoming interesting enough to document publicly.
Recommended Next Actions
Give me a short prioritized list of what I should do next based on the current state of my experiments.
Important Rules

* Always verify the current state before updating documentation.
* Prefer live project evidence over assumptions.
* Do not mark a project as changed just because its repository has a new commit.
* Distinguish technical changes from actual product/design changes.
* Preserve historical information.
* Never invent project details.
* If something cannot be verified, explicitly mark it as Unknown / Needs Review.
* Keep the documentation concise but useful.
* Focus on design, UX, product thinking, experimentation, and learning.
* Treat this as an ongoing monthly archive of my design experimentation journey.

Monthly Goal
By the end of every monthly review, my experiment archive should accurately answer:
What did I build? What changed? What did I learn? What is currently live? And what should I explore next?
