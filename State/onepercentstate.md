# One Percent — State Snapshot
**Generated:** 2026-05-27 (v4)

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
1. **Design sprint — header presence** — feels unheroic, needs weight without being a hero image
2. **Design sprint — nail one moment** — quiz completion / "you got it" state is the candidate
3. **Early entry quiz backfill** — entries 001–008 still have old recall-based quiz format; testers hitting these
4. **Verify Jahic quote in Entry 017 (SC.3.1 Multi-Threading)** — still open

---

## Open Issues
All known bugs resolved. No open issues.

## Tester Progress (as of 2026-05-27)
You=14 (remapped), T2=8, T3=6, T4=3, T5=2, T6=1

---

## AI Prompt — Fully Shipped
- `ai_prompt` field now present on all 25 entries
- Copy button in EntryViewer (after quiz submission, above WHAT'S NEXT card)
- New onboarding screen (screen 3 of 9) introduces the feature
- About page HOW IT WORKS section updated with fourth item
- PU-007 closed

## Design Prototype Status
Three prototype iterations produced (HTML files, not in repo):
- v1: dark, neon — too similar to current app
- v2: sand palette, morph+reveal transitions, SMART goal flow
- v3: dimensional today card, custom SVG tab icons, profile avatar header, legibility pass

**Validated directions:**
- Sand/warm off-white palette ✓
- Reveal (screen lift) + morph (tab crossfade) transitions ✓
- SMART goal commitment flow ✓
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

## Feedback Summary
- Quiz: Erin + Matthew flagged independently — application over recall. Fixed in 009–025. Backfill needed for 001–008.
- Accountability gap: Brian flagged twice — goal feature addresses this
- Audience clarity: Landon — "who is this for" — unresolved
- Audio: Erin asked twice — post-beta (ENH-004)
- AI prompt: Erin praised it — PU-007 now fully shipped
- Prompt library idea raised by Matthew — deferred pending tester signal

---

## Key Decisions This Session
- Repo cleanup complete — no product changes, app untouched
- Log convention locked: one file per day, session headers, no -v2 suffixes
- Directions convention locked: active version in root only, old versions → Archive/
- Editions convention locked: JSX source files live in Editions/ subfolders
- Archive-Original-JSX deprecated and deleted — all JSX moved to Editions/
- Claude Project instructions reviewed and confirmed accurate
- Active instructions: Directions/onepercentinstructions-v1_34.md

---

## App / Repo
- **URL:** one-percent-app.vercel.app
- **Repo:** mgolia6/one-percent-app
- **Supabase:** uuzdlubbynavybttlmeh
- **Instructions:** Directions/onepercentinstructions-v1_34.md
