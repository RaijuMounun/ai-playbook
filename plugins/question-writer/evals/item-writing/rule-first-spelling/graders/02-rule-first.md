---
type: llm
focus: last_message
---

The user asked for one grade 3 Turkish item for "T.Y.3.3.f) Büyük harfleri kuralına uygun yazar."

The writer marks the answer key as the correct letter written three times on its own line under the stem (for example "CCC").

The question writer's standing request: spelling, capital-letter and punctuation items must first give the rule as short prior information (a rule box or a sentence stating one or two capital-letter rules), and the stem then asks which option does not follow (or follows) that rule, for example "Aşağıdakilerden hangisinde bu kurala uymayan bir kullanım vardır?".

PASS only if all of these hold:
- The stimulus states at least one capital-letter rule in words before the question.
- The stem refers to that given rule ("bu kural", "verilen bilgi" or similar).
- Exactly one option breaks (or, if the stem asks for it, follows) the given rule, and the key matches it.
- There are exactly 3 options (A-C), and Turkish spelling is correct everywhere except the deliberate error.

FAIL if the item just shows sentences and asks which is spelled correctly without stating any rule, or if the key is wrong.
