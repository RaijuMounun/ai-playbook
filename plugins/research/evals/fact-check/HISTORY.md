# fact-check eval history

`date | change | setup | passed | notes`

2026-10-29 | baseline (manifest dependencies removed so the plugin loads in eval runs) | sonnet, runs 1, ablation none | 4/6 | tr-brain-ten-percent, en-misattributed-quote fail: well-known myths answered from memory
2026-10-29 | description: also for well-known myths, famous quotes and popular science "facts" that seem answerable from memory; more Turkish question forms | sonnet, runs 1, ablation none | 6/6 | gate passed, research suite 17/17
2026-11-03 | job-quality baseline: tr-claim-is-prediction | sonnet, runs 1, ablation none, WebFetch | 0/1 | fail: dispatched a researcher and gave the verdict "Yanıltıcı" on a prediction ("2030 uzman tahminleri: Doğrulanamadı"); the skill says a prediction is not checkable and should be named as such; $0.18
2026-11-03 | job-quality baseline: tr-brain-myth-verdict | sonnet, runs 1, ablation none, WebFetch | 0/1 | passes brief, template and verdict "Yanlış"; fails 05: the origin trail is second hand ("James metnini, almanağı ve Carnegie önsözünü doğrudan okumadım"); a first run had a broken brief grader (inline regex flags) and was rerun; $0.14 + $0.18
