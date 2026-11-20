# Finance vault

A private Obsidian vault, its own private git repo. Only Claude edits it: `git pull` before reading, commit after writing, ask before pushing.

## Finding it

1. The working directory, if it has `02_Portfoy/`.
2. The `FINANCE_VAULT` environment variable.
3. Otherwise ask for the path once. With no vault, answer from what the user wrote and say it is not personalised.

## Layout

```
01_Profil/Profil.md               income band, fixed monthly costs, emergency fund, debts
01_Profil/Yatirim_Politikasi.md   the investment policy (template below)
02_Portfoy/Portfoy.md             holdings
03_Hedefler/Hedefler.md           goals
04_Arastirmalar/                  saved analyses
Takip.md                          dated to-dos
```

Never write account numbers, IBANs, card numbers, passwords, codes or ID numbers.

## Yatirim_Politikasi.md (investment policy)

The professional standard (an investment policy statement). Written once with the user, reviewed yearly or when life changes; every verdict is made against it. Offer it before the first investment comparison if it is missing. Ask for each part with options; don't fill it with your own preferences.

```markdown
# Yatırım Politikası
Son güncelleme: YYYY-MM-DD · Sonraki gözden geçirme: YYYY-MM-DD

## Hedefler
- <hedef>: <tutar> TL, <tarih> (vade: kısa <1 yıl / orta 1–5 / uzun 5+)

## Risk
- Kabul edebileceğim en kötü yıl: portföyün %<x>'i düşüş
- Paraya ihtiyaç: <ne zaman, ne kadar>

## Hedef dağılım
| Varlık sınıfı | Hedef % | Bant |
| :- | :- | :- |
| Para piyasası / mevduat | | ±5 |
| Hisse (endeks/hisse fonu) | | ±5 |
| Altın | | ±5 |
| Döviz | | ±5 |

## Kurallar
- En fazla yönetim ücreti: %<x>
- Kaldıraçlı ürün, kredili işlem: hayır
- Tek fonda en fazla: %<x>
- Yeniden dengeleme: yılda bir ya da bant aşılınca
```

## Portfoy.md

```markdown
| Varlık | Kod/tür | Tutar (TL) | Platform | Alış tarihi | Vade | Not |
| :- | :- | :- | :- | :- | :- | :- |
```

Update the amounts only from the user's figures, with the date at the top.

## Takip.md

One unticked line per item, so the SessionStart hook can read it:

```
- [ ] YYYY-MM-DD · <action> · <related note>
- [ ] YYYY-MM · <monthly action> · <related note>
```

Tick (`- [x]`) only when the user says it is done.

## Saved analysis

`04_Arastirmalar/YYYY-MM-DD-<topic>.md`: the question, the answer as given, the **Veriler** table with dates, and "Bu analiz <tarih> verileriyle yapıldı; rakamlar değişir."
