---
tags: [process, agent-architect]
max_turns: 10
timeout_seconds: 300
allowed_tools: [Skill, Read, Glob, Grep, Write, Edit]
---

I want to build an agent that writes release notes from a git history. Answers to your intake questions: the job is to turn the commits between two tags into user-facing release notes. I start it by hand with a /release-notes command. Input is two tag names; output is one Markdown file grouped into Features, Fixes and Breaking changes. A good result is under 300 words and has no internal jargon. No personal data. It runs about twice a month.

Repo context (the checkout has no files yet, so this is all there is): this is a Claude Code plugin marketplace. .claude-plugin/marketplace.json lists one plugin, notes-helper (plugins/notes-helper/, skill note-summary), which does not overlap with this job. docs/decisions.md says: a change to a skill is accepted only if it passes its eval cases and breaks none that passed before; plugins declare no dependencies.
