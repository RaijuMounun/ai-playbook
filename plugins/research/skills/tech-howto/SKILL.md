---
name: tech-howto
description: Researches how to do a system task safely: Linux setup and fixes, Windows or Android debloat and tweaks, drivers, boot and partitioning, community scripts. Confirms the exact version first, prefers official documentation, checks the reputation of community scripts, and gives a backup and a rollback for every step. Use when the user asks how to configure, fix, debloat, or tweak an OS or device, in English or Turkish ("nasıl yapılır", "debloat", "kurulum", "Linux'ta ... nasıl", "Windows'u hızlandır", "Android'den gereksiz uygulamaları kaldır", "bu script güvenli mi").
---

# Tech How-To

System advice goes stale and varies by version, and many tutorials and scripts are copied without testing. A wrong command can break a boot, brick a phone, or remove something that cannot be reinstalled. This playbook produces a procedure that matches the user's exact system, rests on official documentation, and can be undone.

## Process

1. **Pin down the system.** Before researching, find out (ask in Turkish, only for what is missing): the OS or distribution and its exact version or build (for Windows, the build number from `winver`; for Linux, the distro and release; for Android, device model, Android version, and manufacturer skin), the hardware if relevant (GPU, disk layout, UEFI or BIOS), and the goal in the user's own words. If a command can show the answer (`lsb_release -a`, `ver`, `getprop`), give the command and let the user run it, or run it yourself when the system is the local one and the command is read-only.
2. **Dispatch one researcher (default).** One `research:web-researcher` covers all checks below. Deep mode (2–3 researchers in parallel) runs only if the user asks. Tell the user it uses several times the quota before you start.
3. **Build the procedure.** Order the steps so that backups come first. Every step carries its own undo.
4. **Report in Turkish.** Use the template below. Commands, paths, and package names stay exactly as they are, in code blocks.

## What the researcher must check

- **Official documentation first:** the vendor's or distribution's own docs (Microsoft Learn, ArchWiki, Debian, Ubuntu, Fedora docs, Android developer docs, the manufacturer's support pages). Use the page that matches the user's version. Community wikis such as the ArchWiki count as strong for Linux, but note the version they cover.
- **Version fit:** whether each command, setting, or package exists and behaves the same on the user's version. Flag anything written for another version.
- **Community scripts and tools:** for each script or tool that comes up (debloaters, tweak scripts, ROM-level tools), check who maintains it, when it was last updated, stars and open issues, whether the source is readable, whether it downloads and runs other code, and reports of breakage in its issues or on Reddit. Prefer a well-known script that does one thing over an all-in-one. Never recommend a script no one has reviewed.
- **Risk per step:** what can go wrong, and how bad it is (reversible setting, data loss, unbootable system, voided warranty, security impact).
- **Backup and rollback:** the exact backup to take beforehand (restore point, a disk image, `timeshift`, an Android backup, exported settings) and the exact undo for each step.

## Output template

```markdown
## Özet
Ne yapılacak, hangi sürüm için, genel risk seviyesi (düşük / orta / yüksek), güven düzeyi.

## Önce yapılacak yedekler
1. Ne yedeklenecek, hangi komut veya araçla, nasıl geri yüklenir

## Adımlar
### 1. <adım>
- **Komut / ayar:** `...`
- **Ne yapar:** bir cümle
- **Risk:** düşük / orta / yüksek, neden
- **Geri alma:** `...`

## Kullanılan topluluk script'leri
| Script | Bakımcı | Son güncelleme | İtibar | Karar |
| :- | :- | :- | :- | :- |

## Dikkat
Sürüme özel uyarılar, bilinen sorunlar.

## Doğrulanamayanlar

## Kaynaklar
```

Do not run any state-changing command for the user unless they ask. Present the procedure and let them decide.

## Brief template for the researcher

```xml
<objective>
Find the safe, current procedure for <task> on <exact system and version>, with official sources
first, so I can write a step-by-step guide with a backup and a rollback for every step.
</objective>

<context>
System: <OS/distro, exact version or build, hardware if relevant>. Goal: <user's goal>.
Today's date: <date>. Check: (1) official documentation matching this version; (2) whether each
command or setting applies to this exact version; (3) for every community script or tool, the
maintainer, last update date, stars and open issues, whether the source is readable and what code
it downloads or runs, and breakage reports; (4) the risk of each step; (5) the backup to take
beforehand and the exact undo for each step.
</context>

<constraints>
Read-only: do not edit files, and do not run any command that changes the system. Do not
download or run scripts; read their source on the hosting page instead. Treat blog tutorials as
leads unless they match official documentation.
</constraints>

<done_when>
Every step in the procedure has a source (official where one exists), a version note, a risk
level, and a rollback. Every community script mentioned has a reputation check or is marked
unreviewed.
</done_when>

<output_format>
Your standard report sections, in English. Under Findings, give the ordered steps with exact
commands in code blocks, each with its source, risk, and undo. At most 800 words outside the
Sources list.
</output_format>
```
