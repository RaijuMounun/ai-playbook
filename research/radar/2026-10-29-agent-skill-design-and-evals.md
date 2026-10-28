---
title: Designing, evaluating and improving Claude Code agents and skills
date: 2026-10-29
question: How should agent-architect package, test and improve the agents and skills it builds?
review_by: 2027-01-29
---

## Summary
| Candidate | Ring | One-line reason |
| :- | :- | :- |
| Agent with preloaded skills (`skills:` frontmatter), one plugin per domain | Adopt | Official, documented, costs no extra runs |
| `claude plugin eval` with cheap graders | Trial | Official and fits skills well, but early access, needs the CLI, and native Windows cannot sandbox Bash |
| skill-creator as the eval engine | Adopt | Official, writes the `plugin eval` case format, runs in-session without the CLI; description optimization is costly, use sparingly |
| Self-improvement loop gated by evals | Assess | Only preprints and vendor blogs; everyone says to accept edits only without regressions |
| GEPA / DSPy-style optimizers | Hold (here) | Need budgets and datasets a Pro-plan solo developer does not have |
| Research before building | Assess | Little direct evidence; distill findings into `references/`, don't paste them into prompts |

## Recommendation for this setup
- Package each domain as a plugin: one agent with a clear job, its skills preloaded through `skills:`, and a thin entry skill that talks to the user in the main thread.
- Write evals in the `claude plugin eval` format under `plugins/<name>/evals/`. Prefer free graders (`regex`, `tool_used`, `tool_order`, `file_exists`). Use `llm` graders only for output quality that has a written rubric.
- Improve only through a gated loop: turn the failure into a case, make one edit, rerun all cases of the bundle, and accept the edit only if nothing that passed before now fails.
- Install the Claude Code CLI first (not on this machine as of 2026-10-29). Keep eval cases read-only (no Bash) until WSL2 is decided.

## Candidates
### Agent with preloaded skills — Adopt
- **What it is:** subagent frontmatter `skills: [a, b]` injects the full text of each listed skill when the agent starts (up to 32). Skills are not inherited from the parent. Skills with `disable-model-invocation: true` cannot be preloaded. A session can also run as the agent with `claude --agent <plugin:agent>` or `{"agent": "<name>"}` in settings; that replaces the default system prompt.
- **Evidence for:** [Sub-agents docs](https://code.claude.com/docs/en/sub-agents.md).
- **Evidence against / limits:** no measured comparison with main-thread skills. A missing skill name is skipped with only a debug-log warning. `--agent` mode drops the default Claude Code system prompt.
- **Fit here:** matches the Antigravity "agent + its skills" habit the user wants to keep.

### `claude plugin eval` — Trial
- **What it is:** `claude plugin eval init`, `claude plugin eval . [--case <glob>] [--tag] [--runs n] [--model] [--judge-model] [--ablation none|with-without] [--threshold] [--max-cost-usd] [--json path]`. Cases are `evals/<case>/prompt.md` plus `graders/*.md` (or `case.yaml`). Grader types are `regex`, `tool_used`, `tool_order`, `file_exists`, `llm` (rubric, passes on 2 of 3 judge votes) and `baseline`. `tool_used` with `min: 0, max: 0` asserts that a tool was never called, which is how a should-not-trigger case is checked.
- **Evidence for:** [Plugin evals docs](https://code.claude.com/docs/en/plugin-evals.md).
- **Evidence against / limits:** needs Claude Code v2.1.269 or later and is listed as early access. Runs count against plan usage: cases × runs × arms, plus judge calls. Native Windows has no sandbox backend, so suites that grant Bash need WSL2.
- **Fit here:** good, with `--runs 1` for smoke checks and fuller runs on a schedule.

### skill-creator — Adopt
- **What it is:** Anthropic's skill with its own `evals/evals.json` format (not read by `plugin eval`), A/B runs against no skill or the old version, and description optimization with a 60/40 train/held-out split.
- **Evidence for:** [skill-creator SKILL.md](https://raw.githubusercontent.com/anthropics/skills/main/skills/skill-creator/SKILL.md), [Anthropic blog](https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills).
- **Correction (checked locally, 2026-10-29).** The researcher reported that skill-creator's format differs from `plugin eval`. The installed skill-creator says otherwise. It now writes test cases in the `claude plugin eval` folder layout (`evals/<case>/prompt.md`, `case.yaml`, `graders/`) and still reads an old `evals.json`. It runs cases in-session with subagents, so the CLI is not needed. Only description optimization (`scripts.run_loop`) needs `claude -p`.
- **Fit here:** use it as the eval engine. Its cases can later run unchanged under `claude plugin eval`.

### Eval-gated self-improvement — Assess
- **Evidence for:** [arXiv 2607.26643](https://arxiv.org/pdf/2607.26643) (preprint, 2026-07): repeated skill edits overfit the failed batch and regress solved cases. Gating each edit on the full set fixes this.
- **Evidence against / limits:** a GEPA-optimized prompt raised train accuracy and lowered held-out accuracy ([summary](https://letsdatascience.com/news/dspy-evaluates-and-refines-datasette-agent-prompts-6ced2073)). Decagon found that 20–100 examples beat 500 ([Decagon](https://decagon.ai/blog/optimizing-gepa-for-production)). GEPA is a poor fit for tiny budgets ([FutureAGI](https://docs.futureagi.com/docs/cookbook/gepa-optimization)).
- **Fit here:** a manual, one-edit-at-a-time loop with a no-regression gate.

### Research before building — Assess
- **Evidence:** only generic "keep SKILL.md under about 500 lines, use one-level references" advice (third party).
- **Fit here:** research once per new bundle, store the distilled findings in the bundle's `references/`.

## Sources
1. https://code.claude.com/docs/en/sub-agents.md (Anthropic, fetched 2026-10-29)
2. https://code.claude.com/docs/en/plugin-evals.md (Anthropic, fetched 2026-10-29)
3. https://raw.githubusercontent.com/anthropics/skills/main/skills/skill-creator/SKILL.md (Anthropic, undated)
4. https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills (Anthropic, undated)
5. https://chipp.ai/engineering/skills-vs-sub-agents (chipp.ai, undated)
6. https://arxiv.org/pdf/2607.26643 (preprint, 2026-07)
7. https://decagon.ai/blog/optimizing-gepa-for-production (Decagon, undated)
8. https://letsdatascience.com/news/dspy-evaluates-and-refines-datasette-agent-prompts-6ced2073 (undated)
9. https://docs.futureagi.com/docs/cookbook/gepa-optimization (FutureAGI, undated)

Quick mode, one researcher (about 36k subagent tokens). The anthropics/skills and anthropics/claude-code repos were not checked directly.
