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
1. **Next entry: SC.3.2** — Sales Craft is next in rotation
2. **Verify Jahic quote in Entry 017 (SC.3.1 Multi-Threading)** — still open
3. **ai_prompt backfill** — entries 001–008 and 014–025 need the field added
4. **PU-007** — copy button UI for ai_prompt field in EntryViewer
5. **LinkedIn carousel HTML for Entry 017** — deferred

---

## Open Issues
- ISSUE-002: Weekly feedback trigger broken for backdated/admin signups
- ISSUE-003: Multi-threading bug (parallel entry loading)
- ISSUE-004: Weekly wrap modal fires for zero-completion users
- ISSUE-005: Onboarding text overlap on mobile — last few cards

## Tester Progress (as of 2026-05-27)
You=14 (remapped), T2=8, T3=6, T4=3, T5=2, T6=1

---

## Key Decisions This Session
- Entry insertion mid-catalog is now explicitly prohibited during active beta — append only
- End-of-beta survey triggers on `completions.count >= TOTAL_ENTRIES`, not day 30
- Profile page lands on Progress tab by default (PROGRESS → BADGES → PROFILE)
- Admin page stays light background (#dadada) — dark bg broke other sections
- Sticky back nav now on profile + leaderboard (entry already had it)
- Time-gated unlock (one per day regardless of completion) confirmed as correct — add question to end-of-beta survey

---

## App / Repo
- **URL:** one-percent-app.vercel.app
- **Repo:** mgolia6/one-percent-app
- **Supabase:** uuzdlubbynavybttlmeh
- **Instructions:** Directions/onepercentinstructions-v1_32.md
