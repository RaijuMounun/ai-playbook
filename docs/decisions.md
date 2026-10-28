# Decision log

Decisions about how this AI setup works, newest first. Each entry records what was decided, why, and when to revisit. Detailed evidence lives in `research/radar/`. Add an entry whenever a choice is made, and don't rewrite old entries: supersede them with a new one.

## Open items

- [ ] **Live-test the hooks** in a fresh session: WebSearch from the main thread must be denied, and an Agent spawn without brief sections must be denied. (SessionStart injection already confirmed working on 2026-10-28.)
- [ ] **CodeGraph trial on Cannaville (UE5).** Ask the same 2–3 architecture questions with and without CodeGraph, and compare token use in `ccusage session`. Decide Adopt or Hold.
- [ ] **Build research playbooks:** `purchase-research`, `tech-howto`, `fact-check`. Then `health-evidence`, together with a `health-coach` plugin.
- [ ] **Usage review around 2026-11-28:** run `ccusage daily` and `ccusage monthly`, then tune model and effort assignments.
- [ ] Later: `game-research`, `stack-selection`, `market-research`, and an `agent-architect` skill. Then the pre-production pipeline, kept separate from a per-feature spec/ADR development loop.

---

## 2026-10-28: Model and effort per kind of work
**Decision.** Fable is not used: on the Pro plan it bills usage credits.

| Work | Model | Effort |
| :- | :- | :- |
| Development conversations (brainstorm, plan, implement) | `opusplan`: Opus 5.5 in plan mode, Sonnet 5.5 while executing | medium. Use high for architecture and pre-production decisions |
| Health conversations | Opus 5.5 | high |
| Quick questions, small edits, general chat | Sonnet 5.5 | low or medium |
| `research:web-researcher` subagent | `sonnet` (set in the agent file) | medium |
| Bulk lookups and file sweeps (ad hoc subagents) | `haiku` | low |

**Why.** Opus reasons best and is the Pro default, but it uses quota fastest. `opusplan` puts Opus where judgment matters (planning) and Sonnet where volume is (execution). Health conversations are rare, and careful reasoning matters more there than cost.
**Revisit.** At the usage review, using ccusage data.

## 2026-10-28: Usage tracking with ccusage
**Decision.** `ccusage` is installed globally through npm. It reads local Claude Code logs, and the old Antigravity logs too.
**Why.** It shows per-day, per-model, and per-session token use, which is the data needed to tune model and effort choices. Cost columns are API-equivalent prices, not Pro charges. Use them to compare, not as a bill.

## 2026-10-28: Code intelligence and memory tools
**Decision.** The built-in tools are the default (agentic search, CLAUDE.md, auto-memory, and in-repo spec/ADR docs). CodeGraph goes to Trial on the UE5 project only. Serena is Assess, not installed. `mcp-memory-service` is Hold: it is not migrated from Antigravity.
**Why.** See [radar entry](../research/radar/2026-10-28-code-intelligence-and-memory.md).
**Revisit.** 2027-01-28, or after the CodeGraph trial.

## 2026-10-28: Where memory and decisions live
**Decision.** There are three layers:
- `~/.claude/CLAUDE.md`: a short profile and working style, loaded in every session.
- This file: setup decisions and open items, versioned and public.
- Obsidian vault: personal data (health) only.

Claude's auto-memory is a per-folder convenience, not the source of truth.
**Why.** Conversations and per-folder memory disappear when sessions are deleted. Git history doesn't, and CLAUDE.md loads automatically.

## 2026-10-28: Enforcement through hooks, not capitalized rules
**Decision.** Mandatory behavior is enforced by hooks in the plugins. Subagent briefs need `<objective>`, `<context>`, `<done_when>`, and `<output_format>`. WebSearch runs only inside subagents. Both policies are re-injected at session start and after every compaction.
**Why.** Instruction-only rules fade in long sessions. Hooks run as code, so the model cannot skip them.

## 2026-10-28: Research is quota-aware
**Decision.** `ai-engineering-radar` defaults to quick mode: one researcher. Deep mode (2–4 parallel researchers) runs only on request, or when a decision is expensive to reverse.
**Why.** The Pro plan quota. The quick-mode radar used about 67k subagent tokens, while a 4-agent fan-out costs roughly 4×.

## 2026-10-28: New repo, Antigravity setup retired
**Decision.** `RaijuMounun/ai-playbook` (public) replaces the archived `RaijuMounun/skills`. The Antigravity prompts are rewritten from scratch, not ported.
**Why.** The old prompts relied on simulated mechanisms ("run DSPy compilation") and on capitalized rules. Claude 5 models follow plain, reasoned instructions better. A full backup of the old repo and the Cannaville-studio files is in `C:\Users\Eren\.gemini\config\_archive`.
