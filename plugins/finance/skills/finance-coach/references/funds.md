# Funds and ETFs: comparing, screening, risk metrics

The user buys and holds US-listed ETFs through Midas (details in `us-etfs.md`). TEFAS funds are explained when asked (section at the end). This file is how to compare, screen and measure.

## How to compare

1. **Same job first.** Compare funds that do the same job (two Nasdaq-100 ETFs, two S&P 500 ETFs). Across jobs (a T-bill ETF vs an equity ETF), say they are different tools and judge against the user's horizon and policy, not return alone.
2. **Cost.** Expense ratio; for the same index, the lower one usually wins over time (`scenario.js feedrag` over the user's horizon).
3. **Risk and return** with `metrics.js` (below), same period for all, in USD and TL.
4. **Fit with the portfolio.** Overlap and correlation with current holdings; effect on the policy's target allocation; US-situs total against the estate-tax threshold.
5. **Verdict.** Which fits the user's criteria and policy best, why, and the condition that would change it.

## Risk and return metrics (`metrics.js`)

```
node "<plugin root>/scripts/metrics.js" QQQ VOO --years 10 --tr-inflation <fetched yearly %>
```

It fetches prices, USD/TRY, US CPI and the T-bill rate itself. Read each figure for the user in plain Turkish:

| Output | Say it as | Use it for |
| :- | :- | :- |
| `max_drawdown` (USD and TL) with dates and `recovery_days` | "En kötü dönemde %35 düştü (Ara 2021 – Kas 2022), eski zirvesine 405 günde döndü." Put it in money: on the user's amount, what that fall would have been. | Compare with the policy's "worst year I can bear". Above it means the plan breaks the policy. |
| `rolling_1y` / `rolling_3y` worst, median, best, positive share | "Herhangi bir yıl alıp bir yıl tutan biri en kötü %−35, ortada %+25 gördü; yılların %87'si artıda." | Consistency, and what a short horizon risks. Prefer this over one headline return. |
| `yearly_return_pct`, `real_yearly_return_pct` (USD vs US CPI, TL vs Turkish inflation) | Nominal and real, both currencies. | Did it beat inflation where the user lives. |
| `volatility_pct` | How rough the ride is. | Comparing similar funds. |
| `sharpe` (vs the 3-month T-bill), `sortino`, `return_over_max_drawdown` | Return per unit of risk; higher is better among similar funds. | Ranking funds doing the same job. Say the limits (below). |
| `correlations` (weekly is the headline) | "Bu ikisi neredeyse birlikte hareket ediyor (0,93); ikisini tutmak çeşitlendirme sağlamıyor." | Overlap. Above about 0.9 the two are close to one exposure. Use the weekly figure: daily correlation is understated across exchanges that close at different hours. |
| `vs_200_day_average_pct` | Context only: "Şu an uzun vadeli ortalamasının %11 altında." | Never a buy or sell trigger. |

Say the `limits` the output lists: past figures are not a forecast; history under 3 years may miss a full cycle; Sharpe-type ratios assume normal returns; adjusted close assumes dividends reinvested before tax.

If `metrics.js` fails (exit code 2: a source is down or changed), say so and ask the researcher for the headline figures from the issuer's page instead.

## Technical analysis

The user may ask for RSI, MACD, chart patterns or "şimdi alınır mı". Answer in two sentences, then offer the metrics above:

- Classic indicators have mixed evidence that doesn't survive data-snooping and cost tests consistently (Park & Irwin 2007 review); no robust after-cost study exists for Borsa Istanbul. Trend following has better support, mainly for limiting drawdowns (Hurst, Ooi & Pedersen 2017), with long flat stretches.
- For a buy-and-hold investor, timing signals mostly add trades, costs and taxable sales. Regular buying on a schedule, per the policy, is the usual alternative.

Never give a timing call ("şimdi al", "bekle"). The 200-day figure is context.

## Short horizons

Money needed within about a year doesn't go into equity ETFs: they can fall 20–35% within months (see the rolling worst). Point to low-risk, liquid options: cash, short-term Treasury bill or money-market type funds, or a TL deposit, compared with live rates.

## Screening

When the user gives criteria ("gideri %0,2'nin altında, en az 10 yıllık S&P 500 ETF'leri"), the researcher finds the ETFs that meet them; `metrics.js` measures them. Rank by the user's criteria in their order; show the next two below the line. If nothing qualifies, say which criterion to relax.

## Things to flag

- A cost much higher than funds doing the same job.
- Overlap or correlation above about 0.9 with a holding.
- US-situs holdings near or above $60,000 (`us-etfs.md`).
- A short track record, or returns driven by one exceptional year.
- A very small or thinly traded fund.
- Money needed soon sitting in equities.

## TEFAS funds (when asked)

Fetch from TEFAS (when reachable) or KAP through the researcher: type and whether the holdings match the name, management fee, size, returns, valör, tax class. Since the September 2026 crisis (`us-etfs.md`, last section), also check the manager's record and whether the fund holds thinly traded stocks. TEFAS's API was unreachable from the user's PC on 2026-11-21.
