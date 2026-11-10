# Work folder setup and Word output

## The work folder

All of his material lives in one folder on his own computer, connected to Cowork. None of it is part of the plugin.

```
Soru Yazarlığı/
  ayarlar.md     settings and publisher rules (created on first use)
  sablon.docx    the publisher's Word template
  ornekler/      his good past questions, a few per grade
  program/       optional: the MEB Türkçe program PDF
  setler/        one subfolder per set: plan.md, review.md, final .docx
```

**Finding it:** search the folders Cowork can see for `ayarlar.md` (also one level down, such as `Soru Yazarlığı/ayarlar.md`). If it is there, that folder is the work folder.

**If it is not there**, guide him. Do not report an error. In plain Turkish:

1. Say that keeping his settings, examples and finished sets in one folder on his computer lets you remember them next time.
2. Offer two choices:
   - **Recommended:** set up the folder now. Tell him to create a folder named "Soru Yazarlığı", for example on the desktop, and to choose it as the working folder in Cowork. Cowork's folder button sits next to the message box; its exact label can change between app versions, so describe it as "klasör seçme" and ask him to tell you if he cannot find it.
   - **Alternative:** continue without a folder for now. The set is shown in the chat, and the Word file is saved wherever Cowork allows.
3. Once the folder exists, create `ayarlar.md` from `ayarlar-template.md` and the `ornekler/` and `setler/` subfolders. Then ask him, one at a time and only when needed, to put in the Word template (`sablon.docx`) and a few past questions. Neither is required to start.

**Read-only material:** never edit or delete his examples or his template. Write only under `setler/` and to `ayarlar.md`.

## His past questions

When `ornekler/` has files, read them before drafting. Use them for:
- tone, length and how the contexts are framed
- how the options are laid out
- typical names and settings

Do not copy them, and do not reuse their contexts. They are a style reference, and they may belong to a publisher.

## Word output

Goal: a `.docx` in his publisher's template, saved to `setler/<set name>/`.

1. **Use the built-in Word support if this session has it.** Claude apps often include a Word (docx) skill. Copy `sablon.docx`, keep its styles, and insert each item in order: number, context, visual or visual brief, stem, options. Put the answer key at the end, in a table with the item number, the key and the outcome code.
2. **Fallback:** if there is no Word skill but code execution works, use `python-docx` to open the copied template and add the paragraphs with the template's existing styles.
3. **No template:** if he has no template yet, make a plain, clean document. Say that it will match the publisher's format once he adds `sablon.docx`.
4. **Nothing works:** if no Word file can be made, give the set as clean text ready to paste into Word, and say why in one sentence.

**Visuals in the file:**
- Tables and simple charts go into the document as real Word tables, or as a chart image if a chart was drawn.
- Visuals for the illustrator appear as their brief, in a clearly marked box or paragraph where the picture will go.

**After saving:** tell him the file name, where it is, and what to check in it (the answer key, the visual briefs).
