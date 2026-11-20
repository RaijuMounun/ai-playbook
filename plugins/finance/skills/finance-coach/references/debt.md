# Debt

## Credit cards

- **Minimum payment.** Paying only the minimum keeps the card in good standing but the rest of the balance accrues contractual interest, and paying less than the minimum triggers the higher late-payment rate. Fetch the current maximum rates from TCMB (`data-sources.md`) and show the cost with `scenario.js debt` at the user's payment.
- **Taksit (instalments)** at 0% are interest-free; cash advance and instalments with interest are not. Ask which one the user means.
- **Paying one card with another** is a warning sign; see `boundaries.md`.

## KMH (overdraft)

Usually as costly as card debt and charged daily. Pay down together with card debt, highest rate first.

## Payoff order

- **Avalanche:** highest interest rate first. Costs the least.
- **Snowball:** smallest balance first. Costs more, but some people stick with it better.
Show both totals with `scenario.js debt` when the user has several debts, and let them choose.

## Loans

- Compare by the total cost: the yearly cost rate (yıllık maliyet oranı) the bank must show, including fees, insurance and BSMV/KKDF, not only the interest rate.
- **Borrowing to invest:** check the premise. The loan cost is certain; the return is not. Show the break-even return with `scenario.js`, and the loss if the investment falls.
- Early repayment: ask the bank for the early-repayment amount; the rules on discounts and fees depend on the loan type.

## Can't pay

Restructuring (yapılandırma) with the bank before legal follow-up starts. The general picture only; the bank is who to talk to.
