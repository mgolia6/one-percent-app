# One Percent — Session Log 2026-05-20

## What Was Built This Session

### 1. Onboarding Flow (`/app-next/app/onboarding/page.js`)
- 6-screen interactive commitment flow for beta testers
- Light blue-gray aesthetic (DM Mono + DM Sans) — intentional departure from dark theme
- Screens: Welcome → Access → Daily Feedback (most important) → Day 15 check-in → Day 30 feedback → Name capture
- Committed pills accumulate at bottom as user taps through each commitment screen
- Name + email captured on final screen, written to `profiles` table
- Sets `onboarding_complete = true` on completion
- Redirect logic in `page.js` — any user with `onboarding_complete = false` hits onboarding first

### 2. Post-Entry Feedback (`/app-next/components/EntryViewer.jsx`)
- `PostEntryFeedback` component fires after every quiz submission
- Three ratings: Topic (interesting/relevant?), Content (clear/useful?), Quiz (right things?)
- Optional freeflow comment field
- Writes to `feedback` table as `feedback_type: 'post_entry'` with entry number
- Daily feedback framed as the most critical ask in the onboarding

### 3. Day/Night Theme System (`/app-next/components/EntryViewer.jsx`)
- Three themes: morning (light blue-gray), midday (warm amber-dark), evening (original dark)
- Theme switches with tab — fade transition (0.4–0.6s ease)
- Header is sticky, shifts with theme, backdrop-filter blur
- `THEMES` constant defines full palette per tab: bg, surface, text, border, quiz options etc.
- **Known issue:** Quiz tab rendering too light after patch — needs follow-up audit

### 4. Supabase Schema (`supabase-schema-additions.sql`)
- `profiles`: added `name`, `onboarding_complete`, `is_admin`
- `feedback`: full table with topic/clarity/quiz/overall ratings, entry_number, freeflow comment
- `bug_reports`: table with RLS
- Applied directly to Supabase project `uuzdlubbynavybttlmeh` (one-percent-better)
- Both existing users reset to `onboarding_complete = false`

## Design Direction Decision
- **Pivoting away from all-dark.** New direction: light and airy as default.
- Library/home page: light blue-gray permanently
- Entry experience: day/night follows the tab (morning=light, midday=warm, evening=dark)
- Onboarding aesthetic is the style reference for the app shell redesign

## Verify Codeword
**Dead Drop** — Matthew goes to verify a claim, I surface it and wait. Interactive fact hunt.

## Known Bugs (see BUGS.md)
1. Quiz tab too light after theme patch
2. Celebration/confetti overlay stuck on screen, blocks post-entry feedback interaction
3. **CRITICAL — Content mismatch:** Entries serving wrong content
   - Euphemism Treadmill → Chain of Thought content
   - Second Order Thinking → Euphemism Treadmill content
   - Chain of Thought Prompting → Anchoring content
   - Anchoring → Second Order Thinking content
   - Neuroplasticity → Tactical Empathy content
   - Tactical Empathy → Neuroplasticity content
   Root cause: entry number / filename mismatch in JSON files or unlock logic
4. Multi-threading not working

## Priority for Next Session
1. Fix content mismatch (beta testers seeing wrong content NOW)
2. Fix celebration stuck on screen
3. Fix quiz too light
4. Investigate multi-threading

## Current Entry State
- Entry 001–011 complete (see previous logs)
- Next entry: 012 (AI category)
- Rotation: Sales Craft → AI → Vocab & Language → Mental Models → Philosophy → Neuroscience → Communication

## Repo
- `mgolia6/one-percent-app`
- Instructions: `Directions/onepercentinstructions-v1_18.md` (v1.19 not yet written)
- Token provided per session by Matthew

---

## Session Update 2026-05-20 (Part 2 — Feedback & Schema Fixes)

### Feedback System — Current State (All Three Surfaces)

#### 1. Daily Post-Entry Feedback (`PostEntryFeedback` in `EntryViewer.jsx`)
- Fires after every quiz submission
- Ratings: `topic_rating` (1-5), `clarity_rating` (1-5), `quiz_rating` (1-5)
- Optional freeflow: `comment`
- Writes to `feedback` table with `feedback_type: 'post_entry'` + `entry_number`
- Labels shown to user: Topic / Content / Quiz

#### 2. Weekly Modal (`WeeklyFeedbackModal` in `entry/[id]/page.js`)
- Auto-fires on day 7, 14, 21, 28 from signup when user opens an entry
- About overall product experience, NOT a specific entry
- Ratings: `topic_rating`, `clarity_rating`, `quiz_rating` + `would_recommend` (text) + `biggest_win` + `missing_topics`
- Writes to `feedback` table with `feedback_type: 'weekly'`
- Completely separate from daily — fires on entry open, daily fires post-quiz

#### 3. Anytime Feedback Button (home `page.js`)
- Always available on library/home page
- Single `overall_rating` (1-5) + freeflow `comment`
- Writes to `feedback` table with `feedback_type: 'landing'`
- Bug report button also present → writes to `bug_reports` table

### Supabase Schema Fixes Applied This Session
Problem: `feedback` table column names didn't match what components were writing.

Changes made directly in Supabase (project `uuzdlubbynavybttlmeh`):
- `relevance_rating` → renamed to `topic_rating` (matches both daily and weekly components)
- `overall_rating` → added (used by anytime feedback)
- `would_recommend` → changed from `boolean` to `text` (weekly sends 'Yes'/'Not yet'/'No')

Code fix committed:
- `entry/[id]/page.js` WeeklyFeedbackModal: updated to write `topic_rating` instead of `relevance_rating`

### Feedback Table Column Reference (current)
| column | type | used by |
|--------|------|---------|
| id | uuid | all |
| user_id | uuid | all |
| feedback_type | text | all ('post_entry', 'weekly', 'landing') |
| entry_number | text | post_entry only |
| topic_rating | integer | post_entry, weekly |
| clarity_rating | integer | post_entry, weekly |
| quiz_rating | integer | post_entry, weekly |
| overall_rating | integer | landing |
| would_recommend | text | weekly |
| missing_topics | text | weekly |
| biggest_win | text | weekly |
| comment | text | post_entry, landing |
| created_at | timestamptz | all |

### Supabase Access (for new sessions)
- Project: `one-percent-better`
- Project ID: `uuzdlubbynavybttlmeh`
- Region: us-east-1
- Supabase MCP is connected — use it directly, no manual SQL editor needed
- Env vars already set in Vercel (NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY)

### Styling Note
- Day/night theme system was built this session (morning=light, midday=warm, evening=dark)
- Theme was subsequently reverted — styling work to be continued in a dedicated session
- Home/library page light aesthetic direction still approved — just not implemented yet
- See other session for styling context
