# fact-check eval history

`date | change | setup | passed | notes`

2026-10-29 | baseline (manifest dependencies removed so the plugin loads in eval runs) | sonnet, runs 1, ablation none | 4/6 | tr-brain-ten-percent, en-misattributed-quote fail: well-known myths answered from memory
2026-10-29 | description: also for well-known myths, famous quotes and popular science "facts" that seem answerable from memory; more Turkish question forms | sonnet, runs 1, ablation none | 6/6 | gate passed, research suite 17/17
2026-11-03 | job-quality baseline: tr-claim-is-prediction | sonnet, runs 1, ablation none, WebFetch | 0/1 | fail: dispatched a researcher and gave the verdict "Yanıltıcı" on a prediction ("2030 uzman tahminleri: Doğrulanamadı"); the skill says a prediction is not checkable and should be named as such; $0.18
2026-11-03 | job-quality baseline: tr-brain-myth-verdict | sonnet, runs 1, ablation none, WebFetch | 0/1 | passes brief, template and verdict "Yanlış"; fails 05: the origin trail is second hand ("James metnini, almanağı ve Carnegie önsözünü doğrudan okumadım"); a first run had a broken brief grader (inline regex flags) and was rerun; $0.14 + $0.18
2026-11-03 | fix: step 1 treats a prediction about the future as not checkable (no researcher, no verdict, offer to check the factual parts) | sonnet, runs 1, ablation none, WebFetch | 1/1 | tr-claim-is-prediction flips to pass on the first attempt; $0.07
2026-11-03 | fix attempts for tr-brain-myth-verdict (brief: open the original yourself, mark second-hand; then primary study required; then PubMed abstract counts), 3 attempts | sonnet, runs 1, ablation none, WebFetch | 0/1 | not accepted and reverted: the trail improved (the original James text is now opened) but the science verdict still rests on a popular article; judge votes 0 of 3, then 1 of 3 (attempt 2), then 0 of 3; patch kept in the side-session notes (research-fix-1-and-4.patch)
