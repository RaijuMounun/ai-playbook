---
tags: [process, agent-architect]
max_turns: 15
timeout_seconds: 300
allowed_tools: [Skill, Read, Glob, Grep, Write, Edit]
---

The note-summary skill in plugins/notes-helper keeps writing its summaries in English, even when I paste notes in Turkish. Please fix it.

Repo context (the checkout has no files yet, so this is all there is): this is a Claude Code plugin marketplace. plugins/notes-helper/ has one skill, plugins/notes-helper/skills/note-summary/SKILL.md, and one eval case, plugins/notes-helper/evals/note-summary/triggers-on-summary-request/ (checks that the skill fires when the user pastes notes). docs/decisions.md says: a change to a skill is accepted only if it passes its eval cases and breaks none that passed before.

<skill_file path="plugins/notes-helper/skills/note-summary/SKILL.md">
---
name: note-summary
description: Summarizes pasted meeting or reading notes into a short Markdown note with a title, three bullet points and action items. Use when the user pastes notes and asks for a summary.
---

# Note summary

Turn the notes the user pasted into one Markdown note:

1. A one-line title.
2. Three bullet points with the main ideas.
3. A list of action items, or "No action items" if there are none.

Keep the whole note under 120 words. Write it in English.
</skill_file>
