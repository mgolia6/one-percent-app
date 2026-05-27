# One Percent — Generation Log
**onepercentlog2026-05-19.md**
**Session date: May 19, 2026**

---

## Session Summary

No new entry generated this session. Session was a recovery and infrastructure session following a glitched chat that failed mid-execution on May 18.

---

## What Happened — May 18 Session (other chat)

- Rebuilt entries 001–013 in new hybrid template format (v1.18 → v1.19)
- Successfully wrote 2 files to Google Drive before session glitched into incomplete response loop
- That session is dead — tokens burned, no recovery possible
- Two Drive files landed in wrong location (root level, not Claude/One Percent/) — those files are orphaned
- Entries 012 and 013 (and possibly others) were regenerated from scratch without archive originals present — content may have drifted from verified originals

---

## What Was Accomplished — May 19 Session (this chat)

### Template canonized — v1.19 hybrid

The new standard JSX template is now locked. Key changes from v1.18:

| Element | Old (v1.18) | New (v1.19) |
|---|---|---|
| Font | DM Mono | Inter |
| Tab icons | emoji only | Lucide: BookOpen, Lightbulb, Award |
| max-width | 680px | 720px |
| Body text | 13px / #888 | 15px / #bbb |
| Reframe | 16px | 17px / fontWeight 500 |
| Concept title | 28px / fontWeight 500 | 32px / fontWeight 600 |
| Hook | 18px | 20px |
| Celebration (3/3) | brain + fireworks | starburst rays + particles |
| Score label (3/3) | "LOCKED IN 🔒" | "PERFECT SCORE" |
| Closing line | 13px / #aaa | 14px / #aaa / italic |

### Instructions updated — v1.19

`onepercentinstructions-v1_19.md` written and committed to `Directions/`. Key additions:

- v1.19 hybrid template fully specified (CSS, style object, celebration animation)
- PDF removed as standard output — on-request only
- Output set reduced to 5
- GitHub as file storage protocol (replacing Google Drive)
- Archive gate rule added — no regeneration without source file present
- Google Drive folder structure retired

### GitHub repo initialized

Repository: `mgolia6/one-percent-app`

Folder structure created:
```
one-percent-app/
├── Logs/
├── Directions/
├── Backlog/
├── Archive-Original-JSX/
└── Editions/
```

Files committed this session:
- `Directions/onepercentinstructions-v1_19.md`
- `Backlog/onepercentbacklog.md` (carried forward from project files — last updated May 17, 2026)
- `Logs/onepercentlog2026-05-19.md` (this file)

---

## Outstanding Items — Action Required

### Archive gate is blocking all regeneration

Before any existing entry can be rebuilt in the v1.19 template, the original files must be in `Archive-Original-JSX/`. Matthew needs to locate originals on desktop and upload them.

Entries that need originals:
- 001 — AI — Context Window
- 002 — Vocab & Language — Framing Effect
- 003 — Sales Craft — (confirm concept)
- 004 — Mental Models — Inversion
- 005 — Philosophy — Premeditatio Malorum
- 006 — AI — Prompt Sensitivity
- 007 — Sales Craft — (confirm concept)
- 008 — Vocab & Language — Euphemism Treadmill
- 009 — Mental Models — Second-Order Thinking
- 010 — AI — Chain-of-Thought Prompting
- 011 — Sales Craft — Anchoring in Negotiation
- 012 — AI — Hallucination / Confabulation
- 013 — Philosophy — Dichotomy of Control
- 014 — Neuroscience — Neuroplasticity
- 015 — Sales Craft — Tactical Empathy

### New entry generation

Next in rotation: determine current position in cycle based on entries 014 and 015. Likely next is AI (slot 6, cycle 2) or VL/MM depending on confirmed rotation position. Read log and backlog before next generation.

### Orphaned Drive files

Two files were written to Google Drive root level during the failed May 18 session. Matthew to locate and delete or move manually.

---

## Entries Log — All Entries to Date

| Entry | Edition ID | Category | Concept | Status |
|---|---|---|---|---|
| 001 | AI.1.1 | AI | Context Window | Original needs archive |
| 002 | VL.1 | Vocab & Language | Framing Effect | Original needs archive |
| 003 | SC.1.1 | Sales Craft | Discovery Questions | Original needs archive |
| 004 | MM.1 | Mental Models | Inversion | Original needs archive |
| 005 | PH.1 | Philosophy | Premeditatio Malorum | Original needs archive |
| 006 | AI.1.2 | AI | Prompt Sensitivity | Original needs archive |
| 007 | SC.1.2 | Sales Craft | Talk/Listen Ratio | Original needs archive |
| 008 | VL.2 | Vocab & Language | Euphemism Treadmill | Original needs archive |
| 009 | MM.2 | Mental Models | Second-Order Thinking | Original needs archive |
| 010 | AI.2.1 | AI | Chain-of-Thought Prompting | Original needs archive |
| 011 | SC.2.1 | Sales Craft | Anchoring in Negotiation | Original needs archive |
| 012 | AI.2.2 | AI | Hallucination / Confabulation | Original needs archive |
| 013 | PH.2 | Philosophy | Dichotomy of Control | Original needs archive |
| 014 | NC.1 | Neuroscience & Cognition | Neuroplasticity | Original needs archive |
| 015 | SC.2.2 | Sales Craft | Tactical Empathy | Original needs archive |

