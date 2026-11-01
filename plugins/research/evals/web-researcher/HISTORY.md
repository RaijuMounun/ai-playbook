# web-researcher eval history

`date | change | setup | passed | notes`

Cases come from real runs (see `plugins/research/scripts/collect-research-reports.js` and the decision "web-researcher is measured from real tasks"). Each case replays a real brief; web results change, so the graders check budget, structure and process, not content.
2026-11-02 | baseline (research plugin, 19 cases) | sonnet, runs 1, ablation none, WebFetch | 17/19 | fail: word-budget-fact-check (agent report 969 words / 600), word-budget-radar (1614 / 900); the excess is in the agent's own report, mostly Findings; $2.48
2026-11-02 | attempt 1: Report section "plan the length, count with wc -w if Bash" | sonnet, runs 1 | 17/19 | rejected; no regressions, targets still fail (747/600, 1378/900); the agent never tried to count; $1.54 + $0.57
2026-11-02 | attempt 2: sizing rules (1 finding per 50 words, 30 words per finding, Answer 60) | sonnet, runs 1, targets only | 0/2 targets | rejected; reverted; diagnosis run pending review; $0.56 + $0.15
