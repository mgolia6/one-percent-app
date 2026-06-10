# One Percent — Session Log
**Date:** 2026-06-10
**Session:** 2 (appended)
**Entries published this session:** 0 (platform work only)

---

## What Happened

### Home Screen Redesign — Shipped
Full replacement of the home screen (`page.js`) with the v8+ design direction:

- **New layout:** Today / Library / Prompts / Progress bottom nav tabs
- **Today tab:** WHY I'M HERE commitment banner, 3 KPI chips (Completed, Streak, Avg Score), TODAY hero card with category icon + CONCEPT/IN THE WILD/LOCK IT IN moment strip, On Deck (next unlocked, or oldest incomplete if fully unlocked), Last Learned clickable to entry
- **Library tab:** 4x2 category chip grid with icon + name + completed/total count, chip tap toggles filter on/off, FAVORITES chip replaces ALL, default shows all
- **Prompts tab:** Prompt Farm with hero card + same category chip grid + prompt cards per completed entry
- **Progress tab:** Streak pill + week row, Concepts Locked In + Time Spent stat pair, quiz score sparkline with human insight, leaderboard card with live rank, category mastery rings with icons inside

### Goal Setting Ritual — Shipped
Full SMART commitment flow:

- 3-step sheet: What needs to change / When will you know / What will proof look like
- Sharper chips — no more Q2, no generic options
- Typewriter animation on dark screen writes sentence in Caveat handwriting font
- Paper folds away with "TUCKING THIS AWAY." — deliberate, not rushed
- "Committed." done state with context: "Every lesson you open from here will be measured against this."
- Saves `goal_what`, `goal_when`, `goal_proof` to Supabase `profiles` table (columns added via migration)
- Grammar: "I will change [what]. [When], I'll know it worked — [proof]."

### Concept / In the Wild / Lock It In — Shipped
Renamed morning/midday/evening across entire codebase:
- EntryViewer tab labels, section overlines, next buttons, post-entry feedback labels, morning challenge → YOUR MOVE
- Bug report dropdown options
- How It Works copy (onboarding + page.js)
- End of beta + weekly survey questions
- DB column names unchanged (topic_rating, clarity_rating, quiz_rating) — no migration needed

### Desktop Layout — Shipped
- On screens ≥768px: dark navy sidebar (240px) with Today/Library/Prompts/Progress nav + About/Bug/Feedback/Admin/Sign Out at bottom
- Main content area takes remaining width, max 680px
- Bottom nav and mobile header hidden on desktop
- Mobile unchanged

### Leaderboard Redesign — Shipped
- Parchment background matching main app
- YOUR STANDING hero card with accent bar, rank number, metric value
- Metric switcher in dark pill
- Each user row: progress bar at top edge, rank number, avatar, name, sub-stats, value, expandable breakdown
- Expanded: per-metric bars + overall score

### Admin Overhaul — Shipped
Full replacement of admin page:
- Light background (matches app aesthetic)
- **Users tab:** Status dot (engagement color), inline completed/streak/last seen, NUDGE button opens SMS sheet (pre-written message, opens native SMS if phone on file), expand for full stats + progress bar + reset actions
- **Bugs tab:** Open/Resolved/All filter, RESOLVE button per bug, browser info shown
- **Feedback tab:** Per-user filter, score summary (topic/clarity/quiz avg), written comments chronologically, click user from Users tab navigates here
- **API Health tab:** Run health check button — tests Supabase DB, Auth, daily reminder edge function, practice reminder edge function. Shows OK/FAIL + ms. Yellow warning card about Resend key being critical failure point.
- **Email tab:** Lists all 3 edge functions with schedules, step-by-step runbook for email outage debugging

### Bug Fixes
- **Page crash (React import):** Missing `import React` caused `React.cloneElement` to fail at runtime — page showed loading spinner forever. Fixed.
- **Init crash (loading never cleared):** Unhandled exceptions in `useEffect` init prevented `setLoading(false)` from firing. Wrapped in try/catch/finally.
- **Leaderboard N+1 blocking:** Promise.all of per-user completion queries was blocking page load. Moved to non-blocking try/catch.
- **Sessions wiped:** All Supabase auth sessions deleted via `DELETE FROM auth.sessions` to force re-login after redesign.

### Database
- Added `goal_what`, `goal_when`, `goal_proof` text columns to `profiles` table

### New Testers
- John Calamita, Wade Stock, Ankur Khanna, Chris Sherman, Reza Saboury, Larissa Rodriguez, Amy Burnette, Michelle Hentz, Matt Golia — LinkedIn DMs sent 2026-06-04, awaiting replies
- 2 new signups visible in Supabase (John + 1 unknown) as of this session

---

## Open / Deferred
- User signs name in commit ritual (store on profile, use in paper signature)
- Social sharing card ("I just learned X with One Percent")
- Profile page overhaul (additional info, better layout)
- Admin: error logger per user, more detailed API logging
- 001–008 quiz backfill
- ENH-007 email allowlist
- Zoho Mail inbox setup
- Magic link rate limit hit during session — default Supabase limit ~3-5/hr/email. Recommend increasing in Auth settings.
