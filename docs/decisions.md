# Decision log

Decisions about how this AI setup works, newest first. Each entry records what was decided, why, and when to revisit. Detailed evidence lives in `research/radar/`. Add an entry whenever a choice is made, and don't rewrite old entries: supersede them with a new one.

## Where things stand (updated 2026-10-29)

Read this first in a new conversation. It is the short version of everything below.

- **What exists.** Three plugins, all enabled locally from this checkout:
  - `prompt-craft`: the brief template, plus hooks that reject subagent briefs without `<objective>`, `<context>`, `<done_when>`, `<output_format>`.
  - `research`: the `web-researcher` agent and four skills (`ai-engineering-radar`, `purchase-research`, `tech-howto`, `fact-check`). A hook blocks WebSearch in the main thread.
  - `agent-architect`: builds new agent/skill bundles and improves existing ones through an eval-gated loop. Design in [design/agent-architect.md](design/agent-architect.md).
- **What is measured.** Trigger evals only: 17 cases for the research skills and 5 for agent-architect, all passing (one run per case). Nothing yet checks whether a skill or agent does its job well once it fires. Closing that gap is the work in progress: agent-architect now has 6 job-quality cases, baseline 5/10 (see Next, item 1).
- **What runs on its own.** The cloud routine `weekly-evals` runs every eval suite on Mondays, 1 hour before the weekly quota reset, and writes a report to the `eval-reports` branch. The desktop task `weekly-evals-drift-check` runs daily on Haiku, moves the routine if the reset time moves, and relays new reports.
- **How to work.** One hub conversation per phase, with sub-sessions for separate jobs. Start a hub with the prompt in [handoff.md](handoff.md). Every decision and open item goes into this file before a conversation ends, because conversations can be lost (the 2026-10-28 setup conversation was deleted).

## Open items

### Next, in this order

1. **Self-improvement round for `agent-architect` and `web-researcher`.** The goal: both get better at their jobs before they build anything new.
   - **Why eval cases first.** "Read your own prompt and improve it" without measurement is what failed in Antigravity: a rewrite looks better but nobody knows if it is. So the round starts by writing job-quality cases (does the agent do its job well, not only does it trigger), takes a baseline, and only then runs the improve loop: one edit at a time, accepted only if nothing that passed before fails.
   - **`agent-architect`.** Cases from its own job: does it ask the intake questions, produce a design for approval before writing files, research current practice (through `ai-engineering-radar`), write eval cases with what it builds, and follow the improve loop. Its research on current prompting and agent-design practice happens inside this round.
   - **`web-researcher`.** Measured from real tasks instead of extra test searches (see the entry "web-researcher is measured from real tasks"). Its first real reports get graded against its own standards, and failures become fixed cases.
   - **Quota.** Give the user an estimate before each run. Default to one agent; stop after 3 attempts per fix.
   - **Status (2026-10-29).** Case plan approved (entry "Job-quality eval plan for agent-architect and web-researcher"). Step a, done: the agent-architect cases are written and the baseline is 5/10 (entry "agent-architect job-quality baseline"). Not committed yet. Step b: the improve loop on agent-architect's failures. Step c: the web-researcher collection script and its first two cases (no run without approval).
2. **Job-quality evals for the research skills** (`purchase-research`, `tech-howto`, `fact-check`). Triggering is covered (17 cases). Still missing: does the skill ask the right questions first, stay at one researcher, and follow its output template. Write these as cases in `plugins/research/evals/<skill>/`, preferring free graders (tool use, structure) and using an `llm` rubric only for quality. The first real use of each skill also counts: check those same points, record the result here, and turn failures into cases.

### Waiting on a date or an event

