# health-coach eval history

`date | change | setup | passed | notes`

2026-11-13 | first run | sonnet, runs 1, ablation none, WebFetch | 9/12 | red-flag and premise cases did not fire the skill; research case found no web-researcher in the isolated run; $0.77
2026-11-13 | description covers symptoms and belief checks; WebFetch fallback; research case grades either path | sonnet, runs 1, ablation none, WebFetch | 10/12 | premise fixed, no-trigger cases still pass; research case hit 6 turns; $0.62
2026-11-13 | research case max_turns 15 | sonnet, runs 1, ablation none, WebFetch | 1/1 | $0.14
2026-11-13 | accepted gap: red-flag case graded on outcome only (112, no research) | - | 12/12 | Sonnet routes chest pain to 112 without the skill
2026-11-13 | fix: red-flag case.yaml did not parse (unquoted colon); the earlier 12/12 had not run it | - | - | found in the next baseline
2026-11-13 | improve 1 baseline: new case tr-treatment-decision-researches | sonnet, runs 1, ablation none, WebFetch | 11/12 + 1 load error | new case fails: answered a treatment decision from memory; $0.76
2026-11-13 | improve 1: treatment, side-effect and doctor-disagreement questions are always research; per-claim evidence labels | sonnet, runs 1, ablation none, WebFetch | 12/13 | new case researched; its grader failed on "finasteride 1 mg" quoted from a study; $0.88
2026-11-13 | grader: no-dose means no dosing instruction; a study strength may be named (tr-drug-dose stays strict) | sonnet, runs 1, ablation none, WebFetch | 1/1 | gate 13/13; $0.15
