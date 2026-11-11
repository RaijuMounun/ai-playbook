---
name: visual-item
description: Writes picture, table and graph interpretation questions ("görsel yorumlama", "tablo/grafik okuma") for primary school Turkish (grades 2-4) under MEB's Maarif Modeli, where the visual carries information the question needs. Builds tables and simple charts directly, and writes a precise brief for the publisher's illustrator when a drawing is needed. Use when someone asks for a visual, table, graph, chart or picture question, or for an illustrator brief, in Turkish or English ("görsel yorumlama sorusu", "tablo sorusu", "grafik sorusu", "resimli soru", "çizer için görsel tarifi yaz", "graph question", "visual question").
---

# Visual items

A visual item is a skill-based question whose answer depends on reading a visual: a picture, a sequence of pictures, a table, a bar chart, a pictograph or a poster. The person using this writes questions for Turkish publishers and is new to AI tools. Talk to him in plain Turkish, with no technical words.

All the general item rules of the `item-writing` skill apply: outcome, context, stem, options, distractor reasons, and the grade's option count (default 3 options for grades 2-3, 4 for grade 4, unless `ayarlar.md` says otherwise). This skill adds what is specific to visuals.

## The main rule

MEB's guide (section 2.5) says a visual must add information. A visual that repeats the text is a known error. So:

- **The answer depends on the visual.** Put the information the question needs in the visual only. Do not repeat it in the text.
- **No decoration.** A decorative picture is left out, not described.
- **One place.** The text and the visual sit together.

## Which kind of visual

- **Tables, bar charts and pictographs.** Build them yourself: write the table with every label and value, or describe the chart's data completely so it can be drawn exactly. Keep the categories few (about 3-5 in grade 2). Use round, small numbers. Prefer pictographs to numbers in grade 2.
- **Pictures, scenes, posters, children with speech bubbles or cards, picture options.** You do not draw these. He finds a stand-in picture on the internet for his draft, and the publisher prepares the final picture. Where the picture goes, write a placeholder with three parts:
  - what the picture must show
  - Turkish search words for the stand-in picture
  - "Yayınevi için:" the details the final picture must keep (the exact words, numbers, and what must not appear)

  Write it exactly in this shape, inside the item where the picture belongs:

  ```
  [GÖRSEL: <what the picture must show, in one sentence>
   Aranacak: "<2-4 Turkish search words for a stand-in picture>"
   Yayınevi için: <details the final picture must keep: exact words in bubbles or cards, numbers, what must not appear>]
  ```

  For picture options (A, B, C are pictures), write one such placeholder per option. When the answer depends on fine detail in a drawing, or he asks for one, write the full brief from [references/visual-brief-template.md](references/visual-brief-template.md) instead.
- **Words and sentences carried by pictures** (speech bubbles, word cards, notebook pages, the board) are part of the item. Always write them out in full.
- **Mixed items.** Some items have both a table and a drawing. Give the table in full and a brief for the drawing.

## Output

Write it in Turkish:
1. The item, in the `item-writing` shape: context, the visual (the table itself, or "[Görsel: bkz. görsel tarifi]" where the picture goes), stem, options, answer and distractor reasons.
2. The picture placeholder (what to show, search words, "Yayınevi için"), or the full brief ("GÖRSEL TARİFİ") when he asks for one or the answer depends on fine detail.
3. One line on what the student must read from the visual to answer.

Before showing it, cover the visual and confirm the question can no longer be answered. Cover the text and confirm the visual alone does not reveal more than intended.
