# One Percent — Session Log
**onepercentlog2026-05-21-v2.md**
**Session date: May 21, 2026 (session 2)**

---

## What Was Done

### Entry 019 — VL.3 — Nominalization ✅
- Generated, committed, verified
- Concept selected after rejecting Loaded Language (too much Euphemism Treadmill overlap)
- Sources: Orwell 1946, Williams Style, Organization Science AI Task Force 2026
- Interactive verification completed with Matthew — all three sources confirmed
- Quote fix: "the banal statements" → "banal statements" (Orwell)
- Verify receipt updated with full verification status

### Bug Fix — Entry page unlock count
- Root cause: hardcoded `17` in `entry/[id]/page.js` unlock check — entries 018 and 019 were bouncing back to library
- Proper fix: created `lib/config.js` as single source of truth for `TOTAL_ENTRIES`
- Both `page.js` and `entry/[id]/page.js` now import from config
- `unlock.js` default also updated
- Adding new entries now requires: JSON file + ENTRIES array + `lib/config.js` bump only

---

## Matthew's Notes for Next Session

- **Backfill missing editions** — categories with only one or two entries need filling before the gap grows. Priority: NC, CM, MM, PH (all have 1-2 entries vs SC/AI which have 3+)
- **Lead with Meditation next session** — sits at PH/NC crossover, Matthew flagged it. Decide category at session start.
- **Next rotation slot: SC.4** — Mirroring or Labeling from Voss/Black Swan series

---

## Commits This Session
- `4d3a317` — Add Entry 019 — VL.3 Nominalization
- `ecb256c` — Add verify receipt, update backlog, session log
- `cf891bd` — Fix unlock count 17→19 in entry page
- `374c4a7` — Centralize TOTAL_ENTRIES in lib/config.js
- `6a18651` — Fix Orwell quote, flag 1.28 SD in verify receipt
- `8865944` — Verify receipt: 1.28 SD confirmed by Matthew

---

## Entry Manifest (19 entries)

| Entry | Edition ID | Category | Concept |
|---|---|---|---|
| 001 | AI.1.1 | AI | Context Window |
| 002 | VL.1 | Vocab & Language | Framing Effect |
| 003 | SC.1.1 | Sales Craft | Discovery Questions |
| 004 | MM.1 | Mental Models | Inversion |
| 005 | PH.1 | Philosophy | Premeditatio Malorum |
| 006 | AI.1.2 | AI | Prompt Sensitivity |
| 007 | SC.1.2 | Sales Craft | Talk/Listen Ratio |
| 008 | AI.2.1 | AI | Chain-of-Thought Prompting |
| 009 | VL.2 | Vocab & Language | Euphemism Treadmill |
| 010 | SC.2.1 | Sales Craft | Anchoring in Negotiation |
| 011 | MM.2 | Mental Models | Second-Order Thinking |
| 012 | AI.2.2 | AI | Hallucination / Confabulation |
| 013 | PH.2 | Philosophy | Dichotomy of Control |
| 014 | NC.1 | Neuroscience & Cognition | Neuroplasticity |
| 015 | SC.2.2 | Sales Craft | Tactical Empathy |
| 016 | CM.1 | Communication | Active Listening |
| 017 | SC.3.1 | Sales Craft | Multi-Threading |
| 018 | AI.3.1 | AI | RAG (Retrieval-Augmented Generation) |
| 019 | VL.3 | Vocab & Language | Nominalization |

