#!/usr/bin/env node
// SessionStart hook: when the session opens in the health vault, lists the
// follow-up items in Takip.md that are due or overdue. Silent everywhere else,
// so coding sessions get no health context.

const fs = require('fs');
const path = require('path');

function readStdin() {
  try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; }
}

const input = readStdin();
const cwd = input.cwd || process.cwd();
const takipPath = path.join(cwd, 'Takip.md');
if (!fs.existsSync(path.join(cwd, '01_Profil')) || !fs.existsSync(takipPath)) process.exit(0);

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const thisMonth = today.slice(0, 7);

// Unticked items: "- [ ] YYYY-MM[-DD] · person · action · source"
const due = fs.readFileSync(takipPath, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.match(/^\s*-\s\[\s\]\s+(\d{4}-\d{2}(?:-\d{2})?)\s+·\s+(.*)$/))
  .filter(Boolean)
  .filter(([, date]) => (date.length === 7 ? date <= thisMonth : date <= today))
  .map(([, date, rest]) => `- ${date} · ${rest}`);

if (due.length === 0) process.exit(0);

const list = due.join('\n');
process.stdout.write(JSON.stringify({
  systemMessage: `Takip.md: ${due.length} item(s) due or overdue.`,
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext:
      `Health vault follow-up items that are due or overdue (from Takip.md, today ${today}):\n${list}\n` +
      'Mention them to the user in Turkish in one short line each at the start of your first reply, ' +
      'and ask whether any is done. Tick an item only when the user says it is done (format in health-coach references/vault.md).',
  },
}));
