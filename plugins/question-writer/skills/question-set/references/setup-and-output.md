# Work folder setup and Word output

## The work folder

All of his material lives in one folder on his own computer, connected to Cowork. None of it is part of the plugin.

```
Soru Yazarlığı/
  ayarlar.md     settings and publisher rules (created on first use)
  ornekler/      his past booklets and questions (style reference)
  program/       optional: the MEB Türkçe program or the publisher's outcome lists
  setler/        one subfolder per set: plan.md, key.md, review.md, final .docx
```

**Finding it.** Search the folders Cowork can see for `ayarlar.md`, also one level down (for example `Soru Yazarlığı/ayarlar.md`). If it is there, that folder is the work folder.

**If it is not there, guide him through setting it up.** Do not report an error. In plain Turkish:

1. Say that keeping his settings, examples and finished sets in one folder on his computer lets you remember them next time.
2. Offer two choices:
   - **Recommended: set up the folder now.** Tell him to create a folder named "Soru Yazarlığı", for example on the desktop, and to choose it as the working folder in Cowork. Cowork's folder button sits next to the message box. Its exact label can change between app versions, so describe it as "klasör seçme" and ask him to tell you if he cannot find it.
   - **Alternative: continue without a folder for now.** The set is shown in the chat, and the Word file is saved wherever Cowork allows.
3. Once the folder exists, create `ayarlar.md` from `ayarlar-template.md`, plus the `ornekler/` and `setler/` subfolders. Then ask him, when it is needed, to put a few of his past booklets into `ornekler/`. This is not required to start.

**Read-only material.** Never edit or delete his examples. Write only under `setler/` and to `ayarlar.md`.

## His past questions

When `ornekler/` has files, read them before drafting. Use them for:
- tone and length, and how the stimuli are framed
- how the options are laid out
- the title line
- typical names and settings

Do not copy them, and do not reuse their contexts. They are a style reference, and they may belong to a publisher.

## Word output

Goal: a `.docx` in his own booklet layout, saved to `setler/<set name>/`. He has no publisher template. He writes into a blank document, so the layout below is the format. If `ayarlar.md` ever names a template file, copy it and keep its styles.

**The layout:**
- the title line from `ayarlar.md` (for example "<YAYINEVİ> 3. SINIF TÜRKÇE 2. DENEME")
- for each item, in order:
  - the stimulus (text, sentences, cards, or the visual or its placeholder)
  - the shared-stimulus line, when there is one
  - "<n>. <stem>"
  - the key line (the letter three times, for example "BBB")
  - the options (short options in one row, long ones one per line)
  - the outcome code and its text
- no separate answer-key table: the publisher builds its own

Keep the distractor reasons out of the Word file. They go in `key.md` for him.

**How to make the file:**
1. **Use the built-in Word support if this session has it.** Claude apps often include a Word (docx) skill. Use plain, readable formatting: a bold title, numbered stems, and the outcome line in a smaller or grey font.
2. **Fallback: `python-docx`.** If there is no Word skill but code execution works, make the same layout with `python-docx`.
3. **Last resort: text.** If no Word file can be made, give the set as clean text ready to paste into Word, and say why in one sentence.

**Visuals in the file:**
- **Tables, word cards and simple charts** go into the document as real Word tables, or as a chart image if a chart was drawn.
- **Pictures:** he finds a stand-in picture on the internet and puts it in the draft. The publisher then prepares the final picture. So where a picture belongs, insert a clearly marked placeholder for him:

  ```
  [GÖRSEL: <what the picture must show, in one sentence>
   Aranacak: "<2-4 Turkish search words for a stand-in picture>"
   Yayınevi için: <details the final picture must keep: exact words in bubbles or cards, numbers, what must not appear>]
  ```

  Fill in "Yayınevi için" whenever the answer depends on a detail in the picture. That way, the publisher's final picture cannot change the answer.

**After saving:** tell him the file name and where it is. Ask him to check three things: the key lines, the picture placeholders (to replace with his stand-in pictures), and the outcome lines.
