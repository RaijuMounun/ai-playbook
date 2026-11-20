# Saving and investing: how to compare

Funds have their own file (`funds.md`). This file is for comparisons across instruments.

## Deposit vs money-market fund

The most common question. Fetch: the bank's rate for the amount and term (or the TCMB weekly average), the money-market funds' recent returns on TEFAS, the current stopaj on each, and CPI.

- A deposit's rate is fixed for the term; breaking early usually loses the interest. A money-market fund's return floats daily and can be sold any business day (check valör).
- Stopaj differs between deposits and fund types and changes by decision; fetch it.
- Compute both with `scenario.js deposit` and `fund` over the same days, net of stopaj, then real.

## Gold

- In TL, gold has often done well because the lira lost value; in US dollars it has had long real losses (for example the two decades after 1980, and 2011–2015). Both are true; say which currency the user thinks in.
- Physical gold (çeyrek, gram) has a buy/sell spread at the dealer; a bank gold account has its own spread; a gold fund has a management fee. Compare the round-trip cost.
- Gold pays nothing; its return is the price change only.

## FX

Holding FX is a bet on the lira weakening faster than TL rates compensate. Compare the TL return of an FX deposit or eurobond fund with a TL alternative over the same period, real in TL.

## Stocks and index funds

Long horizon only (5+ years is the usual guidance) because of large drawdowns. For a buy-and-hold investor, a low-fee index fund is the usual baseline to beat; an active equity fund has to beat it after fees to earn its place.

## Crypto

Very volatile, no cash flows, and scam-prone. Explain the risks if asked; check the platform's regulatory status (crypto asset service providers are under SPK since 2024; fetch the current list). Any "guaranteed" crypto return goes to `boundaries.md`.

## Rules that always apply

- Compare the same period, the same amount, after fees and stopaj, in real terms.
- Liquidity and risk next to return, always.
- The user's horizon decides the shortlist before return does.
