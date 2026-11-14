# Decision log

Decisions about how this AI setup works, newest first. Each entry records what was decided, why, and when to revisit. Detailed evidence lives in `research/radar/`. Add an entry whenever a choice is made, and don't rewrite old entries: supersede them with a new one.

## Where things stand (updated 2026-10-29)

Read this first in a new conversation. It is the short version of everything below.

- **What exists.** Four plugins. `question-writer` is for the user's father and runs in Cowork (entry of 2026-11-11). The other three are enabled locally from this checkout:
  - `prompt-craft`: the brief template, plus hooks that reject subagent briefs without `<objective>`, `<context>`, `<done_when>`, `<output_format>`.
  - `research`: the `web-researcher` agent and four skills (`ai-engineering-radar`, `purchase-research`, `tech-howto`, `fact-check`). A hook blocks WebSearch in the main thread.
  - `agent-architect`: builds new agent/skill bundles and improves existing ones through an eval-gated loop. Design in [design/agent-architect.md](design/agent-architect.md).
- **What is measured.** Trigger evals only: 17 cases for the research skills and 5 for agent-architect, all passing (one run per case). Nothing yet checks whether a skill or agent does its job well once it fires. Closing that gap is the work in progress: agent-architect now has 6 job-quality cases, went from a 5/10 baseline to 9/10 after one improve round (see Next, item 1). web-researcher and the research skills come next.
- **What runs on its own.** The cloud routine `weekly-evals` runs every eval suite on Mondays, 1 hour before the weekly quota reset, and writes a report to the `eval-reports` branch. The desktop task `weekly-evals-drift-check` runs daily on Haiku, moves the routine if the reset time moves, relays new reports, and collects new web-researcher reports to `~/.claude/research-log/`.
- **Where it is going.** agent-architect becomes trusted, then the existing agents and skills go through it, then it builds the pre-production pipeline, first used on a TÜBİTAK 2209-A research proposal (entry "Roadmap to the pre-production pipeline").
- **How to work.** One hub conversation per phase, with sub-sessions for separate jobs. Start a hub with the prompt in [handoff.md](handoff.md). Every decision and open item goes into this file before a conversation ends, because conversations can be lost (the 2026-10-28 setup conversation was deleted).

## Open items

### Next, in this order

1. **Self-improvement round for `agent-architect` and `web-researcher`.** The goal: both get better at their jobs before they build anything new.
   - **Why eval cases first.** "Read your own prompt and improve it" without measurement is what failed in Antigravity: a rewrite looks better but nobody knows if it is. So the round starts by writing job-quality cases (does the agent do its job well, not only does it trigger), takes a baseline, and only then runs the improve loop: one edit at a time, accepted only if nothing that passed before fails.
   - **`agent-architect`.** Cases from its own job: does it ask the intake questions, produce a design for approval before writing files, research current practice (through `ai-engineering-radar`), write eval cases with what it builds, and follow the improve loop. Its research on current prompting and agent-design practice happens inside this round.
   - **`web-researcher`.** Measured from real tasks instead of extra test searches (see the entry "web-researcher is measured from real tasks"). Its first real reports get graded against its own standards, and failures become fixed cases.
   - **Quota.** Give the user an estimate before each run. Default to one agent; stop after 3 attempts per fix.
   - **Status (2026-10-29).** Case plan approved (entry "Job-quality eval plan for agent-architect and web-researcher"). Step a, done: the agent-architect cases are written and the baseline is 5/10 (entry "agent-architect job-quality baseline"). Step b, done: the improve loop took the suite to 9/10, waiting for the user's approval to commit (entry "agent-architect improve round 1"). Confirmed locally at `--runs 3` on 2026-11-02 (29/30 runs; only `tr-no-unmeasured-rewrite` 2/3, the skill did not fire once). The trigger for "improve your own prompt" was fixed on 2026-11-03 (entry "agent-architect fires on ..."), so the bundle is trusted. Step c: the web-researcher collection script and its first two cases (no run without approval). The two existing real transcripts were copied by hand to `~/.claude/research-log/2026-10/` on 2026-10-29, so the 30-day cleanup can't delete them before the script exists. Do step c after the quota resets.
   - **Step c status (2026-11-02).** Done: the collector script (`plugins/research/scripts/collect-research-reports.js`; on 9 real runs, 5 fail the word budget) and the first two cases (`word-budget-fact-check`, `word-budget-radar`). Research-plugin baseline 17/19 ($2.48). The improve loop stopped after three rejected attempts on the agent's own prompt (see `plugins/research/evals/web-researcher/HISTORY.md`): prompt-only length rules shrink reports (969 to about 670 words) but don't bring them under budget, because the model can't count its own words without a tool, and eval runs can't grant Bash on native Windows. The user chose (a), enforcement outside the agent's prompt, built as a `SubagentStop` hook: suite 19/19 (entry "web-researcher word budget is enforced by a SubagentStop hook"). The collector runs daily as step 5 of the desktop task `weekly-evals-drift-check` (since 2026-11-02; first run collected 9 reports, 5 over budget, all from before the hook).
