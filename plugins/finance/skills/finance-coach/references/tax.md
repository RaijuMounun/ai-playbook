# Tax: method only

Rates change by presidential decision and sources conflicted in 2025–2026. This file holds no rates. Fetch the current ones from Resmi Gazete or GİB for every scenario, and show them with their date in **Veriler**.

## How it works (as of 2026)

- **Deposits:** stopaj is withheld by the bank on the interest; the rate depends on the term and the currency. Usually no return to file for an individual.
- **Funds:** stopaj is withheld on the gain when units are sold, and the rate depends on the fund type and how long the units were held. Some fund types (for example equity-intensive funds, ≥80% BIST stocks) have had a 0% rate. Check the fund's tax class and the current decision.
- **Gold and FX held physically or in a bank account:** rules differ by instrument; fetch.
- **Losses:** stopaj applies only to gains; a fund sold at a loss pays none.

## Foreign-listed securities and ETFs (the user's main case)

No stopaj in Turkey; the user declares on the annual return (March, for the previous year). Source: a 2026 bank tax note (Yapı Kredi) and GVK mükerrer 81; GİB's own guide not yet opened, so fetch it when a figure matters.

- **Gain (değer artışı).** Cost and sale price are converted to TL at the TCMB rate of the purchase date and of the sale date. So the TL gain includes the lira's fall: a USD loss can be a taxable TL gain. `tax.js` uses the TCMB USD buying rate (`forex_buying`); say so in the answer.
- **Indexation.** If Yİ-ÜFE rose 10% or more from the purchase month to the month before the sale, the TL cost is indexed by that rise. Under Turkish inflation this usually applies to holdings over about a year. Fetch the two index values (TÜİK) and pass them to `tax.js`.
- **No exemption threshold** for these gains; progressive tariff; commissions deductible.
- **Losses** on foreign securities offset gains on them in the same year only.
- **Dividends.** Declared when the year's foreign dividends exceed the threshold (fetch it; 22,000 TL for 2026), at the TCMB buying rate on the day received. The US tax withheld is credited, capped at the Turkish tax on it, with proof (the broker's statement).
- **Accumulating UCITS ETFs** pay no dividends out, so there is nothing to declare until the sale.

`tax.js` gives the taxable gain in TL per sale and per year from the lots in `Portfoy.md`. It does not give the final tax, which depends on the user's other income. When the user reports a sale, add a March item to `Takip.md`: "Yabancı menkul satışı: beyanname".

## In scenarios

- Pass the fetched rate to `scenario.js` (`--stopaj`).
- If the rate could not be confirmed, run the scenario with the rates the sources gave, show the range, and say it is unconfirmed.
- Tax filing, declarations, or anything with business income: a mali müşavir.