---

*Next session: confirm archive uploads before any regeneration. Then generate next entry in rotation.*

---

## Session 2

## Session Summary

Infrastructure and app build session. No new entry generated. All 16 existing entries converted to JSON format for the app.

---

## What Was Accomplished

### GitHub repo fully scaffolded
Repository: `mgolia6/one-percent-app`
- All folders created: Logs/, Directions/, Backlog/, Archive-Original-JSX/, Editions/
- 16 original JSX files uploaded to Archive-Original-JSX/ by Matthew from desktop
- Instructions v1.19, backlog, and log committed

### Next.js app built and deployed
- App lives in `/app-next/` subdirectory of repo
- Live at: `https://one-percent-app.vercel.app`
- Auth working: magic link login via Supabase
- Library view: shows all 16 entries, locked/unlocked state, stats bar
- Entry view: full EntryViewer component with morning/midday/evening tabs
- Quiz: all three questions, single submit, score celebration
- Post-completion card: "BACK TO LIBRARY" + "VIEW SOURCES" actions
- Stats saved to Supabase on quiz completion

### Supabase project created
- Project: `one-percent-better` (ID: `uuzdlubbynavybttlmeh`)
- Schema applied: profiles + completions tables with RLS
- Auth configured: magic link redirect URLs set for Vercel domain

### All 16 entries converted to JSON
All files in `app-next/public/entries/`:
001.json through 016.json — all complete with correct canonical format

### Instructions updated
v1.19 updated with full app build state, architecture, JSON format spec, adding new entries workflow

---

## Known Issues / Open Items

1. **JSX rebuilds paused** — decided JSX is no longer the primary format. App JSON is canonical. JSX rebuilds are optional/deprioritized.
2. **Library view** — functional but minimal. Visual polish deferred to post-beta feedback.
3. **Entry manifest** — hardcoded in page.js. Should be data-driven eventually.
4. **Supabase email rate limit** — free tier limits magic link emails. Not an issue for beta (users won't be logging in/out repeatedly).
5. **Next entry** — Entry 017 not yet generated. Next in rotation: determine position. After 016 (CM.1), rotation returns to slot 1: SC.

---

## Entries Log

| Entry | Edition ID | Category | Concept | JSON | Status |
|---|---|---|---|---|---|
| 001 | AI.1.1 | AI | Context Window | ✓ | Live in app |
| 002 | VL.1 | Vocab & Language | Framing Effect | ✓ | Live in app |
| 003 | SC.1.1 | Sales Craft | Discovery Questions | ✓ | Live in app |
| 004 | MM.1 | Mental Models | Inversion | ✓ | Live in app |
| 005 | PH.1 | Philosophy | Premeditatio Malorum | ✓ | Live in app |
| 006 | AI.1.2 | AI | Prompt Sensitivity | ✓ | Live in app |
| 007 | SC.1.2 | Sales Craft | Talk/Listen Ratio | ✓ | Live in app |
| 008 | AI.2.1 | AI | Chain-of-Thought Prompting | ✓ | Live in app |
| 009 | VL.2 | Vocab & Language | Euphemism Treadmill | ✓ | Live in app |
| 010 | SC.2.1 | Sales Craft | Anchoring in Negotiation | ✓ | Live in app |
| 011 | MM.2 | Mental Models | Second-Order Thinking | ✓ | Live in app |
| 012 | AI.2.2 | AI | Hallucination | ✓ | Live in app |
| 013 | PH.2 | Philosophy | Dichotomy of Control | ✓ | Live in app |
| 014 | SC.2.2 | Sales Craft | Tactical Empathy | ✓ | Live in app |
| 015 | NC.1 | Neuroscience & Cognition | Neuroplasticity | ✓ | Live in app |
| 016 | CM.1 | Communication | Active Listening | ✓ | Live in app |

---

## Next Session Priorities

1. Test all 16 entries in the live app — click through each, verify content renders correctly
2. Generate Entry 017 — next in rotation is SC (slot 1 of cycle 3: SC.3.1)
3. Any UX fixes surfaced from testing
4. Begin beta invite process when ready

---

*GitHub token provided this session: revoke at github.com/settings/tokens after use*

---

## Session 3

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
