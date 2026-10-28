---
name: agent-architect
description: Designs new Claude Code domain bundles (an agent with its preloaded skills and an entry skill) and improves existing agents and skills through an eval-gated loop, including the research skills and itself. Use when the user wants to build a new agent, skill, or plugin, or says an existing one misbehaved, did not trigger, or should get better, in English or Turkish ("yeni agent yap", "skill oluştur", "bir agent tasarlayalım", "bu skill tetiklenmedi", "skill'i iyileştir", "agent'ı geliştir", "eval yaz").
---

# Agent Architect

This skill builds and improves the agents and skills in the ai-playbook marketplace (`C:\Users\Eren\Desktop\-\Projeler\ai-playbook`). It adds this setup's rules on top of Anthropic's `skill-creator`: the bundle model, `prompt-craft`, Turkish triggers, personal data only from the Obsidian vault, the Pro-plan quota, a design the user approves before any file is written, and the decision log.

"Improved" means better on the bundle's eval cases. A rewrite that was never measured is not an improvement.

Talk to the user in Turkish. Write every file in English.

## Before anything else

1. Read `CLAUDE.md` and `docs/decisions.md` in the repo, and `docs/design/agent-architect.md` if this is the first use in the session. The decisions log has the open items and constraints that apply.
2. Load the `prompt-craft` skill. Every skill, agent, and brief this flow writes follows it.
3. Decide which flow the request needs: **Create** (a new bundle or skill) or **Improve** (something exists and should work better). If it is unclear, ask.

Out of scope: pre-production (vision, scope, stack choice), per-project agent loops (a future `project-loop-architect`), and DSPy/GEPA-style automatic optimizers. Say so and stop if the request is one of these.

## Create

1. **Intake.** Ask about the job, who starts it, inputs and outputs, what a good result looks like, any personal data (it must come from the vault at runtime, never from the repo), and how often it will run, since that sets the model and the quota budget. Ask 2–4 questions at a time with options and your recommendation first.
2. **Inventory.** Read `.claude-plugin/marketplace.json` and the existing plugins. Prefer extending an existing bundle over adding a new one, and name any overlap.
3. **Research.** Tell the user before spending quota. By default run one `research:web-researcher` with the research brief below. For questions about AI tooling itself, use `ai-engineering-radar` in quick mode. Distill the findings into the bundle's `references/`; don't paste raw reports into prompts.
4. **Design doc.** Write `docs/design/<bundle>.md`: the shape (propose the smallest one that does the job, and say why), the agent's job and tools, each skill's purpose and trigger phrases in English and Turkish, the flows, the briefs, the eval plan, and open questions. Stop here until the user approves it.
5. **Cases first.** Write the eval cases from the approved design, before the prompts. See [references/eval-authoring.md](references/eval-authoring.md).
6. **Write the files** with `prompt-craft` loaded, following [references/bundle-conventions.md](references/bundle-conventions.md). Register the plugin in `.claude-plugin/marketplace.json` and the README table.
7. **First eval run.** One run per case, with-skill only (commands in eval-authoring.md). Read the failures, fix, and rerun until the cases pass or the user accepts a known gap.
8. **Record.** Add a `docs/decisions.md` entry, append the first line to `evals/<skill>/HISTORY.md`, and commit. Ask before pushing.

## Improve

Follow [references/improve-loop.md](references/improve-loop.md). In short: reproduce the failure as a case, take a baseline on all of the bundle's cases, make one edit, and accept it only if the new case passes and nothing that passed before fails. Stop after 3 failed attempts and report. The user approves every change before it is committed.

Evidence can come from the user's description, a session transcript (find it with session search and read it), or a failing case in a weekly report under `evals/reports/`.

## Measuring

Two tools, two jobs:

- **`skill-creator`** (in the session) for writing cases and iterating while building, including the side-by-side viewer and description optimization. Its browser review step is optional here.
- **`claude plugin eval`** (CLI) for regression runs: the improve gate and the weekly run. It isolates each run and has free deterministic graders.

The CLI must run in the user's real terminal (the `run_in_terminal` tool), not in the sandboxed Bash or PowerShell tools, which do not see the real install or its login. Tell the user the number of runs before starting anything bigger than a smoke run.

## Agent questions (relay)

Every bundle agent gets this output contract: when it needs a decision only the user can make, it stops and returns `status: needs_input` with 1–4 questions, each with options and its recommendation first. The entry skill asks them with a question card, then continues the same agent with `SendMessage` so it keeps its context. Agents ask only when the brief leaves the answer open, never for confirmation.

## Research brief (Create, step 3)

```xml
<objective>
Find out how practitioners build <job> today: the source and quality standards they use and the
common failure modes, so I can distill them into the references of a new Claude Code skill bundle.
</objective>

<context>
Bundle purpose, from the intake: <purpose, inputs, outputs, what a good result looks like>.
User setup: solo developer on Windows 11, Claude Code desktop app and CLI on the Pro plan, so the
bundle must run with one subagent by default. Today's date: <date>.
</context>

<constraints>
Read-only: do not edit files. Prefer primary and dated sources. Include at least one skeptical
or critical view.
</constraints>

<done_when>
Each question above has at least 2 dated sources, and the skeptic view is covered.
</done_when>

<output_format>
Findings grouped as: practices, source/quality standards, failure modes, open disagreements.
Each with links. Under 900 words, in English.
</output_format>
```

Every brief a domain agent receives is written per bundle in its design doc and includes the `needs_input` contract above.
