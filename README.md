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
