# question-writer: design

Status: **approved** (2026-11-11), with the amendments in section 1a and the option counts in section 8.
Evidence: [radar 2026-11-11](../../research/radar/2026-11-11-meb-skill-based-items.md). Decision context: `docs/decisions.md`, Next item 3.

## 1. Purpose and users

A professional question writer, the user's father, writes sets of 15 new-generation ("yeni nesil") multiple-choice questions in Turkish for grades 2, 3 and 4. The sets go into a "kazanım değerlendirme deneme kitapçığı" and a Türkçe soru bankası.
- **Alignment:** every set follows the Türkiye Yüzyılı Maarif Modeli's learning outcomes ("öğrenme çıktıları") and process components ("süreç bileşenleri").
- **One outcome per question:** each of the 15 questions measures a different outcome.
- **Visuals:** some questions ask the student to interpret a picture, a table or a graph.
- **Inputs:** he gives the outcomes before each set and can supply his own good past questions.
- **Output:** he delivers the set in the publisher's Word template.

The plugin drafts, checks and formats. He stays the author: he approves the plan, edits the questions, and owns the result.

Out of scope:
- **Drawing the publication-quality pictures.** The publisher's designer does that. The plugin writes a visual brief for the designer and builds tables and simple charts itself (section 4).
- **Other subjects and grades.** The design leaves room for them, but only Türkçe 2-4 is built and measured.

## 1a. He is new to AI tools: the plugin leads

