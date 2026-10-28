---
title: Code intelligence and memory tools for Claude Code
date: 2026-10-28
question: Should code-graph, LSP and graph-memory MCP servers be part of the default development setup?
review_by: 2027-01-28
mode: quick (1 researcher, ~12 calls)
---

## Summary
| Candidate | Ring | One-line reason |
| :- | :- | :- |
| Built-in: agentic search + CLAUDE.md/auto-memory + in-repo spec/ADR docs | Adopt | Vendor-documented. Semantic search showed no recall gain over grep in a Claude Code benchmark. |
| CodeGraph | Trial | Its method is documented and token savings are large on some repos, but small on others. Only the maintainer has measured them. |
| Serena (LSP/semantic MCP) | Assess | Popular, but there are no independent token measurements. It overlaps with built-in tools and adds heavy tool definitions. |
| Graph/vector memory MCP (mcp-memory-service) | Hold | Built-in auto-memory and ADR docs cover the need. There is no evidence of benefit, and it may silently hide memories it decides are outdated. |

## Recommendation for this setup
- Default for every project: the built-in baseline. Keep CLAUDE.md under 200 lines, and keep decisions in versioned spec/ADR docs.
- Trial CodeGraph on the UE5 C++ project only, where the codebase is large enough for a graph to pay off. Measure before and after on 2–3 real architecture questions using `/usage`.
- Don't add Serena for now. Revisit if Claude Code's built-in LSP support falls short on C++.
- Retire `mcp-memory-service` from the Antigravity setup. Don't migrate it.

## Candidates
### Built-in baseline: Adopt
- **Evidence for:** CLAUDE.md under 200 lines, and auto-memory `MEMORY.md` is loaded each session ([memory docs](https://code.claude.com/docs/en/memory.md)). MCP tool search defers tool definitions ([MCP docs](https://code.claude.com/docs/en/mcp.md)). In the ContextBench run on Claude Code, semantic search raised file-read precision from 65% to 87%, but recall stayed equal to grep at 39% ([Rogut, AI Engineer Europe 2026-04](https://www.ai.engineer/talks/zKk7sDMGDEQ-benchmarking-semantic-code-retrieval-on-claude); note that the presenter works for a vendor).
- **Limits:** agentic search can spend more tokens exploring large repos.

### CodeGraph: Trial (UE5 only)
- **Evidence for:** 62% fewer tokens and 88% fewer tool calls (median of 4 runs × 7 repos), C/C++ supported, Windows installer ([repo, 2026-08](https://github.com/colbymchenry/codegraph)).
- **Evidence against:** savings depend on the repo (13% on Django, about even on Gin). Resident context at session end is about 80% larger. It misses dynamic dispatch and reflection, which matters for UE5 macros, and it skips files over 1 MB.
- **Adoption:** about 75.8k stars, active.

### Serena: Assess
- **Evidence for:** symbol-level retrieval and editing, 40+ languages ([repo](https://github.com/oraios/serena)).
- **Evidence against:** no published method behind its token claims. Tool definitions are about 24k tokens by a third-party estimate. Some refactors are unsupported, and setup friction on Windows is reported.

### mcp-memory-service: Hold
- **Evidence:** about 2.1k stars, no token or cost data published, and heuristic "superseded" logic can hide memories ([repo](https://github.com/doobidoo/mcp-memory-service)).

## Not verified
The primary Anthropic statement on choosing agentic search over vector indexing. Independent CodeGraph benchmarks at UE5 scale. Serena's cost under tool search. Claude Code's built-in LSP features. Community failure reports for all three tools.
