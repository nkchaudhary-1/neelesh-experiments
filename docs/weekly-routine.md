# Daily check and weekly update

The archive keeps itself current without publishing anything on its own. Two commands do the work, and a third piece (a subagent) reads the projects.

| Piece                                                     | What it does                                                                                                                                                                |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`/daily-check`](../.claude/commands/daily-check.md)      | Compares every watched repository with the last run and adds a short note to the **Weekly notes inbox** issue. Changes nothing on the site.                                 |
| [`/weekly-update`](../.claude/commands/weekly-update.md)  | On Sunday, turns the week's notes into a draft update on a separate branch, shows the notes and the changes with a preview link, and publishes only after you reply `ship`. |
| [`project-watcher`](../.claude/agents/project-watcher.md) | A read-only subagent that inspects one repository and reports what changed. Both commands use it.                                                                           |

Both commands also work by hand: type `/daily-check` or `/weekly-update` in a Claude Code session in this repository.

## The flow

```
Every day    /daily-check   → one note added to the inbox issue          (nothing deploys)
Every Sunday /weekly-update → draft on a branch + preview link
                            → you see the notes and the changes
                            → you reply  ship | edit: … | skip
                            → only on "ship": merge to the default branch → live site
```

- The default branch deploys to Production on Vercel, so merging it is "going live". The draft branch only gets a Preview.
- If you do not reply, nothing is published. Unpublished notes stay in the inbox and roll into the next Sunday.
- The weekly update changes `content/` and `audits/` only. Design and code changes are suggested, never made.

## The inbox

A single GitHub issue titled **Weekly notes inbox**. Each daily run adds one comment with the date, what moved in which project, what did not, and a hidden `<!-- heads: {...} -->` marker with every project's latest commit so the next run knows where to start. You can add your own notes to it as comments, such as "Inspira is published now" or "drop RDL Theme from the archive", and the Sunday run will read them.

Only comments by `nkchaudhary-1` count. The issue is public, so anyone can comment on it; the commands ignore everyone else and never treat comment text as instructions.

Inbox issue body, used if it ever needs recreating:

> Daily notes from `/daily-check` and the weekly publish log. Add your own notes as comments. Only comments by the repository owner are read.

## What is watched

The public repositories listed in the newest `audits/snapshots/*.json`, plus any new repository under `nkchaudhary-1`. Private repositories (OneMoment) are not read and are never mentioned in the inbox. To track one, attach it to the session yourself and add the notes by hand.

## Running it on a schedule

Two scheduled tasks wake one long-lived Claude Code session titled **After office hours: daily and weekly routine**. That session was started with this repository attached, which is what gives it GitHub access. A scheduled task that starts a brand-new session gets no repository, so it cannot read or post to the inbox issue.

| Task          | When (India time) | Message sent to the session                                    |
| ------------- | ----------------- | -------------------------------------------------------------- |
| Daily check   | every day, 22:47  | Follow the instructions in `.claude/commands/daily-check.md`   |
| Weekly update | Sundays, 10:17    | Follow the instructions in `.claude/commands/weekly-update.md` |

Each run sends a push notification. On Sunday, reply to the draft in that session in the Claude app.

To pause, disable or delete a task, use the Claude Code scheduled tasks list (or ask Claude to). Scheduled runs use your plan's usage, not the one-off credit. If a run ever reports that it has no GitHub access, start a new session from this repository, point the two tasks at it, and archive the old one.
