# ai-engineering-radar eval history

`date | change | setup | passed | notes`

2026-11-03 | job-quality baseline: radar-vague-question | sonnet, runs 1, ablation none, WebFetch | 0/1 | fail: dispatched a researcher on "whatever is new in AI coding" instead of asking one clarifying question first; $0.22
2026-11-03 | job-quality baseline: radar-quick-entry | sonnet, runs 1, ablation none, WebFetch | 1/1 | pass: exactly one researcher, entry saved to research/radar/YYYY-MM-DD-*.md with review_by, rings, recommendation and sources; $0.25
2026-11-03 | fix: step 1 asks one clarifying question with 2-3 directions and dispatches no researcher when the question names no tool, technique or decision | sonnet, runs 1, ablation none, WebFetch | 2/2 | radar-vague-question flips to pass on the first attempt ($0.04); gate radar-quick-entry still passes ($0.30)
