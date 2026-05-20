# One Percent — Generation Log
**onepercentlog2026-05-19-v2.md**
**Session date: May 19, 2026 (continued)**

---

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
