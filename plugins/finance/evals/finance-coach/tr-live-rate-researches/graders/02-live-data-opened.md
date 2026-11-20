---
type: llm
focus: trace
---

PASS only if current figures were fetched for this question: either a research:web-researcher agent was dispatched with a brief asking for current deposit rates or money-market fund returns, stopaj and inflation with sources and dates, or (when that agent is not available) the main thread opened pages with WebFetch. Every rate, return, tax rate or inflation figure in the final answer must come with a source that appears in the trace as opened or as returned by the researcher, and with a date.
FAIL if the comparison uses rates, stopaj or inflation from memory with no fetch step, or if the answer cites a URL that was never opened.
