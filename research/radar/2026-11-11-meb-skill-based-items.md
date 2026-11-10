---
date: 2026-11-11
topic: Skill-based ("beceri temelli") multiple-choice items for primary Turkish (grades 2-4) under the Türkiye Yüzyılı Maarif Modeli
method: one research:web-researcher (sonnet), ~46k subagent tokens
used_by: docs/design/question-writer.md
---

# MEB skill-based items for primary Turkish

## 1. Official curriculum and outcome coding

- **Current program (grades 1-4):** "Türkiye Yüzyılı Maarif Modeli" İlkokul Türkçe Dersi Öğretim Programı, 2026 cover. [PDF](https://mufredat.meb.gov.tr/Dosyalar/202681493354625-Türkçe%20(1-4)%20DÖP%20TTKB.pdf) (primary). The tymm.meb.gov.tr program page returned HTTP 500, so it is not checked whether this PDF supersedes the May 2024 original.
- **Layout:** themes per grade (grade 2 from p.70, grade 3 from p.112, grade 4 from p.154). EK 1 (p.202) is the lookup table "Sınıf Düzeylerine Göre Öğrenme Çıktıları ve Süreç Bileşenleri". EK 2 (p.218) has sample assessment forms.
- **Codes:** `T.<skill>.<grade>.<n>`, where T = Türkçe, D = Dinleme/İzleme, K = Konuşma, O = Okuma, Y = Yazma. Example: T.O.3.2 is grade 3 reading, outcome 2. Process components are lettered a), b), c), ç), d) and so on.
- **Example:** T.O.3.2 "Okuduğu ile ilgili anlam oluşturabilme". Component a) links the text to prior knowledge; b) predicts from the title and visuals. The PDF's font encoding is garbled, so check the exact wording before quoting it.
- **Theme metadata:** alan becerileri (TAB1 Dinleme/İzleme, TAB2 Okuma, TAB3 Konuşma, TAB4 Yazma), eğilimler (E…), sosyal-duygusal beceriler (SDB…), değerler (D…), okuryazarlık becerileri (OB…, e.g. OB4 Görsel Okuryazarlık).

## 2. What "beceri temelli" means

- **Skill families:** tymm.meb.gov.tr lists them as kavramsal beceriler, fiziksel beceriler, eğilimler, alan becerileri, sosyal-duygusal öğrenme becerileri, and okuryazarlık becerileri. Türkçe alan becerileri are Anlama and Anlatma. [tymm](https://tymm.meb.gov.tr/beceriler/alan-becerileri) (undated, primary).
- **Main reference:** MEB, *Türkiye Yüzyılı Maarif Modeli Bağlam Temelli Çoktan Seçmeli Soru Yazım Kılavuzu* (March 2026). [PDF](https://www.meb.gov.tr/meb_iys_dosyalar/2026_04/01080317_TUYRKIYYE_YUYZYILI_MAARIYF_MODELIY_SORU_YAZIM_TEKNIYKLERIY17_MART.pdf), [announcement](https://www.meb.gov.tr/olcme-ve-degerlendirme-sisteminde-koklu-degisiklikler-iceren-soru-yazim-kilavuzu-hazirlandi/haber/40284/tr) (1 Apr 2026).
  - **What items target:** applying and transferring knowledge in new, authentic situations. Each item targets a process component of an outcome.
  - **What it governs:** it is positioned as the reference for exams, textbooks and supplementary material.
- **Test of a skill item:** the functional link between the context and the question, not the format.
- **Gap:** the guide was piloted on grade 6 and grade 10 students. It has no grade 2-4 examples.

## 3. Item construction and quality rules (guide, section 2.4, after Haladyna & Rodriguez)

1. **Five steps:**
   1. Fix the outcome and the process component.
   2. Build a daily-life context.
   3. Write the stem for that component.
   4. Write the distractors.
   5. Run the context test: if the item can be solved without the context, it fails.
2. **Distractors** come from misconceptions or faulty reasoning. Never "hepsi" or "hiçbiri".
3. **Options** are similar in length, structure and complexity. A longer key is a clue.
4. **The stem** uses wording that triggers the outcome's skill. Use at most one negation, marked in bold or underlined. Never a double negation.
5. **Several items on one context** must not chain clues: one answer is not a prerequisite for another, and one item does not give another away.
6. **Cognitive load:** no decorative visuals and no complex sentences. The item measures the target skill, not general reading load.
7. **Checklist:** difficulty fits the group, no stereotypes, correct spelling and punctuation, no ambiguity, and suitable texts and visuals.
8. **Age-appropriate language:** MEB gives no numeric limits for ages 7-10.

## 4. Visual items (guide, section 2.5)

- **A visual must add information.** One that repeats the text is wrong. The guide's example: three apples on a table drawn as three apples. A right visual carries information the student needs, for example how fast the apples rot.
- **Text and visual share one visual field.**
- **No MEB format for briefing a designer was found.** A visual brief (data values, labels, axes, what must be readable, what new information the visual adds) is this design's own choice, not an MEB rule.

## 5. Failure modes and critiques

- **Errors the guide lists:**
  - a decorative context that the question does not need
  - every needed fact stated in the text, so the item measures only reading
  - artificial scenarios ("3×2+5 ekmek aldı")
  - weak distractors
  - visuals that repeat the text
  - double negation
- **Critical view:** Şahin & Kaya (2023), *Ana Dili Eğitimi Dergisi* 11(2), 437-453, a small qualitative study. Primary teachers found that new-generation Turkish questions did not match the program's outcomes and that textbooks gave no guidance for them. The teachers still saw a positive effect on teaching. Only the abstract was read. [DOAJ](https://doaj.org/article/f336bf0a80384172835b47f8a07bfdd5)
- **Other leads (snippets only, not read in full):** studies calling such questions hard, long and complex, and students reluctant to answer them.

## Not verified

- Whether the 2026 PDF supersedes the 2024 program.
- Any MEB sample items for grades 2-4.
- Numeric reading-level limits for ages 7-10.
- The exact wording of T.O.3.2.
- The full texts of the critical studies.
