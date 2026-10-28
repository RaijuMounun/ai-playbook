# agent-architect: design

Status: **approved v3** (2026-10-29), **implemented as v0.1.0** the same day. Amended after the first eval runs: the case location (sections 2 and 5) and plugin dependencies (section 3) changed to fit what the CLI accepts. See `docs/decisions.md`, entry "agent-architect implemented".
Evidence: [radar 2026-10-29](../../research/radar/2026-10-29-agent-skill-design-and-evals.md). Decision context: `docs/decisions.md`, entry "agent-architect is the self-improvement loop".

## 1. Purpose and boundaries

`agent-architect` makes new **domain bundles** (an agent with a clear job plus its skills) and improves existing ones, including the research plugin and itself. "Improved" means better on that bundle's eval cases, not only rewritten.

It is general purpose. A bundle can be about health, research, games, writing, or development.

It is built on Anthropic's **`skill-creator`**. skill-creator supplies the generic machinery: test-case format, eval runs, grading, the benchmark viewer, and description optimization. agent-architect adds what is specific to this setup: the bundle model, `prompt-craft` rules, Turkish triggers, personal data only from the vault, the quota policy, a design doc approved before code, and the decision log.

Out of scope:
- **Pre-production.** Vision, scope, specs and stack choice belong to a separate pre-production pipeline, which can decide the stack. agent-architect takes no part in it.
- **Project agent loops.** Per-project agents, rules and workflows go to a separate future tool, `project-loop-architect`. It can reuse this design's bundle conventions and eval method (sections 2 and 5), but it is designed in its own session.
- **Automatic rewrites.** Nothing edits a prompt without the user's approval of the change.
- **DSPy / GEPA optimizers.** These are Python frameworks that tune prompts automatically against a dataset and a metric, through pay-per-token API calls. They need an API key (separate billing from Pro), 20–100+ labeled examples, and a pipeline that calls the model directly, not an agentic Claude Code skill. They are Hold for this setup. skill-creator's description loop (train/held-out split, pick by held-out score) is the small, affordable version of the same idea.

What is kept from the Antigravity version: ask first, research before building, a design the user approves, Turkish conversation and English files. What is dropped: simulated "compilation", state-machine prompts, capitalized rules, and handing the writing to a worker that lacks the design context.

## 2. The bundle model

A bundle is one plugin under `plugins/<domain>/`:

| Part | Role |
| :- | :- |
| `agents/<domain>.md` | The worker. It has a defined job, a minimal tool list, and its domain skills preloaded through `skills:` frontmatter, so it always carries the domain's rules and flows. |
| `skills/<domain>/SKILL.md` | The **entry skill**. It runs in the main thread and talks to the user: it asks the questions, applies the domain's rules, writes the brief, dispatches the agent, relays the agent's questions (below), and presents the result in Turkish. |
| `skills/<topic>/SKILL.md` | Domain skills: methods, source standards, templates. The agent preloads them. The entry skill may also use them directly for small jobs that need no subagent. |
| `skills/*/references/` | Detail loaded only when needed, including the distilled research behind the bundle. |
| `evals/<skill>/` | Test cases per skill (section 5), plus `HISTORY.md`. Plugin-level, because the CLI refuses an eval dir inside `skills/`. |
| `hooks/`, `scripts/` | Only for behavior that must always happen. |

Example: `health-coach` = agent `health-coach` (preloads `health-evidence`) + entry skill `health-coach`, which reads the profile from the Obsidian vault at runtime.

Not every request needs the full shape. A standalone method skill with no agent (like `prompt-craft`) is fine when no separate worker context is needed. agent-architect proposes the smallest shape that does the job and says why.

### Questions from the agent (relay)

A subagent cannot show the user a question card. It can stop and ask, though, and it keeps its context. Every bundle agent gets this output contract:

- When it needs a decision only the user can make, it stops and returns `status: needs_input` with 1–4 questions, each with options and its recommendation first.
- The entry skill asks those questions with a question card.
- The entry skill then continues **the same agent** with `SendMessage`, which keeps the agent's context. The agent finishes, or asks again.

Each question costs one extra round trip, but the agent loses no context. Agents ask only when the brief truly leaves the answer open. They don't ask for confirmation.

Option for later: running a whole session as the agent (`claude --agent <plugin:agent>`). It works in the CLI. Desktop app support is unverified, so the entry skill is the default way in.

## 3. Components of agent-architect itself

agent-architect is itself a bundle, `plugins/agent-architect/`:

- **Entry skill `agent-architect`** (main thread). It runs the design conversation and writes the files with `prompt-craft` loaded. For tests and measurement, it follows skill-creator's procedure, with the overrides in section 5. Main-thread writing was chosen by the user: the design context is already here, and a separate builder would cost about one more agent context and lose detail in the handoff.
- **No worker agent in v1.** The heavy jobs are research, which goes to `research:web-researcher` through `ai-engineering-radar` or a domain brief, and eval runs, which go to the subagents skill-creator spawns. An `eval-analyst` agent can be added later if reading reports becomes the bottleneck.
- **References**:
  - `bundle-conventions.md`: section 2 as a checklist.
  - `eval-authoring.md`: section 5, the house rules on top of skill-creator.
  - `improve-loop.md`: section 4.2.
