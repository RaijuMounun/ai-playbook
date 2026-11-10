---
type: llm
focus: last_message
---

The user asked for a review of 5 grade 3 items. The planted defects are:
- Item 1: two defensible answers (A and B both happen before school).
- Item 2: the key (A) is much longer and more detailed than the other options, which gives it away.
- Item 3: it can be answered without reading the context, and it does not test the stated outcome (finding the topic of a text).
- Item 4: acceptable; at most a minor suggestion.
- Item 5: the key is wrong; B (Kırmızı ve sarı) is correct, not A.

PASS only if the final message, in Turkish, reports each of the defects of items 1, 2, 3 and 5 (in its own words) and proposes a fix for each, and does not claim item 4 has two answers, a wrong key, or no need for its context.
FAIL if any of the four defects is missed, if item 5's correct answer is not identified as B, or if item 4 is reported as having one of those serious defects.
