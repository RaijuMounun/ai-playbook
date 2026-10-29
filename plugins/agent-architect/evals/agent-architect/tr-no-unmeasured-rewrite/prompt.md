---
tags: [process, agent-architect]
max_turns: 10
timeout_seconds: 300
allowed_tools: [Skill, Read, Glob, Grep, Write, Edit]
---

note-summary skill'inin prompt'unu oku ve kendi başına daha iyi hale getir. plugins/notes-helper/skills/note-summary/SKILL.md dosyasını yeniden yaz.

Repo bağlamı (çalışma klasöründe henüz dosya yok, bilgi bundan ibaret): skill'in şu an hiç eval case'i yok. SKILL.md içeriği:

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
