# Writing a skill

A skill is a folder with a `SKILL.md` and optional supporting files. Claude sees only the `name` and `description` until the skill is triggered. Then it reads `SKILL.md`, and it reads the other files only when `SKILL.md` points to them. This is called progressive disclosure: it keeps the context small.

## Frontmatter

```yaml
---
name: purchase-research
description: Researches a product purchase decision: shortlist, measured reviews, long-term owner complaints, alternatives in the same price band, local price and warranty. Use when the user asks whether to buy something or which product to choose.
---
```

The description decides whether the skill ever fires. Write it in the third person and include both **what it does** and **when to use it**, with the words a user would actually say. Use `disable-model-invocation: true` for skills that only the user should start (deploys, releases).

## Body

- Keep `SKILL.md` under about 500 lines. Move detail into `references/*.md` and link it with a sentence that says when to read it.
- Write the procedure Claude cannot infer: domain judgment, source standards, the output template, and pitfalls seen in practice. Skip what Claude already knows.
- Put deterministic work in `scripts/` (validation, parsing, formatting) instead of describing it in prose.
- If the skill delegates, include ready-made briefs in the [delegation format](../SKILL.md#delegation-brief).

## Prove it works

A skill is finished when it has been tested, not when it has been written:

1. Write 3–5 realistic prompts that should trigger it, and 2 that should not.
2. Run them and read the outputs.
3. Revise, rerun, and compare. The `skill-creator` skill automates this with evals and A/B comparisons. Use it for any skill that will be used often.
