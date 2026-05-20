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
