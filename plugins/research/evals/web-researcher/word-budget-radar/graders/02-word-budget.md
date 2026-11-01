---
type: regex
target: last_message
match: not_contains
pattern: '^\s*(?:(?!#+\s*Sources\b)\S+\s+){901}'
---

Fails when more than 900 whitespace-separated words come before the Sources heading (the brief's
budget excludes the Sources list). Same word count as `wc -w` and the collector script. A fixed
repetition count is used instead of {0,900} so the pattern can't backtrack heavily.
