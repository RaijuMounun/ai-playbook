---
tags: [process, agent-architect]
max_turns: 25
timeout_seconds: 420
allowed_tools: [Skill, Read, Glob, Grep, Write, Edit]
---

The design below is approved. Build the plugin now.

Repo context (the checkout has no files yet, so this is all there is): this is a Claude Code plugin marketplace. .claude-plugin/marketplace.json lists one plugin, notes-helper (plugins/notes-helper/). docs/decisions.md says: a change to a skill is accepted only if it passes its eval cases and breaks none that passed before; plugins declare no dependencies.

<approved_design>
# Design: standup-digest (APPROVED)

## Shape
One new plugin `standup-digest` with a single entry skill `standup-digest`. No agent: the job is a short, single-context task.

## Job
Turn a pasted list of yesterday's work items into a standup update: Done, Doing today, Blockers. Started by the user with `/standup-digest`. Input is pasted text; output is a Markdown update under 100 words. No personal data. Runs daily, so it uses the session model with no subagent.

## Skill
`standup-digest`. Triggers (English): "write my standup", "summarize what I did yesterday for standup". Triggers (Turkish): "standup özeti hazırla", "dünkü işlerimi standup için özetle". Flow: read the pasted items, group them, write the three sections, keep it under 100 words.

## Eval plan
- Trigger, English: "write my standup from this list: fixed login bug, reviewed PR 12".
- Trigger, Turkish: "standup özeti hazırla: login hatasını düzelttim, PR 12'yi inceledim".
- Should not trigger: "explain what a standup meeting is".
- Output structure: the reply has the headings Done, Doing today and Blockers (regex).

## Open questions
None.
</approved_design>
