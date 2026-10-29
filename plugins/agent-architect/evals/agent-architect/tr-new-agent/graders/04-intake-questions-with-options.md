---
type: llm
focus: last_message
---

PASS only if the final message asks the user between 2 and 4 intake questions about the agent to build (for example its job, inputs and outputs, what a good result looks like, personal data, how often it runs), and every question comes with answer options, one of them marked as the recommendation.
FAIL if the message has fewer than 2 or more than 4 questions, if any question has no options, if it asks only for confirmation, or if it presents a finished design or says it created files.