- **First weekly eval run, Monday 2026-11-02, about 15:00 Turkey time.** Read the report on the `eval-reports` branch (`evals/reports/2026-11-02.md`) and the real cost. Then tune `--runs` and `--max-cost-usd` in the routine. The same run shows **trigger stability**: the 2026-10-29 results were one run per case, and `tr-brain-ten-percent` and `en-misattributed-quote` were the two that failed before the fix. If either flips back, consider skill-creator's description optimization.
- **Drift-check on Haiku.** The user switched its model to Haiku 4.5 on 2026-10-29 (it was Opus 5.5 by default). Check that the next run (2026-10-30, 10:00) still reads `resetsAt` and the routine. Haiku 5.5 is newer; use it if the Scheduled tab offers it.
- **Drift-check's reschedule step is untested.** Its one manual run (2026-10-28) succeeded without permission prompts, and the task is in auto mode. But changing the routine's cron has never happened yet, and auto mode can be stricter on actions that change things outside the PC. The first time the reset time moves, check that the update went through.
- **`SendMessage` continuation from inside a skill-driven flow** (design section 8). First test when a bundle with an agent is built, for example `health-evidence`.
- **Usage review around 2026-11-28.** Run `ccusage daily` and `ccusage monthly`, then tune the model and effort assignments.

### On hold

- **CodeGraph trial on Cannaville (UE5).** Cannaville is not on this PC (only on GitHub) and not in active work. Run it when work on Cannaville or another large C++ project resumes: ask the same 2–3 architecture questions with and without CodeGraph, compare token use in `ccusage session`, decide Adopt or Hold.

### Later

- **`health-evidence` with a `health-coach` plugin.** A good first real build for `agent-architect` after its self-improvement round. Personal health data stays in the Obsidian vault.
- `game-research`, `stack-selection`, `market-research`. Then the pre-production pipeline, kept separate from a per-feature spec/ADR development loop. `project-loop-architect` (per-project agent loops) is a separate tool, designed on its own.
- Optional: a LICENSE file. `claude plugin validate` passes, but the official plugin directory would refuse a submission without one. Not needed for local use.

### Done

- 2026-10-28: hooks live-tested (main-thread WebSearch denied; a brief without sections denied; SessionStart injection works).
- 2026-10-28: research playbooks `purchase-research`, `tech-howto`, `fact-check` written.
- 2026-10-29: `agent-architect` designed, approved, implemented (v0.1.0), and enabled locally.
- 2026-10-29: Claude Code CLI logged in (Pro subscription); `claude plugin eval` works locally and in the cloud.
- 2026-10-29: first improve-loop fix: the `fact-check` trigger went from 15/17 to 17/17.
- 2026-10-29: weekly eval routine and drift-check task set up.
- 2026-10-29: phone access decided (Remote Control when the PC is on, cloud otherwise).

---

## 2026-10-29: agent-architect job-quality baseline: 5/10, and what the eval CLI allows
**Result.** Six job-quality cases written (the plan is in the next entry). The baseline (Sonnet, `--runs 1`, `--ablation none`, `--allow-tools Write Edit`) passed 5/10, for about $0.94 API-equivalent in total, including the smoke runs. The estimate was $2–4. Failures:
- `tr-new-agent`: the fourth intake question had no options.
- `research-before-design`: it recommended skipping research.
- `build-cases-first`: `SKILL.md` was written before the cases.
- `improve-reproduce-first`: `SKILL.md` was edited before the case was written.
- `tr-no-unmeasured-rewrite`: it rewrote its own `SKILL.md` and said it hadn't measured the result, which is the Antigravity failure. In one smoke run the skill did not fire at all, so expect noise at `--runs 1`.

**Learned about `claude plugin eval` (CLI 2.1.312, native Windows):**
- **Per-case fixtures** exist only as `context.scaffold_script`. That needs `--scaffold` and bash, and bash is not on the CLI's PATH here (exit 127). So the cases carry repo context in the prompt.
- **Write access.** A case that writes files needs `Write`/`Edit` in its `allowed_tools`, and the run needs `--allow-tools Write Edit`.
- **`llm` graders** see only `last_message` by default. `focus: trace` gives them the tool calls.
- **Grader bounds.** `max: 0` also needs `min: 0`, because `min` defaults to 1. The existing should-not-trigger graders already set both.
- **`--case`** keeps only the last value given.
- **Hard-coded repo path.** The skill reads its absolute repo path, and that read is denied in an eval run. Every case starts with that denial, which can confound the results (for example, research-before-design).

