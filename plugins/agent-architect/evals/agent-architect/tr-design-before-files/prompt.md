---
tags: [process, agent-architect]
max_turns: 15
timeout_seconds: 300
allowed_tools: [Skill, Read, Glob, Grep, Write, Edit]
---

Kitap notlarımı özetleyip Obsidian'a uygun hale getiren bir agent yapmak istiyorum. Sorularının cevapları şunlar: işi, bir kitabın ham notlarını tek bir temiz Markdown notuna çevirmek. Ben /kitap-ozeti komutuyla başlatırım. Girdi, notların bulunduğu bir Markdown dosyasının yolu. Çıktı, front matter'lı (başlık, yazar, etiketler) ve beş maddelik özetli tek bir not. İyi sonuç: 200 kelimenin altında, ham notlardaki fikirler kaybolmadan. Kişisel veri yok. Haftada birkaç kez çalışır. Araştırma yapma, doğrudan tasarım dokümanını yaz.

Repo bağlamı (çalışma klasöründe henüz dosya yok, bilgi bundan ibaret): bu bir Claude Code plugin marketplace'i. .claude-plugin/marketplace.json içinde tek plugin var: notes-helper (plugins/notes-helper/, skill'i note-summary). docs/decisions.md şunu söylüyor: bir skill değişikliği ancak eval case'lerini geçerse ve önceden geçen hiçbirini bozmazsa kabul edilir; plugin'ler `dependencies` tanımlamaz.
