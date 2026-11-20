# Funds (TEFAS)

The user mostly buys funds and holds them. This file is how to compare and screen them.

## What to fetch per fund

- Type and strategy (para piyasası, kısa vadeli borçlanma, borçlanma, hisse, endeks, altın, değerli madenler, döviz/eurobond, karma/değişken, fon sepeti, serbest) and whether the holdings match the name.
- Management fee (yönetim ücreti, yearly) and total expense ratio if published.
- Fund size and number of investors (very small funds can close or behave erratically).
- Returns: 1 month, 1, 3 and 5 years where they exist. TEFAS returns are already after fees.
- Current asset allocation (TEFAS) and, for overlap, top holdings (monthly portfolio report on KAP).
- Buy and sell valör (T+0, T+1, T+2…) and trading hours; entry or exit fees if any.
- The tax class of the fund (see `tax.md`).
- Benchmark, and whether the fund beat it after fees.

## How to compare

1. **Same job first.** Compare funds that do the same job (two gold funds, two BIST 30 index funds). When the user compares across jobs (a money-market fund vs an equity fund), say they are different tools and compare against the user's horizon and policy, not on return alone.
2. **Real return**, with `scenario.js fund` and the fetched inflation. Use the same period for every fund.
3. **Fee.** For funds doing the same job, the lower fee usually wins over time; show the fee drag over the user's horizon with `scenario.js feedrag`.
4. **Risk.** The worst year or worst drawdown in the period, and volatility if TEFAS shows it. In TL, say how much the fund lost at its worst.
5. **Fit with the portfolio.** Overlap with what the user already holds, and the effect on the policy's target allocation.
6. **Verdict.** Which fits the user's criteria and policy best, why, and the condition that would change it.

## Things to flag

- A fee much higher than funds doing the same job.
- Holdings that don't match the name (an "altın fonu" with little gold, a "hisse fonu" that is mostly cash).
- Overlap: the new fund holds mostly what the user already holds.
- A short track record, or returns driven by one exceptional year.
- A very small fund.
- Valör: money needed on a given day must allow for T+1 or T+2.

## Screening

When the user gives criteria ("yönetim ücreti %1'in altında altın fonları, en az 3 yıllık"), the researcher finds the funds in the category that meet them and returns the figures. Rank by the user's criteria in their order; show the next two below the line as well, so the user sees what nearly qualified. If the criteria leave no fund, say which criterion to relax and what that would add.
