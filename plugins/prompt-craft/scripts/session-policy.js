#!/usr/bin/env node
// SessionStart hook: re-states the delegation policy at startup and after
// every compaction, so it survives long sessions.

const policy = [
  'Delegation policy (prompt-craft plugin):',
  '- Before spawning any subagent, load the prompt-craft skill and write the brief from its template.',
  '- Briefs need <objective>, <context>, <done_when> and <output_format> sections; a hook rejects spawns without them.',
  '- When writing or revising an agent definition, a skill, or a system prompt, load prompt-craft first.',
].join('\n');

process.stdout.write(JSON.stringify({
  hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: policy },
}));
