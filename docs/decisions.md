# Decision log

Decisions about how this AI setup works, newest first. Each entry records what was decided, why, and when to revisit. Detailed evidence lives in `research/radar/`. Add an entry whenever a choice is made, and don't rewrite old entries: supersede them with a new one.

## Open items

- [x] **Live-test the hooks** (done 2026-10-28): WebSearch from the main thread was denied, and an Agent spawn without brief sections was denied. SessionStart injection was confirmed earlier the same day.
- [ ] **CodeGraph trial on Cannaville (UE5).** Ask the same 2–3 architecture questions with and without CodeGraph, and compare token use in `ccusage session`. Decide Adopt or Hold.
- [x] **Build research playbooks:** `purchase-research`, `tech-howto`, `fact-check` (written 2026-10-28).
- [ ] **Review the three new research skills on first real use.** `purchase-research`, `tech-howto`, and `fact-check` are not properly tested yet: no eval cases, and triggering from a Turkish request has not been checked. The 2026-10-28 `fact-check` run tested only a hand-written brief, not the skill itself. On each skill's first real use, check: did it trigger, did it ask the right questions first, did it stay at one researcher, and did the output follow the template? Write the result here and fix the skill. Add eval cases after that, as the README's "Measured, not assumed" principle requires. Trigger cases exist since 2026-10-29 (17, all pass); process, structure and quality cases are still missing.
- [ ] **Build `health-evidence`**, together with a `health-coach` plugin.
- [ ] **Usage review around 2026-11-28:** run `ccusage daily` and `ccusage monthly`, then tune model and effort assignments.
- [x] **Design `agent-architect`** (approved 2026-10-29): [docs/design/agent-architect.md](design/agent-architect.md).
- [x] **Log in to the Claude Code CLI** (done 2026-10-29, Pro subscription). A one-case smoke test of `claude plugin eval` worked: 11 s, $0.06 API-equivalent.
  - **First finding.** The Turkish prompt "İnsanların beyninin sadece %10'unu kullandığı doğru mu?" did **not** trigger `fact-check`; the model answered from memory in one turn. Fixed 2026-10-29 through the improve loop (see "agent-architect implemented").
  - **Smoke test setup.** `--eval-dir`, `--runs 1`, `--ablation none`, `--no-publish`, and a `tool_used` grader with `tool: Skill`, `input_match: fact-check`, `min: 1`.
- [x] **Implement `agent-architect`** (done 2026-10-29): plugin v0.1.0, its smoke cases pass 5/5, and the research skills have 17 trigger cases. See the entry "agent-architect implemented".
- [x] **Turn on `agent-architect` locally** (done 2026-10-29, `enabledPlugins` in `~/.claude/settings.json`). Takes effect in new sessions.
- [x] **Weekly eval schedule** (done 2026-10-29): cloud routine `weekly-evals` plus the desktop task `weekly-evals-drift-check`. See the entry "Weekly evals run in the cloud". First run Monday 2026-11-02 around 15:00 Turkey time; check its report and calibrate the budget.
- [ ] **Checks left from design section 8:** does `SendMessage` continuation work from inside a skill-driven flow (first test when a bundle with an agent is built); does the drift-check task get `get_usage` and `RemoteTrigger` without pausing for permission (click "Run now" on it once in the Scheduled tab to approve its tools).
- [ ] **Trigger stability.** The 2026-10-29 results are one run per case. The first weekly run should use `--runs 3` on the research suite to see whether `tr-brain-ten-percent` and `en-misattributed-quote` fire reliably.
- [ ] Later, optional: add a LICENSE file. `claude plugin validate` passes, but the official plugin directory would refuse a submission without one. Not needed for local use.
- [x] **Test a cloud eval run once** (done 2026-10-29): the cloud can run evals, but cannot read the reset time. See the entry "Weekly evals run in the cloud".
- [ ] **Remote work from the phone:** decide between Remote Control into this machine and cloud sessions on the GitHub repo.
- [ ] Later: `game-research`, `stack-selection`, `market-research`. Then the pre-production pipeline, kept separate from a per-feature spec/ADR development loop. `project-loop-architect` (per-project agent loops) is a separate tool, designed on its own.

---

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
