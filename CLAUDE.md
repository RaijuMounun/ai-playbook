# ai-playbook

A Claude Code plugin marketplace: `.claude-plugin/marketplace.json` lists the plugins under `plugins/<name>/`.

- Read `docs/decisions.md` first. It has the decisions so far and the open items. Add an entry for every new decision.
- Each plugin uses the standard layout: `.claude-plugin/plugin.json`, `skills/<name>/SKILL.md`, `agents/*.md`, `hooks/hooks.json`, and `scripts/`. Hook scripts are Node.js in exec form (`"command": "node", "args": ["${CLAUDE_PLUGIN_ROOT}/scripts/..."]`).
- Load the `prompt-craft` skill before writing or changing any skill, agent, or prompt. Write the files in English.
- Test hook scripts by piping sample JSON into them before committing. The plugins are installed from this checkout through a directory marketplace in `~/.claude/settings.json`, so changes take effect in the next new session.
- Research reports go to `research/radar/YYYY-MM-DD-<topic>.md`.
- Never commit personal data. Skills that need it read it from the Obsidian vault at runtime.
