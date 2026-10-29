# agent-architect eval history

`date | change | setup | passed | notes`

2026-10-29 | first smoke run (v0.1.0) | sonnet, runs 1, ablation none | 5/5 | trigger, should-not-trigger, intake question
2026-10-29 | baseline (job-quality) | sonnet, runs 1, ablation none, --allow-tools Write Edit | 5/10 | fail: tr-new-agent (4th question has no options), research-before-design (recommends skipping research), build-cases-first (SKILL.md written before cases), improve-reproduce-first (SKILL.md written before the case), tr-no-unmeasured-rewrite (rewrites SKILL.md unmeasured); cost $0.79 for the suite
2026-10-29 | improve 1: SKILL.md step 1 falls back when repo files cannot be read | sonnet, runs 1, ablation none | 6/10 | accepted; no regressions; improve-reproduce-first now passes; $0.79
2026-10-29 | improve 2 attempt 1: SKILL.md measurement rule (no prompt edit before a failing case and baseline) | sonnet, runs 1, ablation none | 6/10 | tr-no-unmeasured-rewrite passes; build-cases-first and improve-reproduce-first still fail; $0.67
2026-10-29 | improve 2 attempt 2: Create step 5 names the first file written (a case); Improve says to name baseline, gate and approval when it stops | sonnet, runs 1, ablation none | 9/10 | accepted; targets build-cases-first, improve-reproduce-first, tr-no-unmeasured-rewrite pass, no regressions; research-before-design also passes; tr-new-agent still fails; $0.72 (+ $0.25 and $0.14 targeted reruns)
2026-10-29 | improve 3: Create step 1 gives every intake question options, including open-looking ones | sonnet, runs 1, ablation none | 9/10 | accepted; tr-new-agent passes, no regression except research-before-design flipping back to fail (flaky, fix 4 target); $0.78 (+ $0.06 targeted)
2026-10-29 | improve 4 attempt 1: Create step 3 proposes research with its quota cost, only the user can skip it | sonnet, runs 1, ablation none | 7/10 | targets pass alone; full suite flipped tr-new-agent (6 questions), research-before-design and improve-reproduce-first (both pass on rerun); $0.73
2026-10-29 | improve 3 attempt 2: Create step 1 caps intake at four questions per message (with fix 4 in place) | sonnet, runs 1, ablation none | 9/10 | accepted fixes 3 and 4; only tr-no-unmeasured-rewrite failed (skill did not fire), passed 2/2 on rerun; $0.69 (+ $0.12 reruns)
2026-10-29 | improve 5: eval-authoring.md gets a CLI limits section (fixtures, --allow-tools, focus: trace, min/max, --case) | sonnet, runs 1, ablation none | 9/10 | accepted; no regressions; tr-no-unmeasured-rewrite did not fire the skill once, passed on rerun; $0.71 (+ $0.06 rerun)
