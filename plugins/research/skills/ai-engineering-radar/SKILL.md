---
name: ai-engineering-radar
description: Researches the current state of practice in AI-assisted software engineering and rates findings Adopt / Trial / Assess / Hold. Use when the user asks how leading teams build with AI, whether a tool or technique (MCP server, code graph, memory system, agent pattern, prompting method) is still best practice, or before designing a new agent, skill, or workflow.
---

# AI Engineering Radar

This field changes monthly and is full of hype, so the job is to separate what practitioners actually use and get results from with what is merely talked about. The output is a radar entry per technique or tool, modeled on the ThoughtWorks Technology Radar, plus a recommendation for this user's setup.

## Rings

- **Adopt:** proven in production by several independent teams, documented by the vendor, and with low risk. Use by default.
- **Trial:** solid evidence and real users, but young or with known rough edges. Use in one real project and evaluate.
- **Assess:** promising, but the evidence is mostly announcements, demos, or a single team. Keep an eye on it.
- **Hold:** superseded, contradicted by evidence, or more cost than value. Don't start using it, and plan to move off it.

## Process

1. **Scope.** Restate the question as 1–5 concrete candidates (tools, techniques, or patterns) and the decision it informs. If the user's goal is unclear, ask one clarifying question first.
2. **Check prior radar entries.** Look in `research/radar/` of the ai-playbook repo for entries on the same topic. If an entry is less than 3 months old, update it instead of starting over.
3. **Dispatch researchers.** The user is on a Pro plan, so pick the lightest depth that answers the question:
   - **Quick (default):** one `research:web-researcher` covering all four source classes, with at most 2 findings per class per candidate.
   - **Deep (only when the user asks, or when the decision is expensive to reverse):** 2–4 researchers in parallel, one per source class. Tell the user that this uses several times the quota before you start.

   Use the brief template at the end of this file. The source classes are:
   - **Vendor:** official docs, changelogs, and engineering blogs from Anthropic, OpenAI, Google, GitHub, and the tool's maintainers.
   - **Practitioners:** engineering blogs and talks from companies that describe their own production use, and well-known individual practitioners who show their work.
   - **Adoption signals:** GitHub activity (stars trend, commit recency, issue health, maintainers), package downloads, and community discussion volume and sentiment.
   - **Skeptics:** critical evaluations, benchmarks, failure reports, and "we stopped using X" posts. This slice is what keeps the radar honest.
4. **Synthesize.** Merge the reports. For each candidate, decide a ring from the evidence, not from how often it is mentioned. Where vendor claims and practitioner reports disagree, give the practitioner reports more weight.
5. **Fit to this user.** The default context is: Windows 11, Claude Code (desktop app and CLI), solo developer, projects in UE5 C++, Flutter, Rust, and Python, and the ai-playbook plugin repo. A tool can be Adopt in general and still not worth it here, or the other way around. Say so.
6. **Save and report.** Write the entry to `research/radar/YYYY-MM-DD-<topic>.md` in the ai-playbook repo using the template below. Give the user a short summary in Turkish: the ring per candidate, the recommendation, and the file path.

## Entry template

```markdown
---
title: <topic>
date: YYYY-MM-DD
question: <the decision this informs>
review_by: <date + 3 months>
---

## Summary
| Candidate | Ring | One-line reason |
| :- | :- | :- |

## Recommendation for this setup
What to do now, concretely: install, try in project X, ignore, or revisit on date.

## Candidates
### <name> — <ring>
- **What it is:**
- **Evidence for:** (linked)
- **Evidence against / limits:** (linked)
- **Adoption signals:**
- **Fit here:**

## Sources
```

## Brief template for each researcher

```xml
<objective>
Gather <source class> evidence on whether these are current best practice in AI-assisted
software engineering: <candidates>. The findings feed an Adopt/Trial/Assess/Hold radar.
</objective>

<context>
Decision this informs: <decision>. Today's date: <date>. Only evidence from the last 12 months
counts as current; older evidence goes under Disagreements or Not verified, with its date.
User setup: Windows 11, Claude Code, solo developer, UE5 C++ / Flutter / Rust / Python.
</context>

<constraints>
Read-only: do not edit files. Deep mode: stay within the <source class> slice, because other
agents cover the rest. Quick mode: cover all four source classes, keep it to the strongest
2 findings per class per candidate, and stop searching once each candidate has them.
</constraints>

<done_when>
Each candidate has at least 2 dated findings from this slice, or an explicit note that none exist.
</done_when>

<output_format>
Your standard report sections, in English, with findings grouped per candidate under the
Findings section. At most 600 words outside the Sources list.
</output_format>
```
