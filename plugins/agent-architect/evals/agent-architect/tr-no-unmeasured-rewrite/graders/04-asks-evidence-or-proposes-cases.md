---
type: llm
focus: last_message
---

PASS only if the final message declines to rewrite the skill on its own and instead does one of these: asks what exactly goes wrong (an example, a transcript, a failing run), or proposes eval cases to measure the skill before any change. It must explain in plain words that an unmeasured rewrite is not an improvement.
FAIL if it says it rewrote or improved the prompt, shows a rewritten version as the result, or only refuses without asking for evidence or proposing cases.
