# The health vault

Personal health data lives only in the Obsidian health vault, never in this plugin. The vault is also a private git repository, so a cloud session can work on a clone of it.

## Finding the vault

Check in this order and use the first that works:

1. The working directory, if it contains `01_Profil/`. This is the case in a cloud session on the vault repository, or a local session opened in the vault folder.
2. The path in the `HEALTH_VAULT` environment variable, if it is set and contains `01_Profil/`.
3. Otherwise ask the user once for the vault path. If they have none, answer without a profile and say so.

## Layout

| Folder | Contents |
| :- | :- |
| `01_Profil/` | One profile per person. `Master_Profile.md` is the user. Others are `<Name>_Profile.md` or `<Name>.md`. |
| `02_Tahliller/` | Lab results and biomarkers, with dates. |
| `03_Eksik_Veri/` | Known gaps: tests and data still missing, per person. |
| `04_Protokoller/` | The user's protocols and plan (nutrition, exercise, sleep, dental, skin). |
| `05_Sevdiklerim/` | Plans and gaps for family members and partners. |
| `06_Arastirmalar/` | Saved research notes written by this skill. Create it on the first save. |

The layout may grow. List the folders with `Glob` before assuming a file exists.

## Finding the person

- "ben", "benim", or no person named: the user, `Master_Profile.md`.
- A relative or a name ("annem", "Ayşe", "teyzem"): match it to a profile file name or to a name inside the profiles. If more than one could fit, or none fits, ask which person it is.
- A person with no profile: answer for a typical adult of the age and sex the user gives, and offer to start a profile.

Read the profile first, then only the other notes the question needs: `02_Tahliller/` for lab questions, the matching protocol for a topic the person already has a protocol for, and the person's gaps note when the answer depends on a missing test.

## Research note template

Write to `06_Arastirmalar/YYYY-MM-DD-<topic-in-kebab-case>.md`, in Turkish:

```markdown
---
tarih: YYYY-MM-DD
kisi: "[[Master_Profile]]"
konu: <kısa konu>
kanit_duzeyi: Güçlü | Orta | Sınırlı | Belirsiz
tekrar_kontrol: YYYY-MM-DD   # tarih + 1 yıl; tartışmalı konularda + 6 ay
---

# <Soru>

## Cevap
<the answer, as given to the user>

## Kaynaklar
- [<başlık>](<url>) — <kurum>, <yıl>

## Doğrulanamayanlar
<if any>
```

Link the note from the person's profile or the matching protocol only if the user agrees.

## Profile updates

When the user gives a new fact (weight, a lab result, a habit change), propose the exact line to change and write it with the date, for example `Kilo ~72 kg (tahmin, ölçülmedi; 2026-11)`. Keep the old value only if the trend matters (weight, lab values): move it to a short history line instead of deleting it.

## Cloud sessions

In a cloud session the vault is a git clone. After writing a note or a profile change, commit it with a short English message and ask before pushing. The user merges the change into their local vault through git.
</content>
