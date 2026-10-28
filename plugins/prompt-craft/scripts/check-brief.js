#!/usr/bin/env node
// PreToolUse hook for the Agent tool: rejects delegation briefs that lack the
// required sections from the prompt-craft skill. Fails open on malformed input
// so a hook bug never blocks work.

const REQUIRED = ['objective', 'context', 'done_when', 'output_format'];
const MIN_CHARS = 10;

function sectionBody(prompt, tag) {
  const match = prompt.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return match ? match[1].trim() : null;
}

function check(prompt) {
  const missing = [];
  const empty = [];
  for (const tag of REQUIRED) {
    const body = sectionBody(prompt, tag);
    if (body === null) missing.push(tag);
    else if (body.length < MIN_CHARS) empty.push(tag);
  }
  return { missing, empty };
}

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  }));
}

let raw = '';
process.stdin.on('data', (chunk) => { raw += chunk; });
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0);
  }
  const prompt = input?.tool_input?.prompt;
  if (typeof prompt !== 'string') process.exit(0);

  const { missing, empty } = check(prompt);
  if (missing.length === 0 && empty.length === 0) process.exit(0);

  const problems = [];
  if (missing.length) problems.push(`missing: ${missing.map((t) => `<${t}>`).join(', ')}`);
  if (empty.length) problems.push(`too thin: ${empty.map((t) => `<${t}>`).join(', ')}`);
  deny(
    `Delegation brief rejected (${problems.join('; ')}). ` +
    'Load the prompt-craft skill and rewrite the whole brief from its template: ' +
    '<objective>, <context>, <done_when> and <output_format> are required, <constraints> is optional.'
  );
});
