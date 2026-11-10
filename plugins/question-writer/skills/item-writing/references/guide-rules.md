# Item rules from MEB's 2026 guide

Distilled from MEB, *Türkiye Yüzyılı Maarif Modeli Bağlam Temelli Çoktan Seçmeli Soru Yazım Kılavuzu* (March 2026), sections 2.4 and 2.5. The guide follows Haladyna and Rodriguez's item-writing research. MEB positions it as the reference for exams, textbooks and supplementary material, so publishers will expect items to meet it.
Source: https://www.meb.gov.tr/meb_iys_dosyalar/2026_04/01080317_TUYRKIYYE_YUYZYILI_MAARIYF_MODELIY_SORU_YAZIM_TEKNIYKLERIY17_MART.pdf
Research summary: `research/radar/2026-11-11-meb-skill-based-items.md` in the ai-playbook repo.

The guide's examples are for grades 6 and 10. Nothing in it is specific to grades 2-4, so the age rules in `grade-language.md` come from elsewhere.

## What makes an item skill-based

An item is context-based when the context and the question are really linked: the student has to use the context to answer. The item asks the student to apply or transfer what they know to a new, authentic situation. Recalling a fact is not enough. Each item targets one process component of one learning outcome.

## The five steps

1. **Fix the target.** Choose the outcome and one process component. Write down what a student who has the skill can do that one without it cannot.
2. **Build the context.** Write a short, believable daily-life situation for a child of that age: a note from a teacher, a dialogue between friends, a poster, a short story, a recipe, a class table. It must carry what the question needs.
3. **Write the stem.** Use wording that calls up the outcome's skill: "olayların sırası", "neden", "metnin konusu", "bu kelime metinde hangi anlamda". Ask one thing.
4. **Write the options.** Write one key and build the distractors from real mistakes.
5. **Run the context test.** Cover the context. If the item can still be answered, it fails, so rewrite it.

## Distractors

- **Every distractor models a real mistake a child makes.** Examples: reversing the order, taking a detail for the main idea, reading only the first sentence, taking a word's everyday meaning instead of its meaning in the text, mixing up cause and effect.
- **Write one line per distractor naming that mistake.** The writer and the reviewer both use it, and it shows when a distractor is just random.
- **No filler options.** Never use "hepsi", "hiçbiri" or "hepsi doğrudur", and never a joke option nobody would choose.
- **No defensible distractor.** A distractor must be clearly wrong for a student who has the skill. If it can be defended from the text, it is a second key: rewrite it.

## Options

- **Similar form.** Options are close in length, grammar and level of detail. A key that is longer, more precise or more "complete" than the others gives itself away.
- **No word echo.** The key does not repeat a striking word from the stem when the distractors do not.
- **Natural order.** Put short options, numbers and time words in a natural order. Otherwise the order must not hint at the key.
- **Keys spread across a set.** Spread the keys over A, B and C (and D in grade 4) about evenly, with no long run of the same letter.

## Stem

- **Positive by default.** Use at most one negation ("değildir", "yoktur"), marked in bold or underlined. Never a double negation.
- **Clear before the options.** A student who has read the context and the stem should know what kind of answer is wanted before reading the options.

## Several items on one context

When items share a context, no item's answer may be needed to answer another. No item may contain information that gives another item's answer away.

## Cognitive load

- **Measure the skill, not reading stamina.** Remove anything the question does not need: decorative pictures, side stories, long or complex sentences.
- **Match the level.** The task should be as complex as the expected performance at that grade, and no more.

## Errors the guide names

- **A decorative context:** the question can be answered without the text.
- **The answer in plain words:** the text states the answer word for word, so the item measures only finding a sentence.
- **Artificial scenarios:** situations no child would meet, or arithmetic dressed up as a story.
- **Weak distractors.**
- **A visual that repeats the text** (see the `visual-item` skill).
- **Double negation.**

## Checklist (the reviewer uses it too)

- [ ] Tests the stated outcome and process component.
- [ ] Cannot be answered without the context.
- [ ] Exactly one defensible key, and the key is correct.
- [ ] Every distractor models a named mistake. No "hepsi" or "hiçbiri".
- [ ] Options are similar in length and form.
- [ ] At most one negation, and it is marked.
- [ ] Language fits the grade (`grade-language.md`).
- [ ] Spelling and punctuation follow TDK rules.
- [ ] No stereotypes, and nothing frightening or unsuitable for the age.
- [ ] Within a set: no repeated outcome, no clue chain, keys spread out.
