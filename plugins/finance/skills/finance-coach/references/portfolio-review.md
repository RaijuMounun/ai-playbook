# Portfolio review

"Portföyümü değerlendir", or once a year as the policy says, or when a maturity or a large sum comes up.

1. Read `Portfoy.md` (holdings and the lot table) and `Yatirim_Politikasi.md`. Ask for current amounts if the note is older than a month.
2. Run `metrics.js` on all ETF holdings in one call (prices, USD/TRY, risk figures, correlations). Use the researcher only for what the script can't give (expense ratios, a fund's holdings, Turkish inflation).
3. Show the current allocation in USD and TL next to the policy's target and bands.
4. Check:
   - **Drift:** a class outside its band.
   - **Costs:** any expense ratio above the policy's limit or much above funds doing the same job; the FX spread paid on conversions.
   - **Overlap:** weekly correlation above about 0.9 between holdings; one fund above the policy's single-fund limit.
   - **Drawdown against the policy:** the portfolio's worst historical fall (weight the holdings' drawdowns, or run `metrics.js` on the largest holding) against "the worst year I can bear".
   - **US-situs total** against $60,000 (`us-etfs.md`), and the domicile rule in the policy.
   - **Broker:** where the assets sit (Midas → Alpaca → DTCC); anything new from SPK about the broker, through the researcher when the review is yearly.
   - **Emergency fund:** still covered in a liquid place, in the currency it will be spent in.
   - **Tax:** sales this year and their TL gain (`tax.js`), so the March return is not a surprise.
   - **Dates:** maturities, due dates and reviews in the next 30 days.
5. Verdict: what is in line with the policy, and what is not. Rebalancing follows the policy's own rule (yearly or on a band breach); show which class is over and which is under, in USD and TL. New money first goes to the underweight class: it avoids a sale, and every sale is a taxable TL gain.
6. Offer to update `Portfoy.md` and add the next review date to `Takip.md`.