2. **Job-quality evals for the research skills** (`purchase-research`, `tech-howto`, `fact-check`, `ai-engineering-radar`). **Status (2026-11-03):** 8 cases written and baselined at 4/8 (entry "Job-quality baseline for the four research skills"); the improve loop then fixed two of the four (6/8, entry "Improve loop on the research baseline"); `tr-howto-rollback-per-step` and `tr-brain-myth-verdict` remain. Triggering is covered (17 cases). The original gap was: does the skill ask the right questions first, stay at one researcher, and follow its output template. Write these as cases in `plugins/research/evals/<skill>/`, preferring free graders (tool use, structure) and using an `llm` rubric only for quality. The first real use of each skill also counts: check those same points, record the result here, and turn failures into cases.
3. **Question-writing plugin for the user's father** (added 2026-10-30; not now, but fairly high priority, before the "Later" items). He writes questions for student test books, including skill-based questions ("beceri temelli sorular"), which take study to prepare. He uses some general AI tool now; the goal is a proper Claude plugin that makes this easier. Build it with `agent-architect` (create mode). Notes for that build:
   - **Shape the user wants (2026-10-30).** A bundle, not one skill: a separate skill per question type (skill-based questions and the other types he writes), each with its own reference documents, plus an agent that can spawn subagents and pick the right skill. Use whichever surface supports that.
   - **Delivery surface first.** He is not a developer, so the Claude Code terminal is likely the wrong place. Research which non-developer surface (the Claude desktop app's Cowork, claude.ai with uploaded skills, or the desktop app's Code tab) runs a plugin with several skills, reference files and subagents, and which plan he needs. Don't assume: claude.ai skills may not support subagents.
   - **Intake with him, not about him.** Subjects and grade levels, which exams or books (LGS, YKS, school level), which question types, how many per session, and the output format he hands to the publisher (Word is likely).
   - **Research before design** (one `web-researcher`): what MEB means by skill-based questions under the current curriculum (Türkiye Yüzyılı Maarif Modeli skill definitions), how such a question is built (a context or stimulus, the question stem, the correct answer, distractors), and common quality rules.
   - **What the skill does.** From a learning outcome ("kazanım") and a context, draft the question, the answer, and distractors with a reason for each. Then run a checklist: exactly one correct answer, plausible distractors, no clue in the wording, language fit for the grade, and the outcome actually tested.
   - **Evals from his judgment.** His own good past questions become the style reference, and he grades the first outputs. Those grades become the eval cases, the same way web-researcher is measured from real tasks.
   - **Privacy and copyright.** His examples and publisher material stay out of this public repo. They live in a private place he or the skill reads at runtime, the same rule as personal data.
   - **Status (2026-11-11).** `question-writer` v0.3.0, all 15 cases pass (entries "question-writer built for Cowork", "v0.2.0" and "v0.3.0"). His intake is complete. Next:
     - Install it on his PC with him (Cowork, his own Pro plan).
     - Copy his example booklets into `Soru Yazarlığı/ornekler/` there.
     - Run his first real set. He grades it item by item, and recurring failures become synthetic cases.

4. **Code and test quality tooling** (added 2026-10-30). The user asked for Anthropic's own tools first, then Superpowers. Current practice: run the built-in `/code-review` skill on new code (first used on the TÜBİTAK project's feature code, 10 findings), and measure test quality with mutation testing (it changes the code on purpose and checks that some test fails). On native Windows use `cosmic-ray`: `mutmut` 3 doesn't support Windows. Lessons from the first run (2026-11-01): run `cosmic-ray baseline` first, and check that no result is `INCOMPETENT`. The first run reported "0 surviving mutants" while all 936 were INCOMPETENT, because the tests never started. On Windows the test command must be the venv's `pytest`, not `python -m pytest`: the venv's python.exe hands off to the system Python. Set `PYTHONIOENCODING=utf-8` before the run: with the Turkish code page, cosmic-ray can't decode pytest's output and reports killed mutants as INCOMPETENT. Expect about an hour for roughly 900 mutants. The TÜBİTAK project went from 71% to 87% killed after one round of new tests. Superpowers (obra/superpowers, TDD and debugging skills) is not installed; assess it with `ai-engineering-radar` before adding it, since it overlaps with agent-architect and prompt-craft.

### Waiting on a date or an event

- **Second weekly eval run, Monday 2026-11-09.** The first run's report never reached GitHub (entry "The weekly report could not be pushed"); fix the GitHub access first. Then read the report on the `eval-reports` branch (`evals/reports/2026-11-09.md`) and the real cost. Then tune `--runs` and `--max-cost-usd` in the routine. The same run shows **trigger stability**: the 2026-10-29 results were one run per case, and `tr-brain-ten-percent` and `en-misattributed-quote` were the two that failed before the fix. If either flips back, consider skill-creator's description optimization.
- **Drift-check on Haiku.** The user switched its model to Haiku 4.5 on 2026-10-29 (it was Opus 5.5 by default). Check that the next run (2026-10-30, 10:00) still reads `resetsAt` and the routine. Haiku 5.5 is newer; use it if the Scheduled tab offers it.
- **Drift-check's reschedule step is untested.** Its one manual run (2026-10-28) succeeded without permission prompts, and the task is in auto mode. But changing the routine's cron has never happened yet, and auto mode can be stricter on actions that change things outside the PC. The first time the reset time moves, check that the update went through.
- **`SendMessage` continuation from inside a skill-driven flow** (design section 8). First test when a bundle with an agent is built, for example `health-evidence`.
- **Usage review around 2026-11-28.** Run `ccusage daily` and `ccusage monthly`, then tune the model and effort assignments.

### On hold

- **CodeGraph trial on Cannaville (UE5).** Cannaville is not on this PC (only on GitHub) and not in active work. Run it when work on Cannaville or another large C++ project resumes: ask the same 2–3 architecture questions with and without CodeGraph, compare token use in `ccusage session`, decide Adopt or Hold.

