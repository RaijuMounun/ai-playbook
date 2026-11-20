# Data sources

Which source for which figure. Checked 2026-11-20; addresses can move, so if a page fails, search the institution's own site. Put the matching rows into the researcher brief.

| Figure | Source | Access | Updates | Notes |
| :- | :- | :- | :- | :- |
| Policy rate (1-week repo) | TCMB, "Merkez Bankası Faiz Oranları" → "1 Hafta Repo", and the PPK decision summary | tcmb.gov.tr page | each PPK meeting | Read the date on the page. |
| Official FX (indicative) | TCMB `https://www.tcmb.gov.tr/kurlar/today.xml` | XML, no key | each business day | Indicative, not a bank's buy/sell price. |
| Time series (rates, CPI, FX history) | TCMB EVDS | API with a free key (`key` parameter) | per series | EVDS 3 has been in beta since 2026-01-26; EVDS 2 still works. v0.1 doesn't use it. |
| CPI (TÜFE) | TÜİK monthly bulletin | tuik.gov.tr | the 3rd of each month, 10:00 | Give y/y and m/m with the month. ENAG publishes a higher alternative figure; mention it only if the user asks. |
| Average deposit and loan rates | TCMB banking statistics (weekly deposit and loan rate averages) | tcmb.gov.tr page | weekly | Averages, not one bank's offer. |
| Credit card maximum rates | TCMB "Kredi Kartı İşlemlerinde Uygulanacak Azami Faiz Oranları" | tcmb.gov.tr page | monthly | Contractual and late-payment ceilings. |
| One bank's deposit offer | That bank's own rate page | bank site | live | Note the amount band and term the rate applies to. |
| Fund data (price, returns, fee, size, allocation) | TEFAS fund page (`tefas.gov.tr`, fund analysis by code) | page; no official public API | each business day | Returns on TEFAS are after fees. Fee and strategy in the izahname and the yatırımcı bilgi formu on KAP. |
| Fund holdings in detail | Monthly portfolio distribution report on KAP | kap.org.tr | monthly | For overlap checks. |
| Stopaj rates | Resmi Gazete (Cumhurbaşkanı Kararı), GİB | page | on each decision | Sources conflicted in 2025–2026. Always fetch; never reuse an old rate. |
| Gold (gram, çeyrek), market FX | Kapalıçarşı and established price sites; the bank's own gold account rate | page | live | No official gram or çeyrek feed. Note the dealer spread (buy vs sell). |
| SPK-unauthorised sites | SPK's list of sites blocked for unauthorised activity | spk.gov.tr | ongoing | For scam checks. |

## MCP servers (not used in v0.1)

`borsa-mcp` (wraps KAP, TEFAS, EVDS, doviz.com, Yahoo), `fonparam-mcp`, `kap-mcp`: single-person projects, untested here. Rated Assess. Revisit if fund lookups through the researcher prove slow or unreliable.
