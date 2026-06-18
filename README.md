# 🛡️ Microsoft Cybersecurity Mastery — Interactive Course

An interactive, **beginner-to-interview-ready** course covering the Microsoft security stack:
Windows, Active Directory, **Microsoft Entra ID**, Microsoft 365, Intune, PowerShell, and
**Microsoft Defender XDR & Sentinel** — written from the perspective of a senior Microsoft /
Azure cloud / network-security engineer, and aimed squarely at landing a **cybersecurity job**.

> Content is current as of **June 2026** (Azure AD → Entra ID, Endpoint Manager → Intune admin
> center, MSOnline/AzureAD PowerShell retirement, Microsoft 365 Defender → Defender XDR, Sentinel
> in the unified Defender portal).

---

## ▶️ How to open it

**Option 1 — just open the file (simplest).**
Double-click **`index.html`**, or open it in your browser. Everything runs locally with no
internet connection and no install. Your progress is saved in the browser.

**Option 2 — run a tiny local server (recommended for the “Copy” buttons).**
Some browsers restrict the clipboard API on `file://`. From this folder:

```bash
python3 -m http.server 8000
```

Then visit **http://localhost:8000** in your browser. (There's a built-in fallback copy method,
so Option 1 still works — this just makes it smoother.)

---

## 📚 What's inside

| # | Module | Focus |
|---|--------|-------|
| 0 | Foundations: Before You Begin | OS, networking, crypto, cloud & security basics — the absolute-beginner on-ramp |
| 1 | Windows OS & Security Fundamentals | Accounts, SIDs, NTFS/DACLs, LSASS, UAC, the built-in security stack, event logs |
| 2 | Active Directory & On-Prem Identity | Forests/domains, Kerberos vs NTLM, GPO, Kerberoasting, DCSync, Golden Ticket, defense |
| 3 | Cloud & Azure Fundamentals | Shared responsibility, the Azure hierarchy, RBAC, NSGs, managed identities, Defender for Cloud |
| 4 | Microsoft Entra ID (Identity & Access) | Conditional Access, MFA, PIM, Identity Protection, app registrations, hybrid identity |
| 5 | Microsoft 365 & Collaboration Security | SPF/DKIM/DMARC, Defender for Office 365, Purview/DLP, the audit log, BEC |
| 6 | Microsoft Intune & Endpoint Management | MDM vs MAM, compliance → Conditional Access, Autopilot, baselines, selective wipe |
| 7 | PowerShell for Admins & Security | Object pipeline, scripting, Graph & Az, AMSI, script-block logging |
| 8 | Defender XDR & Sentinel (SecOps) | SIEM/SOAR/XDR/EDR, the Defender workloads, KQL hunting, end-to-end IR |
| 9 | Zero Trust, Threats & Defense | ZT principles, the attack kill chain, control-by-control defenses, frameworks |
| 10 | Interview Bootcamp | Behavioral/STAR, alert-triage reasoning, SOC/IAM/cloud tracks, mock drills, closing strong |

Plus four always-available study tools:

- **🎯 Interview Prep** — 44 model-answered questions across 10 categories (incl. scenarios & strategy).
- **📋 Cheat Sheets** — 12 quick-reference cards (event IDs, KQL, AD attack↔defense, Conditional Access, ports, STAR, and more) for last-minute cram.
- **🃏 Flashcards** — 130 active-recall cards, filterable by module, with shuffle.
- **📖 Glossary** — 154 searchable terms.

**Totals:** 11 modules · 79 lessons · 87 quiz questions · 130 flashcards · 154 glossary terms · 12 cheat sheets · 44 interview Q&A.

---

## ✨ Features

- **Progress tracking** — mark lessons complete, take module quizzes; everything persists in your
  browser (`localStorage`). The header shows your overall % and each module shows its own bar.
- **Quizzes** — instant grading with explanations; 70% to pass; retry any time.
- **Full-text search** — press `/` and search every lesson, glossary term, and interview question.
- **Dark / light theme** — toggle in the top-right (🌙 / ☀️).
- **Keyboard nav** — `←` / `→` move between lessons; `/` focuses search.
- **Copy buttons** on every code/command block.
- **Learning objectives** at the top of every module, so you know the target before you start.
- **Accessibility** — keyboard-operable flashcards, ARIA on the interview accordions, non-color quiz feedback (✓/✗), and `prefers-reduced-motion` support.
- **Mobile-friendly** responsive layout.

To wipe progress and start fresh, use **↺ Reset progress** at the bottom of the sidebar.

---

## 🗺️ Suggested study plan

1. **Work modules 0 → 10 in order** — each builds on the last. Read, then **Mark complete**, then take the quiz. (Module 0 is the beginner primer; Module 10 is interview practice.)
2. **Run the commands.** Spin up a free **Microsoft 365 Developer tenant** and an **Azure free account** and actually try Conditional Access, PIM, Intune compliance, and a KQL query. Hands-on beats reading every time.
3. **Drill flashcards** a few minutes daily (spaced repetition).
4. **The week before an interview**, live in the **🎯 Interview Prep** tab — answer each question out loud *before* revealing the model answer.

Targeted certs that map to this material: **SC-900**, **AZ-900**, then **SC-300** / **SC-200**.

---

## 🧩 Project structure

```
index.html            # app shell + ordered <script> includes
css/styles.css        # all styling (dark/light themes, components)
js/app.js             # the engine: routing, rendering, quizzes, progress, search
js/data/course.js     # global namespace (window.COURSE)
js/data/mod-00..10.js # one file per module (lessons, quiz, flashcards, objectives)
js/data/interview.js  # interview question bank
js/data/glossary.js   # glossary terms
js/data/cheatsheets.js# quick-reference cheat sheets
```

It's all **dependency-free vanilla HTML/CSS/JS** — no build step, no npm, no frameworks. To add a
lesson, edit the relevant `mod-XX.js`; to add a module, drop in a new `mod-11.js` (with
`window.COURSE.modules.push({...})`) and add a `<script>` line to `index.html`.

---

*Built to get you hired. Good luck — you've got this. 🚀*
