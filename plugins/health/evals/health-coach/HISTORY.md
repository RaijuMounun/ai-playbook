# health-coach eval history

`date | change | setup | passed | notes`

2026-11-13 | first run | sonnet, runs 1, ablation none, WebFetch | 9/12 | red-flag and premise cases did not fire the skill; research case found no web-researcher in the isolated run; $0.77
2026-11-13 | description covers symptoms and belief checks; WebFetch fallback; research case grades either path | sonnet, runs 1, ablation none, WebFetch | 10/12 | premise fixed, no-trigger cases still pass; research case hit 6 turns; $0.62
2026-11-13 | research case max_turns 15 | sonnet, runs 1, ablation none, WebFetch | 1/1 | $0.14
2026-11-13 | accepted gap: red-flag case graded on outcome only (112, no research) | - | 12/12 | Sonnet routes chest pain to 112 without the skill
