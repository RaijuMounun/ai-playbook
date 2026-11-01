#!/usr/bin/env node
// Collects web-researcher runs from Claude Code's subagent transcripts and grades
// each report with free checks, so real tasks become eval evidence.
//
// Claude Code keeps subagent transcripts in
//   ~/.claude/projects/<project>/<session>/subagents/agent-<id>.jsonl (+ .meta.json)
// and deletes them after 30 days. This script copies new web-researcher runs to
//   ~/.claude/research-log/<YYYY-MM>/
// (outside the repo, because briefs may hold personal topics), writes a readable
// <id>.md per run (brief, report, checks), and rebuilds ~/.claude/research-log/index.md.
//
// Usage: node collect-research-reports.js [--check-urls] [--projects <dir>] [--log <dir>] [--quiet]
//   --check-urls  also requests every cited URL (HEAD, then GET) and records its status.

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const AGENT_TYPE = "research:web-researcher";
const DEFAULT_SECTIONS = ["## Answer", "## Findings", "## Disagreements", "## Not verified", "## Sources"];

function parseArgs(argv) {
  const args = { checkUrls: false, quiet: false, projects: null, log: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--check-urls") args.checkUrls = true;
    else if (argv[i] === "--quiet") args.quiet = true;
    else if (argv[i] === "--projects") args.projects = argv[++i];
    else if (argv[i] === "--log") args.log = argv[++i];
  }
  const home = os.homedir();
  args.projects = args.projects || path.join(home, ".claude", "projects");
  args.log = args.log || path.join(home, ".claude", "research-log");
  return args;
}

// Every subagents/agent-*.meta.json under the projects dir whose agentType is the researcher.
function findRuns(projectsDir) {
  const runs = [];
  if (!fs.existsSync(projectsDir)) return runs;
  for (const project of fs.readdirSync(projectsDir)) {
    const projectDir = path.join(projectsDir, project);
    if (!fs.statSync(projectDir).isDirectory()) continue;
    for (const session of fs.readdirSync(projectDir)) {
      const subDir = path.join(projectDir, session, "subagents");
      if (!fs.existsSync(subDir)) continue;
      for (const file of fs.readdirSync(subDir)) {
        if (!file.endsWith(".meta.json")) continue;
        const metaPath = path.join(subDir, file);
        let meta;
        try {
          meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
        } catch {
          continue;
        }
        if (meta.agentType !== AGENT_TYPE) continue;
        const transcript = metaPath.replace(/\.meta\.json$/, ".jsonl");
        if (fs.existsSync(transcript)) runs.push({ id: file.replace(/\.meta\.json$/, ""), meta, metaPath, transcript });
      }
    }
  }
  return runs;
}

function textOf(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((c) => (typeof c === "string" ? c : c.text || (c.content ? textOf(c.content) : "")))
    .join("\n");
}

// Brief, final report, tool calls and all tool-result text from one transcript.
function parseTranscript(file) {
  const entries = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  let brief = "";
  let report = "";
  let lastText = "";
  let started = null;
  const toolCalls = {};
  const seenText = [];
  for (const e of entries) {
    if (!started && e.timestamp) started = e.timestamp;
    if (!e.message) continue;
    if (e.type === "user") {
      if (!brief && typeof e.message.content === "string") brief = e.message.content;
      if (Array.isArray(e.message.content)) {
        for (const c of e.message.content) if (c.type === "tool_result") seenText.push(textOf(c.content));
      }
    }
    if (e.type === "assistant" && Array.isArray(e.message.content)) {
      for (const c of e.message.content) {
        if (c.type === "text" && c.text.trim()) lastText = c.text;
        if (c.type !== "tool_use") continue;
        toolCalls[c.name] = (toolCalls[c.name] || 0) + 1;
        seenText.push(JSON.stringify(c.input || {}));
        if (c.name === "SubagentHandback" && c.input && typeof c.input.message === "string") report = c.input.message;
      }
    }
  }
  return { brief, report: report || lastText, toolCalls, seenText: seenText.join("\n"), started };
}

