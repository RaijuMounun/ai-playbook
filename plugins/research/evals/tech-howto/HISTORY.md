# tech-howto eval history

`date | change | setup | passed | notes`

2026-10-29 | baseline | sonnet, runs 1, ablation none | 6/6 | all pass
2026-10-29 | fact-check description edit (gate run) | sonnet, runs 1, ablation none | 6/6 | no regression
2026-11-03 | job-quality baseline: tr-howto-asks-version | sonnet, runs 1, ablation none, WebFetch | 1/1 | pass after three case fixes (a Windows prompt was wrong because the run knows the local Windows build; a vague prompt did not fire the skill; the rubric forbade a general overview); $0.32 + $0.05 + $0.04 + $0.05 + $0.05
2026-11-03 | job-quality baseline: tr-howto-rollback-per-step | sonnet, runs 1, ablation none, WebFetch | 0/1 | fail: step 3 (Xbox) has no "Geri alma" line and step 4 says "resmî bir yeniden ekleme komutu bulamadım, geri yükleme noktası kullanın"; the other checks pass; $0.29
2026-11-03 | fix attempts for tr-howto-rollback-per-step (every step carries Geri alma; then exact command or menu path; then only actions under Adımlar), 3 attempts | sonnet, runs 1, ablation none, WebFetch | 0/1 | not accepted and reverted: every step got an undo by attempt 3, but the judge still rejected "Gerekmez" on a read-only step and a vague undo on the provisioned-package step; the rubric may be stricter than the skill contract; patch kept in the side-session notes (research-fix-2-unflipped.patch); $0.43 + $0.48 + $0.45
2026-11-03 | rubric review: 05 loosened so a read-only step may say nothing needs undoing, rerun on the unchanged skill | sonnet, runs 1, ablation none, WebFetch | 0/1 | still FAIL FAIL FAIL, so the rubric was not the cause; loosening reverted, the case stays as written and the gap stays a skill gap (vague undos); $0.42
