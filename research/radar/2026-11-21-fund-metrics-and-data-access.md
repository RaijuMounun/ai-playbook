# Fund metrics, technical analysis and data access: research for finance v0.2

Date: 2026-11-21. One sonnet `research:web-researcher` run, plus local endpoint tests from the user's PC. Confidence: medium on part A (several papers known from abstracts or summaries), high on part B (tested first-hand).

## A. Technical analysis vs descriptive metrics

- **Classic TA is inconclusive, not proven.** Park & Irwin (J. Economic Surveys, 2007): of 95 modern studies, 56 positive, 20 negative, 19 mixed, but data snooping, ex post rule selection and weak cost and risk handling keep the result inconclusive. https://ideas.repec.org/a/bla/jecsur/v21y2007i4p786-826.html
- **Snooping tests split the field.** Ready (2002) attributes the moving-average results to data snooping; Metghalchi et al. (Applied Economics, 2012) find MA rules still had power in 16 European markets after White's Reality Check (snippet only).
- **Borsa Istanbul.** Ülkü (ISE Review, 2009) found simple rules worked better on ISE-100 than on the DJIA. No robust, snooping-corrected, after-cost study of Borsa Istanbul was found.
- **Trend following** has the best support, mainly as drawdown control: Moskowitz, Ooi & Pedersen (2012); Hurst, Ooi & Pedersen (2017, positive in every decade since 1880, with drawdowns up to 25%). Skeptics: Kim, Tse & Wald (2016) attribute much of the effect to volatility scaling; Zakamulin calls short-run outperformance "shaky".
- **For this user:** TEFAS funds price once a day and settle T+1/T+2, and the user buys and holds. Timing signals don't fit; descriptive risk and performance metrics do.

## A2. Standard fund metrics

- Max drawdown and drawdown duration, Sharpe, Sortino: CFA Institute Level III performance evaluation (2026 refresher reading); Morningstar (2018) on a tail-risk Sharpe (return over max drawdown), which can rank funds differently from standard Sharpe.
- Caveats (CFA Institute blog 2013): Sharpe-type ratios assume normal, independent returns; drawdown depends on sampling frequency (monthly understates it against daily).
- Not sourced (reasoning only): short track records, survivorship, and the choice of a TL risk-free rate under high inflation. State them as limits in the output.

## B. Data access (tested 2026-11-21)

| Source | Status | Notes |
| :- | :- | :- |
| TCMB `kurlar/today.xml` | **Works** (200, from the user's PC) | `Tarih_Date` root with `Currency` children: `ForexBuying`, `ForexSelling`, `BanknoteBuying`, `BanknoteSelling`. Business days only; dated archive URLs for history. |
| TCMB "1 Hafta Repo" HTML page | Works (researcher) | Date/rate table; confirm the column before parsing. No keyless machine-readable endpoint for the policy rate. |
| EVDS 3 | Needs a free key in a `key` header (403 without it) | Series path not verified. |
| TEFAS old endpoints (`BindHistoryInfo`, `BindHistoryAllocation`) | **Retired** (tefas-crawler v0.6.0, 2026-04-28) | Don't build on them. |
| TEFAS new `POST /api/funds/fonFiyatBilgiGetir` | **No connection** | Body `{"fonKodu","dil","periyod"}` with periyod in {1,3,6,12,36,60} months (from tefas-crawler source). From the user's PC with Node and curl, and from the researcher's host, even the home page resets the connection. Users reported cloud-IP blocking and robot checks (issue, 2026-04-17). Not circumvented: getting around bot detection is out of bounds and would be brittle. |
| TEFAS website export | Assumed to work in a normal browser | The Fon Analiz / historical data pages offer an Excel export. To be confirmed by the user. |

Wrappers: `burakyilmaz321/tefas-crawler` (Python, v0.6.0 2026-05-02, last push 2026-07-06); others unvetted.