Added at approval (user, 2026-11-11). He has little experience with AI tools. The plugin must guide him and expect nothing from him up front. This shapes every skill:
- **No commands.** He never types a skill name or a slash command. The descriptions fire on everyday Turkish, such as "3. sınıf için soru hazırlamam lazım" or "yeni deneme kitapçığı için soru yazacağım".
- **One step at a time.** The skill leads in plain Turkish, one step per message. Every question offers choices with a recommended option. It uses no jargon: no "skill", "agent", "prompt" or "eval".
- **It asks for what it needs.** It does not wait for him to bring outcomes, examples or the template. It asks at the right moment, says why, and offers a way forward without them (for example, no examples yet means writing from the guide's rules).
- **Missing setup is a guided step, not an error.** If no folder is connected, it explains exactly what to click. He can also choose to continue without a folder for now; the set is then shown in the chat and the Word file is saved where Cowork allows.
- **Every step ends by saying what comes next** and what he should check.

## 1b. What his real booklets showed (2026-11-11)

He shared his drafts of three practice booklets (grades 2-4) and the publisher's print-approval PDFs for the 2026-2027 school year. They stay on the user's PC and in his work folder, not in this repo. Four corrections followed, applied in v0.2.0:

1. **Grade 4 still uses the 2019 program.** The publisher's grade 4 list uses "kazanım" codes like `T.4.3.28.`, with no process components. Grades 2-3 use Maarif codes with components (`T.O.3.3.b)`). Codes are used exactly as given and never converted.
2. **Outcomes can repeat.** The publisher's lists reuse broad outcomes (one grade 4 kazanım appears in four items). "A different outcome per question" is a goal. A repeat is allowed when he agrees and the item type differs, and the reviewer flags a repeat only when the item type is also the same.
3. **His layout:**
   - a title line
   - the stimulus, and a "1 ve 2. soruları … cevaplayınız." line when several items share it
   - "<n>. stem"
   - the key on its own line as the letter three times ("BBB")
   - the options
   - the outcome code with its text
   
   There is no answer-key table: the publisher makes its own.
4. **Item types are broader than reading passages.** They include spelling, capital letters, punctuation, word cards, synonyms and antonyms, dictionary order, idioms, dialogue gaps, rules and brochures. The stimulus is often a child's sentence or a card. `item-writing/references/item-types.md` lists them without copying his items.

**Open: who prepares the pictures.** His drafts embed many pictures. `ayarlar.md` records whether he places them himself (a short "[GÖRSEL: …]" note) or the illustrator draws them (the full brief).

## 2. Delivery surface

The plugin runs in **Cowork** in the Claude desktop app, on his own **Pro** plan. He installs it with no terminal: Customize > Plugins > Add marketplace > `RaijuMounun/ai-playbook`, then he enables `question-writer` only.

Sources (fetched 2026-11-10):
- [Use plugins in Claude](https://support.claude.com/en/articles/13837440-use-plugins-in-claude): plugins work on every paid plan. Subagents and hooks run in Cowork and Claude Code, not in chat.
- [Getting started with Cowork](https://support.claude.com/en/articles/13345190-getting-started-with-cowork): Cowork works on Windows (beta) and reads and writes only folders the user connects.

claude.ai chat is rejected because the review subagent would not run there.

## 3. Private material: a folder on his PC

Nothing he or the publisher owns goes into this public repo. He connects one local folder to Cowork. The skills read it at runtime and stop with a Turkish message saying what is missing.

```
Soru Yazarlığı/
  ayarlar.md         publisher rules: option count per grade, option letters, forbidden forms, style notes
  sablon.docx        the publisher's Word template
  ornekler/          his good past questions (style reference, a few per grade)
  program/           the MEB Türkçe program PDF (public, but kept here; see open question 4)
  setler/            output: one subfolder per set (plan, review, final .docx)
```

On first use, the entry skill creates `ayarlar.md` from a template with his answers and the `setler/` folder. Nothing else is created.

## 4. Shape

The user first asked for "an agent that spawns subagents and picks a skill per question type". Two facts change that:
- **Subagents cannot spawn subagents.** The main conversation is always the orchestrator, so the entry skill plays that role.
- **He writes one main type.** Context-based new-generation multiple choice, with a visual variant. A skill per type would duplicate the shared rules.

The design takes the smallest shape that still has a reason for each part: **one entry skill, two method skills, one review agent.** It has no hooks and no `dependencies`.

| Part | Job |
| :- | :- |
| `skills/question-set/` (entry) | Runs the whole flow with him in the main thread: intake, set plan, drafting, the review dispatch, revisions, Word output. |
| `skills/item-writing/` | The method for one context-based item: the guide's five steps, the distractor rules, the stem rules, the language rules for ages 7-10, and the self-check. References: `guide-rules.md` (distilled from MEB's 2026 Soru Yazım Kılavuzu), `outcome-coding.md` (T.O.3.2 format, where to look in the program PDF), `grade-language.md` (our own heuristics, calibrated on his examples). |
| `skills/visual-item/` | The visual variant: the visual must add information the question needs (guide 2.5); tables and simple bar or pictograph charts built directly in Word; for pictures, a designer brief (what to draw, what must be visible, what must not appear, which detail answers the question). Reference: `visual-brief-template.md`. |
| `agents/item-reviewer.md` | An independent reviewer with fresh context. It gets the set without the answer key and solves each item blind, then compares its answers with the key. It runs the guide's checklist and returns a verdict per item. Model `sonnet`. Tools `Read`, `Glob`. Preloads `item-writing` and `visual-item`. |

**Why a review agent, and only one.** A writer checking its own items tends to approve them. Professional item writing uses a separate reviewer, and a blind solve catches the worst defects: two defensible answers, a wrong key, and an item that is solvable without its context. One review pass per set costs one subagent run. Writing each question in its own subagent would cost 15 runs and lose the set-level view, which the "different outcome per question" and "no clue chains" rules need.

**Why no web-researcher, prompt-craft or hooks.**
- The outcomes come from him or from a known MEB PDF, so no web search is needed.
- The reviewer's brief is fixed text written at build time with prompt-craft.
- Hooks would need Node on his PC and add a failure point on a beta surface.
- `dependencies` break `claude plugin eval` (decision log, 2026-10-29).

## 5. Flow (`question-set`)

1. **Setup check.** The skill finds the connected folder and `ayarlar.md`. If either is missing, it walks him through creating them (one short question card).
2. **Intake per set** (one question card, options with a recommendation first):
   - the grade
   - the outcome list: pasted by him (recommended), or "pick from the program", in which case the skill reads EK 1 of the program PDF
   - the number of visual items
   - a theme or context preference
3. **Set plan.** A table of 15 rows: number, outcome code and process component, context idea (text type, situation), item kind (text or visual), and the intended skill. No two rows share an outcome. Contexts vary: no two items rely on the same situation unless he wants a shared context, and then the no-clue-chain rule applies. Saved to `setler/<set>/plan.md`. **He approves or edits the plan before any question is written.**
4. **Drafting**, in batches of 5 so he can steer early:
   - the context text or visual
   - the stem
   - the options with the key
   - one line per distractor naming the misconception it models
   - the self-check from `item-writing`

   His `ornekler/` set the tone and length.
5. **Review.** One `item-reviewer` dispatch with the whole set, in two files: `set.md` without keys, `key.md` with keys and outcomes. The reviewer returns a table: item, blind answer, matches key (yes or no), issues (from a fixed code list, below), and a suggested fix. Saved to `setler/<set>/review.md`.
6. **Revision.** The entry skill fixes the flagged items. It shows him each fix next to the reviewer's note, and he accepts or edits. No second review by default. He can ask for one.
7. **Word output.** Fill `sablon.docx` with the final set and save it to `setler/<set>/`. Built-in Word support is used if Cowork offers it (Anthropic's docx skill); otherwise python-docx through code execution. See open question 3.

**Review issue codes:**
- `TWO-KEYS`: more than one defensible answer
- `WRONG-KEY`
- `NO-CONTEXT-NEEDED`: solvable without the context
- `DECORATIVE-VISUAL`
- `WEAK-DISTRACTOR`
- `LENGTH-CLUE`: the key's length gives it away
- `NEGATION`: an unmarked or double negation
- `OUTCOME-MISMATCH`
- `DUPLICATE-OUTCOME`
- `CLUE-CHAIN`: one item gives another away
- `LANGUAGE-LEVEL`
- `SPELLING`

**Reviewer output contract.**
- It returns `status: done` with the table.
- It returns `status: needs_input` with 1-4 questions (options, recommendation first) only when the brief leaves something open, for example an outcome code it cannot find in the program.
- The entry skill relays those questions and continues the same agent with `SendMessage`.

## 6. Trigger phrases

- **`question-set`.** English: "write a question set", "prepare 15 questions for grade 3". Turkish: "soru seti hazırla", "3. sınıf Türkçe soruları yaz", "deneme kitapçığı için soru", "yeni nesil soru yaz", "beceri temelli soru hazırla", "kazanım değerlendirme sorusu".
- **`item-writing`.** English: "write one question for this outcome", "check this question". Turkish: "bu öğrenme çıktısına soru yaz", "şu soruyu kontrol et", "çeldiricileri güçlendir". It is also used alone for one-off items.
- **`visual-item`.** English: "graph question", "visual question". Turkish: "görsel yorumlama sorusu", "grafik sorusu", "tablo sorusu", "çizer için görsel tarifi yaz".

## 7. Eval plan

All cases live in this public repo. They use made-up outcomes in the program's format and synthetic contexts, never his questions or the publisher's material.

| Case | Skill | Checks | Grader |
| :- | :- | :- | :- |
| `tr-set-trigger` / `tr-single-item-trigger` / `tr-visual-trigger` | each | fires on Turkish requests | `tool_used` (free) |
| near misses (`"3. sınıf matematik ödevine yardım et"`, `"bu Türkçe metni özetle"`) | entry | does not fire | `tool_used` max 0 (free) |
| `plan-before-items` | question-set | with outcomes given, it writes a 15-row plan with distinct outcomes and asks for approval, writing no items | regex on the plan + `llm` |
| `tr-novice-trigger` | question-set | fires on a vague everyday request with no skill name ("Yeni bir Türkçe deneme kitapçığı için soru hazırlamam gerekiyor. Bana nasıl yardımcı olabilirsin?") | `tool_used` (free) |
| `guides-first-setup` | question-set | with no folder, it explains the setup in plain steps with a recommended option, uses no jargon, and writes no questions yet | `llm` |
| `asks-for-outcomes` | question-set | without outcomes, it asks (pasted or from the program), does not invent them | `llm` |
| `item-quality` (2 cases, grade 2 and grade 4) | item-writing | context needed, distractors tied to misconceptions, similar option lengths, no "hepsi/hiçbiri", one marked negation at most, short sentences | `llm` rubric written from `guide-rules.md` |
| `visual-adds-information` | visual-item | the visual carries information the stem needs; the designer brief has all fields | `llm` |
| `reviewer-seeded-defects` (2 cases) | item-reviewer | a synthetic 5-item set with planted defects (two keys, length clue, decorative visual, clue chain, wrong key) and one clean item; each defect is flagged with its code, the clean item passes | regex on codes per item (free) |

**From his judgment (decision log rule).**
- He grades the first two real sets item by item.
- Each recurring failure becomes a new synthetic case: the same defect pattern, rewritten so none of his text or the publisher's appears.
- His graded items themselves stay in his folder.

**Cost.** About 12 cases, Sonnet, `--runs 1`: roughly $2-4 API-equivalent for the first run, based on earlier suites.

## 8. Open questions

1. **Option count: answered.** Grades 2 and 3 use 3 options (A-C). Grade 4 uses 4 options (A-D). These are the defaults in `ayarlar.md`, which the publisher's rules can override.
2. **Examples** (for him). 2-3 good past questions per grade, including one visual item.
3. **Word template** (for him). Is it a real `.docx` template with styles, or a sample file he copies into? Also: does his Cowork have Word file support (the built-in docx skill)? To be tested once on his PC.
4. **Program PDF in the repo or in his folder.** The researcher found the PDF's text encoding garbled, so automatic outcome lookup may be unreliable. Recommended: he pastes the outcomes (he said he will), and the PDF stays in his folder as a fallback only.
5. **Plan for his first use.** Cowork on Windows is beta. A short Turkish setup guide (install, connect the folder, first set) goes into the plugin README. The user should do the first install with him.

## 9. Build order after approval

1. Write the eval cases (section 7).
2. Write the `item-writing` references from the radar report.
3. Write the skills and the agent with `prompt-craft`.
4. Write the manifest, marketplace and README entries.
5. First eval run.
6. Add the decision-log entry.
7. Install on his PC, then the first real set.
