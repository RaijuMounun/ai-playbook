#!/usr/bin/env node
// SubagentStop hook for research:web-researcher: counts the words of the report
// against the brief's budget and, when it is over, keeps the agent running with
// the exact count so it cuts the report itself. The model can't count its own
// words reliably (three prompt-only fixes failed, see evals/web-researcher/HISTORY.md),
// so the count comes from here.
//
// The budget and the "outside the Sources list" rule are read from the brief with
// the same helpers the report collector uses. At most MAX_BLOCKS cut requests per
// agent run; after that the report goes through as it is.

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { wordBudget, budgetedText, countWords, parseTranscript } = require("./collect-research-reports.js");

const MAX_BLOCKS = 2;

function blockCount(agentId, increment) {
  const file = path.join(os.tmpdir(), `web-researcher-budget-${String(agentId).replace(/[^\w-]/g, "")}.txt`);
  let n = 0;
  try {
    n = parseInt(fs.readFileSync(file, "utf8"), 10) || 0;
  } catch {}
  if (increment) fs.writeFileSync(file, String(n + 1));
  return n;
}

function decide(input) {
  if (!input.agent_transcript_path || !fs.existsSync(input.agent_transcript_path)) return null;
  const run = parseTranscript(input.agent_transcript_path);
  const budget = wordBudget(run.brief);
  if (!budget) return null;
  const report = input.last_assistant_message || run.report;
  const words = countWords(budgetedText(run.brief, report));
  if (words <= budget) return null;
  if (blockCount(input.agent_id, false) >= MAX_BLOCKS) return null;
  blockCount(input.agent_id, true);
  const scope = /outside the sources/i.test(run.brief) ? " outside the Sources list" : "";
  return {
    decision: "block",
    reason:
      `Your report is ${words} words${scope}; the brief allows at most ${budget}. ` +
      `Cut about ${words - budget} words and return the whole report again, same sections. ` +
      `Cut the weakest or least decision-relevant findings first, then shorten the remaining bullets. ` +
      `Keep every source you still cite.`,
  };
}

let raw = "";
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const result = decide(JSON.parse(raw));
    if (result) process.stdout.write(JSON.stringify(result));
  } catch (err) {
    // Never trap the agent because of a bug here.
    process.stderr.write(`word-budget-check: ${err.message}\n`);
  }
  process.exit(0);
});
