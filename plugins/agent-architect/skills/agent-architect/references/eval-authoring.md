# Eval authoring (house rules on top of skill-creator)

The case format is skill-creator's, which is also the layout `claude plugin eval` reads. Cases live in the plugin's `evals/` folder, grouped by the skill they test:

```
plugins/<plugin>/
├── .claude-plugin/plugin.json      # no "dependencies" (see below)
├── skills/<skill>/SKILL.md
└── evals/
    └── <skill>/                     # a group folder, not a case
        ├── HISTORY.md               # one line per measured change
        └── <case-name>/             # lowercase-with-hyphens, says what is tested
            ├── prompt.md            # settings block, then the prompt as a user would type it
            ├── case.yaml            # schema_version "1.1", name, expected_outcome
            └── graders/NN-*.md      # one check per file
```

A folder counts as a case only when it holds `prompt.md` or `case.yaml`, so `claude plugin eval plugins/<plugin>` finds every case under every skill group.

Two limits found on 2026-10-29 (CLI 2.1.312):
- The eval dir cannot be inside `skills/` (the CLI ignores `experimental.evals: "skills"`), so skill-creator's `skills/<skill>/evals/` location does not work for the CLI. Use the plugin-level `evals/<skill>/` above.
- A plugin whose manifest has `dependencies` does not load in an eval run: the isolated run has no other plugins installed, so the dependency is unsatisfied and the plugin's skills are missing. Case-level `plugins:` cannot add sibling plugins either (they are outside the containment root). So plugins in this repo declare requirements in the README, not in `dependencies`.

Case names must not be `results`, `mocks`, `files`, `node_modules`, `true`, `false`, or `null`.

## What to write, per skill

| Kind | Count | Grader |
| :- | :- | :- |
| Should trigger, English and Turkish phrasing | 3–5 | `tool_used`, `tool: Skill`, `input_match` on the skill name |
| Should not trigger, near misses | 2–3 | Same, with `min: 0, max: 0` and `arm: both` |
| Process checks (the steps that matter) | 1–3 | `tool_used` / `tool_order` on the transcript, for example the researcher was dispatched, or a page was fetched |
| Output structure | 1–2 | `regex` over `last_message` or a file |
| Output quality | 0–2 | `llm` with a concrete PASS/FAIL rubric; the only paid grader |

Prefer the free graders (`tool_used`, `tool_order`, `regex`, `file_exists`). Each case should have one grader on the result and, where it matters, one on the steps.

## Templates

Trigger case, `prompt.md`:

```markdown
---
tags: [trigger, fact-check]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Skill]
---

İnsanların beyninin sadece %10'unu kullandığı doğru mu?
```

`graders/01-skill-fired.md`:

```markdown
---
type: tool_used
tool: Skill
input_match: '"skill"\s*:\s*"(?:[\w-]+:)?fact-check"'
---
```

Should-not-trigger grader:

```markdown
---
type: tool_used
tool: Skill
input_match: '"skill"\s*:\s*"(?:[\w-]+:)?fact-check"'
min: 0
max: 0
arm: both
---
```

`case.yaml`:

```yaml
schema_version: "1.1"
name: tr-brain-ten-percent
expected_outcome: |
  The fact-check skill is invoked for a Turkish "is it true" question.
```

Keep free text out of the `prompt.md` settings block; it ends at the first `---`.

## Running

Run the CLI in the user's real terminal (`run_in_terminal`), never in the sandboxed shell tools. From the repo root:

```
claude plugin eval plugins/<plugin> --runs 1 --ablation none --model sonnet --no-publish --output-dir evals/results/<label>
```

- `--ablation none` for every regression run: the default with-without doubles the runs.
- `--runs 1` while iterating; the weekly run may use more if the budget allows.
- `--model sonnet` unless the agent pins another model: run with the cheapest model that matches real use.
- `--case <glob>` or `--tag <tag>` to run a subset; `--json <path>.json` for a machine-readable result.
- Research cases that do real research need `--allow-tools WebFetch`. Never grant `Bash`: native Windows has no sandbox backend, so those runs are refused.
- Trigger cases grant only `Skill`. Once the skill fires, the run usually ends on the turn cap or without its tools; that is expected and does not affect the `tool_used` grader.
- The first run in an untrusted directory asks for trust in the terminal. Answer it once, or pass `--trust-plugin` for unattended runs.
- When a trigger case fails, first check that the plugin loaded: rerun the case with `--keep-temp` and read the first line of `out/trace.jsonl` in the kept folder. Its `skills` list must contain the skill, and `plugin_errors` must be empty. Delete the kept folder afterwards.
- `results/` folders are git-ignored. Record the outcome in `HISTORY.md` instead.

Eval runs load only the plugin under test: no user settings, CLAUDE.md, memory, or other plugins. A case cannot rely on anything outside the plugin.

## CLI limits (CLI 2.1.312, native Windows)

- **Fixtures.** The only per-case fixture mechanism is `context: scaffold_script` in `case.yaml`, which needs `--scaffold` and bash. Bash is not on the CLI's PATH on native Windows (exit 127), so put the repo context a case needs into `prompt.md` and say so in `case.yaml`'s `description`. Files stored under a case folder that look like cases (`prompt.md`, `case.yaml`) would be run as cases.
- **Writing files.** A case whose skill writes files needs `Write` (and `Edit`) in `allowed_tools`, and the run needs `--allow-tools Write Edit`. Without both, a grader that expects a `Write` call can never pass. The run's working directory is empty and temporary, so the writes land there.
- **`llm` graders.** The frontmatter is `type: llm` and `focus:`; the body is the rubric. `focus` defaults to `last_message`, so the judge sees only the final message. Use `focus: trace` when the rubric is about order or tool calls. Write rubrics as `PASS only if ...` / `FAIL if ...`.
- **`tool_used` bounds.** `min` defaults to 1, so a "never called" check needs `min: 0` and `max: 0`.
- **`input_match` and `tool_order`.** `input_match` is a regex over the tool call's input as JSON, so a path in it has doubled backslashes; match separators with `[\\/]+`. `tool_order` takes `before:` and `after:`, each with `tool` and an optional `input_match`, and fails when the `before` call never happens.
- **`--case`** keeps only the last value given. Run several cases by repeating the command, or use one glob.
- **Process cases** are graded on a single turn: the skill cannot run evals inside a run, so the correct behavior is to write or propose, then stop and ask. Write the graders for that.

## House rules

- No personal data in cases. Health cases use made-up profiles.
- Every bug fixed through the improve loop leaves its case behind as a regression test.
- The grader exists so the user doesn't have to judge outputs by eye; skill-creator's browser review is optional.

## HISTORY.md

One line per measured change, newest last:

```
2026-10-29 | baseline | sonnet, runs 1 | 4/6 | tr-brain-ten-percent, tr-vaccine-rumor fail
2026-10-29 | description: add Turkish question forms | sonnet, runs 1 | 6/6 | gate passed
```