### Later

- **health follow-ups.** Run the first protocol check on the existing vault protocols. (Done 2026-11-13: `HEALTH_VAULT` set, health enabled locally, `saglik-vault` has `.claude/settings.json` and a `CLAUDE.md` for cloud sessions. Obsidian Git is not needed: only Claude edits the vault, with pull before reading and push after writing, recorded in the global CLAUDE.md.)
- `game-research`, `stack-selection`, `market-research`. Then the pre-production pipeline, kept separate from a per-feature spec/ADR development loop. `project-loop-architect` (per-project agent loops) is a separate tool, designed on its own.
- Optional: a LICENSE file. `claude plugin validate` passes, but the official plugin directory would refuse a submission without one. Not needed for local use.

### Done

- 2026-11-13: `health` plugin (`health-coach`) built, 12/12; health vault pushed to private `saglik-vault`.
- 2026-10-28: hooks live-tested (main-thread WebSearch denied; a brief without sections denied; SessionStart injection works).
- 2026-10-28: research playbooks `purchase-research`, `tech-howto`, `fact-check` written.
- 2026-10-29: `agent-architect` designed, approved, implemented (v0.1.0), and enabled locally.
- 2026-10-29: Claude Code CLI logged in (Pro subscription); `claude plugin eval` works locally and in the cloud.
- 2026-10-29: first improve-loop fix: the `fact-check` trigger went from 15/17 to 17/17.
- 2026-10-29: weekly eval routine and drift-check task set up.
- 2026-10-29: phone access decided (Remote Control when the PC is on, cloud otherwise).

---

## 2026-11-14: health-coach v0.2 after the first real use, 17/17

**Decision (user: "do all of them, in order").** Read the first real health session (shampoo, hair loss, finasteride). It answered a treatment choice, side-effect rates and a disagreement with the user's dermatologist from memory under one blanket "Güçlü" label, and offered research only at the end. It also missed EMA's 2025 finasteride referral (suicidal ideation added as a side effect). Four improve-loop rounds:

1. Treatment choices, side-effect rates and anything that agrees or disagrees with the person's doctor are always research, done before answering; evidence labels are per claim. New regression case; grader clarified: "no dose" means no dosing instruction, naming a studied strength is allowed (`tr-drug-dose` stays strict).
2. New topic files with sources opened by one sonnet researcher: hair, smoking (ALO 171), sexual health, mental health (112; no national 24-hour crisis line confirmed), heart (ESC 2024 aortic). Three safety cases; they passed at baseline, so they are regression tests, not proof the files help.
3. The suicidal-thoughts case passed 1/3: the skill did not fire and the base model added supplement advice. The description now covers mood, self-harm, smoking and sexual health: 3/3.
4. `Takip.md` follow-up list in the vault: due items are mentioned first, and timed actions are offered for the list. 0/2 to 2/2.

Also found: the red-flag case.yaml had not parsed since 2026-11-13 (unquoted colon), so the earlier 12/12 had not covered it. Gate runs cost about $5 in total. A 5-hour usage limit stopped one gate and one researcher mid-way; both were rerun.

## 2026-11-13: health plugin with one `health-coach` skill; the health vault becomes a private repo

**Decision (user).** The health assistant is `plugins/health/` (v0.1.0): one entry skill `health-coach`, no agent of its own. Design: [design/health.md](design/health.md), approved the same day. Built through agent-architect's Create flow.

**Shape and why.** One skill with topic reference files (nutrition, exercise, sleep, oral, skin, labs) instead of a skill per topic: one trigger point, one eval suite, and a new topic is one file (the user's choice). Research goes to the existing `research:web-researcher` (sonnet), one per question and only for contested, recent or person-specific questions; settled answers come directly with an evidence label. A health agent would add a subagent context per question, too costly on Pro. Topic files hold method and sources, not facts, because health guidance goes out of date; facts are researched live and cited only when opened. If `research` is not installed, the skill researches with WebFetch itself.

**Rules from the research.** Bean et al. (Nature Medicine, 2026) and a BMJ Open audit (2026) show chatbot health advice fails through made-up references, agreeing with the user's framing and missed red flags. So: red-flag check first (112; ALO 184 is not an emergency line), premise check, no doses, evidence labels mapped to GRADE (Güçlü/Orta/Sınırlı/Belirsiz), cite only opened sources. Two sonnet web-researcher runs: one on practice and failure modes, one that opened and verified every topic source (ACSM's 2026 resistance-training stand replaces 2009; ESC/EAS 2025 update; ADA 2026).

**Vault.** The user chose to push the whole health vault, family profiles included, to the private repo `RaijuMounun/saglik-vault`, so cloud sessions can use it. The skill finds the vault from the working directory, then `HEALTH_VAULT`, then asks; no path is in the plugin. Researched answers are saved to `06_Arastirmalar/` only after the user says yes.

**Measurement.** 12 cases. First run 9/12 ($0.77): the red-flag and premise cases did not fire the skill, and the research case could not dispatch web-researcher in the isolated run. Fixes: description covers symptoms and belief checks; WebFetch fallback; the research case grades either path with an `llm` trace grader and gets 15 turns. Second run 10/12 ($0.62), research case rerun 1/1 ($0.14). Accepted gap: Sonnet answers chest pain with "call 112" directly without the skill, which is the safe result, so that case grades the outcome only. Final: 12/12 on the current graders.

## 2026-11-11: question-writer v0.3.0, pictures and template settled by him

