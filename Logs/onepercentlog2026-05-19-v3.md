# One Percent — Generation Log
**onepercentlog2026-05-19-v3.md**
**Session date: May 19, 2026 (session 3)**

---

## Session Summary

Admin/infrastructure session + Entry 017 generation. First entry committed directly to GitHub repo under the new Editions/ structure.

---

## Infrastructure Completed This Session

### Admin access
- `mgolia6@gmail.com` set to `is_admin = true` in Supabase profiles table
- signup_date backdated to 2026-01-01 — all 16 entries unlocked
- Admin badge displays in library header
- `/admin` dashboard route added — tabs: Feedback, Bugs, Users

### Feedback system
- `feedback` table added to Supabase (daily/weekly/landing types, structured weekly fields)
- `bug_reports` table added (page, description, browser_info)
- RLS policies applied — users write own, admins read all
- FEEDBACK button in library header → quick modal (1–5 + optional comment)
- BUG button in library header → bug report modal (page selector + description)
- Weekly deep feedback: auto-triggers every 7 days from signup; rates clarity/relevance/quiz; asks recommend + open text fields

### Entry 017 added to app
- `app-next/public/entries/017.json` created
- `TOTAL_ENTRIES` updated to 17 in `app-next/app/page.js`
- Entry 017 added to ENTRIES manifest array

---

## Entry Generated

| Field | Value |
|---|---|
| Entry | 017 |
| Edition ID | SC.3.1 |
| Category | Sales Craft |
| Concept | Multi-Threading |
| Date created | 2026-05-19 |
| In the Wild type | B (composite scenario, LinkedIn tenure stat anchor) |
| AI nudge | Yes — stakeholder mapping tools |
| Sources verified | 3 (Gartner, Aviso, Salesmotion/LinkedIn) |
| Quote | Semir Jahic, Salesmotion 2026 — FLAG: verify exact wording ("themselves" vs "about themselves") |

### Files generated
1. `app-next/public/entries/017.json`
2. `Editions/017-SalesCraft-MultiThreading/onepercent2026-05-19-salecraft-multithreading.jsx`
3. `Editions/017-SalesCraft-MultiThreading/onepercentpost2026-05-19-salecraft-multithreading.md`
4. `Editions/017-SalesCraft-MultiThreading/onepercentverify2026-05-19-salecraft-multithreading.md`

PDF: not generated (on-request only per v1.19)
Carousel HTML: not generated this session — deferred

LinkedIn Document Title: **One Percent #017 — Multi-Threading**

---

## Open Items / Next Session

1. **Beta onboarding PDF** — instructions for Justin Simpson and Robb McNaugher; target 10 users by Friday
2. **Carousel HTML for 017** — not generated this session
3. **Quote flag** — verify "themselves" vs "about themselves" in Jahic quote before publishing
4. **Entry 018** — next in rotation: AI (AI.3.1) — candidates: RAG, AI Agents, Temperature/Sampling
5. **Backlog update** — multi-threading marked used; backlog file needs update

---

## Full Entry Manifest (as of this session)

| Entry | Edition ID | Category | Concept | Status |
|---|---|---|---|---|
| 001 | AI.1.1 | AI | Context Window | Live |
| 002 | VL.1 | Vocab & Language | Framing Effect | Live |
| 003 | SC.1.1 | Sales Craft | Discovery Questions | Live |
| 004 | MM.1 | Mental Models | Inversion | Live |
| 005 | PH.1 | Philosophy | Premeditatio Malorum | Live |
| 006 | AI.1.2 | AI | Prompt Sensitivity | Live |
| 007 | SC.1.2 | Sales Craft | Talk/Listen Ratio | Live |
| 008 | AI.2.1 | AI | Chain-of-Thought Prompting | Live |
| 009 | VL.2 | Vocab & Language | Euphemism Treadmill | Live |
| 010 | SC.2.1 | Sales Craft | Anchoring in Negotiation | Live |
| 011 | MM.2 | Mental Models | Second-Order Thinking | Live |
| 012 | AI.2.2 | AI | Hallucination / Confabulation | Live |
| 013 | PH.2 | Philosophy | Dichotomy of Control | Live |
| 014 | NC.1 | Neuroscience & Cognition | Neuroplasticity | Live |
| 015 | SC.2.2 | Sales Craft | Tactical Empathy | Live |
| 016 | CM.1 | Communication | Active Listening | Live |
| 017 | SC.3.1 | Sales Craft | Multi-Threading | Live — generated this session |
