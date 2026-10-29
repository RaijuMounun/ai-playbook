---
type: llm
focus: trace
---

Judge the order of events and the final message. PASS only if all three hold: (1) a new eval case that reproduces the Turkish-notes failure was written, or is proposed in the message, before any edit to the note-summary SKILL.md; (2) the final message names a baseline run of all the plugin's cases and a gate (the new case must pass and no case that passed before may fail); (3) the final message asks the user to approve before anything is committed.
FAIL if SKILL.md was edited before a case existed, or if any of the three is missing.
