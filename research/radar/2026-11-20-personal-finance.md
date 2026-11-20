# Personal finance assistant: research for the `finance` bundle

Date: 2026-11-20. One sonnet `research:web-researcher` run. Distilled; the raw numbers it saw (policy rate, CPI) are deliberately left out, because they go stale. Facts are fetched live at answer time.

## Practices and failure modes

- **Sycophancy is measurable in finance.** Zhao et al., arXiv 2604.24668 (ICLR 2026 FinAI workshop): most models fail when the user's stated preference contradicts the correct answer; they hold up only modestly under pushback. Abstract only read. Design answer: a premise check before answering inside the user's framing.
- **Advice varies by model and persona.** UGA / Journal of Financial Planning (Jul 2026): 7 chatbots, fictional personas; advice differed by platform and by gender and race (e.g., emergency-fund size). "Trust but verify". https://news.uga.edu/?p=114423
- **Skeptic.** Pawan Jain, The Conversation / PBS (Jul 2026): fluency is not accuracy; financial advice is a credence good, errors surface years later; red flags are large sums, tax consequences, irreversible decisions, personal specifics. https://www.pbs.org/newshour/economy/when-managing-your-money-take-a-chatbots-confidence-with-a-grain-of-salt
- **Gap.** No study found on stale or invented numbers. Workaround: fetch live, date every number, never quote a rate from memory.

## Turkish legal line

- Yatırım danışmanlığı is a licensed investment service under Law 6362 and SPK Communiqué III-37.1 (amended Apr 2022). https://spk.gov.tr/duyurular/basin-duyurulari/2022/yatirim-hizmetleri-ve-faaliyetleri-ile-yan-hizmetlere-iliskin-esaslar-hakkinda-teblig-iii-37-1de-degisiklik-yapilmasina-dair-teblig
- General commentary for an anonymous investor is allowed; advice tailored to a person's risk/return profile is licensed advisory (from search snippets of III-37.1; primary text not yet opened).
- No SPK statement on AI or robo-advice found.
- A disclaimer does not turn personalised advice into general information: substance counts. Line for the bundle: educate, compare, run scenarios; never "buy X / sell Y / put N% in Z" for this user.

## Live data sources

| Data | Source | Access | Freshness | Key |
| :- | :- | :- | :- | :- |
| Policy rate | TCMB "1 Hafta Repo" page, PPK summaries | page | per PPK meeting | no |
| Series (rates, CPI, FX history) | TCMB EVDS (EVDS 3 beta since 2026-01-26; EVDS 2 still up) | API | per series | free key, `key` param |
| FX (official indicative) | https://www.tcmb.gov.tr/kurlar/today.xml | XML | daily | no |
| CPI | TÜİK bulletin, 3rd of each month 10:00 | page | monthly | no |
| Deposit / loan averages, card ceiling rates | TCMB banking statistics | page | weekly / monthly | no |
| Per-bank offers | bank sites | page | live | no |
| Stopaj | Resmi Gazete, GİB | page | on decision | no |
| Funds | TEFAS (no official public API; unofficial `tefas.gov.tr/api` wrappers) | page | daily | no |
| Filings | KAP | page | real time | unclear |
| Gold, market FX | doviz.com, Kapalıçarşı | page | live | no |

- Stopaj rates conflict across 2025–2026 articles. Never hard-code; open Resmi Gazete or GİB.
- MCP servers: `borsa-mcp` (saidsurucu, MIT; KAP, TEFAS, EVDS, doviz.com, Yahoo), `fonparam-mcp`, `kap-mcp`. One-person projects, untested. Rating: **Assess**, not adopted in v0.1.

## Plugin guidance (Claude Code docs, 2026)

- Plugins can bundle skills, agents, hooks and `.mcp.json`. `userConfig` with `sensitive: true` stores an API key (EVDS) securely. `${CLAUDE_PLUGIN_DATA}` persists state; personal data still belongs in the vault.
- A rule that must hold every time belongs in a hook. Hooks can add `additionalContext`; write injected text as facts.
- Keep SKILL.md short; put volatile facts in fetched data, not in reference files.

## Not verified

Current individual stopaj rates; exact III-37.1 wording; KAP/TEFAS API terms; ENAG debate; per-bank comparison sources.
