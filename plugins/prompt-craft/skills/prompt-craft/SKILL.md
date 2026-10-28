---
name: prompt-craft
description: Claude-specific prompt engineering. Use before spawning any subagent (writing the delegation brief), and whenever writing or revising a system prompt, an agent definition, or a skill. Covers brief structure, input/output contracts, and Claude 4+/5 prompting behavior.
---

# Prompt Craft

A subagent starts with an empty context. Everything it knows about the task comes from the brief you write, so the brief decides the quality of the result. This skill is how briefs, agent definitions, and skills get written in this setup.

Pick the section that matches what you are writing:

- **Delegating to a subagent** → [Delegation brief](#delegation-brief) (a hook rejects briefs without the required sections)
- **Writing an agent definition** (`agents/*.md`) → [references/agent-definition.md](references/agent-definition.md)
- **Writing or revising a skill** → [references/skill-authoring.md](references/skill-authoring.md)
- **Deciding the shape of inputs and outputs** → [references/io-contracts.md](references/io-contracts.md)

The principles below apply to all of them.

## Principles for prompting Claude

1. **State the goal and why it matters.** Claude generalizes from reasons. "Keep the report under 300 words because it gets pasted into a chat reply" works better than "MAX 300 WORDS".
2. **Write calmly.** Current Claude models follow instructions closely. ALL CAPS, "CRITICAL", and "you MUST" make them overapply a rule in places it was never meant for. Use emphasis for at most one or two things that really are exceptional.
3. **Say what to do, not only what to avoid.** "Write in flowing prose paragraphs" beats "don't use bullet points".
4. **Be explicit about scope and action.** If you want changes made, say so. If you want research only, say "do not edit files". Claude does what is asked, so leaving it out means it won't happen.
5. **Give goals and constraints; prescribe steps only when order matters.** Capable models plan well. Fixed step lists help for procedures (a migration, a release), but they get in the way of open-ended investigation.
6. **Separate instructions from material with XML tags.** Put documents, data, and examples in their own tags (`<document>`, `<example>`). Tag names have no magic; choose clear names and use them consistently.
7. **Long material first, question last.** When a prompt carries long documents, place them above the instructions and the question.
8. **Examples are copied closely.** Use 2–3 varied examples, and make sure each one shows exactly the behavior you want, including length and tone.
9. **Match the prompt's style to the output you want.** A prompt written in markdown bullets gets markdown bullets back.
10. **Ask for evidence.** Requests like "quote the line", "give the file path and line number", or "link the source" make claims checkable and reduce confabulation.

## Anti-patterns

These were common in earlier prompt-engineering folklore. They make output longer and more confident-sounding without making it more correct:

- **Simulated mechanisms:** "simulate logit-level constraint decoding", "run DSPy compilation", "compute epistemic uncertainty". A prompt cannot run an algorithm. Name the behavior you want instead, for example "if two sources disagree, report both and say which is stronger".
- **Persona inflation:** "elite god-tier world-class expert". It adds nothing. A one-line role plus real context about the situation does the work.
- **Threat framing:** "failure will cause cascading collapse". Explain the actual consequence once.
- **State-machine theatre:** numbered STATE_1…STATE_5 with fault payloads. Plain ordered guidance is enough when order matters.
- **Rule duplication:** the same rule repeated in five places. Say it once, where it applies.

## Delegation brief

Every Agent tool call carries a brief in this shape. The `check-brief` hook blocks a spawn when a required section is missing or empty.

```xml
<objective>
One or two sentences: what this subagent must produce, and what you will do with it.
</objective>

<context>
What the subagent cannot know on its own: the user's situation and preferences,
what has already been tried or decided, relevant file paths, versions, and links.
Write it for a smart colleague who just walked in.
</context>

<constraints>
Optional. Boundaries: read-only vs. may edit, time or source limits, things out of scope.
</constraints>

<done_when>
Concrete stopping condition, for example "3 options compared on price, battery and ANC,
each with at least 2 independent sources" or "root cause identified with file:line evidence".
</done_when>

<output_format>
Exact shape of the reply: sections and their order, length budget, whether to save to a file
(give the path), and the language. The reply lands in your context, so ask for the
conclusion and evidence, not a narrative of the search.
</output_format>
```

Required: `objective`, `context`, `done_when`, `output_format`. Optional: `constraints`, plus any material tags (`<document>`, `<prior_findings>`).

When briefing several agents in parallel, give each one a distinct slice. Overlapping briefs produce duplicate work and redundant output.

Before sending, check the brief against these questions:

- Could someone with no access to this conversation do the task from this brief alone?
- Is "done" checkable, or would the agent have to guess when to stop?
- Does the output format fit what you will do next (read it, merge it with others, parse it)?
- Did you say whether the agent may modify files?

## Keeping quality over long sessions

Long sessions drift: instructions read early fade, and briefs get shorter and vaguer over time. In this setup:

- A SessionStart hook re-injects the delegation policy at startup and after every compaction.
- The `check-brief` hook validates structure on every spawn, so a vague brief cannot go through.
- When a brief is rejected, re-open this skill and rewrite the brief from the template. Don't patch only the missing tag.
