#!/usr/bin/env node
// Two jobs, picked by argv[2]:
//   session  - SessionStart: re-states the research policy (also after compaction).
//   guard    - PreToolUse on WebSearch: blocks searching from the main thread, so
//              research runs in web-researcher subagents with clean context.

const mode = process.argv[2];

const POLICY = [
  'Research policy (research plugin):',
  '- Web research goes to the research:web-researcher subagent, not the main thread. WebSearch is blocked in the main thread.',
  '- WebFetch of one specific, already-known URL (a docs page the user linked) is fine in the main thread.',
  '- For a multi-part question, dispatch several web-researcher agents in parallel, each on its own slice, then synthesize.',
  '- For questions about AI-assisted development practice, tools, or agent/skill design, use the ai-engineering-radar skill.',
].join('\n');

function emit(obj) {
  process.stdout.write(JSON.stringify(obj));
}

if (mode === 'session') {
  emit({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: POLICY } });
} else if (mode === 'guard') {
  let raw = '';
  process.stdin.on('data', (chunk) => { raw += chunk; });
  process.stdin.on('end', () => {
    let input;
    try {
      input = JSON.parse(raw);
    } catch {
      process.exit(0);
    }
    // Inside any subagent, agent_id is set; only the main thread is guarded.
    if (input.agent_id) process.exit(0);
    emit({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          'Web search runs in the research:web-researcher subagent, not the main thread. ' +
          'Delegate with a prompt-craft brief, or use a research skill such as ai-engineering-radar.',
      },
    });
  });
}
