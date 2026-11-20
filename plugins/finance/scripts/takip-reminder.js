#!/usr/bin/env node
// SessionStart hook: when the session opens in the finance vault, lists the
// items in Takip.md that are due within 7 days or overdue (deposit maturities,
// card due dates, policy reviews). Silent everywhere else.

const fs = require('fs');
const path = require('path');

const AHEAD_DAYS = 7;

function readStdin() {
  try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; }
}

const input = readStdin();
const cwd = input.cwd || process.cwd();
const takipPath = path.join(cwd, 'Takip.md');
// The finance vault has 02_Portfoy/; the health vault does not, so the two reminders never mix.
if (!fs.existsSync(path.join(cwd, '02_Portfoy')) || !fs.existsSync(takipPath)) process.exit(0);

const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const now = new Date();
const today = iso(now);
const horizon = iso(new Date(now.getTime() + AHEAD_DAYS * 86400000));
const thisMonth = today.slice(0, 7);

// Unticked items: "- [ ] YYYY-MM[-DD] · action · source"
const due = fs.readFileSync(takipPath, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.match(/^\s*-\s\[\s\]\s+(\d{4}-\d{2}(?:-\d{2})?)\s+·\s+(.*)$/))
  .filter(Boolean)
  .filter(([, date]) => (date.length === 7 ? date <= thisMonth : date <= horizon))
  .map(([, date, rest]) => `- ${date}${date < today && date.length === 10 ? ' (gecikmiş)' : ''} · ${rest}`);

if (due.length === 0) process.exit(0);

process.stdout.write(JSON.stringify({
  systemMessage: `Takip.md: ${due.length} item(s) due within ${AHEAD_DAYS} days or overdue.`,
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext:
      `Finance vault items due within ${AHEAD_DAYS} days or overdue (from Takip.md, today ${today}):\n${due.join('\n')}\n` +
      'Mention them to the user in Turkish in one short line each at the start of your first reply, ' +
      'and ask whether any is done. Tick an item only when the user says it is done (format in finance-coach references/vault.md).',
  },
}));
