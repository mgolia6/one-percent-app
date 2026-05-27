# One Percent — Session Log
**Date:** 2026-05-27
**Log:** onepercentlog2026-05-27-v1.md

---

## Session Summary

Bug fix and UI polish session. No new content generated. Focus was on correctness from the prior content session, then a sweep of admin, profile, and navigation improvements.

---

## Issues Found and Fixed

### 🔴 CRITICAL: Entry renumbering broke completions and visibility (root cause of session)
The prior session inserted 5 new entries at positions 9–13 and renumbered 9–20 → 14–25. Three things were not updated:

1. **`TOTAL_ENTRIES` in `lib/config.js`** — still set to 20. App capped unlock and display at 20 entries. Fixed → 25.
2. **Entry manifest in `page.js`** — still used old numbering (009=VL.2, etc.) and stopped at 020. Fixed → full 25-entry manifest with correct post-renumber assignments.
3. **Completions in Supabase** — mgolia6's completion records (entries 009–011, 018–020) still referenced old positions. After the renumber, those records pointed at the wrong entries. Fixed via SQL UPDATE remapping: 009→014, 010→015, 011→016, 018→023, 019→024, 020→025. Other testers were all at ≤008 and unaffected.

**What this means going forward — see LESSON LEARNED section below.**

### Secondary fixes
- `unlock.js` default `totalEntries` param was still 19 — fixed to 25 (harmless since TOTAL_ENTRIES from config is always passed in, but now consistent)
- `ENTRIES` array in `profile/page.js` was the old 19-entry list on old numbering — fixed to correct 25-entry list

---

## Features Built

### End-of-beta survey trigger
- Added `end_of_beta_survey_done boolean` column to `profiles` table
- Trigger fires on page load when `completions.length >= TOTAL_ENTRIES` and `end_of_beta_survey_done = false`
- Full `EndOfBetaModal` component lifted from admin page into `page.js` with proper modal wrapper
- Writes to `feedback` table as `feedback_type = 'end_of_beta'`, sets flag on success
- Fires once, never again. Currently triggers at 25; will auto-update when TOTAL_ENTRIES hits 30.

### Admin page — user cards redesign
- Collapsed: name + email + lessons (X/25). Clean, mobile-friendly.
- Expanded: two labeled sections — DATES (onboarded, last sign in, last lesson) and METRICS (lessons, streak, best streak, badges, surveys, instant feedback, bugs, phone)
- Section headers white + bold to break gray-on-gray
- Completions fetched from Supabase on load (user_id + completed_at) to compute last lesson date and count per user
- Feedback/bug counts computed from already-fetched global arrays — no extra queries
- Badge count approximated from available profile data (8/10 badges computable without per-entry category data)
- Removed refresh button (unnecessary)

### Admin page — button contrast
- REFRESH removed
- LIBRARY button now dark pill (`#1a1a1a` bg) — visible on light `#dadada` admin background

### Profile page — 3-tab restructure
- Tab order: PROGRESS → BADGES → PROFILE (lands on Progress by default)
- Progress tab: category bars with %, fraction, color dot. Total row at bottom.
- Badges tab: unchanged
- Profile tab: account fields + save/sign out only
- Category progress removed from Profile tab (was buried there before)
- ENTRIES array corrected to 25 entries with post-renumber category assignments

### Navigation — sticky back nav
- Profile page: sticky `← LIBRARY` bar at top
- Leaderboard page: sticky bar with `← LIBRARY` left + `LEADERBOARD` label right
- Entry page: already had sticky nav — no change needed

### Landing page
- Trophy emoji `🏆` replaced with Lucide `Trophy` icon (consistent with rest of app)

---

## 🔴 LESSON LEARNED: Entry insertion/renumbering protocol

**What went wrong:** We inserted 5 entries mid-catalog (positions 9–13), shifted existing entries up (9–20 → 14–25), but did not update the three places that must always stay in sync:
1. `lib/config.js` → `TOTAL_ENTRIES`
2. Entry manifest in `app/page.js`
3. `app/profile/page.js` ENTRIES array
4. Supabase `completions` table — existing records reference entry numbers by position

