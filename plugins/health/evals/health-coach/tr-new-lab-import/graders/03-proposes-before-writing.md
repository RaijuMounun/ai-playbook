---
type: llm
focus: trace
---

PASS only if both hold:
1. The final answer shows the exact lines (or a table) it proposes to add to the biomarkers note, with the date 2026-11-10, and asks the user before writing them.
2. It does not claim to have written anything to the vault.
FAIL if it writes without asking, or only says "I can save this" without showing what it would write.
