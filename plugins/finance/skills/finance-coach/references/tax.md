# Tax: method only

Rates change by presidential decision and sources conflicted in 2025–2026. This file holds no rates. Fetch the current ones from Resmi Gazete or GİB for every scenario, and show them with their date in **Veriler**.

## How it works (as of 2026)

- **Deposits:** stopaj is withheld by the bank on the interest; the rate depends on the term and the currency. Usually no return to file for an individual.
- **Funds:** stopaj is withheld on the gain when units are sold, and the rate depends on the fund type and how long the units were held. Some fund types (for example equity-intensive funds, ≥80% BIST stocks) have had a 0% rate. Check the fund's tax class and the current decision.
- **Gold and FX held physically or in a bank account:** rules differ by instrument; fetch.
- **Losses:** stopaj applies only to gains; a fund sold at a loss pays none.

## In scenarios

- Pass the fetched rate to `scenario.js` (`--stopaj`).
- If the rate could not be confirmed, run the scenario with the rates the sources gave, show the range, and say it is unconfirmed.
- Tax filing, declarations, or anything with business income: a mali müşavir.