**Required protocol for any future entry insertion or renumbering:**

When adding entries to the END of the catalog (safest):
- Add JSON file with next number
- Increment `TOTAL_ENTRIES` in `lib/config.js`
- Add row to manifest in `app/page.js`
- Add row to ENTRIES array in `app/profile/page.js`
- No Supabase migration needed (no existing records affected)

When inserting entries MID-CATALOG (avoid unless necessary):
- All of the above PLUS:
- SQL UPDATE to remap all affected completion records for every user
- Verify remapping against actual completion data before pushing
- Check which testers have progress past the insertion point — remap only those users
- Do NOT push the renumbered JSON until the SQL remap is confirmed

**Rule of thumb: always append. Never insert mid-catalog during an active beta.**

---

## Commits This Session

- `Fix: update TOTAL_ENTRIES to 25, sync entry manifest with renumbered entries`
- `End-of-beta survey: trigger on all entries completed, one-time flag in profiles`
- `Admin: fix button contrast, expandable user cards with onboard/last-login/last-lesson/completion count`
- `Admin users: lean collapsed row (name/email/lessons), full stats grid expanded`
- `Admin: dark page bg, visible buttons, +/- toggle instead of chevron, uniform lesson count` ← REVERTED (dark bg was wrong)
- `Admin: revert to light bg, fix buttons as dark pills against light background`
- `Remove admin refresh button; replace trophy emoji with Lucide icon`
- `Admin user cards: split expanded into DATES and METRICS sections`
- `Admin user cards: white bold section headers to break gray-on-gray`
- `Profile: 3 tabs (Progress→Badges→Profile), land on Progress, fix 25-entry list`
- `Profile progress: add total row at bottom`
- `Sticky back nav on profile and leaderboard pages`
- `Fix unlock.js default totalEntries from 19 to 25`

---

## Open Items Carried Forward

- Entry 026 (SC category — next in rotation per state snapshot)
- Verify Jahic quote in Entry 017 (SC.3.1) — still open
- LinkedIn carousel HTML for Entry 017 — deferred
- Weekly feedback test trigger for backdated signups (ISSUE-002)
- Multi-threading bug (ISSUE-003)
- ai_prompt backfill for entries 001–008 and 014–025
- PU-007 — copy button UI for ai_prompt field in EntryViewer
- End-of-beta survey question about time-gating vs completion-gating unlock model


---
## Session 2

- **ISSUE-002 + ISSUE-004 (combined fix):** Weekly survey trigger now skips admin accounts entirely and gates on ≥1 completion before firing. Zero-activity users no longer see the modal. Single `limit(1)` Supabase query added for efficiency.
- **ISSUE-003:** Investigated and closed as ghost issue — no parallel loading code exists in the codebase.
- **ISSUE-005:** Onboarding text overlap fixed. Root cause: `overflow:hidden` + `justifyContent:center` was clipping content on short viewports with no scroll. Fixed to `overflowY:auto` + `justifyContent:flex-start` with `padding:80px 24px 100px`. Removed dynamic `paddingBottom` hack on card. Added `flex:1/maxHeight:80` spacer for tall-viewport centering.

### Backlog
- ISSUE-002/003/004/005 all closed
- PU-005 (profile 3-tab) and PU-006 (admin expandable cards) marked done — shipped last session

### Design Prototype Sprint
Three iterations of interactive HTML prototype:

**v1 — Neural Architecture / Signal:** Two dark-palette direction mocks. Feedback: too similar to current app, needed animation and interactivity not just reskin.

**v2 — Interactive prototype:** Full screen-to-screen reveal transitions, morph tab transitions, SMART goal commitment flow, sand palette. Feedback: today card too dark/jarring, some font still lost, liked icons for tabs, header unheroic, profile avatar wanted.

**v3 — Current best:** Dimensional today card (triple shadow, category color top accent, lift on press), custom SVG icons (sun/refresh/target for Morning/Midday/Quiz), profile avatar in header, legibility pass (ink2 62%, ink3 40%), "what's next" strip, seed chips for SMART goal that activate writing rather than auto-fill. Goal chips reworded to behavioral not aspirational.

