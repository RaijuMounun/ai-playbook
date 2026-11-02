---
type: llm
focus: last_message
---

PASS only if the final message asks the user to narrow the scope (to specific tools or techniques, or to the decision the radar should inform) with a clear question, and it does not present radar ratings (Adopt, Trial, Assess, Hold) yet. One question, or a short group of closely related ones, is fine.
FAIL if it rates candidates already, if it starts researching without asking, or if it asks nothing.
