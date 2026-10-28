# Input and output contracts

Should inputs and outputs be structured? Yes, but the right structure depends on who consumes them.

| Consumer | Input shape | Output shape |
| :- | :- | :- |
| Another Claude (parent agent) | XML-sectioned brief | Markdown with fixed headings, in a fixed order |
| Code (a script, a hook, a workflow) | JSON or XML | JSON that matches a schema. Use the API's structured outputs or a `schema` option where available, not "please output JSON" |
| The user | Natural language | Markdown written for reading: answer first, then detail |
| A file that persists (report, spec, ADR) | — | Markdown with YAML front matter (date, sources, status) so it can be searched and diffed later |

## Why not JSON everywhere

JSON is the right choice when code parses the result. When Claude reasons in its answer, forcing JSON lowers quality: reasoning squeezed into string fields gets shorter and loses nuance. For model-to-model handoffs, fixed Markdown headings give most of the reliability at no cost to reasoning.

## Writing an output contract

- Name each section, its order, and its purpose. For example: `## Answer` is 2–4 sentences, bottom line first.
- Give a length budget. The parent's context is finite. Ask for conclusions plus evidence, not process.
- Say where uncertainty goes (a section such as `## Open questions` or `## Not verified`), so it isn't spread across the whole report.
- If the output is saved, give the path pattern and the front-matter fields.
- If several agents' outputs will be merged, use the same contract for all of them.
