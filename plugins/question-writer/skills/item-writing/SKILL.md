---
name: item-writing
description: Writes or checks a single skill-based ("beceri temelli", "yeni nesil") multiple-choice question for primary school Turkish (grades 2-4) from a MEB Maarif Modeli learning outcome, following MEB's 2026 item-writing guide, with context, stem, options, answer key and a reason for each distractor. Use when someone asks for one question for an outcome, or wants a question checked or its distractors improved, in Turkish or English ("bu öğrenme çıktısına soru yaz", "şu kazanıma bir soru hazırla", "bu soruyu kontrol et", "çeldiricileri güçlendir", "yeni nesil soru yaz", "write one question for this outcome"). For a whole set of questions, the question-set skill leads and uses this one.
---

# Item writing

This skill drafts one question at a time, the way a careful professional writer would. The person using it writes questions for Turkish publishers and is new to AI tools. Talk to him in plain, warm Turkish. Avoid technical words ("skill", "prompt", "agent", "markdown"). He is the author: you draft, he decides.

The rules come from MEB's 2026 guide for context-based multiple-choice items. Before the first item of a conversation, read:
- [references/guide-rules.md](references/guide-rules.md): the item rules
- [references/item-types.md](references/item-types.md): the item types he writes and the stimulus each one uses
- [references/grade-language.md](references/grade-language.md): the grade's option count and language level

Read [references/outcome-coding.md](references/outcome-coding.md) when an outcome code is unclear or he asks you to look one up.

Two programs are in use at once. Grades 2-3 use Maarif codes (`T.O.3.3.b)`), and grade 4 still uses 2019 kazanım codes (`T.4.3.28.`). Use every code exactly as he gives it: never convert it, and never add a letter to a grade 4 code.

## Before writing

- **Settings.** If a work folder with `ayarlar.md` is available, read it: the publisher's rules and his style notes override the defaults here. If `ornekler/` has past questions, read a few for the same grade and match their tone and length. Never copy their contexts.
- **Option count** (default when there is no `ayarlar.md`): grades 2 and 3 have 3 options (A-C), grade 4 has 4 options (A-D).
- **Missing information.** If the grade or the outcome is missing, ask for it in one short message with choices. Never invent an outcome.
- **Untestable outcomes.** If the outcome cannot be tested with multiple choice (speaking, for example), say so and offer the nearest testable process component.

## Writing

Follow the guide's five steps. Keep the self-checks to yourself; show only the result:

1. Name the outcome and the process component the item targets. Read its wording for direction: what the student starts from and what the student produces. The stimulus is what the outcome starts from. For example, "başlığından ve görsellerinden hareketle … tahminde bulunur" means the stimulus is a title and a picture, and the student predicts the content. Never reverse it, as in giving the story and asking which picture fits; he rejected that as not matching the outcome.
2. Choose the item type that fits the outcome (`item-types.md`). Write its stimulus: a short daily-life text, a child's sentence, word cards, a dialogue or a notice, sized for the grade.
3. Write the stem so that it calls up the outcome's skill.
4. Write the key and the distractors. Each distractor models a named mistake a child at that age makes.
5. Cover the stimulus and check that the item can no longer be answered. Then run the checklist at the end of `guide-rules.md`, and fix anything that fails before showing the item.
6. Count the words in each option. If the key is the longest by more than two words, or is the only option joining two ideas with "ve" or a comma, shorten it or lengthen the distractors until they match.
7. Argue for each distractor as a child who has the skill would. If the context supports it, even partly, it is a second key. Replace it with an option the text clearly rules out. Do not rescue it with qualifiers in the stem such as "asıl", "en doğru" or "ilk". A common trap in cause-effect items: an option that names a symptom or an intermediate link of the same cause chain ("toprak kurudu" next to "sulanmadı") is defensible.

For a picture, table or graph item, also follow the `visual-item` skill.

## Output

Write the item in Turkish, in his own booklet layout. The key goes on its own line under the stem, as the letter written three times. The outcome code and its text go under the options:

```
<uyarıcı: metin, cümle, diyalog, kartlar ya da görsel>
(<n> ve <n+1>. soruları yukarıdaki metne göre cevaplayınız.)   ← only when several items share the stimulus

<n>. <soru kökü>
BBB
A) ...
B) ...
C) ...
(D) ...  ← only in grade 4)
<çıktı kodu> <çıktının metni>
```

Short options (a word or two) can sit in one row: `A) biber    B) limon    C) karpuz`.

Below the item, outside the booklet layout, add:
- **Çeldiriciler:** one line per wrong option, naming the mistake that makes a child choose it
- one line on which skill the item measures

Then offer what he can do next: change the context, make it easier or harder, or write another item. Offer these as short choices, not a long explanation.

## Checking a question he wrote

If he gives a question to check, run the same checklist on it and answer in Turkish:
- what works
- each problem in one plain sentence, with a concrete fix (a rewritten option, a shorter sentence)
- the corrected question in full, if it needed changes

Keep his wording wherever it is fine. Change only what the rules require, and say why.
