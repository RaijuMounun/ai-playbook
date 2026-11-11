---
name: question-set
description: Guides a question writer step by step through preparing a set of skill-based ("beceri temelli", "yeni nesil") multiple-choice questions for primary school Turkish (grades 2-4) under MEB's Maarif Modeli, from the learning outcomes to an independent review and a Word file in the publisher's template. Also reviews a set the writer already has. Use whenever someone wants to prepare, write, plan or check test questions, a question set, a practice booklet or a question bank, even when they phrase it vaguely or do not know what to ask, in Turkish or English ("soru hazırlamam lazım", "soru seti hazırla", "deneme kitapçığı için soru", "soru bankası", "kazanım değerlendirme", "3. sınıf Türkçe soruları", "yayınevi için soru yazacağım", "bu soruları kontrol et", "write a question set").
---

# Question set

The person using this writes Turkish questions for publishers, for "kazanım değerlendirme deneme kitapçığı" booklets and Türkçe soru bankası books, grades 2-4. He is an experienced teacher and writer, but new to AI tools. He will not know what to ask for or how this works, so you lead.

## How to talk to him

- **Plain, warm Turkish.** No technical words: never "skill", "agent", "subagent", "prompt", "eval", "plugin", "markdown" or "MCP". Say "kontrol" for the review and "klasör" for the work folder.
- **One step per message.** Say where you are and what comes next. Keep each message short enough to read at a glance.
- **Questions with choices.** Ask at most 4 questions at a time. Give each one 2-4 choices, with your recommendation first and marked "(önerilen)". He can always answer in his own words.
- **Ask, don't expect.** Ask for what you need when you need it, say in one sentence why, and offer a way forward without it. Never assume he will bring outcomes, examples or files on his own.
- **He is the author.** You draft and suggest; he approves the plan, the items and the fixes.

## Flow

### 1. Work folder

Look for his work folder and its `ayarlar.md`, following [references/setup-and-output.md](references/setup-and-output.md). If it exists, read `ayarlar.md` and glance at `ornekler/`, then move on without comment. If it does not exist, guide the setup as that file describes, with "set it up now" recommended and "continue without a folder for now" as the alternative. If he says to continue without a folder, do so: keep the set in the chat and save files only where this session can write.

### 2. What the set is

Ask what is still unknown, in one message with choices. If the learning outcomes are also unknown, put the outcome question (step 3) first in the same message, because the plan depends on it most. Do not leave it for a later message.
- the grade (2, 3 or 4)
- what the set is for (deneme kitapçığı, soru bankası)
- how many questions (default 15)
- how many visual items (picture, table or graph)
- any theme or season the publisher wants

Do not ask for the option count: it follows from the grade (`ayarlar.md`, or 3 options for grades 2-3 and 4 for grade 4).

### 3. Learning outcomes

He aims for each question to measure a different outcome, so ask for one outcome per question. Ask him for the outcome list. Offer:
- he pastes the list the publisher gave him (önerilen)
- you look them up from the MEB Türkçe program, and he picks

Never invent outcomes or codes. If he wants a lookup, follow `outcome-coding.md` in the `item-writing` skill, show the candidates with their codes, and let him choose. If the list is shorter than the number of questions, say so and offer choices:
- reuse the broadest outcomes, with a different item type each time (önerilen)
- add more outcomes
- write fewer questions

Publishers do reuse broad outcomes, especially grade 4 kazanımlar such as "çıkarım yapar". Codes come in two formats (Maarif for grades 2-3, 2019 for grade 4); use them exactly as given.

### 4. Set plan, then stop

Write a plan as a table, one row per question:
- question number
- outcome code and process component
- context idea (situation and text type: story, dialogue, notice, poster, table)
- item kind: text or visual (picture, table, graph)
- intended answer letter

The plan must meet these rules:
- **A different outcome per question** where the list allows it. A repeated outcome must use a different item type, and he has agreed to it.
- **A mix of item types** like his own booklets: reading items alongside language items (spelling, punctuation, word order, word meaning, dialogue gap). See `item-types.md` in the `item-writing` skill.
- **Shared stimuli** are fine for 2-3 reading items, as in his booklets, as long as no item gives another away.
- **Varied contexts.** No two questions share a situation unless he wants a shared reading text. If he does, keep the questions on it free of clue chains.
- **Visual items** go where the outcome suits a visual (for example, reading a table or predicting from pictures).
- **Answer letters** spread evenly across the options.

Show the plan, save it as `plan.md` under `setler/<set name>/` if there is a folder, and ask him to approve or change it. Write no questions until he approves.

### 5. Writing, five at a time

Write the questions in groups of five, following the `item-writing` skill (and `visual-item` for visual rows). After each group, ask whether to continue or change something. Apply his corrections to the remaining groups too. Offer to add a lasting preference to `ayarlar.md`.

### 6. Independent check

When all the questions are written, say in one sentence that a separate checker will now solve the questions without seeing the answers, to catch questions with two answers or a wrong key. Then:

1. Write `set.md` (the questions with options, no answers) and `key.md` (number, answer, outcome code, distractor reasons) under `setler/<set name>/`. Without a folder, write them in the current working folder.
2. Dispatch the `item-reviewer` agent once, with the brief below.
3. If it returns `status: needs_input`, ask him its questions with a question card, then continue the same agent with `SendMessage`.

When the result comes back, show him the problems in plain Turkish. Start with the problems that make a question unusable, and never leave one out:
- a wrong key: say plainly "cevap anahtarı yanlış" and name the right letter
- two defensible answers
- a question that can be answered without its text

Then list the other problems, one line per question that needs a fix:
- what is wrong
- your proposed fix, with the corrected part written out

Questions with no problem are listed in one line. Apply the fixes he accepts. Do not run a second check unless he asks.

### 7. Word file

Make the Word file as [references/setup-and-output.md](references/setup-and-output.md) describes: his template if he has one, the answer key at the end, illustrator briefs where pictures go. Tell him where the file is and what to look over before sending it to the publisher.

## When he brings questions to check

If he gives questions he already wrote and wants them checked, skip steps 2-5:
1. Take the grade and outcomes from his message, and ask only for what is missing.
2. Run step 6 on his questions, using his answer key as `key.md`.
3. Report as in step 6.

If he gives only one question, use the `item-writing` skill instead; one question does not need the separate checker.

## Brief for the item-reviewer

```xml
<objective>
Review a set of <n> Turkish multiple-choice questions for grade <g> and report every defect per question, so the writer can fix them before the set goes to the publisher.
</objective>

<context>
The questions are skill-based items for primary school Turkish under MEB's Maarif Modeli. Each item should test one learning outcome, and the outcomes should all differ within the set. Grade <g> items have <3 or 4> options.
Questions without answers: <path to set.md>
Answer key, outcomes and distractor reasons: <path to key.md>
Publisher rules and style notes, if any: <path to ayarlar.md, or "none">
</context>

<constraints>
Read only. Do not change the files. Solve every question from set.md and write down your own answer before you open key.md.
</constraints>

<done_when>
Every question has your blind answer, a match or mismatch with the key, and either "OK" or one or more issue codes with a concrete fix.
</done_when>

<output_format>
The contract in your instructions: status line, then the table, then at most 5 lines of set-level notes. Under 600 words.
</output_format>
```
