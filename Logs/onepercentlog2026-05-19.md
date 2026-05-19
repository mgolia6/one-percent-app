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
