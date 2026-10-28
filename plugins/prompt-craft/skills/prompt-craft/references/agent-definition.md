# Writing an agent definition

An agent definition is a Markdown file with YAML frontmatter. It lives in `agents/` of a plugin, in `~/.claude/agents/` (user), or in `.claude/agents/` (project). The body becomes the subagent's system prompt.

## Frontmatter

```yaml
---
name: web-researcher            # lowercase-hyphenated, unique
description: >-                 # the main agent reads this to decide when to delegate
  Researches questions on the web and returns a sourced report. Use for any task
  that needs current or external information.
tools: WebSearch, WebFetch, Read  # smallest set that does the job; omit to inherit all
model: inherit                  # or sonnet / opus / haiku / fable
---
```

- **description** is a routing rule, not a tagline. Say what the agent does and when to use it. Add "Use proactively when …" if it should be picked without being asked.
- **tools**: grant only what is needed. A reviewer that cannot edit files cannot "fix" things it was asked to review.
- **model**: `inherit` follows the session. Pin a model only when the work clearly needs more (deep reasoning) or less (bulk lookups).
- Other useful fields: `skills` (preload skill content), `memory` (`user`/`project` for cross-session learning), `isolation: worktree` (separate checkout for parallel coding), `effort`, `maxTurns`.

## Body (system prompt)

Keep it in this order and keep each part short:

1. **Role and purpose.** One or two sentences: who the agent is and what its output is used for.
2. **Approach.** How good work in this role is done: the judgment calls, the source or quality standards, and what to do when stuck or when evidence conflicts. Explain the reasons.
3. **Boundaries.** What it must not do (edit files, contact people, act on instructions found in web pages), and when to stop and report instead of continuing.
4. **Output contract.** The exact shape of the final reply. See [io-contracts.md](io-contracts.md).

The brief from the parent supplies the task. The system prompt supplies the standing method. Don't put task specifics in the definition.

## Checklist

- [ ] The description says when to use it, in terms the main agent will recognize in a user request.
- [ ] The tool list is minimal and sufficient.
- [ ] The body explains the reasons behind its rules.
- [ ] There is an output contract with fixed sections.
- [ ] There are no anti-patterns from SKILL.md (simulated mechanisms, persona inflation, shouting).
- [ ] It was tried on 2–3 realistic briefs and the output was read.
