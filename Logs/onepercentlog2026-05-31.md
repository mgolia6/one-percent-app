# One Percent — Session Log
**Date:** 2026-05-31
**Session:** 1

---

## What We Did

### Feedback Review
- Pulled all feedback from Supabase `feedback` table
- Mapped user IDs to names (DonRobbo, Erin, Brian, Landon, Andrew)
- Synthesized themes: access/habit friction, audio, quiz design, bookmarking, email inconsistency, leaderboard, streak anxiety

### Product Backlog Update
- Marked quiz revamp ✅ done
- Marked voice feedback ✅ done
- Marked AI prompt copy ✅ done
- Added entry bookmarking to Approved Builds
- Added ENH-010 push notifications (user-requested x2)
- Added ENH-011 home screen widget + streak counter
- Logged ISSUE-006 Firefox Focus login friction

### Beta Check-In Survey — Built & Deployed
- Created `beta_checkin` table in Supabase (RLS enabled)
- Built `/survey/[userId]` page — v3 parchment aesthetic, no auth required
- Side-by-side design comparison (current dark vs v3 warm) embedded in survey
- Questions laddered by tier: superuser / fence / low engagement
- Goal-setting called out as "coming before end of beta" in feature priorities step
- Screenshots: `public/survey-assets/current-app.png` + `public/survey-assets/v3-prototype.png`

### Beta Check-In Emails — Sent
- Built `send-beta-checkin` Supabase Edge Function
- v3 parchment HTML email style — warm background, DM Mono wordmark, card layout, mpgink.com footer
- 5 personalized emails sent successfully via Resend from `matthew@mpgink.com`:
  - DonRobbo McNaugher — super user, Mental Models, leaderboard, streak loss
  - Erin Lewber — super user, audio x2, quiz recall fix called out
  - Brian Smith — fence, discovery reframe, accountability gap
  - Landon Martin — low, bookmarking, notification friction, detailed submitter
  - Andrew Hall — low, re-engagement, honest ask
- All 5 confirmed `"ok": true` from Resend

### Roadmap — Created
- `onepercentroadmap.md` committed to repo root
- Three tiers: Before Beta Ends (8 items), Post-Beta Pre-Launch (10 items), Long-Term
- Sequenced by urgency, not wish list

### Bookmarking / Favorites — Built & Deployed
- Created `bookmarks` table in Supabase (RLS, unique per user+entry)
- Star icon (`☆`/`★`) on every unlocked entry card — `#555` at rest, `#E8FF47` when saved
- Optimistic UI — flips instantly, syncs to Supabase in background
- Added `Saved` filter tab to library between Completed and Sales Craft
- Visibility fix pushed after first deploy (star was too dark)

### Admin — Beta Check-In Tab
- Added `BETA CHECK-IN` tab to admin dashboard
- Fetches from `beta_checkin` table with profile join
- Shows: name, tier badge (color-coded), design preference, prompt farm interest, friction reason, feature priorities ranked, open comment
- Added to both `init()` and `refreshAll()` fetches

---

## Items Knocked Off the Backlog

| Item | Notes |
|---|---|
| ✅ Entry bookmarking / favorites | Approved Builds → Done. `bookmarks` table + star icon + Saved tab |
| ✅ Admin — beta check-in responses tab | New BETA CHECK-IN tab in admin. Reads `beta_checkin` |
| ✅ Zero-completion gate | Already done May 27 — confirmed in code, closed |
| ✅ PU-001 Library refresh button | Already fixed prior session — confirmed closed |
| ✅ PU-004 Leaderboard trophy emoji | Already done prior session — confirmed closed |

---

## Still Open (Priority Order)

1. Quiz backfill — entries 001–008 (old recall format, testers hitting these)
2. Personalized goal-setting (promised in all 5 emails before beta ends)
3. Email consistency audit — 2 users flagged missing emails
4. Verify Jahic quote — Entry 017 SC.3.1 (Dead Drop protocol)
5. ENH-007 Email allowlist / beta gate
6. Firefox Focus login fix (ISSUE-006)

---

## Commits This Session
- `Update product backlog — quiz/voice/AI prompt done, bookmarking approved, push+audio in future backlog, Firefox Focus issue logged`
- `Add beta check-in survey — /survey/[userId], v3 aesthetic, design side-by-side, prompt farm Q, feature priorities`
- `Add send-beta-checkin edge function — v3 parchment email style, all 5 users`
- `Add roadmap — sequenced pre-beta, pre-launch, and long-term priorities`
- `Add bookmarks — bookmarks table, star toggle on entry cards, Saved filter tab`
- `Increase star icon visibility — #555 at rest vs #E8FF47 when saved`
- `Add beta check-in tab to admin — reads from beta_checkin table, shows design pref, prompt farm, friction, feature priorities, open comment`

