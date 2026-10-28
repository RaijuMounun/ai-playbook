# ai-playbook

Agents, skills, rules and workflows for running projects with Claude Code like a professional studio:
from pre-production and specs through feature development, review and release.

This repository is a Claude Code plugin marketplace. Each folder under `plugins/` is an installable plugin.

## Install

```
/plugin marketplace add RaijuMounun/ai-playbook
/plugin install <plugin-name>@ai-playbook
```

## Principles

- **Personal data stays out.** Skills that need personal context (health profile, preferences) read it from a separate profile directory, never from this repo.
- **Measured, not assumed.** Skills ship with eval cases; a change is an improvement only if the evals say so.
- **Deterministic where it matters.** Must-always-happen behavior is enforced with hooks, not with capitalized instructions.

Predecessor: [RaijuMounun/skills](https://github.com/RaijuMounun/skills) (archived, Antigravity era).

## Plugins

| Plugin | What it gives you |
| :- | :- |
| `prompt-craft` | `prompt-craft` skill (delegation briefs, agent definitions, skills, I/O contracts). Hooks: every subagent spawn must carry a structured brief; the policy is re-injected at session start and after compaction. |
| `research` | `web-researcher` subagent with source-weighing standards; skills `ai-engineering-radar` (Adopt/Trial/Assess/Hold), `purchase-research`, `tech-howto`, and `fact-check` (SIFT). Hook: web search runs only in subagents. Requires `prompt-craft`. |

Radar reports land in [`research/radar/`](research/radar/).

## Local development

Register the checkout as a directory marketplace in `~/.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "ai-playbook": { "source": { "source": "directory", "path": "C:\path\to\ai-playbook" } }
  },
  "enabledPlugins": { "prompt-craft@ai-playbook": true, "research@ai-playbook": true }
}
```

Hook scripts need Node.js on `PATH`.
