# web-researcher eval history

`date | change | setup | passed | notes`

Cases come from real runs (see `plugins/research/scripts/collect-research-reports.js` and the decision "web-researcher is measured from real tasks"). Each case replays a real brief; web results change, so the graders check budget, structure and process, not content.
2026-11-02 | baseline (research plugin, 19 cases) | sonnet, runs 1, ablation none, WebFetch | 17/19 | fail: word-budget-fact-check (agent report 969 words / 600), word-budget-radar (1614 / 900); the excess is in the agent's own report, mostly Findings; $2.48
2026-11-02 | attempt 1: Report section "plan the length, count with wc -w if Bash" | sonnet, runs 1 | 17/19 | rejected; no regressions, targets still fail (747/600, 1378/900); the agent never tried to count; $1.54 + $0.57
2026-11-02 | attempt 2: sizing rules (1 finding per 50 words, 30 words per finding, Answer 60) | sonnet, runs 1, targets only | 0/2 targets | rejected; reverted; diagnosis (rerun after a rate-limited try): the agent obeys the bullet count (11 of 12 allowed) but not the per-bullet cap (28-57 words, about 38 average), so the fact-check report drops from about 969 to about 670 words against 600; $0.56 + $0.15 + $0.16
2026-11-02 | attempt 3: aim for 80% of the budget, one finding per 60 words, about 20 words per finding | sonnet, runs 1, targets only | 0/2 targets | rejected; reverted; three attempts used, loop stopped per improve-loop.md; $0.47
2026-11-02 | SubagentStop hook `scripts/word-budget-check.js`: counts the report against the brief's budget and blocks the stop with the exact count (at most 2 blocks); agent prompt unchanged | sonnet, runs 1, ablation none, WebFetch | 19/19 | accepted; targets 2/2 in two runs (fact-check 727 -> ~574 / 600, one block; radar 1202 -> 914 -> ~882 / 900, two blocks), no regressions; $0.70 + $0.62 + $2.30
