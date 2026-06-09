# Session Log — 2026-06-08

## What We Did

### Email Outage — Diagnosed and Fixed
- DonRobbo reported no emails in 7+ days
- Confirmed crons were firing fine (pg_cron status: succeeded)
- Confirmed DonRobbo's profile clean: onboarding_complete, email populated
- Zero sends in Resend logs for 7 days → issue upstream of Resend
- Root cause: RESEND_API_KEY deleted during opsec review in another project, reissued key was scoped to Supabase project but not to edge function secrets
- Fix: Matthew reissued Resend API key, added to edge function secrets
- Verified: manually triggered send-daily-reminder via net.http_post — emails fired immediately

### Practice Reminder Bug — Fixed
- Noticed send-practice-reminder using `profile.name` instead of `profile.first_name`
- Also selecting wrong column: `select('id, email, name')` → `select('id, email, first_name')`
- Result: reminder_sent never marked true on entries 015–020 for DonRobbo
- Fix: corrected both field references in index.ts
- Deployed via Supabase MCP, committed to main

### DonRobbo Timing Note
- He completed entry 020 at 23:43 UTC on June 7th
- Daily reminder cron runs at 12:00 UTC — checks for completions between 00:00–23:59 UTC today
- His 23:43 completion falls inside that window, so he gets skipped the next morning
- Not a code bug, but a pattern worth watching for night-owl users

### Backlog Note
- 6 practice reminders queued for DonRobbo (entries 015–020), all reminder_sent: false
- Matthew chose to let them all send on next hourly tick

## Commits
- 8524882 fix: send-practice-reminder use first_name not name in profile select

## Next Steps
- Monitor DonRobbo confirms emails received
- Consider DonRobbo timing issue — daily reminder window vs late-night completions
