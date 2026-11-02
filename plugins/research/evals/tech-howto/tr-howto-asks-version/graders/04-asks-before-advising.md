---
type: llm
focus: last_message
---

PASS only if the final message asks for the phone's brand/model and its Android version, and it does not hand over a researched procedure yet: no step-by-step removal guide, no list of specific packages to remove. A short general overview of the possible methods and their risk levels (even naming the tool or command type) is fine.
FAIL if it gives a step-by-step procedure or specific package names before knowing the device and version, or if it does not ask for the model and version.
