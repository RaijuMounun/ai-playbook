# finance-coach eval history

`date | change | setup | passed | notes`

2026-11-21 | first run | sonnet, runs 1, ablation none, WebFetch | 10/14 | clear-verdict, flags-missed-issue, premise-gold, scam: skill did not fire when the prompt gave the figures or said not to research (answers themselves passed); $0.86
2026-11-21 | description: cover user-supplied figures, "don't research", beliefs, Telegram offers | sonnet, runs 1, ablation none, WebFetch | 14/14 | gate passed, no regression; $1.00
2026-11-21 | v0.2: US ETFs, fetch/metrics/tax scripts, 7 new cases | sonnet, runs 1, ablation none, WebFetch | 19/21 | rsi-timing (no evidence statement), drawdown-vs-policy (loss not in money); $1.47
2026-11-21 | SKILL.md: TA claim in premise check; risks in money | sonnet, runs 1 | 20/21 | both fixed; live-rate-researches regressed (rerun runs 2: 1/2): with no shell, figures given without an opened source; $1.50 + $0.49
2026-11-21 | SKILL.md: no shell or exit 2 -> researcher/WebFetch; only printed or opened figures | sonnet, runs 1 | 20/21 | live-rate-researches still fails: several sources 404, judged trace looks incomplete (25 lines for 198 s); known gap, stopped after 3 attempts; $1.64
