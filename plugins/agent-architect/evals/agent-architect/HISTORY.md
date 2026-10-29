# agent-architect eval history

`date | change | setup | passed | notes`

2026-10-29 | first smoke run (v0.1.0) | sonnet, runs 1, ablation none | 5/5 | trigger, should-not-trigger, intake question
2026-10-29 | baseline (job-quality) | sonnet, runs 1, ablation none, --allow-tools Write Edit | 5/10 | fail: tr-new-agent (4th question has no options), research-before-design (recommends skipping research), build-cases-first (SKILL.md written before cases), improve-reproduce-first (SKILL.md written before the case), tr-no-unmeasured-rewrite (rewrites SKILL.md unmeasured); cost $0.79 for the suite
