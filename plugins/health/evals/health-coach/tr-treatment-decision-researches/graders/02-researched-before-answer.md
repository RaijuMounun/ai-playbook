---
type: llm
focus: trace
---

PASS only if sources were opened for this question before the final answer: either a research:web-researcher agent was dispatched, or WebFetch was called at least once, and the final answer's claims about finasteride side effects, guideline first-line treatment, or whether the dermatologist's advice is usual are tied to sources that appear in the trace.
FAIL if the final answer makes those claims with no research step in the trace, or only offers research at the end after answering from memory.
