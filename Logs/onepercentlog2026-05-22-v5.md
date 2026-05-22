# One Percent — Session Log
**Date:** 2026-05-22
**Version:** v5

---

## What We Did

### Resend DNS Fix
- Diagnosed welcome email 500 error — root cause was Resend domain verification failing for mpgink.com
- DKIM was already verified; SPF records for `send` subdomain were missing
- Added two records to GoDaddy manually:
  - MX: `send` → `feedback-smtp.us-east-1.amazonses.com`, priority 10
  - TXT: `send` → `v=spf1 include:amazonses.com ~all`
- Duplicate SPF record (`dc-fd741b8612._spfm.send`) created by GoDaddy auto-apply — attempted delete, GoDaddy UI looped. Left in place for now; Resend still verified.
- Also noted: stale `email CNAME → mailgun.org` still in GoDaddy — not urgent, clean up later
- Resend domain verified ✅ — welcome email now sending successfully

### Welcome Email — Full Rewrite
- Previous copy was product-pitch tone, not authentic
- Rewrote from Matthew's actual origin story: "grew instead of scroll, built it for me"
- Fixed CORS bug (OPTIONS returning 500) — missing `corsHeaders` in v5 deployment
- Iterated through copy, formatting, and structure:
  - Subject: `Welcome to the Founders Club | One Percent`
  - Broke up feedback wall of text into readable paragraphs
  - Added wind-down line: "I built this for me — I hope it becomes something for you too."
  - Added `Mahalo, and welcome to the Founders Club.` closing
  - Moved P.S. below signature (correct convention)
- Final version deployed as Edge Function v9, committed to GitHub

### Admin Tab Reorder
- Previous order: POST-LESSON → WEEKLY → END OF BETA → INSTANT → BUGS → USERS → LEADERBOARD → SURVEYS → EMAIL
- New order: USERS → BUGS → POST-LESSON → INSTANT → WEEKLY → END OF BETA → LEADERBOARD → SURVEYS → EMAIL
- Default tab changed from `feedback` to `users`

---

## Decisions Made
- Resend SPF/MX on `send` subdomain only — root domain MX left alone to protect Zoho inbox
- Welcome email tone: personal and founder-voice, not product marketing
- Admin opens to USERS by default — lay of the land first, then drill into feedback

---

## Open / Next Session
- Send retroactive welcome emails to Erin, Robbo, and Brian via admin
- Delete duplicate `send` TXT SPF record in GoDaddy (UI was looping — try desktop browser)
- Delete stale `email CNAME → mailgun.org` from GoDaddy
- ISSUE-002 — Weekly trigger broken for backdated signups
- ISSUE-003 — Multi-threading bug (uninvestigated)
- Admin button states audit — loading/disabled/feedback states
- Profile page layout revisit

---

## Commits This Session
- `477ceec` — Update welcome email — Founders Club subject, founder origin story, tester CTA
- `a40b937` — Fix CORS headers in welcome email edge function
- `1c6dc0f` — Break up feedback paragraph for readability
- `7d0d98b` — Add Mahalo closing, move PS below signature
- `30e5f03` — Final welcome email — wind down line, Mahalo + Founders Club closing, PS after signature
- `8a72b53` — Admin: reorder tabs, default to USERS

---

## Tool Access Notes (for next session)
- **Supabase MCP:** Connected, project ID `uuzdlubbynavybttlmeh` — use for schema changes, edge function deploys, logs
- **GitHub:** Git CLI via bash, token in project instructions (expires ~Aug 17 2026)
- **Vercel:** MCP connected — use for runtime logs if needed
- **Google Drive:** MCP connected — Matthew exports GoDaddy DNS zone files here for review

---

## Addendum — Feature Added to Backlog

### Lesson Reminder Email
- When a tester starts a lesson, fire a contextual reminder email tied to that lesson's content
- Not a generic "new lesson" ping — pulls from the entry's actual asks/practice prompts
- Goal: reinforce application, not just consumption
- Fires at lesson start (not a day after)
- Build out spec next session before implementation
