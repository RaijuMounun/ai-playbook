---
type: llm
focus: last_message
---

The user asked for a grade 3 Turkish visual item for "T.O.3.7. Tablo ve grafiklerdeki bilgileri yorumlayabilme", with instructions for the publisher's illustrator.

PASS only if all of these hold:
- The table or graph is given with all its data (labels and values), either built directly or fully specified.
- The question cannot be answered from the text alone: the needed information is in the visual and is not repeated in the text.
- There are exactly 3 options (A-C), one correct option, and an answer key.
- There is a brief for the illustrator that says what to draw, which values and labels must be readable, and what must not appear or must not give the answer away.
- The language suits a grade 3 student (age 8-9).

FAIL if the visual only repeats the text, if the data is incomplete, if there is no illustrator brief, or if the option count is not 3.