**Decision (user's father, relayed).**
- **Pictures.** He finds a stand-in picture on the internet, and the publisher prepares the final one. Every picture slot now gets a placeholder with three parts: what the picture must show, Turkish search words ("Aranacak"), and "Yayınevi için", the details the final picture must keep so it cannot change the answer.
- **Template.** The publisher has no Word template, and he writes into a blank document. His own booklet layout is the output format, and `sablon.docx` is dropped from the work folder.

**Measurement.** New case `picture-placeholder`. It first failed because the placeholder format was only in `question-set`'s reference, which `visual-item` does not load. The format was then written into `visual-item`'s SKILL.md, and the visual cases now pass 3/3. `guides-first-setup` passes 1/1. The suite is 15 cases. Cost about $0.5.

## 2026-11-11: question-writer v0.2.0, corrected by his real booklets, 14/14 cases

**Decision (user).** Four changes after reading his drafts of three 2026-2027 practice booklets (grades 2-4) and the publisher's print-approval PDFs. These stay on the user's PC and go into his work folder, never into this repo:

1. **Two curricula at once.** Grade 4 still uses the 2019 program's kazanım codes (`T.4.3.28.`, no process components), and grades 2-3 use Maarif codes (`T.O.3.3.b)`). Codes are used as given, never converted.
2. **Outcomes may repeat.** The publisher's lists reuse broad outcomes. "A different outcome per question" stays the goal. A repeat needs his agreement and a different item type.
3. **His layout.** Title line; shared-stimulus line; "<n>. stem"; the key as the letter three times ("BBB") under the stem; the options; the outcome code with its text. There is no answer-key table, because the publisher makes its own.
4. **Item types.** A new reference, `item-types.md`, lists the types he writes (spelling, punctuation, word cards, dialogue gaps, brochures and others) without copying his items.

**Pictures.** `ayarlar.md` now records who prepares them: a short "[GÖRSEL: …]" note if he places them himself, the full illustrator brief otherwise. Still to ask him.

**Measurement.** New case `grade4-old-program-code`, and a key-marker grader on `item-quality-grade2`. The first full run scored 12/14. Both failures were the judges not knowing the "CCC" key convention, so the rubrics now explain it and the skills were not changed. The rerun of those cases passed, so the suite is 14/14. Cost about $1.25.

**Revisit** when grade 4 moves to Maarif, expected 2027-2028 but not verified.

## 2026-11-11: question-writer built for Cowork, 13/13 cases

**Decision (user).** The question-writing plugin for the user's father is `plugins/question-writer/` (v0.1.0). Design: [design/question-writer.md](design/question-writer.md), approved the same day. Research: [radar 2026-11-11](../research/radar/2026-11-11-meb-skill-based-items.md), one sonnet web-researcher, about 46k tokens.

**Who uses it.** He writes 15-question sets of new-generation multiple-choice items in Turkish for grades 2-4, for kazanım değerlendirme booklets and a soru bankası. Every question measures a different Maarif Modeli learning outcome. Some questions are visual or graph interpretation items. He delivers in the publisher's Word template.

**Options.** Grades 2-3 have 3 options and grade 4 has 4. These are defaults in his `ayarlar.md`.

**Delivery surface.** Cowork in the Claude desktop app, on his own Pro plan. He installs it with no terminal: Customize > Plugins > Add marketplace. claude.ai chat was rejected, because subagents do not run there ([Use plugins in Claude](https://support.claude.com/en/articles/13837440-use-plugins-in-claude), [Getting started with Cowork](https://support.claude.com/en/articles/13345190-getting-started-with-cowork)).

**Shape.**
- `question-set` is the entry skill. It leads the whole flow: work folder, outcomes, a 15-row plan he approves, drafting in groups of five, one review, and the Word file.
- `item-writing` covers one item, written by MEB's March 2026 *Bağlam Temelli Çoktan Seçmeli Soru Yazım Kılavuzu*.
- `visual-item` covers visual items. It builds tables and charts itself and writes a brief for the publisher's illustrator.
- `item-reviewer` is a sonnet agent with Read and Glob only. It solves the set blind before it reads the key.
- There are no hooks, no `dependencies`, and none of web-researcher or prompt-craft.

**Why this shape and not a skill plus an agent per question type.**
- Subagents cannot spawn subagents, so the main thread orchestrates.
- He writes one main type, with a visual variant.
- One blind review per set catches the defects that make an item unusable (two keys, a wrong key, no need for the context) at the cost of one subagent run.
- Hooks would need Node on his PC.

**He is new to AI tools (user, at approval).**
- The skills fire on everyday Turkish, with no commands.
- They lead one step at a time and use no jargon.
- They ask for what they need and offer a way forward without it.
- A missing folder is a guided step, not an error.

**Private material.** His examples, the template and the publisher's rules live in a `Soru Yazarlığı/` folder on his PC, connected to Cowork. All eval cases use synthetic items.

**Measurement.** 13 cases (`plugins/question-writer/evals/`), Sonnet, `--runs 1`, `--allow-tools Write Edit Agent`. The runs went 9/13, then 10/13, then 13/13, for about $2.5 API-equivalent in all.
- **Case fixes.** Two failures came from the cases, not the skills: a rubric read the plan's answer-letter column as an answer key, and the reviewer case gave outcome codes without their text.
- **Skill fixes:**
  - ask for the outcomes in the first message
  - argue for each distractor (a distractor on the same cause chain was a second key)
  - count the option words (the key was the longest)
  - report a wrong key first and never drop it (it was lost once in the summary)

**Open.**
- Cowork on Windows is beta. The first install on his PC is the real test of the folder flow and of Word output (the built-in docx skill or python-docx).
- Whether the 2026 program PDF replaces the 2024 one is unverified, and its text is garbled when read, so the outcomes he pastes are the primary input.

**Revisit** after his first two graded sets.

## 2026-11-08: GM helper v2 after the first played session; next game moves to full 5e classes
**Decision (user).** After the first one-shot was played, the trpg skills were improved through agent-architect's improve loop. Spec: trpg `docs/design/gm-helper-v2.md`, approved by the user. `adventure-prep` now writes `Adventure.md` as a short hub that links to separate `Scenes/`, `NPCs/`, `Locations/` and `Handouts/` notes, runs a gap check (every hook, prop and handout answers who/what/why; handouts written in full), writes the climax as an obstacle plus a final beat that still lands when the players bypass the obstacle, uses short distinct NPC names with name cards, and draws one clue-map Obsidian Canvas per adventure (node-based scenario design and the Three Clue Rule, instead of the branching "story tree" the user first asked for). `character-sheets` writes skills as "Skill (Ability) +N" and asks for a want that lasts the session with an obstacle; House Rules list skills by ability. The user also decided the next game drops the tavern jobs for full 5e classes, keeping 5e backgrounds; that change gets its own spec.
**Why.** Evidence from the session debrief: the GM had to invent missing story facts mid-game, a clever plan skipped the whole finale, players forgot old-fashioned names, one character's want was done in the first minute, the one-page adventure note was not enough at the table, the GM did not know which ability a skill uses, and the players did not much like jobs.
**Measurement.** First real runs of the hand-run cases, each a `claude -p` in a throwaway copy of the repo. Three new cases (`tr-write-from-outline`, `tr-finale-bypass`, `tr-want-and-abilities`). Baseline 4/7 (the three new cases failed), gate 7/7. Deviation from the loop, for quota: one edit per skill instead of one per finding. 14 runs in all.
**Revisit** with the full-5e spec, and if the hub keeps running past ~45 lines (one gate run was 55).

## 2026-11-05: A GM helper for tabletop RPGs lives in its own private project, not as a plugin
**Decision (user).** The user wants help as a first-time game master: a rules-light D&D 5e one-shot for 4 casual players. The helper writes adventures with the user, teaches GMing, makes character sheets, and gives quick help during play. It never runs the game. The user proposed the shape, and it was adopted: a private repo `RaijuMounun/trpg` at `C:\Users\Eren\Desktop\-\trpg`, containing a `CLAUDE.md`, four project skills (`adventure-prep`, `character-sheets`, `gm-coach`, `table-help`), no agent, and an Obsidian vault in `TRPG/` that the user reads at the table. All game content is in natural, explanatory Turkish (the whole group is Turkish), including read-aloud text, NPC lines and character sheets; only official 5e terms stay in English. Design: trpg `docs/design/gm-helper.md`, built through agent-architect's Create flow (intake, one sonnet web-researcher, design approved, cases before skills).
**Why.** Every job is a back-and-forth with the GM, so a subagent would only add cost. The skills are used in one place, the same reason as intqual's test-reviewer. The players' names and game notes stay in a private repo. The `CLAUDE.md` routing table guides skill use but does not enforce it. A hook is added only if a skill keeps being skipped. The house rules are real SRD 5.2.1 rules (CC-BY-4.0, attribution in the file), so the group can move to full 5e by adding rules. Two house rules are marked as such: tavern jobs instead of classes, and player characters at 0 HP are knocked out, not dying. The knockout rule and the DC table (10/15/20) were checked against the SRD PDF itself. The researcher had only a secondary source for them.
**Measurement.** Six hand-run cases in trpg `.claude/evals/`, because `claude plugin eval` runs plugins only. Not run yet.
**Revisit** if the group moves to full 5e, or if a second game project wants the same skills: then make them a plugin here.

## 2026-11-04: intqual gets a project-local `test-reviewer` agent
**Decision (user).** The test-review stage of the per-project loop (entry of 2026-11-03, step 3) is built first, for intqual only, in the intqual repo, not as an ai-playbook plugin: `.claude/agents/test-reviewer.md` (sonnet; Read, Grep, Glob, Bash for `cargo test`, `cargo llvm-cov` and read-only `git`; never edits files), an entry skill `.claude/skills/test-review/` with `references/checklist.md` and `references/rust-testing.md`, and known-answer cases in `.claude/evals/test-reviewer/`. Design: intqual `docs/design/test-reviewer.md`. Three modes: review existing tests, propose tests for untested code (with level: unit, loopback integration, manual `#[ignore]`), and plan tests from a spec before code.
**Why.** The user preferred a quick project-local build over a reusable bundle. Project rules are read from intqual's `CLAUDE.md` at runtime. The agent is read-only so a reviewer cannot "fix" what it should report; mutation testing is recommended (`cargo mutants --in-diff`), not run, because of its runtime.
**Research adopted** (one sonnet web-researcher, 2026-11-04): behavior-over-implementation and one-behavior-per-test rules from *Software Engineering at Google* ch. 12; hand-written fakes over `mockall` (Assess, its `#[concretize]` clashes with the project's no-`dyn` rule); `tokio::test(start_paused = true)` for timers but never with real sockets or `spawn_blocking`; loopback `127.0.0.1:0`; `cargo-llvm-cov` (works on Windows MSVC) to find gaps, never as a target (Fowler, TestCoverage). Trial: `proptest` for `packet.rs`, `insta` with ratatui `TestBackend`, `cargo mutants --in-diff`, `wiremock`.
**Measurement.** `claude plugin eval` runs plugins only, so the four cases are run by hand (dispatch with the case's brief, grade against its rubric). Results go to `.claude/evals/test-reviewer/HISTORY.md`.
**Revisit** when a second project needs a test reviewer: move the agent and `checklist.md` to an ai-playbook `test-review` bundle and keep `rust-testing.md` in the project. Then the cases can run in `claude plugin eval`.

## 2026-11-03: intqual is the first project; the per-project development loop is the next build
**Decision (user).** The first real project for roadmap step 4 is `RaijuMounun/intqual`: an existing, almost finished Rust tool. It is cloned at `C:\Users\Eren\Desktop\-\Projeler\intqual`. `homebrew-intqual` is only its Homebrew formula. Because the project already exists, it gets no full pre-production. It gets a read-only assessment instead: a current-state document and a project `CLAUDE.md`, done in its own session from a brief written here. Then comes the user's wish list.
The user also wants an automated development loop per project:
1. A feature request starts a brainstorm with the user.
2. The approved idea becomes a spec.
3. A test writer writes the tests, and a test reviewer loops with it until the tests are good.
4. A coder writes the code, and several reviewers loop with it until they approve.
5. Project-specific rules come from the project.
This is roadmap step 3, built with agent-architect's Create flow, including the research step.
**Why.** An assessment comes before the loop, because the loop needs the project's build and test commands and rules, and intqual has no tests yet. Open points for the design: how many reviewers the Pro quota allows per change, a cap on loop rounds, and where the user approves (spec and final merge at least).
**Next.** (1) intqual assessment session. (2) agent-architect Create for the loop bundle, research first. (3) The first intqual feature goes through the loop.

## 2026-11-03: Improve loop on the research baseline: 6/8 (two fixes accepted, two not)
**Decision.** Two edits are kept; two failures were not fixed and their edits were reverted after three attempts each (the loop's limit).
- **Accepted:** `fact-check` step 1 now says a prediction about the future cannot be settled by evidence: name it, dispatch no researcher, give no verdict, offer to check the factual parts (`tr-claim-is-prediction` flips, first attempt, $0.07). `ai-engineering-radar` step 1 now says that a question naming no tool, technique or decision gets one clarifying question with 2-3 directions and no researcher (`radar-vague-question` flips, first attempt, $0.04). Gate: `radar-quick-entry` still passes ($0.30). The other skills were not touched, so their passing cases were not rerun.
- **Not fixed, `tr-howto-rollback-per-step`:** by the third attempt every step had a "Geri alma" line, but the judge (three of three votes) still rejected "Gerekmez" on a read-only step and a vague undo on the provisioned-package step. The skill's behaviour improved; the rubric may be stricter than the skill's contract. Next time: decide whether a read-only step is allowed to have no undo, then fix either the rubric or the skill with one edit.
- **Not fixed, `tr-brain-myth-verdict`:** the trail improved (the original James text is now opened and read), but the science verdict still rests on a popular article, because the researcher cannot reach paywalled primary studies. Best result was one of three judge votes. Next time: check whether open-access primary studies exist for this claim, or relax the rubric to accept a reviewed secondary source.
- **Rubric review (same day):** the `tr-howto-rollback-per-step` rubric was loosened to allow a read-only step to need no undo and rerun on the unchanged skill. It still failed three of three votes, so the rubric was not the cause and the loosening was reverted. The `tr-brain-myth-verdict` rubric matches the skill's own rule (prefer the primary study or a systematic review for science claims), so it stays. Both remain real skill gaps.
- **tech-howto undo rule kept (2026-11-03, second pass, flaky):** step 3 now requires each undo as the exact command or menu path, no pointer to another step, and "Geri alınamaz" plus the exact backup (or leaving the step out) when no exact undo exists. Attempt 1 (exact command or menu path) scored 0/3; attempt 2 (adds the no-pointer rule and the one-way wording) scored 3/3 ($1.04). In the gate run the same case failed once (steps still pointed to a section below), so 3 of 4 runs in total: kept as an improvement, not a solved case. Gate: all other research cases passed except `word-budget-radar`, a known failure from the 2026-11-02 baseline (radar skill untouched). A quota limit stopped the first gate run; the 11 cases that had not run were rerun after the reset. Cost about $5.3.
- The reverted patches are in the side-session notes folder (`research-fix-2-unflipped.patch`, `research-fix-1-and-4.patch`).
**Cost.** About $2.4 for 9 runs.
**Result.** Research job-quality cases are 6/8 (the two accepted fixes added to the four earlier passes).

## 2026-11-03: Job-quality baseline for the four research skills: 4/8
**Decision.** Eight job-quality cases were written (two per skill: one cheap process case that must not dispatch a researcher, one full-flow case) and run once, one at a time at the user's request (Sonnet, `--runs 1`, `--ablation none`, `--allow-tools Write Edit WebFetch`). Total about $1.95 API-equivalent, against the $4–6 estimate. Result:
- **Pass (4):** `tr-purchase-asks-first`, `tr-purchase-full-report`, `tr-howto-asks-version`, `radar-quick-entry`.
- **Fail (4), each a skill gap to fix through the improve loop (no skill prompt was touched):**
  - `tr-claim-is-prediction`: fact-check dispatched a researcher and gave the verdict "Yanıltıcı" on a prediction, although its own step 1 says to name a prediction as not checkable.
  - `tr-brain-myth-verdict`: the trail is second hand. The report says the original texts were not read directly. Structure and the verdict "Yanlış" pass.
  - `tr-howto-rollback-per-step`: step 3 (Xbox) has no "Geri alma" line and step 4 says no official undo was found. Every step must carry its own undo.
  - `radar-vague-question`: the radar dispatched a researcher on "whatever is new in AI coding" instead of asking one clarifying question first.

**Case fixes before counting a result (the failures were the case's, not the skill's):** the first Windows version of `tr-howto-asks-version` was wrong, because the run's environment shows the local Windows build and the skill rightly skipped the question, so it asks about an Android phone instead; one prompt was too vague to fire the skill; one rubric wrongly forbade a general overview of methods. A brief grader used inline regex flags `(?i)`/`(?s)`, which the grader's JS engine rejects; `flags: i` or `[\s\S]` does it.
**Learned.** Full-flow research cases cost $0.15–0.30 each, not $1, because the word-budget hook and the quick modes keep the reports short. The `llm` judge fails three of three votes when a rubric is stricter than the skill's own contract, so write rubrics from the skill text. Results are in `plugins/research/evals/*/HISTORY.md`.
**Next.** The improve loop on the four failures, one edit each, with the suite gate. Budget about $2–3.

## 2026-11-03: agent-architect fires on "rewrite or improve this prompt" requests
**Decision.** The skill's description now also covers requests to rewrite or improve a skill's or agent's prompt or SKILL.md, with two new Turkish trigger phrases ("prompt'unu daha iyi hale getir", "SKILL.md'yi yeniden yaz"). No second trigger case was added: `tr-no-unmeasured-rewrite` already reproduces the gap.
**Why.** That case's prompt asks to make a skill's prompt better and rewrite its SKILL.md. In about a third of runs the skill did not fire, and the model rewrote the file with no measurement. Gate at `--runs 3`: the target went from 2/3 to 3/3, and the suite stayed at 29/30 runs. The one miss was `research-before-design` (judge PASS FAIL FAIL), whose judge is known to be noisy; a rerun of that case gave 3/3. Cost $2.19 + $0.19. With this, roadmap step 1 ("agent-architect is trusted") is done.

## 2026-11-03: The weekly report could not be pushed
**Finding.** The first weekly run (2026-11-02) finished (agent-architect 6/10, research 18/19, $5.92 in total), but `git push` to `eval-reports` failed with 403: the cloud has no GitHub access to `RaijuMounun/ai-playbook`. The report was lost with the cloud sandbox; the numbers are in the run log only. Its failures match the missing tool grant and the hook pushed after the clone, except `tr-no-unmeasured-rewrite`, fixed in the entry above.
**Open (user).** Install the Claude GitHub App on the repo, or reconnect GitHub at claude.ai/customize/connectors, before next Monday's run.

## 2026-11-02: weekly-evals grants Write, Edit and WebFetch
**Decision.** The cloud routine's eval command now passes `--allow-tools Write Edit WebFetch`, and its prompt says a background command's timeout must cover the 30 minutes per plugin.
**Why.** The first weekly run (2026-11-02, 12:10 UTC) ran without the grant. `claude plugin eval` warned that three agent-architect graders (`build-cases-first` 02 and 03, `tr-design-before-files` 02) cannot pass without `Write`, and the word-budget cases need `WebFetch`. That run also cloned main before the word-budget hook was pushed. So its report shows false failures for those cases; read it with that in mind. Its first try was also cut by a 10-minute background timeout and restarted. Bash stays ungranted: the cloud is Linux, but no case needs it.

## 2026-11-02: web-researcher word budget is enforced by a SubagentStop hook
**Decision.** The user chose option (a), "the caller checks the length". It is built as a `SubagentStop` hook in the research plugin (`scripts/word-budget-check.js`, matcher `^research:web-researcher$`). When the agent tries to finish, the hook reads the brief from the agent's transcript and the report from `last_assistant_message`. It counts the words with the collector's helpers, so the budget comes from `<output_format>` and the Sources list is excluded when the brief says "outside the Sources list". If the report is over budget, the hook blocks the stop and tells the agent the exact count and how many words to cut. It blocks at most twice per run, then lets the report through, and it never blocks on its own errors.
**Why.** Three prompt-only fixes failed because the model can't count its own words. A hook counts deterministically, needs no Bash grant (so it also works in eval runs on Windows), and the agent cuts its own report with its context intact, so no main-thread instruction or extra prompt-craft step is needed. Result: targets 2/2 in two runs (fact-check 727 → about 574 / 600 after one block; radar 1202 → 914 → about 882 / 900 after two), and the full research suite went from 17/19 to 19/19 ($0.70 + $0.62 + $2.30).
**Revisit if** reports start losing important findings to the cut (check with the collector), or another agent needs a budget: then generalize the matcher and the script.

## 2026-10-29: This repo records the AI setup only
**Decision (user, on the hub's recommendation).** ai-playbook stays public. `docs/decisions.md` and `docs/design/` cover the AI setup only: plugins, models, evals and workflow. Each project's decisions, topic and research go in that project's own **private** repo, and personal data stays in the Obsidian vault. Until the 2209 project repo exists, its notes live in `~/.claude/research-log/2026-10/`.
**Why not gitignore `docs/`.** Already-pushed content stays in the git history. An ignored file has no backup, and that is the loss this log exists to prevent. Cloud sessions and the weekly routine also work from the repo, so they would not see it.
**Note.** Earlier commits still show the project topic in the history. That is accepted as low risk; removing it would need a history rewrite and a force-push.

## 2026-10-29: Roadmap to the pre-production pipeline, with a TÜBİTAK 2209 project as the first real use
**Decision (user).** agent-architect is the blocker for everything after it, because every future project's setup goes through it. The order:
1. agent-architect is trusted: confirmed at `--runs 3`, and its open trigger gap is fixed.
2. The existing agents and skills go through it.
3. agent-architect builds the pre-production workflow (agents, rules, flows).
4. The first project goes through that workflow.

The first project is a TÜBİTAK 2209-A research proposal (an ML project). Its topic and decisions are project material, so they live in the project's own private repo (entry "This repo records the AI setup only").

**Steering (hub's recommendation).**
- **Step 2 is evidence-driven, not "rewrite everything".** First web-researcher (collection script plus cases) and the research skills' job-quality evals. A research proposal leans on literature research more than anything else. prompt-craft only if a real failure shows up.
- **Step 3 is built against this real project.** It gets a shared pre-production core, plus a research-proposal track built first, because there is a real case to measure it on. Its real tasks become its eval cases. A generic pipeline designed with no real use to test it would be built blind.
- **The tooling must not eat the project's deadline.** If the 2209 deadline is close, the proposal work starts with the existing tools in a hub, and the pipeline is extracted from what that work needed.

**Verified 2026-10-29** by web-researcher from the official 2026 call: the deadline is 2026-11-11 17:30 (TYBS), with the advisor's approval in the same window. A summary is in `~/.claude/research-log/2026-10/2026-10-29-tubitak-2209a-call.md`. It moves to the project repo once that exists, since it is project material, not setup.
- Constraints that shape the tooling: TÜBİTAK's generative-AI responsible-use guide applies, and the advisor checks AI-produced content. So the AI assists (research, critique, structure), and the student writes and owns the text.
- **First real web-researcher grade.** Sections, dates and tiers are present; primary sources are used; the "Not verified" list is honest and it said plainly that it found no second source. It ran over its 900-word budget. That is a failed check, so it is a candidate for its first fixed case.
- **Second real report** (the novelty check, same day). Same result: strong primary-source work and an honest "Not verified" list, but it ran over the word budget again, even though the brief asked it to count. This is a reproducible failure; the first web-researcher case targets it.
- **Third real report** (a narrow legal-text verification, 2026-10-30, Sonnet, about 53k tokens, 34 tool calls). It stayed within the 400-word budget. The difference from the first two: the brief told it how to count (write the draft to a temp file and run `wc -w`), not only to count. It also kept to primary sources, quoted each article, and listed what it could not verify. One success doesn't fix the failure: keep the word-budget case, and test whether adding that "count with a tool" instruction to the agent's own prompt makes it pass.
- **Fourth and fifth real reports** (2026-10-30 budget/Colab check, 450 words: within budget; 2026-11-02 reference and DOI verification, 700 words: it counted 710 with `wc -w` including table pipes and said so). Both were briefed with the same "count with a tool" instruction. Corrected 2026-11-02 by the collector's exact count (Sources excluded where the brief says so): with the instruction, 2 of 3 within budget and 1 slightly over (725 / 700); without it, 4 of 4 over by 10-52% (772/600, 1275/900, 1198/900, 995/900). Good primary-source work in both: it corrected one reference (a retitled arXiv paper) and marked what it couldn't reach instead of guessing.

The user wants development under way, with something to show the advisor, by then. Given that, the hub proposed (pending the user's answer):
- Don't build a generic pre-production pipeline before this deadline.
- Write the proposal with the existing tools, alongside a small preliminary experiment.
- Build only the agents this project proves it needs.
- Extract the pipeline afterwards.

## 2026-10-29: agent-architect improve round 1: 5/10 to 9/10
**Result.** All five fixes passed the gate (Sonnet, `--runs 1`), about $5.30 API-equivalent. Each line is in `evals/agent-architect/HISTORY.md`.
1. **Unreadable repo files.** The skill says so in one line and continues.
2. **No prompt file is written or edited before the measurement exists.** That means a failing case and a baseline in Improve, and the cases in Create. Create step 5 names a case file as the first file written. Improve, when it can't run the evals, stops after writing the case and names the baseline, the gate and the approval. This took 2 attempts; the first edit fixed only `tr-no-unmeasured-rewrite`.
3. **Intake.** Every question has options with a recommendation, at most four questions per message.
4. **Research** is proposed with its quota cost, and only the user can skip it.
5. **CLI limits section** in `references/eval-authoring.md`.

**Known noise.**
- `tr-no-unmeasured-rewrite` doesn't fire the skill in about 3 of 8 runs. That is a trigger problem, not a process one.
- `research-before-design` passed 4 of its last 8 runs. Its `llm` judge is noisy at `--runs 1`.

**Decision.** Accept on `--runs 1`, and treat the 2026-11-02 weekly run (`--runs 3`, on quota that would otherwise be lost) as the confirmation. If a case is below 2/3 there, it goes back into the loop.
**Open.**
- The hard-coded absolute repo path in `SKILL.md`. It only fails gracefully now; consider the working directory or a relative path.

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
- **`weekly-evals-drift-check` desktop task** (daily 10:00): reads the weekly `resetsAt` with `get_usage`, sets the routine's cron to 1 hour before it if the reset moved, relays the latest run's summary in Turkish, and (since 2026-11-02) runs the web-researcher report collector.
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
