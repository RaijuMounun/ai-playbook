---
name: fact-check
description: Fact-checks a claim with the SIFT method (Stop, Investigate the source, Find better coverage, Trace to the original) and returns a sourced verdict: true, misleading, false, or unverifiable. Use whenever the user asks whether a claim is true, including well-known myths, famous quotes, and popular science "facts" that seem answerable from memory, because the user wants the claim traced to its original source rather than a recalled answer. Also use for rumors, news items, viral posts, statistics, and health or science claims, in English or Turkish ("... doğru mu?", "gerçek mi", "yalan mı", "gerçekten ... dedi mi?", "teyit et", "kaynağı ne", "bu haber doğru mu", "yanıltıcı mı").
---

# Fact-Check

Claims spread detached from their origin: a statistic loses its context, a quote loses its speaker, a study gets summarized beyond what it found. SIFT is a fast, proven way to check a claim. The goal is a verdict the user can trust, with the trail that supports it.

## SIFT, as applied here

- **Stop.** Don't judge from the first impression. Before researching, note what the user already believes about the claim, and what would change the answer.
- **Investigate the source.** Who made the claim, what is their expertise and interest, and what is their track record? Look at what others say about the source, not what the source says about itself.
- **Find better coverage.** Look for what reliable, independent sources say about the same claim: reference sources, primary experts, and fact-checking articles. A fact-checker's verdict is a lead, not evidence. Use its article to find the primary sources it cites, check those yourself, and base the verdict on them. Every fact-checker has its own framing and blind spots, and checking the primary evidence is what protects the verdict from them.
- **Trace to the original.** Follow the claim back to where it first appeared: the study, the document, the full video, the original statement, the dataset. Check that the claim matches what the original says, including date, context, and numbers.

## Process

1. **Break the claim into parts.** Split it into separate checkable statements (who, what, when, how many, what caused what). One viral post often mixes true and false parts, and each part gets its own result. If the claim is vague, ask one clarifying question in Turkish. If it is an opinion or prediction rather than a checkable fact, say so.
2. **Dispatch one researcher (default).** One `research:web-researcher` runs SIFT on all the parts. Deep mode (2–3 researchers in parallel, split by claim part) runs only if the user asks. Tell the user it uses several times the quota before you start.
3. **Decide the verdict** for each part and for the claim as a whole, using the scale below.
4. **Report in Turkish** with the template below.

## Verdict scale

- **Doğru:** the original evidence supports the claim as stated, and reliable independent sources agree.
- **Yanıltıcı:** something in it is true, but the context, framing, timing, or numbers lead to a wrong conclusion (for example a real photo from another event, a correlation presented as a cause, an old statistic presented as current).
- **Yanlış:** reliable evidence contradicts the claim.
- **Doğrulanamadı:** after a real search, no original or reliable evidence settles it either way. This verdict says nothing about truth. Say what was looked for and what would settle it.

Do not give a verdict that is stronger than the evidence. When the original source can't be found, the answer is "Doğrulanamadı" or a note on what is established, not a guess.

## What the researcher must check

For every part of the claim: the earliest appearance found and its date; the original source and whether it says what the claim says; the source's credibility; what independent reliable sources say, and which primary sources any fact-checking articles cite; whether any image, video, or quote is used out of context (reverse-image search, full video, full quote). For health and science claims, prefer the primary study or a systematic review over news coverage, and note the sample size, whether it was in humans, and whether it has been replicated.

## Output template

```markdown
## Hüküm
**<Doğru | Yanıltıcı | Yanlış | Doğrulanamadı>** — iki cümlelik gerekçe. Güven düzeyi: yüksek / orta / düşük.

## İddianın parçaları
| Parça | Hüküm | Kısa gerekçe |
| :- | :- | :- |

## İzlenen yol
- **İlk çıktığı yer:** nerede, ne zaman
- **Orijinal kaynak:** ne diyor, iddiayla uyuşuyor mu
- **Kaynağın güvenilirliği:**
- **Bağımsız kaynaklar / teyit kuruluşları:**

## Bağlam
İddia neden yayılmış olabilir, doğru olan kısım ne.

## Doğrulanamayanlar

## Kaynaklar
```

## Brief template for the researcher

```xml
<objective>
Fact-check this claim with the SIFT method and trace each part back to where it first appeared,
so I can give the user a verdict: true, misleading, false, or unverifiable.
</objective>

<context>
Claim, as the user gave it: <claim, with link or screenshot description if any>.
Parts to check separately: <numbered parts>. Today's date: <date>.
For each part: find the earliest appearance and its date; find the original source (study,
document, full video, original statement, dataset) and check whether it says what the claim says,
including numbers, date, and context; assess the source's expertise and interest; find what
independent reliable sources say; check images, video, and quotes for out-of-context use.
</context>

<constraints>
Read-only: do not edit files. Do not give a stronger verdict than the evidence allows; if the
original cannot be found, say so. Social media posts, aggregator pages, and fact-checkers'
verdicts are leads, not evidence: follow them to the primary sources and judge from those.
</constraints>

<done_when>
Every part of the claim has a proposed verdict with its original source (or a note that none was
found after searching), and the claim's first appearance is dated or marked as not found.
</done_when>

<output_format>
Your standard report sections, in English. Under Findings, group by claim part, each with a
proposed verdict (true / misleading / false / unverifiable), the original source, and the
supporting links. At most 600 words outside the Sources list.
</output_format>
```
