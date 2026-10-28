# Improve loop

The loop changes one thing at a time and accepts a change only when the evals say it helped and broke nothing. Repeated edits made to fix one failing example tend to overfit it and quietly regress cases that used to pass; the no-regression gate is what prevents that.

The same loop improves any bundle in the marketplace, the research skills, `web-researcher`, and `agent-architect` itself.

## Steps

1. **Reproduce.** Turn the failure into a new eval case under `evals/<skill>/` in the affected plugin (see `eval-authoring.md`). Run it alone and confirm it fails. If it does not reproduce, record that in `HISTORY.md` and stop: there is nothing to measure a fix against.
2. **Snapshot and baseline.** Note the current commit (or copy the skill to a scratch folder, as skill-creator does for `old_skill`). Run all of the bundle's cases and record which pass in `HISTORY.md`.
3. **One change.** Make a single targeted edit with `prompt-craft` loaded: the description, one prompt section, one reference, or one hook. One cause per edit, so the result can be read.
4. **Gate.** Rerun all of the bundle's cases.
   - Accept only if the new case passes and every case that passed in the baseline still passes.
   - If the gate fails, revert the edit and try a different one. After 3 failed attempts, stop and report to the user with what was tried.
   - With `--runs 1`, a single flip can be noise. If one case flips, rerun just that case once more before deciding.
5. **Show and record.** Show the user the diff and the before/after pass counts. After the user approves, append a line to `HISTORY.md`, add a `docs/decisions.md` note if the change reflects a decision, and commit. Ask before pushing.

## Trigger problems

When a skill fires where it shouldn't, or doesn't fire where it should:

1. First try one manual edit to the description, through the loop above. Typical causes: the description lists keywords but not the question shapes users type, or a near-miss shares its keywords.
2. If the manual edit fails the gate, offer skill-creator's description optimization. It is the costly part (about 20 queries × 3 runs × up to 5 rounds, and it needs the `claude` CLI), so tell the user the cost and run it only on their go-ahead.

## Where evidence comes from

- The user's description of what went wrong.
- A session transcript: find it with session search, read the relevant turns, and quote what the model did.
- A failing case in a weekly report (`evals/reports/YYYY-MM-DD.md`). The weekly run only reports; fixes always go through this loop with the user.
