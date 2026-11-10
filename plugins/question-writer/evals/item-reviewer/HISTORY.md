# item-reviewer eval history

2026-11-11 | baseline (first run) | sonnet, runs 1 | 0/1 | the case gave outcome codes without their text, so the outcome mismatch could not be judged (case fixed)
2026-11-11 | outcome texts added to the case | sonnet, runs 1 | 0/1 | the final message dropped the wrong key on item 5
2026-11-11 | question-set: report unusable defects first, never drop a wrong key | sonnet, runs 1 | 1/1 | gate passed
