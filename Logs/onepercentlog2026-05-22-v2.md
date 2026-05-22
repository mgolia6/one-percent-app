# One Percent — Session Log
**Date:** 2026-05-22
**Version:** v2

---

## What We Did

### Bug Fix — Quiz Retake Triggering Survey
- Added `feedbackShown` ref to `EntryViewer.jsx`
- Survey now only fires on first quiz submission — retakes skip it
- Committed: `82b199f`

### Email System — Full Setup
- Created Resend account, added + verified `mpgink.com` domain (DNS pending propagation on GoDaddy)
- Added `RESEND_API_KEY` to Vercel environment variables
- Added `RESEND_API_KEY` secret to Supabase Edge Functions
- Built and deployed `send-daily-reminder` Edge Function (v3) with Matthew's approved 7-day copy rotation
- Smart-send logic: only sends to `onboarding_complete = true` users who haven't completed an entry today
- Set up pg_cron + pg_net, scheduled cron at `0 12 * * *` (8am ET daily)
- Added EMAIL tab to admin dashboard with manual send trigger, recipient preview, and result feedback
- Committed edge function to repo: `0d21e77`
- Committed admin EMAIL tab: `ccab3b2`

### Survey Redesign — Drafted, Not Yet Built
- Agreed current weekly + end-of-beta surveys are too generic
- Drafted full new question sets (18 questions weekly, 29 end-of-beta)
- Focused on GTM readiness, PMF signal, pricing, retention, positioning, name validation
- Matthew approved direction — flagged as pre-7-day priority

---

## Decisions Made

- Weekly survey fires every 7 days (day 7, 14, 21) — same form each time for comparable data
- Day 28 trigger skipped — too close to day 30 graduation
- Day 30 = end-of-beta survey
- Welcome email needed — triggers on signup, retroactive send for existing beta users
- Welcome email tone/angle TBD next session

---

## Next Session Priorities (in order)

1. **Welcome email** — build + deploy, trigger on signup, retroactive send for current testers
   - Tone/angle to be defined at session start (why this exists vs how it works)
2. **Survey rebuild** — implement new weekly + end-of-beta question sets in app
   - Fix trigger logic: every 7 days, skip day 28, day 30 = graduation
3. **DNS check** — verify mpgink.com shows as Verified in Resend, test send to mgolia6@gmail.com
4. **Multi-threading bug** — ISSUE-003, not yet investigated
5. **Entry 018** — AI.3.1 (RAG lead candidate)

---

## Open Questions
- Welcome email: "why this exists" or "here's how it works" or both?
- Weekly survey: should questions evolve week over week or stay identical for data comparability? (Matthew leaning identical — confirm next session)

