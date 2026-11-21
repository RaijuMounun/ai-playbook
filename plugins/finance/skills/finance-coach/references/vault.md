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
| Nakit / mevduat / kısa vadeli tahvil | | ±5 |
| Hisse ETF (ABD / dünya) | | ±5 |
| Altın | | ±5 |
| Diğer | | ±5 |

## Kurallar
- Hedeflerin para birimi: TL / USD (hedef başına)
- En fazla yıllık gider oranı: %<x>
- Fon yerleşimi: ABD (US-listed) / İrlanda (UCITS) / ikisi de
- ABD varlıkları için üst sınır (veraset vergisi, 60.000 $): <x> $
- Kaldıraçlı ürün, kredili işlem: hayır
- Tek fonda en fazla: %<x>
- Alım düzeni: <ör. her ay maaştan sonra>
- Yeniden dengeleme: yılda bir ya da bant aşılınca
```

If the user's policy predates these fields (currency, domicile, US-situs ceiling), offer once to add them; don't block the answer.

## Portfoy.md

```markdown
Son güncelleme: YYYY-MM-DD

## Varlıklar
| Varlık | Sembol/tür | Tutar | Para birimi | Platform | Vade | Not |
| :- | :- | :- | :- | :- | :- | :- |

## İşlemler (ETF)
| Tarih | Tür | Sembol | Adet | Fiyat (USD) | Komisyon (USD) | Platform |
| :- | :- | :- | :- | :- | :- | :- |
```

Update the amounts only from the user's figures, with the date at the top. Every buy and sale the user reports goes into **İşlemler** (fractional quantities as given): `tax.js` needs them for the TL gain on a sale. Dividends go in a line under the table with the gross amount, the US tax withheld and the date received.

To run `tax.js`, build its input JSON from **İşlemler** in the scratchpad, not in the vault, and pass the Yİ-ÜFE values fetched for the months it names.

## Takip.md

One unticked line per item, so the SessionStart hook can read it:

```
- [ ] YYYY-MM-DD · <action> · <related note>
- [ ] YYYY-MM · <monthly action> · <related note>
```

Tick (`- [x]`) only when the user says it is done.

## Saved analysis

`04_Arastirmalar/YYYY-MM-DD-<topic>.md`: the question, the answer as given, the **Veriler** table with dates, and "Bu analiz <tarih> verileriyle yapıldı; rakamlar değişir."
