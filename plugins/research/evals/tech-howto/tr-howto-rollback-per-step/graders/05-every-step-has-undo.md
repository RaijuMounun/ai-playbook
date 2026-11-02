---
type: llm
focus: last_message
---

PASS only if every numbered step under "Adımlar" has its own "Geri alma" line with a concrete undo (a command, a setting, or a named restore action), none says only "not needed" without a reason, and every step also has a "Risk" line. If the report names a community script, it also gives who maintains it and when it was last updated, or says that it was not reviewed.
FAIL if any step has no undo or only a vague one such as "just reinstall", if a step has no risk level, or if a community script is recommended with no reputation check.
