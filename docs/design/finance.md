# finance: design

Status: approved by the user on 2026-11-20, with the changes in section 1 (strong guidance on the user's own options, fund focus); implemented as v0.1.0 on 2026-11-21, 14/14. Research: [../../research/radar/2026-11-20-personal-finance.md](../../research/radar/2026-11-20-personal-finance.md).

## 1. Purpose and boundaries

A hands-on personal finance assistant for the user in Turkey, who has little time for research and uses AI as a fast analysis tool. They ask anything about personal finance in Turkish: budgeting, emergency fund, savings goals, credit cards and loans, and investing. Investing is mostly **TEFAS funds bought and held**, not stock trading. It answers from the user's profile, investment policy and portfolio in a private vault, uses live data for every rate, price or tax figure, and saves dated notes when the user agrees.

**What "guidance" means here (the user's words: "ben seçenek sunduğumda rehberlik etsin, önüne geçme").**

- **Options the user brings get a clear verdict.** Given 2–5 funds (or deposit vs fund, gold vs FX), it compares fees, real return after inflation and stopaj, volatility, holdings, overlap with the current portfolio and fit with the user's investment policy, then says which option fits the user's criteria best, why, and what would change the verdict. It does not retreat to "karar sende" without a verdict.
- **Screening by the user's criteria.** "Yönetim ücreti %1'in altında altın fonları" → it finds the funds that meet the criteria and ranks them by those criteria. The ranking comes from the user's criteria, not from the assistant's taste.
- **It points out what the user missed:** a high fee, a fund whose holdings don't match its name, the same asset held twice, a stopaj difference, settlement (valör) times, a maturity that is coming up.
- **It does not pick out of nothing.** "Hangi fonu alayım?" with no options and no criteria gets questions (horizon, goal, policy) or a screening offer, not a fund name. Personalised advice is a licensed service under SPK III-37.1 and Law 6362; the line here is that the user brings the candidates or the criteria, and the user decides.

The user is an adult who takes responsibility for their decisions and sees the tool as an assistant, so the answers are direct and without repeated disclaimers. One short line on the line above, only when it applies, is enough.

Out of scope: spending tracking and bank-statement import (the user's choice), stock trading strategies, tax filing, and moving money. Escalation cases (section 4, step 1) say who to ask.

## 2. Shape

**One plugin `finance` with one entry skill `finance-coach`, no agent of its own, one script, one hook.** The same shape as `health`, which has worked.

- Live data goes to the existing `research:web-researcher` (sonnet), one run per question that needs it. A finance agent would add a second subagent context per question, too costly on Pro.
- Topics are reference files, not skills: one trigger point, one eval suite.
- **Script `scripts/scenario.js`.** Arithmetic is where a model quietly goes wrong. Net and real return after stopaj and inflation, annualised return from start and end values, fee drag over a horizon, compound growth, loan or card-debt cost, the time to reach a goal: the skill runs the script with the fetched inputs and reports its output, so numbers are computed, not estimated. Unit-tested with known inputs.
- **Hook `SessionStart` → `scripts/takip-reminder.js`.** Lists due or overdue items in the vault's `Takip.md` (deposit maturity, card due date, policy review), only when the session opens in the vault. Silent elsewhere.
- No MCP server in v0.1. TEFAS has no official public API; the researcher reads TEFAS fund pages. `borsa-mcp` (which wraps TEFAS, KAP and EVDS) is a single-person, untested project, rated Assess. Revisit if fund lookups through the researcher prove slow or unreliable.
- `plugin.json` has no `dependencies`; the README table says `finance` needs `research`.

```
plugins/finance/
├── .claude-plugin/plugin.json
├── hooks/hooks.json
├── scripts/
│   ├── scenario.js
│   ├── scenario.test.js
│   └── takip-reminder.js
├── skills/finance-coach/
│   ├── SKILL.md
│   └── references/
│       ├── boundaries.md        # the line, escalation list, scam signs
│       ├── evidence.md          # source ranking, every number dated, LLM failure modes
│       ├── data-sources.md      # which source for which number, how to fetch it
│       ├── vault.md             # vault layout, note templates, investment policy template
│       ├── funds.md             # how to analyse and compare TEFAS funds, screening
│       ├── portfolio-review.md  # periodic review against the policy
│       ├── budgeting.md         # budget, emergency fund, goals
│       ├── debt.md              # cards, KMH, loans, effective cost
│       ├── saving-investing.md  # deposits, gold, FX, stocks, crypto: how to compare
│       └── tax.md               # stopaj and fund tax: method only, rates fetched live
└── evals/finance-coach/
```

Reference files hold method and sources, never current figures, because a stale number in a reference file would be cited with confidence.

## 3. The vault

A new private repo `RaijuMounun/finans-vault` (Obsidian), separate from the health vault.

**Finding it:** the working directory if it has `01_Profil/`, then the `FINANCE_VAULT` environment variable, then ask. No path in the plugin.

```
finans-vault/
├── 01_Profil/
│   ├── Profil.md               # income band, fixed costs, emergency fund, debts
│   └── Yatirim_Politikasi.md   # goals, horizon, target allocation, rules (max fee, no leverage, ...)
├── 02_Portfoy/Portfoy.md       # holdings: fund code or type, amount, platform, buy date, maturity
├── 03_Hedefler/Hedefler.md     # goals with amount and date
├── 04_Arastirmalar/            # saved analyses, YYYY-MM-DD-<topic>.md
└── Takip.md                    # dated to-dos: maturities, due dates, reviews
```

`Yatirim_Politikasi.md` is the professional standard (an investment policy statement): written once with the skill's help, reviewed yearly or when life changes. Every verdict is made against it. If it doesn't exist yet, the skill offers to write it before the first investment comparison.

Account numbers, card numbers, passwords and IDs never go into the vault. The skill refuses to write them.

## 4. Flow

1. **Escalate first.** Check against `boundaries.md`: a likely scam (guaranteed returns, Telegram or WhatsApp signal groups, someone asking for codes or remote access), debt the user can't pay, or a tax or legal question. On a match say so plainly and name who to ask (the bank, an accountant, the police for fraud). Large decisions are not escalated; they get a risk section.
2. **Profile.** Find the vault and read the relevant notes only (profile, policy, portfolio).
3. **Missing context.** If the answer depends on something not in the vault (horizon, how soon the money is needed), ask 1–3 questions with options and a recommendation.
4. **Check the premise.** "Altın hiç kaybettirmez, değil mi?", "kredi çekip fona yatırırsam kârdayım": check the claim before answering inside it.
5. **Pick the job.**
   - **Compare the user's options** (`funds.md`, `saving-investing.md`).
   - **Screen by the user's criteria** (`funds.md`).
   - **Review the portfolio** against the policy: allocation drift, fees, overlap, upcoming maturities, rebalancing within the policy's own rules (`portfolio-review.md`).
   - **Explain or plan** (budget, emergency fund, debt, a concept).
6. **Settled or live.** A concept is answered directly with no figure from memory. Any current rate, price, fund figure, inflation figure or tax rate goes to one `research:web-researcher` with the brief in section 6. Every number in the answer carries its source and date.
7. **Compute.** Run `scenario.js` with the fetched inputs and the user's numbers. Show the inputs.
8. **Answer in Turkish** with the template in section 5.
9. **Save.** After an analysis ask "Vault'a kaydedeyim mi?". When the user reports a purchase or a maturity date, offer to update `Portfoy.md` and `Takip.md`.

## 5. Answer template

```markdown
**Kısa cevap:** 1–2 cümle, hüküm dahil.

**Karşılaştırma:** Tablo (ücret, net/reel getiri, oynaklık, içerik, likidite, vergi). Hesap girdileri altta.

**Değerlendirme:** Kriterlerine ve politikana göre hangisi önde, neden. Hangi koşulda hüküm değişir.

**Gözden kaçabilecekler:** Ücret, çakışma, valör, vade, stopaj farkı.

**Riskler:** Ne ters gidebilir, ne kadar.

**Veriler:** Her rakam için kaynak ve tarih.
```

For an explain-or-plan question the sections shrink to what applies.

## 6. Researcher brief

```xml
<objective>
Fetch the current figures a personal finance question needs, with source and date for each,
so I can compute and compare the user's options.
</objective>

<context>
Question: <question, in English>. Figures needed: <e.g. for funds X, Y, Z: type, management
fee and total expense ratio, fund size, 1/3/5-year returns, current asset allocation; latest CPI
y/y; current individual stopaj on this fund type>. Or screening criteria: <criteria>.
Preferred sources: <rows from data-sources.md>. Today's date: <date>.
</context>

<constraints>
Read-only. Use the official source where one exists (TEFAS, KAP, TCMB, TÜİK, Resmi Gazete,
GİB); news and aggregators are leads only, or the source for market prices with no official
feed. Open every source you cite; never give a figure from memory. Give no buy or sell
recommendation; rank only by the criteria given. If you need a fact only the user can give,
stop and return status: needs_input with 1–4 questions, options and your recommendation first.
</constraints>

<done_when>
Each requested figure has a value, the date it applies to, and an opened source, or is marked
not found with the reason.
</done_when>

<output_format>
A table: item, figure, value, as-of date, source URL. Then conflicts between sources and
anything not verified. Under 500 words, in English.
</output_format>
```

No name or account data goes into the brief. On `needs_input`, the skill asks the user and continues the same agent with `SendMessage`.

## 7. Triggers

"bütçe", "birikim", "acil durum fonu", "fon", "TEFAS", "hangi fon", "fonları karşılaştır", "portföyümü değerlendir", "mevduat mı fon mu", "faiz", "enflasyon", "reel getiri", "stopaj", "altın", "dolar", "kredi kartı borcu", "kredi çekmeli miyim", "maaşımı nasıl yönetirim", "param nerede dursun", "savings", "compare these funds", "budget".

Boundaries with neighbours:
- Is a viral money claim true ("devlet herkese 10.000 TL verecekmiş") → `research:fact-check`.
- Which phone or laptop to buy → `research:purchase-research`.
- Code about finance (a budget app) → neither.

## 8. Eval plan

Made-up profiles and made-up fund figures in the prompt (eval runs have no vault). Under `plugins/finance/evals/finance-coach/`. Eval runs can't grant Bash on native Windows, so `scenario.js` is covered by its unit test, not by a case.

| Case | Kind | Grader |
| :- | :- | :- |
| `tr-deposit-vs-fund` | trigger | `tool_used` Skill finance-coach |
| `tr-emergency-fund` | trigger | same |
| `tr-card-debt` | trigger | same |
| `tr-compare-funds-trigger` ("bu üç fonu karşılaştır") | trigger | same |
| `en-compare-funds` | trigger | same |
| `tr-viral-money-claim` | should not trigger | `tool_used` min 0 max 0 |
| `tr-budget-app-flutter` | should not trigger | same |
| `tr-live-rate-researches` | process | `llm` on trace: researcher dispatched, or WebFetch when it is missing; no figure without an opened source |
| `tr-no-pick-from-nothing` ("hangi fonu alayım, söyle işte") | quality | `llm`: PASS only if it names no specific fund and asks for criteria or offers screening or the policy |
| `tr-clear-verdict-on-options` (three made-up funds, figures given) | quality | `llm`: PASS only if it gives a comparison, a clear verdict for the stated criteria and what would change it |
| `tr-flags-missed-issue` (chosen fund has a high fee and overlaps a holding) | quality | `llm`: PASS only if it flags both |
| `tr-scam-escalation` | process | `regex` dolandırıcılık; `tool_used` Agent min 0 max 0 |
| `tr-premise-gold-never-loses` | quality | `llm`: PASS only if it corrects the premise |
| `tr-every-number-dated` | output | `regex` "Veriler" section |

## 9. Open questions

1. **EVDS key.** v0.1 works without it. Add `userConfig` with `sensitive: true` later if time series become useful.
2. **Stopaj.** Sources conflict. Every scenario fetches it fresh from Resmi Gazete or GİB.
3. **Model.** The session model for the main thread, sonnet for the researcher. Same as health.
