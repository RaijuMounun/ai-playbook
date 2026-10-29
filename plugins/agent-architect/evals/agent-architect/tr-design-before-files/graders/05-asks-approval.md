---
type: llm
focus: last_message
---

PASS only if the final message tells the user the design doc is written (or summarizes the design) and asks the user to review and approve it before the next step, without saying that skill, agent or eval files are already created.
FAIL if it never asks for approval, if it says it has already created the skill or agent files, or if it carries on to build the bundle without waiting.
