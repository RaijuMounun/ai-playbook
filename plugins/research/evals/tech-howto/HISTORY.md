# tech-howto eval history

`date | change | setup | passed | notes`

2026-10-29 | baseline | sonnet, runs 1, ablation none | 6/6 | all pass
2026-10-29 | fact-check description edit (gate run) | sonnet, runs 1, ablation none | 6/6 | no regression
2026-11-03 | job-quality baseline: tr-howto-asks-version | sonnet, runs 1, ablation none, WebFetch | 1/1 | pass after three case fixes (a Windows prompt was wrong because the run knows the local Windows build; a vague prompt did not fire the skill; the rubric forbade a general overview); $0.32 + $0.05 + $0.04 + $0.05 + $0.05
2026-11-03 | job-quality baseline: tr-howto-rollback-per-step | sonnet, runs 1, ablation none, WebFetch | 0/1 | fail: step 3 (Xbox) has no "Geri alma" line and step 4 says "resmî bir yeniden ekleme komutu bulamadım, geri yükleme noktası kullanın"; the other checks pass; $0.29
