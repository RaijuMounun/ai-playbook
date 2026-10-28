---
name: purchase-research
description: Researches a product purchase decision for any product category: need and budget, measured reviews, long-term owner complaints, known failure points, alternatives in the same price band, Turkey price (Akakçe/Cimri) and Turkey warranty. Use when the user asks whether to buy something or which product to choose, in English or Turkish ("almalı mıyım", "hangisini alayım", "X mi Y mi", "alternatif öner", "tavsiye eder misin", "fiyat/performans").
---

# Purchase Research

Product reviews are full of affiliate content, and the real problems of a product show up months after purchase. This playbook separates what was measured from what owners report after long use, and then checks the local price and warranty, because a good product at a bad Turkish price or without a Turkish warranty is a different decision.

The output is a decision matrix plus a "who should buy / who should not" verdict, so the user can decide without reading the research.

## Process

1. **Ask first.** Before any research, ask the user (in Turkish) for what is not already clear: what the product is for and how it will be used, the budget (a hard cap or a range), must-have features, products already considered, and anything that rules a product out (size, brand, platform). Ask only for the missing items, in one message. If the request already answers them, skip the questions.
2. **Dispatch one researcher (default).** One `research:web-researcher` covers every check below. Deep mode (2–3 researchers in parallel: measured reviews, owner complaints, Turkey price and warranty) runs only if the user asks for it. Tell the user it uses several times the quota before you start.
3. **Synthesize.** Merge the report into the output template. Judge candidates by measured data and repeated owner reports, not by how often a product is recommended.
4. **Report in Turkish.** Give the template below. Save a file only if the user asks.

## What the researcher must check

- **Measured reviews:** reviews that run tests or measurements with a visible method (lab-style outlets, teardown channels, benchmark data). Note the test method and the date. A review without measurements counts as opinion.
- **Long-term owner complaints:** Reddit, forums, and retailer reviews from people who have owned the product for months. Search for the product name plus words like "problem", "broke", "after 6 months", "issue", and the Turkish "sorun", "bozuldu", "arıza". One complaint is an anecdote; the same complaint from several independent owners is a failure point.
- **Known failure points:** recurring defects, recalls, firmware or software problems, and whether the maker acknowledged them. Tie each to its source.
- **Same-price alternatives:** 2–3 products within about ±15% of the price that fit the stated need, including at least one the user did not name.
- **Turkey price:** current price on Akakçe and Cimri (price history if shown, to spot fake discounts), and the lowest reputable seller. Prices change fast, so record the date.
- **Turkey warranty:** whether the product is sold by an official distributor with a Turkish warranty (the Turkish "distribütör garantisi") or is a grey import, the warranty period, and the service network. If it can't be confirmed, say so.

Sources that are SEO listicles or affiliate "best of" pages are leads only.

## Output template

```markdown
## Karar özeti
Bir-iki cümle: ne almalı, ne zaman beklemeli, güven düzeyi.

## Karar matrisi
| Ürün | Fiyat (TR, tarih) | Ölçüm sonuçları | Uzun dönem şikayetleri | Garanti (TR) | Genel |
| :- | :- | :- | :- | :- | :- |

## Bilinen arıza noktaları
- Ürün: sorun, kaç bağımsız kaynakta görüldü, kaynak linki

## Kim almalı / kim almamalı
- **Almalı:** hangi ihtiyaç ve bütçe profili
- **Almamalı:** hangi profil, ve onun yerine ne

## Doğrulanamayanlar
Neye bakıldı ama kesinleşmedi.

## Kaynaklar
```

## Brief template for the researcher

```xml
<objective>
Research whether the user should buy <product or category> and which option fits best, so I can
produce a decision matrix and a "who should buy / who should not" verdict.
</objective>

<context>
Need and use: <what for>. Budget: <range or cap, in TRY>. Must-haves: <list>. Ruled out: <list>.
Already considered: <products>. Today's date: <date>. The user lives in Turkey, so Turkey price
and warranty matter. Check, as separate source groups: (1) measurement-based reviews with a
visible method; (2) long-term owner complaints on Reddit, forums, and retailer reviews;
(3) known failure points and recalls; (4) 2–3 alternatives within about ±15% of the price,
including one the user did not name; (5) Turkey price on Akakçe and Cimri, with price history if
available; (6) Turkey warranty: official distributor or grey import, period, service network.
</context>

<constraints>
Read-only: do not edit files. Do not buy or sign up for anything. SEO listicles and affiliate
roundups are leads only, not evidence.
</constraints>

<done_when>
Each candidate has measured-review evidence, at least one long-term owner source (or a note that
none exist), a dated Turkey price, and a warranty status. Failure points cite their sources.
</done_when>

<output_format>
Your standard report sections, in English, with Findings grouped per product. At most 700 words
outside the Sources list. Include prices with the date and store, and mark anything unconfirmed
under Not verified.
</output_format>
```
