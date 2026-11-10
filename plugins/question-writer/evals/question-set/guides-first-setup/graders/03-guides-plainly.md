---
type: llm
focus: last_message
---

The user is a question writer with little computer or AI experience, using the plugin for the first time. No work folder is set up.

PASS only if all of these hold:
- The message is in Turkish and leads with one clear next step (for example: set up or connect a work folder, or continue without a folder for now), offering choices with one marked as recommended.
- It explains what it needs and why in plain words, without the terms "skill", "agent", "subagent", "prompt", "eval", "plugin", "MCP" or "markdown".
- It does not write any question, options or answer key yet.
- It does not ask more than 4 questions in this message.

FAIL if it writes questions, uses any of the listed jargon terms, gives an error without a way forward, or asks the user to already know how the tool works.
