---
tags: [web-researcher, word-budget]
max_turns: 6
timeout_seconds: 900
allowed_tools: [Agent, WebSearch, WebFetch]
---

Dispatch the research:web-researcher agent with the brief below, exactly as written. When it returns, reply with its report exactly as it returned it: no introduction, no summary, nothing added before or after.

<brief>
<objective>
Gather evidence (all four source classes: vendor, practitioners, adoption signals, skeptics) on whether these are current best practice for designing and improving Claude Code agents and skills. The findings feed an Adopt/Trial/Assess/Hold radar and the design of a meta-skill ("agent-architect") that creates new agent+skill bundles and improves existing ones.

Candidates:
1. Agent-with-its-own-skills packaging: a Claude Code subagent definition whose frontmatter `skills:` field preloads domain skills, shipped together in one plugin per domain; also running a session as that agent (`claude --agent`, or the `agent` setting). How does this compare with skills invoked from the main thread?
2. Eval-driven skill/agent development: Anthropic's `skill-creator` skill (evals, A/B comparison, description/trigger optimization) and the `claude plugin eval` command (eval suite format, how cases and graders are written, sandbox, report). What does a minimal useful eval suite for a skill look like (trigger cases, should-not-trigger cases, output checks, LLM-as-judge rubrics)?
3. Self-improvement loops for prompts/skills: having an agent rewrite its own or other prompts based on eval failures or transcripts (e.g. reflection-based optimizers like GEPA/DSPy in practice, or simpler "read failing transcripts, revise, rerun evals" loops). What works for a solo developer without API-scale budgets, and what do skeptics report (overfitting to evals, regressions, drift)?
4. Research-before-build: whether teams research prior art/best practice before writing a new agent, and how they keep that from bloating the prompt.
</objective>

<context>
Decision this informs: the design of `agent-architect` in a Claude Code plugin marketplace. It brainstorms a new agent or skill with the user, researches best practice, writes the files in the main thread with a prompt-engineering skill loaded, writes eval cases for what it builds, and later improves existing agents/skills (including itself) only when evals show improvement. It is general purpose (health, research, games), not dev-only.
Today's date: 2026-10-29. Only evidence from the last 12 months counts as current; older evidence goes under Disagreements or Not verified, with its date.
User setup: Windows 11, Claude Code desktop app and CLI, solo developer, Claude Pro plan (quota-limited, so eval runs must be cheap).
Prefer official docs at code.claude.com / docs.claude.com / anthropic.com engineering blog and the anthropics/skills and anthropics/claude-code GitHub repos for candidates 1 and 2.
</context>

<constraints>
Read-only: do not edit files. Quick mode: cover all four source classes, keep to the strongest 2 findings per class per candidate, and stop once each candidate has them.
</constraints>

<done_when>
Each candidate has at least 2 dated findings, or an explicit note that none exist; candidates 1 and 2 include the exact frontmatter field names / command syntax from official docs with links.
</done_when>

<output_format>
Your standard report sections, in English, findings grouped per candidate, ending with a suggested ring per candidate and one line on fit for a quota-limited solo developer. At most 900 words outside the Sources list. Do not save a file; return the report.
</output_format>
</brief>
