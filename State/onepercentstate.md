# One Percent — State Snapshot
**Generated:** 2026-05-27

---

## Rotation Position
- **Total entries:** 25
- **Last entry generated:** NC.3 (Dopamine & Motivation) — position 013
- **Next entry due:** SC (Sales Craft) — SC.3.2 or similar

## Category Counts
| Category | Count |
|---|---|
| Sales Craft | 6 |
| AI | 5 |
| Vocab & Language | 3 |
| Mental Models | 3 |
| Philosophy | 3 |
| Neuroscience & Cognition | 3 |
| Communication | 3 |

---

## Top Priorities
1. **Design sprint — header presence** — next design session picks up here
2. **Design sprint — nail one moment** — quiz completion / "you got it" state is the candidate
3. **Verify Jahic quote in Entry 017 (SC.3.1 Multi-Threading)** — still open
4. **ai_prompt backfill** — entries 001–008 and 014–025 need the field added
5. **PU-007** — copy button UI for ai_prompt field in EntryViewer
6. **Early entry quiz backfill** — entries 001–008 still have old recall-based quiz format; testers hitting these

---

## Open Issues
All four known bugs fixed this session:
- ~~ISSUE-002~~ ✅ Fixed — weekly survey skips admins, gates on ≥1 completion
- ~~ISSUE-003~~ ✅ Closed — ghost issue, no parallel loading code exists
- ~~ISSUE-004~~ ✅ Fixed — same fix as ISSUE-002
- ~~ISSUE-005~~ ✅ Fixed — onboarding now scrollable on short viewports

## Tester Progress (as of 2026-05-27)
You=14 (remapped), T2=8, T3=6, T4=3, T5=2, T6=1

---

## Design Prototype Status
Three prototype iterations produced this session (HTML files, not in repo):
- v1: dark, neon — too similar to current app
- v2: sand palette, morph+reveal transitions, SMART goal flow
- v3: dimensional today card, custom SVG tab icons, profile avatar header, legibility pass

**Validated directions:**
- Sand/warm off-white palette ✓
- Reveal (screen lift) + morph (tab crossfade) transitions ✓
- SMART goal commitment flow ✓ (validated by tester feedback — Brian accountability, Landon "who is this for")
- Dimensional today card (shadow layering, category accent top edge) ✓
- Custom SVG tab icons (sun/refresh/target) ✓
- No emojis anywhere ✓

**Still to resolve in design:**
- Header presence — feels unheroic, needs weight without being a hero image
- One micro-moment to nail — quiz completion "you got it" state is the candidate
- Completed vs locked entry differentiation — too similar visually
- Stats row emotional weight — streak should feel earned, not counted

**Implementation plan:** admin section as sandbox first, then roll to full app pending tester feedback

---

## Feedback Summary (pulled live this session)
- Quiz: Erin + Matthew flagged independently — application over recall. Already fixed in entries 009–025. Backfill needed for 001–008.
- Accountability gap: Brian flagged twice — goal feature addresses this
- Audience clarity: Landon — "who is this for" — unresolved, onboarding/entry header problem
- Audio: Erin asked twice — post-beta (ENH-004)
- AI prompt: Erin praised it explicitly — PU-007 copy button is right next move
- Weekly check-in pending — more feedback expected soon

---

## Key Decisions This Session
- All four known bugs fixed and closed
- Backlog updated: ISSUE-002/003/004/005 closed, PU-005/006 marked done
- Design direction confirmed: sand palette, reveal+morph transitions, goal feature
- Admin section confirmed as design sandbox before rolling to full app
- No product changes to live app without tester feedback first (standing rule)

---

## App / Repo
- **URL:** one-percent-app.vercel.app
- **Repo:** mgolia6/one-percent-app
- **Supabase:** uuzdlubbynavybttlmeh
- **Instructions:** Directions/onepercentinstructions-v1_32.md