- **Requires** the `prompt-craft` and `research` plugins, and the `skill-creator` skill (from Anthropic's skills; already available in the desktop app). The requirement is stated in the README, not in the manifest's `dependencies`: an eval run installs no other plugins, so a plugin with `dependencies` fails to load there.

## 4. Flows

### 4.1 Create

1. **Intake (talk).** Ask about the job, who starts it, inputs and outputs, what a good result looks like, any personal data (which must come from the vault), and how often it will run (this sets the model and the quota budget). Ask a few questions at a time, with options.
2. **Inventory.** Read `.claude-plugin/marketplace.json` and the existing plugins. Prefer extending an existing bundle over adding a new one. Report any overlap.
3. **Research.** Tell the user before spending quota. By default, run one `web-researcher` with the brief in section 7. For questions about AI tooling itself, use `ai-engineering-radar` in quick mode. Keep the findings in a radar file or a research note, and distill them into the bundle's `references/`.
4. **Design doc.** Write `docs/design/<bundle>.md`: the bundle shape, the agent's job and tools, each skill's purpose and trigger phrases (English and Turkish), the flows, the briefs, the eval plan, and open questions. **The user approves it.**
5. **Test cases first.** Write the cases from the approved design, before the prompts (section 5).
6. **Write the files** with `prompt-craft` loaded. Register the plugin in `marketplace.json` and in the README table.
7. **First eval run** with skill-creator's procedure: one run per case, with-skill only. Run a no-skill baseline only for bundles that will be used often. Read the failures, then fix and rerun until the cases pass or the user accepts a known gap.
8. **Record.** Add a decisions.md entry, append the first line to `evals/<skill>/HISTORY.md`, and commit. Ask before pushing.

### 4.2 Improve (includes improving itself)

The evidence comes from one of three places: the user says something went wrong, a session transcript (found with session search and read by agent-architect), or a failing case in the weekly report (section 6).

1. **Reproduce.** Turn the failure into a new test case. If it is not reproducible, record that and stop.
2. **Snapshot and baseline.** Snapshot the current version, as skill-creator does for `old_skill`. Run all of the bundle's cases on it and note which pass.
3. **One change.** Make a single targeted edit to the prompt, description, reference or hook, with `prompt-craft` loaded. Each edit must have one cause, so the results can be read.
4. **Gate.** Rerun all cases. Accept the edit only if the new case passes and no case that passed before now fails. If the gate fails, revert and try a different edit. Stop after 3 attempts and report to the user. This gate is what keeps the loop from overfitting one failing example, the main risk named in the research.
5. **Show and record.** Show the user the diff and the before/after benchmark. After the user approves, append a line to `evals/<skill>/HISTORY.md` and commit.

The same loop improves `agent-architect` itself, `web-researcher`, and the research skills. Their missing test cases (an open item in decisions.md) are the first input.

**Trigger problems** (a skill fires when it shouldn't, or doesn't fire when it should) go to skill-creator's description optimization. Use it only on demand, because it is the costly part: about 20 queries × 3 runs × up to 5 rounds, and it needs the `claude` CLI.

## 5. Test cases (house rules on top of skill-creator)

The format is skill-creator's, which is also the `claude plugin eval` layout: `prompt.md`, `case.yaml`, `graders/NN-*.md` per case. Cases live at `plugins/<plugin>/evals/<skill>/<case>/`; skill-creator's own default (`skills/<skill>/evals/`) does not work with the CLI, so point skill-creator at the plugin-level folder.

The two tools have different jobs:
- **skill-creator, in the session.** Use it for writing cases and iterating while building. That includes comparing against the old version and the browser viewer.
- **`claude plugin eval`, through the CLI.** Use it for regression runs: the improve gate (section 4.2) and the weekly run (section 6). It isolates each run, offers free deterministic graders, and has a cost ceiling and JSON output that a script can read.

Prefer the free grader types where they fit: `tool_used` (including `Skill` for trigger checks, and `min: 0, max: 0` for should-not-trigger), `tool_order`, `regex`, and `file_exists`. Use an `llm` grader only for the quality rubric. The default `--ablation with-without` doubles the runs, so regression runs use `--ablation none`. Research cases need `--allow-tools WebFetch`. Bash stays off, because native Windows has no sandbox for it.

Per skill, sized for the Pro plan:

| Kind | Count | How it is checked |
| :- | :- | :- |
| Should trigger (English and Turkish phrasing) | 3–5 | Was the skill used? |
| Should not trigger (near misses) | 2–3 | The skill was not used |
| Process checks: did it do the steps that matter? | 1–3 | For example, a research agent must open source pages, not stop at search snippets, and the entry skill must dispatch the agent and not answer from memory. Checked from the transcript. |
| Output structure | 1–2 | Required sections, a saved report file. Checked by a script where possible, as skill-creator advises. |
| Output quality | 0–2 | A written PASS/FAIL rubric, for example "every key claim has at least one primary source". |

This is how the user can trust work they cannot easily check: whether the researcher read primary sources becomes a process check and a rubric, so nobody has to judge it by eye.

House rules:
- Cases never contain personal data. Health cases use made-up profiles.
- Every bug fixed through the improve loop leaves its case behind as a regression test.
- Runs use the cheapest model that matches real use: the agent's own pinned model, otherwise `sonnet`.
- skill-creator's browser review step is optional here. The user may skip it, because the graders exist so that the user doesn't have to judge outputs.

## 6. Weekly eval run before the quota resets

The weekly limit resets at a time the usage API reports (Monday 16:00 Turkey time as of 2026-10-29). Quota left unused at reset is lost, so the full suites run in the 8 hours before the reset. agent-architect creates this task during implementation. The user does nothing in the Scheduled tab except keep the app open at some point in that window.

- A desktop-app scheduled task, `weekly-evals`, set to fire 8 hours before the reset (cron `0 8 * * 1` for now). If the app is closed at that moment, it fires on next launch.
- Its prompt is self-contained:
  1. **Check the timing.** Read the plan usage. If the reset is more than 8 hours away (the task fired early) or has already passed (the app was closed through the window), only report, then stop.
  2. **Fix drift.** If the reset time differs from the one the cron assumes, update the task's own schedule to 8 hours before the new reset, and say so in the report. This is how the reset time moving is handled with no work from the user.
  3. **Set a budget.** Keep a reserve of 10% of the weekly window, so the user can still work after the run starts. Stop early if the 5-hour window is nearly used.
  4. **Run.** Run the full suites with `claude plugin eval <plugin> --ablation none --max-cost-usd <budget> --trust-plugin --json evals/reports/<date>.json`, invoked in a shell that sees the real CLI install and its login (Claude's own Bash tool is sandboxed and does not). Running with-skill only means no baselines. Order: bundles changed since the last run first, then the rest, and stop when the budget runs out.
  5. **Report.** Write `evals/reports/YYYY-MM-DD.md` with a pass rate per bundle, the cases that newly fail, and a suggested improve item for each. Then notify the user.
- It does not edit any prompt. Fixes go through the improve loop with the user (human in the loop).
- **Cloud alternative.** Anthropic's cloud scheduled agents ("routines") run without the app and work on the GitHub repo. Two things are uncertain: whether a cloud run can read the plan usage (needed for steps 1–3), and whether `skill-creator` and this repo's plugins are available there. So the local task is the default, and the cloud option is an open question to test once.

Because this run spends quota that would otherwise be lost, a full suite on Monday is effectively free. During the week, runs stay small: one run per case, only the affected bundle.

## 7. Briefs

**Research brief (create flow, step 3).** This follows the `prompt-craft` template:
- `objective`: how practitioners do <job>; the source and quality standards; common failure modes.
- `context`: the bundle's purpose from the intake, the user's setup, and the date.
- `done_when`: at least 2 dated sources per question, and a skeptic view.
- `output_format`: the findings to distill into `references/`, under 900 words, in English.

The final text goes into the skill at implementation time.

The domain agent's own briefs are written per bundle in its design doc, not here. Every one of them includes the `needs_input` contract from section 2.

## 8. Prerequisites and checks at implementation

- **skill-creator.** It is available in the desktop app now, so nothing needs installing.
- **Claude Code CLI.** Installed 2026-10-29 through npm (v2.1.312), and `claude plugin eval` is available. The user logged in on the Pro subscription the same day. The first install landed only inside Claude's tool sandbox. It was redone in the user's own terminal with `--allow-scripts=@anthropic-ai/claude-code`.
- **Things to verify while building:**
  - The scheduled task can read plan usage and can update its own schedule.
  - `SendMessage` continuation works from inside a skill-driven flow.
  - The scheduled task's shell sees the real `claude` install. Claude's own tool shell is sandboxed and saw a different filesystem on 2026-10-29.

## 9. Open questions

1. **Cloud scheduled run** instead of the local task: can it read plan usage, and does it have `skill-creator` and the plugins? Test it once.
2. Should the existing `research` plugin move to the bundle model, with `web-researcher` preloading the research skills? Today the skills run in the main thread and dispatch the agent, which already resembles "entry skill + worker". The answer may be "leave it".
3. Does the desktop app honor `claude --agent` or the `agent` setting? This only matters for the later "session as agent" option.
4. What does `--max-cost-usd` mean on a Pro plan? It is an API-equivalent estimate, not a charge, so it works as a proxy budget. Calibrate the weekly budget after the first real run, using ccusage.
