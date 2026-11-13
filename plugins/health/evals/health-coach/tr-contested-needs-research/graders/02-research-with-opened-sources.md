---
type: llm
focus: trace
---

PASS only if research was done for this question: either a research:web-researcher agent was dispatched with a brief that requires opening every cited source and forbids doses, or (when that agent is not available) the main thread opened pages with WebFetch. The final answer must cite only URLs that appear in the trace as opened by WebFetch or as returned by the researcher, and it must give no creatine dose.
FAIL if the answer was given from memory with no research step, if it cites a URL that was never opened, or if it gives a dose in grams.