**Next.** The improve loop on these failures, one edit at a time, starting with whatever the failures share. Gate cost is about $0.7–0.8 per full-suite run. Add the eval-CLI learnings to `references/eval-authoring.md` (that is a reference edit, so it goes through review).

## 2026-10-29: Job-quality eval plan for agent-architect and web-researcher
**Decision.** Approved by the user. agent-architect goes first and gets one baseline run. web-researcher follows from real tasks.
- **agent-architect cases**, in `plugins/agent-architect/evals/agent-architect/`. They use a small fixture repo (a decisions.md, a marketplace.json, one sample plugin), because an eval run has no repo and no other plugins. If the CLI has no case fixtures, the same context goes into the prompt.
  - `tr-new-agent`, tightened: no `Write`, plus an `llm` rubric: 2–4 intake questions with options.
  - `tr-design-before-files`: intake answered in the prompt. It writes `docs/design/*.md`, no `SKILL.md` or `agents/`, and asks for approval.
  - `research-before-design`: it proposes research with a quota note before the design (`llm`). It cannot test a real dispatch, because `research` is not loaded in the run.
  - `build-cases-first`: approved design in the fixture. Case files are written before `SKILL.md` (`tool_order`), under `evals/<skill>/`, and with no `dependencies`.
  - `improve-reproduce-first`: the case comes before any `SKILL.md` edit, and baseline, gate and approval are named.
  - `tr-no-unmeasured-rewrite`: "read your own prompt and improve it". No edit; it asks for evidence or proposes cases first. This is the Antigravity failure, and the most important case.
- **web-researcher standard**, applied to every report. Free checks: sections in order, front matter, URL + date + tier on each finding, `WebFetch` used. `llm` rubric: primary or two independent sources for key claims, an honest "Not verified" list, every cited URL present in the run's tool results, and the word budget. First cases come from the two real briefs still on disk (`fact-check-brain-ten-percent`, with an extra grader for tracing the origin to primary texts; `radar-agent-skill-design`, trimmed).
- **Collecting real web-researcher reports.** Claude Code keeps subagent transcripts in `~/.claude/projects/<project>/<session>/subagents/agent-*.jsonl`, with `meta.json` naming `agentType: research:web-researcher`. They are deleted after 30 days by default. A Node script (`plugins/research/scripts/collect-research-reports.js`) will copy new ones (brief and final report) to `~/.claude/research-log/`, outside the repo because briefs may hold personal topics. It also runs the free checks, including an HTTP check of each cited URL. The daily drift-check task runs it. The `llm` rubric runs only on demand, in batches, and each failure becomes a scrubbed fixed case. A script was chosen over a SubagentStop hook because it is easier to test and touches no session.

**Why.** Trigger evals only show that a skill fires, not that it does its job. The cases check the steps that define the job (ask, design, approval, cases first, measure before editing) with free graders where possible.
**Quota.** Estimate: agent-architect smoke about $0.5, baseline about $2–4, and each fix attempt about $2–4 (API-equivalent, Sonnet). The web-researcher baseline is about $2–3, run only after the user approves.

## 2026-10-29: web-researcher is measured from real tasks
**Decision.** `web-researcher` is evaluated on the reports it writes in real use, not on extra searches run only for testing. After a real research task, its report gets graded against its own standards: a primary source where one exists, two independent sources for key claims, dates on sources, no invented sources, an honest "Not verified" list, and the brief's word budget. A report that fails a check becomes a fixed eval case: the brief, plus a grader for the failed check. The improve loop then replays that case.
**Why.** Test searches cost quota and return nothing useful, while real tasks are already paid for and show real failure modes. A fixed case is still needed after that, because the improve loop has to compare before and after on the same input.
**Limit.** Web results change over time, so a replayed case grades the report's structure and source behavior, not exact content.

