# US-listed ETFs for a Turkish resident via Midas: research for finance v0.2

Date: 2026-11-21. One sonnet `research:web-researcher` run, plus endpoint tests from the user's PC. V = source opened; NV = not opened or snippet only.

## Context: the September 2026 Turkish fund crisis (V)

SPK rules of 28 Aug 2026 limited fund holdings of thinly traded stocks; forced sales and redemptions followed; Pusula and Tera disclosed redemption payment defaults on 15 Sep; on 17 Sep SPK halted TEFAS trading in the funds of 7 portfolio managers and ordered about 130 funds liquidated, with criminal complaints over 3 stocks. Amounts and investor counts differ by outlet. Euronews TR, 2026-09-17. The user no longer invests through TEFAS or Borsa Istanbul.

## Turkish tax on US-listed ETFs

- Gains on foreign-listed securities are declared on the annual return as değer artışı; no exemption threshold; progressive tariff. Cost and sale price are converted to TL at the rates of the purchase and sale dates, so exchange-rate gains are taxed (a USD loss can be a TL gain). Cost is indexed by Yİ-ÜFE when it rose ≥10% between purchase and sale (purchase month in, sale month out). Commissions deductible. Same-year losses on foreign securities offset gains only within that class. (V, Yapı Kredi 2026 note; GİB guide NV.)
- Foreign dividends: declared above the yearly threshold (22,000 TL for 2026), converted at the TCMB buying rate on the day received; foreign tax withheld is credited under GVK art. 123, capped, with proof. (V, same note.)
- The 2026 foreign-income exemption (Tebliğ 333) needs no Turkish residence in the previous 3 years; not applicable. (NV full text.)
- **US dividend withholding under the US-Turkey treaty: unresolved** (secondary summaries say 20% or 15%; IRS text not opened). The user's own Midas dividend lines show the rate actually withheld.

## US estate tax (non-resident alien)

- The estate must file Form 706-NA when US-situs assets exceed **$60,000** (not indexed); unified credit $13,000. (V, IRS pages.) Stock of US corporations is US-situs; the RIC carve-out applied only to deaths in 2005-2011, so US-domiciled ETFs count today (inference from the IRS instructions). Rates (18-40%) and the absence of a US-Turkey estate tax treaty: NV.
- The usual alternative for non-US investors is Ireland-domiciled UCITS ETFs (not US-situs; dividend withholding at fund level; accumulating classes). No practitioner source opened (NV). Whether Midas offers them: NV, its pages mention only Frankfurt stocks.

## Midas

- Midas Menkul Değerler A.Ş., SPK-licensed; US assets through Alpaca Securities LLC, clearing and custody at DTCC (V, Midas legal page). It claims SIPA protection "up to $150M" (likely excess coverage over the standard SIPC $500k; unclear) and YTM cover (V claim, not independently checked).
- SPK fined Midas 24.9M TL on 28 Aug 2026: remote ID without video call, misleading advertising, ineffective internal controls (V, Dünya). A June 2026 penalty (NV).
- Fees: $1.5 flat per US trade; ACATS transfer out $25. **FX conversion spread not disclosed** on the fee page (V).

## Data access (tested from the user's PC, 2026-11-21)

| Source | Status | Notes |
| :- | :- | :- |
| Yahoo chart API `query1.finance.yahoo.com/v8/finance/chart/<sym>` | Works, keyless | 10 years daily with adjusted close and dividends; `TRY=X` for USD/TRY; LSE UCITS tickers (e.g. `.L`) too. Unofficial: can break or throttle. |
| FRED `fredgraph.csv?id=CPIAUCSL` (US CPI), `DGS3MO` (3-month T-bill) | Works, keyless; intermittent from the researcher's host | Terms: personal, non-commercial; no caching or archiving. Fetch each time, don't store. |
| TCMB `kurlar/YYYYMM/DDMMYYYY.xml` | Works | Official rates for tax conversion on purchase and sale dates. |
| Stooq | Blocked (403 / proof-of-work page) | Not usable. |
| Alpha Vantage, Tiingo | Need free keys | Not needed for v0.2. |
| TEFAS API | Connection reset | Dropped from the design. |