### Feedback Pull
Pulled all 28 feedback rows from Supabase. Key findings:
- Quiz flagged by Erin + Matthew independently — already fixed in 009–025, backfill needed for 001–008
- Brian: accountability gap (twice) — goal feature validated
- Landon: "who is this for" — audience clarity, unresolved
- Erin: audio request (twice), praised AI prompt field
- Content ratings generally 4–5, healthy signal

## Commits
- `Fix ISSUE-002 + ISSUE-004: skip weekly survey for admins, gate on at least one completion`
- `Fix ISSUE-005: onboarding scrollable on short viewports, remove paddingBottom hack`
- `Backlog: close ISSUE-002/003/004/005, mark PU-005/006 done`

## Next Session Picks Up At
1. Header presence — needs weight, feels unheroic
2. Nail one micro-moment — quiz completion "you got it" state
3. Then: translate validated design to admin sandbox in real app

---
## Session 3


**ai_prompt field backfill:**
All 17 entries missing the field were written and injected in a single pass:
- Entries 001–008 (original batch, never had the field)
- Entries 014–025 (second batch, added since 009–013)
- Entries 009–013 already had the field from a prior session

Each prompt follows the established format: first-person, instructs the AI to ask before diving in, tailored to the concept, ends with a `[describe it]` fill-in. Covers all seven categories.

**Copy button (PU-007 UI):**
- New `AI PROMPT` card renders in EntryViewer after quiz submission (inside the `submitted` gate)
- Accent-tinted background, accent border, labeled "AI PROMPT" in category color
- Button reads `COPY PROMPT` → flips to `✓ COPIED` for 2 seconds → resets
- `promptCopied` state added to main EntryViewer component
- Conditional render: `{entry.ai_prompt && ...}` — safe for any entry missing the field
- Positioned above the WHAT'S NEXT completion card — right moment (just finished the concept, now apply it)

**Onboarding — new screen:**
- Inserted between `access` (how entries work) and `bug` (feedback — 1 of 4)
- Eyebrow: `BUILT IN` | Heading: `Every entry ends with an AI prompt.`
- Explains: find it after the quiz, copy it into any AI, takes the concept from abstract to applied
- No commitment, CTA: `GOT IT →`
- Progress bar and dot indicators are fully dynamic (driven by `STEPS.length`) — new screen picked up automatically, nothing hardcoded broke

**About page — HOW IT WORKS section:**
- Fourth item added after Evening Quiz
- `#C847FF` accent (purple), consistent with section formatting
- Copy: "After the quiz, a ready-to-use prompt appears — built around the day's concept. Copy it into any AI and take the learning somewhere real."

### Product Discussion — Prompt Library
Matthew raised the idea of a dedicated prompt library (all prompts in one place). Decision: defer until tester signal. Matthew is a user too and felt the pull, but the standing rule is no new features on one person's judgment alone. Onboarding + about page changes seed awareness so real usage signal can develop.

### Onboarding Integrity Check
Audited progress indicator logic after adding the new screen. All dynamic — `STEPS.length` drives progress bar percentage, dot count, and `isLast` check. Nothing hardcoded. 9 screens, correct order, all required fields (`eyebrow`, `heading`, `cta`, `commitment`) present on every screen.

### Changelog — v0.7
Inserted directly to Supabase `changelog` table:
- Version: 0.7
- Title: "AI prompt — one more way to lock it in"
- `show_modal: true` — modal fires for all testers who haven't seen this version
- Framing: learning angle, not feature announcement

## Commits
- `PU-007: ai_prompt field backfill (entries 001-008, 014-025) + copy button in EntryViewer`
- `Add AI prompt to onboarding (new screen) and about page how-it-works section`

## Next Session Picks Up At
1. Header presence — feels unheroic, needs weight (design sprint)
2. Nail one micro-moment — quiz completion "you got it" state (design sprint)
3. Early entry quiz backfill — entries 001–008 still have old recall-based format
4. Verify Jahic quote in Entry 017 (SC.3.1 Multi-Threading) — still open
