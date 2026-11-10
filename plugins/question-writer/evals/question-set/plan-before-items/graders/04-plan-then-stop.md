---
type: llm
focus: last_message
---

The user gave 15 learning outcomes for a grade 3 set and asked for 3 visual items.

PASS only if all of these hold:
- The message shows a plan of 15 items (a table or a numbered list), each tied to one of the given outcomes, with no outcome used twice.
- Each item has a short context idea, and exactly 3 items are marked as visual (any visual kind counts: picture, picture sequence, table, graph, map, sketch, poster).
- Small extras are fine: questions about process components, notes on listening items, or optional alternatives offered to the user.
- It asks the user, in Turkish, to approve or change the plan before the questions are written.
- No full question is written yet: no question stems followed by written-out options. A plan column with the intended answer letter per row is part of the plan (it spreads the keys) and is allowed.

FAIL if any outcome is repeated or missing, if questions with options are already written, or if it does not stop for approval.