// "at most 400 words", "under 900 words", "max 300 words", "400 words max".
// The report's budget lives in <output_format>; elsewhere a brief can say things
// like "quote under 25 words each", so that section is searched first.
function wordBudget(brief) {
  const find = (text) => {
    const m =
      text.match(/(?:at most|under|max(?:imum)?|no more than|up to)\s+(\d[\d,.]*)\s+words/i) ||
      text.match(/(\d[\d,.]*)\s+words?\s+(?:max|maximum|or (?:less|fewer))/i);
    return m ? parseInt(m[1].replace(/[,.]/g, ""), 10) : null;
  };
  const format = brief.match(/<output_format>([\s\S]*?)<\/output_format>/i);
  return (format && find(format[1])) ?? find(brief);
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function citedUrls(report) {
  const urls = new Set();
  for (const m of report.matchAll(/https?:\/\/[^\s)<>\]"'`|]+/g)) urls.add(m[0].replace(/[.,;:]+$/, ""));
  return [...urls];
}

// A cited URL counts as seen when its host+path (without scheme, "www." and a trailing slash)
// appears in a tool input or result of the run. Unseen URLs may be invented, or cited from memory.
function unseenUrls(urls, seenText) {
  const norm = (u) => u.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
  const haystack = seenText.replace(/https?:\/\/(www\.)?/g, "");
  return urls.filter((u) => !haystack.includes(norm(u)));
}

// Briefs often say "at most N words outside the Sources list"; then the list doesn't count.
function budgetedText(brief, report) {
  if (!/outside the sources/i.test(brief)) return report;
  const i = report.search(/^#+\s*Sources\b/im);
  return i === -1 ? report : report.slice(0, i);
}

function grade(run) {
  const budget = wordBudget(run.brief);
  const words = countWords(budgetedText(run.brief, run.report));
  const urls = citedUrls(run.report);
  const unseen = unseenUrls(urls, run.seenText);
  const customFormat = /<output_format>/i.test(run.brief);
  let lastIndex = -1;
  const inOrder = DEFAULT_SECTIONS.every((s) => {
    const i = run.report.indexOf(s);
    if (i <= lastIndex) return false;
    lastIndex = i;
    return true;
  });
  const fetches = (run.toolCalls.WebFetch || 0) + (run.toolCalls.Bash || 0);
  return {
    word_budget: budget === null ? { status: "n/a" } : { status: words <= budget ? "pass" : "fail", words, budget },
    went_to_source: { status: fetches > 0 ? "pass" : "fail", fetch_calls: fetches },
    not_verified_listed: { status: /not verified/i.test(run.report) ? "pass" : "fail" },
    cited_urls_seen: { status: unseen.length === 0 ? "pass" : "fail", cited: urls.length, unseen },
    // Briefs with their own <output_format> may replace the default sections, so this only counts there.
    default_sections: { status: customFormat ? "n/a" : inOrder ? "pass" : "fail" },
  };
}

async function checkUrl(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, { method, redirect: "follow", signal: AbortSignal.timeout(15000) });
      if (res.status < 400 || method === "GET") return res.status;
    } catch (err) {
      if (method === "GET") return `error: ${err.name}`;
    }
  }
  return "error";
}

function summary(checks) {
  const failed = Object.entries(checks)
    .filter(([, v]) => v.status === "fail")
    .map(([k]) => k);
  return failed.length ? `fail: ${failed.join(", ")}` : "pass";
}

function writeRunFile(file, run, checks) {
  const body = [
    `---`,
    `id: ${run.id}`,
    `date: ${run.started || "unknown"}`,
    `description: ${JSON.stringify(run.meta.description || "")}`,
    `model: ${run.meta.model || "unknown"}`,
    `tool_calls: ${JSON.stringify(run.toolCalls)}`,
    `result: ${summary(checks)}`,
    `---`,
    ``,
    `## Checks`,
    "```json",
    JSON.stringify(checks, null, 2),
    "```",
    ``,
    `## Brief`,
    ``,
    run.brief,
    ``,
    `## Report`,
    ``,
    run.report,
    ``,
  ].join("\n");
  fs.writeFileSync(file, body);
}

function rebuildIndex(logDir) {
  const rows = [];
  for (const month of fs.readdirSync(logDir).sort()) {
    const dir = path.join(logDir, month);
    if (!/^\d{4}-\d{2}$/.test(month) || !fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).filter((f) => /^agent-.*\.md$/.test(f)).sort()) {
      const head = fs.readFileSync(path.join(dir, file), "utf8").split("\n---\n")[0];
      const field = (k) => (head.match(new RegExp(`^${k}: (.*)$`, "m")) || [, ""])[1];
      rows.push(`| ${field("date").slice(0, 10)} | ${field("description").replace(/^"|"$/g, "")} | ${field("result")} | ${month}/${file} |`);
    }
  }
  const text = [
    "# web-researcher runs",
    "",
    "Built by plugins/research/scripts/collect-research-reports.js. A failed check is evidence for an eval case.",
    "",
    "| Date | Task | Free checks | File |",
    "|---|---|---|---|",
    ...rows,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(logDir, "index.md"), text);
  return rows.length;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const log = (...m) => args.quiet || console.log(...m);
  fs.mkdirSync(args.log, { recursive: true });
  let added = 0;
  for (const found of findRuns(args.projects)) {
    const parsed = parseTranscript(found.transcript);
    const run = { ...found, ...parsed };
    const month = (run.started || new Date().toISOString()).slice(0, 7);
    const dir = path.join(args.log, month);
    const mdFile = path.join(dir, `${run.id}.md`);
    if (fs.existsSync(mdFile)) continue;
    fs.mkdirSync(dir, { recursive: true });
    for (const src of [found.transcript, found.metaPath]) {
      const dest = path.join(dir, path.basename(src));
      if (!fs.existsSync(dest)) fs.copyFileSync(src, dest);
    }
    const checks = grade(run);
    if (args.checkUrls) {
      checks.url_status = {};
      for (const url of citedUrls(run.report)) checks.url_status[url] = await checkUrl(url);
    }
    writeRunFile(mdFile, run, checks);
    added++;
    log(`${run.id}: ${summary(checks)} (${run.meta.description || "no description"})`);
  }
  const total = rebuildIndex(args.log);
  log(`added ${added}, ${total} runs in ${path.join(args.log, "index.md")}`);
}

module.exports = { wordBudget, budgetedText, countWords, citedUrls, unseenUrls, grade, parseTranscript };

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