## 2026-10-29: Model for scheduled runs
**Decision.**
- `weekly-evals-drift-check` (desktop task): Haiku. Changed from Opus 5.5 by the user. The job is three tool calls and one date calculation.
- `weekly-evals` (cloud routine): stays on Sonnet 5.5. It reads the eval JSON, compares it with last week's report, and writes a likely cause for each failing case. That analysis is worth Sonnet, and the routine runs once a week.
- The model under test is set separately by `--model sonnet` in the eval command. Keep that on Sonnet, because Sonnet is what runs the skills in normal sessions. Testing on a different model would measure the wrong thing.

## 2026-10-29: Hub conversations with sub-sessions, and a handoff prompt
**Decision.** Work goes through one hub conversation per phase. The hub plans the work, starts a sub-session for each separate job, reviews the results, and records everything in this file. When a hub conversation gets long, it writes the state here and starts a new hub from the prompt in [handoff.md](handoff.md).
**Why.** The 2026-10-28 conversation was deleted, and its plan survived only in two auto-memory notes. Long conversations also lose detail when they get compacted. Sub-sessions keep each job's context separate, and this file keeps the state.

## 2026-10-29: Phone access: Remote Control when the PC is on, cloud otherwise
**Decision.** Use both.
- **PC on and the desktop app open:** Remote Control. From the phone you drive a session on this PC, so it has local files, the installed plugins, the CLI, and the Obsidian vault.
- **PC off:** a cloud session on the GitHub repo. It works on a clone in Anthropic's cloud. Changes come back only through git (a branch or PR), and it cannot see local-only things such as the vault or the scheduled tasks.

**Why.** They cover different situations, and neither replaces the other. Cloud work lands on a branch, so pull it before working locally again.

