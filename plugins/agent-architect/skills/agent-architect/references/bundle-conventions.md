# Bundle conventions

A bundle is one plugin under `plugins/<domain>/`. Use this as a checklist when designing or reviewing one. Propose the smallest shape that does the job: a standalone method skill with no agent (like `prompt-craft`) is fine when no separate worker context is needed.

## Layout

| Part | Role |
| :- | :- |
| `.claude-plugin/plugin.json` | Name, description, version, author. No `dependencies`: a plugin with them does not load in `claude plugin eval` runs. State required plugins in the README table instead. |
| `agents/<domain>.md` | The worker: a defined job, a minimal tool list, a pinned `model`, and its domain skills preloaded through `skills:` frontmatter. Written with `prompt-craft`'s agent-definition reference. |
| `skills/<domain>/SKILL.md` | The entry skill. Runs in the main thread: asks the questions, applies the domain's rules, writes the brief, dispatches the agent, relays its questions, and presents the result in Turkish. |
| `skills/<topic>/SKILL.md` | Domain skills: methods, source standards, templates. The agent preloads them; the entry skill may use them directly for small jobs. |
| `skills/*/references/` | Detail loaded only when needed, including the distilled research behind the bundle. |
| `evals/<skill>/` | Eval cases for each skill, one folder per case, plus `HISTORY.md`. See `eval-authoring.md`. |
| `hooks/hooks.json`, `scripts/` | Only for behavior that must always happen. Node.js in exec form: `"command": "node", "args": ["${CLAUDE_PLUGIN_ROOT}/scripts/..."]`. Test by piping sample JSON in before committing. |

## Checklist

- [ ] Each skill description says what it does and when to use it, in the third person, with English and Turkish trigger phrases a user would really type.
- [ ] The agent's tool list is the minimum for its job. `WebSearch` is fine inside an agent; the main thread never uses it (a hook enforces this).
- [ ] The agent's output contract includes `status: needs_input` with 1–4 questions (options, recommendation first), and the entry skill relays them and continues the same agent with `SendMessage`.
- [ ] One subagent by default. Fan-out only on the user's request, after a quota warning.
- [ ] Models: the cheapest that does the job (`haiku` for lookups and sweeps, `sonnet` for research and routine work).
- [ ] Personal data is read from the Obsidian vault at runtime. Nothing personal in the repo, the prompts, or the eval cases.
- [ ] Skills with `disable-model-invocation: true` cannot be preloaded by an agent.
- [ ] `SKILL.md` stays under about 500 lines; detail goes to `references/`.
- [ ] Registered in `.claude-plugin/marketplace.json` and the README plugin table.
- [ ] Each skill has eval cases and a first `HISTORY.md` line before the first commit.
- [ ] A `docs/decisions.md` entry records the bundle and why it has this shape.
