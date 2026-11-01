---
tags: [web-researcher, word-budget]
max_turns: 6
timeout_seconds: 900
allowed_tools: [Agent, WebSearch, WebFetch]
---

Dispatch the research:web-researcher agent with the brief below, exactly as written. When it returns, reply with its report exactly as it returned it: no introduction, no summary, nothing added before or after.

<brief>
<objective>
Fact-check this claim with the SIFT method and trace each part back to where it first appeared, so I can give the user a verdict: true, misleading, false, or unverifiable.
</objective>

<context>
Claim, as the user gave it: "İnsanlar beyinlerinin sadece %10'unu kullanır; geri kalan %90'ı kullanılmayan potansiyeldir."
Parts to check separately: (1) humans use only about 10% of their brain; (2) the remaining 90% is unused "potential"; (3) origin of the claim (who first said it, when). Today's date: 2026-10-28.
For each part: find the earliest appearance and its date; find the original source (study, document, statement) and check whether it says what the claim says; assess the source's expertise and interest; find what independent reliable sources and fact-checkers (Doğruluk Payı, Snopes, AFP, Reuters) say; for science, prefer primary studies or reviews (imaging studies, lesion studies) over news coverage.
</context>

<constraints>
Read-only: do not edit files. Do not give a stronger verdict than the evidence allows; if the original cannot be found, say so. Social media posts and aggregator pages are leads, not evidence.
</constraints>

<done_when>
Every part of the claim has a proposed verdict with its original source (or a note that none was found after searching), and the claim's first appearance is dated or marked as not found.
</done_when>

<output_format>
Your standard report sections, in English. Under Findings, group by claim part, each with a proposed verdict (true / misleading / false / unverifiable), the original source, and the supporting links. At most 600 words outside the Sources list.
</output_format>
</brief>