## 2026-10-29: Weekly evals run in the cloud, timed from the desktop
**Decision.** The weekly eval run is a cloud routine, not the local 8-hour-window task from design section 6.
- **Cloud test (one-off routine, Default environment).** `claude` 2.1.312 is preinstalled and logged in with the subscription's OAuth token (no API key). `claude plugin eval plugins/research --case tr-brain-ten-percent --trust-plugin` passed, $0.12 API-equivalent, 87 s for the whole session. The cloud **cannot** read the plan's usage or reset time (`/usage` is interactive only; no env var or trace field has it). `bwrap`/`socat` are missing, so cloud cases must not grant Bash either.
- **`weekly-evals` routine** ([claude.ai/code/routines/trig_01FAnGMtPqG8m6wD8Ygh5um2](https://claude.ai/code/routines/trig_01FAnGMtPqG8m6wD8Ygh5um2)): cron `0 12 * * 1` UTC, Monday 15:00 Turkey time, 1 hour before the reset (Monday 13:00 UTC). It runs every plugin that has `evals/` with `--runs 3 --ablation none --model sonnet --max-cost-usd 4` per plugin, writes `evals/reports/YYYY-MM-DD.md` plus the JSON on the **`eval-reports` branch** (never main, so the local checkout never has to merge cloud commits), and sends a push notification. It only reports.
- **`weekly-evals-drift-check` desktop task** (daily 10:00): reads the weekly `resetsAt` with `get_usage`, sets the routine's cron to 1 hour before it if the reset moved, and relays the latest run's summary in Turkish.
- The first cloud run showed that eval results land in `plugins/<plugin>/evals/results/`; `.gitignore` now covers that path.

**Why.** The cloud runs without the app being open and the PC being on, which the local task needed. The 10% reserve from the design is dropped: an hour before the reset there is no week left to protect, and the cost ceiling bounds the run. The 5-hour window is the remaining risk if the user is working heavily at that hour.
**Revisit.** After the first run (2026-11-02): check the report and real cost, then tune `--runs` and `--max-cost-usd`.

## 2026-10-29: agent-architect implemented; first improve-loop fix on fact-check
**Decision.** `plugins/agent-architect/` v0.1.0 exists: the entry skill `agent-architect` with references `bundle-conventions.md`, `eval-authoring.md` and `improve-loop.md`. It is registered in the marketplace and the README. Two changes to the design came out of the first runs (CLI 2.1.312):
- **Eval cases live in `plugins/<plugin>/evals/<skill>/<case>/`,** not in `skills/<skill>/evals/` (design section 2 and 5). The CLI refuses an eval dir inside `skills/` ("a loaded component directory"), and plugin-level `evals/` grouped by skill works with no flags.
- **No `dependencies` in plugin manifests.** An eval run installs nothing else, so a plugin with `dependencies` fails to load (`dependency-unsatisfied`) and its skills are missing. A case-level `plugins:` list cannot add sibling plugins (outside the containment root). `research` and `agent-architect` now state their requirements in the README only. This was also a hidden cause in the first smoke run: the research plugin likely never loaded.

**First improve-loop run (fact-check trigger).** 17 trigger cases for the three research skills (3–4 should-trigger in Turkish and English, 2 near-miss should-not-trigger per skill), all with free `tool_used` graders. Setup: `--runs 1 --ablation none --model sonnet`.
- Baseline 15/17. Failing: `tr-brain-ten-percent` and `en-misattributed-quote`. Both are well-known myths the model answers from memory; news and rumor cases already fired.
- One edit: the `fact-check` description now says to use it for well-known myths, famous quotes and popular science "facts" that seem answerable from memory, and lists more Turkish question forms.
- Gate 17/17, no regressions, including the near misses (`"Herkez" mi doğru yazılır`, `Bu Python kodu doğru mu?`). Recorded in `evals/<skill>/HISTORY.md`.
- Cost: about $0.94 + $1.13 API-equivalent for the two suite runs, about $0.4 for agent-architect smoke runs.

**Why.** The design's eval plan, measured on the real CLI. With `--runs 1` a single pass is a weak signal; the weekly run with more runs will show whether the trigger is stable.
**Revisit.** After the first weekly run. If `tr-brain-ten-percent` flips back, consider skill-creator's description optimization.

## 2026-10-29: agent-architect design approved: bundles, skill-creator, eval-gated improvement
**Decision.** The design is in [docs/design/agent-architect.md](design/agent-architect.md). The main points:
- **Bundle model.** Each domain is a plugin made of an agent with a defined job, its domain skills preloaded through `skills:`, and a thin entry skill in the main thread that talks to the user. When an agent needs a decision, it returns `needs_input` with questions; the entry skill asks the user and continues the same agent with `SendMessage`.
- **Scope.** agent-architect is general purpose (health, research, games, dev). It takes no part in pre-production and makes no stack decisions. Per-project agent loops go to a separate future `project-loop-architect`.
- **Writing and evals.** The main thread writes the files with `prompt-craft` loaded. agent-architect builds on Anthropic's `skill-creator` for writing cases and iterating, and uses `claude plugin eval` (same case format) for regression runs. It prefers free graders, and uses an `llm` rubric only for quality.
- **Improve loop.** Each fix goes through these steps: reproduce the failure as a case, take a baseline, make one edit, then gate it. The edit is accepted only if the new case passes and nothing that passed before fails. Stop after 3 attempts. The user approves every change.
- **Weekly evals.** A local scheduled task runs the full suites in the 8 hours before the weekly quota resets. It reads the real reset time and re-times itself if the time moves. It keeps a 10% reserve, and it only reports; it never edits prompts.
- **DSPy/GEPA: Hold.** They need API billing and labeled datasets, and they don't fit agentic skills.

The Claude Code CLI (v2.1.312) was installed through npm the same day, and `claude plugin eval` is available.
**Why.** The Antigravity version simulated optimization and never measured anything. The [radar](../research/radar/2026-10-29-agent-skill-design-and-evals.md) found that eval-gated, one-edit-at-a-time loops are what avoids overfitting. Building on skill-creator reuses official machinery instead of rewriting it. Running the evals before the reset spends quota that would otherwise be lost.
**Revisit.** After the first weekly eval run: calibrate the budget, and check whether the task re-timed itself correctly.

## 2026-10-29: agent-architect is the self-improvement loop
**Decision.** `agent-architect` will be the way new agents and skills get made, and the way existing ones get improved. It replaces the Antigravity `agent_architect`, which did not work well there. The intended flow, as the user described it:
1. The user starts the `agent-architect` skill. It brainstorms with the user and produces a design for the new agent or skill. The user approves the design.
2. It dispatches `web-researcher` (or uses `ai-engineering-radar`) to find out how leading companies and practitioners build that kind of agent or skill, and what current best practice is.
3. It writes a proper brief and hands the build to an agent that uses `prompt-craft` to write the files.
4. The same loop applies to the setup itself. In Antigravity, the user improved agent_architect and the researcher by having them research and rewrite themselves.

Later scope: setting up project-specific agent loops, meaning per-project agents, rules, and tech-stack decisions. This overlaps with the planned pre-production pipeline and `stack-selection`, so the boundary between them gets decided in the design session.
**Reference.** The old version is in `C:\Users\Eren\.gemini\config\agents\agent_architect.json` and `C:\Users\Eren\.gemini\config\plugins\agent-architect`. Use it to recover intent, not as text to port (see "New repo, Antigravity setup retired").
**Why it is recorded now.** The 2026-10-28 conversation that set up this repo was deleted, and it had covered this plan. Only two auto-memory notes from it survive, in `~/.claude/projects/C--Users-Eren-AppData-Roaming-Claude-scratch-workspaces-…/memory/`. The plan above was rebuilt from those notes and from the user's description. It is also why decisions go into this file: a deleted conversation should not take a plan with it.
**Self-improvement needs measurement.** "Improved" should mean better on eval cases, not only "rewritten by a newer prompt". So `agent-architect` should write eval cases together with each skill it builds (see the README's "Measured, not assumed").

## 2026-10-28: Fact-checkers are leads, and teyit.org is excluded
**Decision.** In every research task, a fact-checking organization's verdict is a lead and not evidence. The researcher follows it to the primary sources and judges from those. `fact-check` no longer names specific fact-checkers. teyit.org is on an excluded-sources list in `web-researcher.md`, by the user's choice. That list is the one place to add or remove excluded sites.
**Why.** The user does not trust teyit.org. More generally, any fact-checker can frame a topic in its own way, and a verdict that rests on primary evidence holds up no matter who did the fact-check.
**Revisit.** If the exclusion causes "Not verified" results on Turkish claims where teyit.org was the only place the primary sources were collected.

## 2026-10-28: Research playbooks as skills in the research plugin
**Decision.** `purchase-research`, `tech-howto`, and `fact-check` are skills in the `research` plugin. Each defaults to one `web-researcher`, and deep mode runs only when the user asks, after a quota warning. Descriptions include Turkish trigger phrases so they fire on Turkish requests. Each skill ships its own delegation brief and a Turkish output template.
- `purchase-research`: asks need and budget first. Checks measured reviews and long-term owner complaints separately, plus failure points, same-price alternatives, Turkey price (Akakçe/Cimri), and Turkey warranty. Outputs a decision matrix and who should or should not buy.
- `tech-howto`: pins the exact version first, prefers official docs, vets community scripts, and gives a backup and rollback per step. It never runs state-changing commands unasked.
- `fact-check`: SIFT method, claim split into parts, traced to the original. Verdicts: doğru / yanıltıcı / yanlış / doğrulanamadı.

**Brief smoke test (`fact-check` brief, claim "humans use 10% of the brain").** A hand-written brief from the skill's template went to one researcher (about 20k subagent tokens). The Skill tool was not used, so this does not test triggering or the Turkish output step. The report fit the brief: per-part verdicts, an original-source trail, and an honest "Not verified" list. Weak spot: it leaned on Wikipedia for the origin trail and did not read the primary texts (James 1907, the 1929 almanac, the 1936 Carnegie foreword). If this repeats in real use, require reading the primary source before settling an origin claim.
**Why.** These are the recurring research jobs in the open-items list, and a playbook per job keeps source standards consistent while the quota stays low.
**Revisit.** After each skill's first real use (see the open item).

## 2026-10-28: Model and effort per kind of work
**Decision.** Fable is not used: on the Pro plan it bills usage credits.

| Work | Model | Effort |
| :- | :- | :- |
| Development conversations (brainstorm, plan, implement) | `opusplan`: Opus 5.5 in plan mode, Sonnet 5.5 while executing | medium. Use high for architecture and pre-production decisions |
| Health conversations | Opus 5.5 | high |
| Quick questions, small edits, general chat | Sonnet 5.5 | low or medium |
| `research:web-researcher` subagent | `sonnet` (set in the agent file) | medium |
| Bulk lookups and file sweeps (ad hoc subagents) | `haiku` | low |

**Note.** The desktop app's model picker rejects `opusplan` ("unsupported model"). It only works in the CLI (`claude --model opusplan`). In the desktop app, do the same thing by hand: use Opus 5.5 while brainstorming and planning, and switch to Sonnet 5.5 in the picker once the plan is approved.
**Why.** Opus reasons best and is the Pro default, but it uses quota fastest. `opusplan` puts Opus where judgment matters (planning) and Sonnet where volume is (execution). Health conversations are rare, and careful reasoning matters more there than cost.
**Revisit.** At the usage review, using ccusage data.

## 2026-10-28: Usage tracking with ccusage
**Decision.** `ccusage` is installed globally through npm. It reads local Claude Code logs, and the old Antigravity logs too.
**Why.** It shows per-day, per-model, and per-session token use, which is the data needed to tune model and effort choices. Cost columns are API-equivalent prices, not Pro charges. Use them to compare, not as a bill.

## 2026-10-28: Code intelligence and memory tools
**Decision.** The built-in tools are the default (agentic search, CLAUDE.md, auto-memory, and in-repo spec/ADR docs). CodeGraph goes to Trial on the UE5 project only. Serena is Assess, not installed. `mcp-memory-service` is Hold: it is not migrated from Antigravity.
**Why.** See [radar entry](../research/radar/2026-10-28-code-intelligence-and-memory.md).
**Revisit.** 2027-01-28, or after the CodeGraph trial.

## 2026-10-28: Where memory and decisions live
**Decision.** There are three layers:
- `~/.claude/CLAUDE.md`: a short profile and working style, loaded in every session.
- This file: setup decisions and open items, versioned and public.
- Obsidian vault: personal data (health) only.

Claude's auto-memory is a per-folder convenience, not the source of truth.
**Why.** Conversations and per-folder memory disappear when sessions are deleted. Git history doesn't, and CLAUDE.md loads automatically.

## 2026-10-28: Enforcement through hooks, not capitalized rules
**Decision.** Mandatory behavior is enforced by hooks in the plugins. Subagent briefs need `<objective>`, `<context>`, `<done_when>`, and `<output_format>`. WebSearch runs only inside subagents. Both policies are re-injected at session start and after every compaction.
**Why.** Instruction-only rules fade in long sessions. Hooks run as code, so the model cannot skip them.

## 2026-10-28: Research is quota-aware
**Decision.** `ai-engineering-radar` defaults to quick mode: one researcher. Deep mode (2–4 parallel researchers) runs only on request, or when a decision is expensive to reverse.
**Why.** The Pro plan quota. The quick-mode radar used about 67k subagent tokens, while a 4-agent fan-out costs roughly 4×.

## 2026-10-28: New repo, Antigravity setup retired
**Decision.** `RaijuMounun/ai-playbook` (public) replaces the archived `RaijuMounun/skills`. The Antigravity prompts are rewritten from scratch, not ported.
**Why.** The old prompts relied on simulated mechanisms ("run DSPy compilation") and on capitalized rules. Claude 5 models follow plain, reasoned instructions better. A full backup of the old repo and the Cannaville-studio files is in `C:\Users\Eren\.gemini\config\_archive`.
