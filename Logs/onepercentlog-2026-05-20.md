# One Percent — Session Log
**Date:** May 20, 2026
**Instructions version at start:** v1.23
**Instructions version at end:** v1.24

---

## Session type
Platform upgrades — no content generation this session.

---

## Work completed

### Bug fixes
- **ISSUE-002** — Weekly feedback trigger fixed: added null guard on `signup_date`, widened duplicate suppression window from 1 day to 7 days
- **ISSUE-003** — Entry page `useEffect` race condition fixed: `cancelled` abort flag prevents state updates on unmounted component
- **ISSUE-004** — Sign out loading state added to both `page.js` and `profile/page.js` — shows "SIGNING OUT..." and disables button

### Admin upgrades
- Redesigned to match library: `#dadada` background, dark pill tabs, readable labels (all `#333` → `#888`/`#666`)
- Added SURVEYS tab: live testable weekly and end-of-beta forms with Supabase write confirmation and reset button
- Added LEADERBOARD tab: all users including admins, emails visible, avatar, streak, best streak, comment count, last active
- Submitter attribution visible on all feedback tabs (email `#bbb` weight 500)
- Post-lesson tab: individual submissions now shown per entry, not just anonymous aggregated comments

### Leaderboard (`/leaderboard`)
- 7 metrics: Overall, Quiz Score, Streak, Best Streak, Lessons Completed, Comments, Speed
- Overall = normalized composite (0–100, averaged across all 6 metrics)
- Tap any row to expand full stat breakdown with per-metric bars, values, descriptions
- Admin excluded from user-facing board (`is_admin = false` filter)
- Display format: First L. with `(you)` tag, medal emoji top 3
- Tiebreaker: score first, then speed
- Speed: sub-20s completions filtered as test runs
- Fixed RLS: added `completions_read_all`, `feedback_read_all`, `profiles_read_all` policies for leaderboard data access
- Library: 🏆 LEADERBOARD button added next to analytics label

### Profile photos (ENH-001)
- Created `avatars` Supabase Storage bucket: public reads, user-scoped writes, 2MB, jpg/png/webp
- Added `avatar_url` column to profiles
- Profile page: tap avatar circle to upload, spinner during upload, cache-busted URL
- Library header avatar circle shows photo if set
- Leaderboard rows show avatar circle

### Onboarding
- Name step split into required first + last name fields
- Saves `first_name`, `last_name`, `name` (combined)
- Hint shown: "shows on the leaderboard as First L."

### Weekly feedback modal
- Removed "SKIP FOR NOW" option — completion required

### Data
- Set names for beta users: Brian Smith, Erin Lewber, DonRobbo McNaugher

### Analytics label fix
- `color: '#fff'` → `#0a0a0a` on library page (white on `#dadada` was washed out)

---

## Commits this session
- `ff202e0` — Fix ISSUE-002/003/004 + admin survey test lab
- `3be1546` — Admin: match library dark pill design + fix illegible labels
- `88aedf0` — Fix analytics washout + submitter attribution across all admin feedback tabs
- `4873fa2` — Leaderboard + onboarding name fix
- `13bcd13` — Fix leaderboard scoring
- `bc41fd2` — Leaderboard: tap to expand full stat breakdown per user
- `d38eea9` — Leaderboard: exclude admins, fix lesson counts, rename entries to lessons
- `6ba1361` — ENH-001: Profile photo upload
- `aa6f285` — Fix profile page build error - missing handleSignOut async declaration
- `ec21418` — Admin: add leaderboard tab
- `db593da` — Remove skip option from weekly feedback modal

---

## Changelog entry
Version 0.3 inserted into Supabase changelog table (published = false). Awaiting Matthew approval.

---

## Open items / next session candidates
- ENH-002: Profile page build-out (streak display, completed count, category breakdown, joined date)
- ENH-003: Weekly quiz standalone mode
- ENH-005: Admin changelog UI
- Entry 018: AI.3.1 — candidates: RAG, AI Agents, Temperature/Sampling
- Founders Club badge + badge system schema
