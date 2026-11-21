# US-listed and UCITS ETFs for a Turkish resident

The user buys and holds US-listed ETFs through Midas. Research: `research/radar/2026-11-21-us-etfs-for-turkish-resident.md` in the ai-playbook repo. Facts that change (fees, rates, thresholds) are fetched; the rules below change rarely.

## Comparing ETFs

Fetch for each (issuer page through the researcher; prices through `fetch.js`):

- **Index and holdings.** What it tracks; top holdings and sector weights. Two ETFs on the same or overlapping indexes are one exposure, not two.
- **Expense ratio** (yearly). Between ETFs on the same index, the lower one usually wins over a long horizon; show the drag with `scenario.js feedrag`.
- **Domicile.** US-listed (US-situs, see estate tax) or Ireland-domiciled UCITS (not US-situs).
- **Distributing or accumulating.** Distributing pays dividends (withheld in the US, declared in Turkey above the threshold); accumulating reinvests inside the fund.
- **Size and spread.** Very small or thinly traded ETFs can close or cost more to trade.
- **Risk and return:** `metrics.js` (see `funds.md` for how to read it).

The same index is often available in both forms, for example Nasdaq-100: QQQ (US) and CNDX or EQAC (UCITS, accumulating); S&P 500: VOO or SPY (US) and CSPX or VUAA (UCITS, accumulating). These are examples of the two forms, not recommendations; check each one's current figures before comparing.

## Two currencies

The user earns, spends and pays tax in TL. Show every result in USD and in TL:

- TL return = (1 + USD return) × (1 + USD/TRY change) − 1. `metrics.js` does this with USD/TRY history.
- Real return in USD against US CPI; real return in TL against Turkish inflation (fetched, passed as `--tr-inflation`).
- A goal in TL (a house in Turkey) and a goal in USD (studying abroad) are judged differently; the policy says which.

## US estate tax

- US-domiciled ETFs are US-situs assets. When a non-US person dies, the estate owes US estate tax on US-situs assets above **$60,000** (Form 706-NA; the threshold is not indexed). No US-Turkey estate tax treaty was found. Rates are steep (fetch the current table when it matters).
- Flag it when the user's US-situs holdings pass about $50,000, or when a plan would take them past $60,000.
- The usual alternative for non-US investors: Ireland-domiciled UCITS ETFs, which are not US-situs. Whether Midas offers them is open; the user can ask Midas support. If it doesn't, the options are a ceiling on US-situs holdings or a second broker that does; name the options, not a broker.

## Dividends

- US withholding on the user's QQQ dividend in Midas was 20% (0.16 of 0.81 USD, the user's statement of 2026-11-21), which matches the US-Turkey treaty rate applied to them.
- In Turkey: foreign dividends are declared above the yearly threshold, converted at the TCMB buying rate on the day received; the US tax withheld is credited, capped at the Turkish tax on it. Details in `tax.md`.
- UCITS ETFs pay US withholding at fund level (typically 15% under the Ireland-US treaty; not verified here) and accumulating classes pay nothing out, so nothing is declared until sale.

## Broker risk and costs

- Midas Menkul Değerler A.Ş. is SPK-licensed; US assets are held through Alpaca Securities LLC with custody at DTCC; SIPC protection applies (Midas claims excess coverage; check its current disclosure). SPK fined Midas 24.9M TL in August 2026 (remote ID without video call, misleading advertising, internal controls).
- Costs: a flat commission per US trade (fetch the fee page), and the **FX spread**: the gap between the app's USD buy and sell prices at the same moment. Spread % ≈ (buy − sell) / ((buy + sell) / 2). It is paid on every TL → USD → TL round trip, so frequent conversions cost more than the commission.
- Moving assets out (ACATS) has a fee; worth knowing before a broker change.

## TEFAS funds and the 2026 crisis

The user no longer uses TEFAS funds. When asked about them: SPK rules of 28 Aug 2026 on thinly traded stocks led to redemptions and payment defaults; on 17 Sep 2026 SPK halted the funds of 7 portfolio managers and ordered about 130 funds liquidated. Manager risk, liquidity risk and trading halts are part of any TEFAS fund comparison now; check whether a fund's manager or holdings were involved.
