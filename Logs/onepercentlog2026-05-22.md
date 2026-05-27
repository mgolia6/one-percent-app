# One Percent — Session Log
**onepercentlog2026-05-22.md**
**Session date: May 22, 2026**

---

## What Was Done

### Bug Fixes — 3 bugs resolved ✅

**Bug 1 — Welcome overlay transparent (Login page)**
- Root cause: `WelcomeOverlay` had no background — library rendered through it
- Fix: added `background: '#0a0a0a'` to the overlay container div in `app/page.js`

**Bug 2 — Quiz retake UX (Entry — Evening/Quiz)**
- Root cause: "REVIEW & RETRY" label with no actual reset mechanism; `handleComplete` used bare upsert with no guard against overwriting first attempt
- Fix: added RETRY QUIZ button in score box (score < 3 only) that resets local state only (`answers`, `submitted`, `showCelebration`) and scrolls to top
- Added note: "Your first attempt score is saved to the leaderboard."
- Added guard in `entry/[id]/page.js` `handleComplete`: `if (userStats?.answers) return` — blocks any re-write to Supabase on retry
- Removed redundant "Retake the quiz anytime" copy from completion card

**Bug 4 — Onboarding text overlap (Onboarding)**
- Root cause: committed pills `position: fixed, bottom: 28` overlapping card content on smaller screens
- Fix: dynamic `paddingBottom` on card div — `committed.length * 36 + 16px` — grows with pill count

All three bugs marked **resolved** in Supabase `bug_reports` table.

### Validation Process
- Verified each fix in source after committing
- Caught `handleComplete` upsert hole during validation — fixed before it could overwrite a real tester's score
- Confirmed `onComplete` is only called inside `handleSubmit`, not on retry path

### Sandbox Discussion
- Supabase branching requires Pro plan ($25/month) — deferred, not worth it at current beta scale
- Agreed approach: `BEGIN`/`ROLLBACK` dry-run wrapper before any schema migration going forward
- No backups needed beyond this — prod is safe as long as migrations go through MCP tools

### Notifications Planning
- Drafted 7-day email rotation copy (day-of-week anchored, light/witty tone, zero obligation language)
- Stack decision: Resend (free tier) + Supabase Edge Function on daily cron
- Send from `matthew@mpgink.com` for beta — personal sender, highest open rate
- Smart send logic: skip if user already completed today's entry
- No opt-out for beta — flagged in backlog to add `email_reminders boolean` + unsubscribe footer before public launch (CAN-SPAM)
- Future: `phone` column on `profiles` for SMS via Twilio

### Changelog Updated
- No modal — silent update to changelog only (see below)

---

## Matthew's Notes for Next Session

- **Do email notifications first thing** — Resend account + DNS setup on mpgink.com (Matthew does this), then build Edge Function
- Matthew needs: Resend account, API key, access to mpgink.com DNS (wherever it's registered)
- Next entry: SC.4 — Mirroring or Labeling (Voss/Black Swan series)
- Backfill priority: NC, CM, MM, PH (1–2 entries vs SC/AI at 3+)
- Meditation concept still on deck — PH/NC crossover, decide category at session start

---

## Commits This Session
- `4993a63` — Fix 3 bugs: welcome overlay background, quiz retake button, onboarding pill overlap
- `bad89e6` — Guard handleComplete against overwriting first-attempt score on retry
- `1ade099` — Backlog: email notification system notes and opt-out flag for pre-launch

---

## Entry Manifest (19 entries — no change this session)

| Entry | Edition ID | Category | Concept |
|---|---|---|---|
| 001 | AI.1.1 | AI | Context Window |
| 002 | VL.1 | Vocab & Language | Framing Effect |
| 003 | SC.1.1 | Sales Craft | Discovery Questions |
| 004 | MM.1 | Mental Models | Inversion |
| 005 | PH.1 | Philosophy | Premeditatio Malorum |
| 006 | AI.1.2 | AI | Prompt Sensitivity |
| 007 | SC.1.2 | Sales Craft | Talk/Listen Ratio |
| 008 | AI.2.1 | AI | Chain-of-Thought Prompting |
| 009 | VL.2 | Vocab & Language | Euphemism Treadmill |
| 010 | SC.2.1 | Sales Craft | Anchoring in Negotiation |
| 011 | MM.2 | Mental Models | Second-Order Thinking |
| 012 | AI.2.2 | AI | Hallucination / Confabulation |
| 013 | PH.2 | Philosophy | Dichotomy of Control |
| 014 | NC.1 | Neuroscience & Cognition | Neuroplasticity |
| 015 | SC.2.2 | Sales Craft | Tactical Empathy |
| 016 | CM.1 | Communication | Active Listening |
| 017 | SC.3.1 | Sales Craft | Multi-Threading |
| 018 | AI.3.1 | AI | RAG (Retrieval-Augmented Generation) |
| 019 | VL.3 | Vocab & Language | Nominalization |

---
## Session 2


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


---
## Session 3


## What We Did

### Feedback Review
- Pulled all feedback from Supabase — 9 total submissions
- 3 active testers (Erin, Robbo, Brian) + 1 landing feedback (Landon Martin)
- Key signals: quiz ratings consistently highest, clarity softest spot, Brian flagged accountability gap, Erin wants more concrete examples + validated AI prompt feature, Landon audience confusion (edge case — not target tester profile)

### Feedback Overhaul — Committed `4b9fe57`

**EntryViewer.jsx — Quiz revamp + voice input**
- Replaced 3 generic rating rows with section-specific questions:
  - MORNING BRIEF: "Did this click for you?"
  - MIDDAY REFRAME: "Did it shift how you think about it?"
  - EVENING QUIZ: "Could you explain this to someone else now?"
- DB columns unchanged (topic_rating / clarity_rating / quiz_rating) — no migration needed
- Added voice mic button to comment field (Web Speech API, browser-native, no cost)
  - Pulses while recording, transcribes to editable text field
  - Works Chrome/Safari mobile

**admin/page.js — Full survey rebuild**
- WeeklySurveyTest: full 18-question form with shared helper components (SvRatingRow, SvChipRow, SvOpenText, SvSection)
- EndOfBetaSurveyTest: full 29-question form — GTM signal, pricing, referral, six-month likelihood, "if you were me"
- Structured data packed into `missing_topics` column as pipe-delimited key:value pairs (avoids schema changes)

**page.js — Live weekly survey modal**
- WeeklySurveyModal component: full 18-question user-facing form
- Trigger logic: fires at day 7, 14, 21 based on signup_date vs last_weekly_survey_day
- Day 28 skipped, day 30 = end-of-beta (modal not yet built — next session)
- Skip button available, writes last_weekly_survey_day to profiles on submit

**Supabase migration**
- Added `last_weekly_survey_day integer` column to profiles table

---

## Decisions Confirmed

- Weekly survey: identical questions weeks 1–3 for comparable data
- Day 28: skip (too close to graduation)
- Day 30: end-of-beta survey fires (user-facing modal not yet built)
- Voice feedback: browser-native Web Speech API (no Whisper/third-party needed for now)
- Audio narration of entries: deferred to roadmap
- Content direction: "Masterclass light" — more concrete, scene-setting, one real scenario per Morning Brief

---

## Next Session Priorities (in order)

1. **Welcome email** — tone/angle TBD at session start
   - Matthew to answer: "why this exists" vs "here's how it works" vs both?
   - Retroactive send for existing beta users after DNS confirmed
2. **End-of-beta modal** — user-facing day 30 trigger (same pattern as weekly)
3. **DNS check** — verify mpgink.com shows Verified in Resend, test send
4. **Content depth** — next entry (018, AI.3.1 RAG) built to Masterclass-light standard:
   - Concrete scenario in Morning Brief (not "imagine" — specific scene)
   - Midday Reframe does more bridging work
5. **Email reminder copy** — content-specific nudge logic ("Yesterday you learned X, did you try it?")
6. **Multi-threading bug** — ISSUE-003, still uninvestigated

---

## Open Questions
- Welcome email: "why this exists" or "here's how it works" or both?
- End-of-beta modal: same skip option as weekly, or required?

---
## Session 4


## What We Did

### Backlog Audit
- Full audit of app feature backlog against actual codebase
- Cleared completed items: profile page, avatar upload, sign out states, weekly survey overhaul, email Edge Function, entries 018/019, ISSUE-005
- Cleaned backlog to reflect true open state

### Zoho Mail Setup — matthew@mpgink.com
- Registered Zoho Mail ($15/year) for a real inbox at matthew@mpgink.com
- mpgink.com is on GoDaddy — added Zoho MX records manually
- Removed conflicting Mailgun MX records (mxa/mxb.mailgun.org)
- Updated SPF TXT from `include:mailgun.org` to `include:zoho.com`
- DNS propagated and confirmed working — test email received ✅

### Welcome Email — Edge Function + Trigger
- Wrote founder-voice welcome email: "You're in." subject, P.S. reply invite
- Built `send-welcome-email` Supabase Edge Function (Resend via matthew@mpgink.com, reply_to set)
- Deployed Edge Function via Supabase MCP
- Trigger added to onboarding page — fires after onboarding_complete flips true, non-blocking

### Profile Page Overhaul
- Added stats grid: Current Streak / Longest Streak / Entries Completed / Badges Earned
- Added category progress bars — accent colors, completion count, all 7 categories
- Added BADGES tab alongside PROFILE tab
- Badges: 10 total — Founder's Club (auto-granted on onboarding_complete), streak milestones (3/7/30 day), usage milestones (first entry, perfect score, 10/25 entries, all 7 categories, perfect week)
- Earned badges lit up with accent color + EARNED chip; locked badges dimmed with progress bars where applicable
- Build clean, DB key format confirmed (entry_number stored as '001' strings — matches ENTRIES array)

---

## Decisions Made

- Zoho Mail over Gmail alias — keep branding consistent at matthew@mpgink.com
- Founder's Club badge: auto-granted to anyone with onboarding_complete = true — no admin action needed
- Welcome email fires at onboarding completion, not profile creation (profile creates at magic link, before onboarding)

---

## Open / Next Session

- Modal for this session's changelog entry (profile + welcome email)
- End-of-beta day 30 modal (user-facing trigger — not yet built)
- ISSUE-002 — Weekly trigger broken for backdated signups
- ISSUE-003 — Multi-threading bug (uninvestigated)
- DNS verify green in Zoho mailadmin (will auto-clear now that propagation is done)

---

## Commits This Session

- `7227293` — Add welcome email edge function + trigger on onboarding complete
- `f32c89e` — Profile: add stats grid, category breakdown, badges tab with progress

---

## Addendum — Post-Wrap Issues Found

### Welcome Email Button in Admin — BROKEN
- Admin users tab has WELCOME EMAIL button per user
- Button fires but Edge Function returns 500
- Root cause: Resend domain verification for mpgink.com is FAILED in Resend dashboard
- Resend requires its own DNS records in GoDaddy (separate from Zoho MX records) — never added
- Fix first thing next session: go to resend.com/domains → mpgink.com → copy required DNS records → add to GoDaddy → hit Restart verification

### Next Session Priorities (in order)
1. Fix Resend DNS in GoDaddy — get mpgink.com verified in Resend
2. Test welcome email button in admin — confirm sends
3. Send retroactive welcome emails to existing testers (Erin, Robbo, Brian)
4. Admin button states audit — all buttons need proper loading/disabled/feedback states
5. Profile page layout revisit
6. ISSUE-002 — Weekly trigger broken for backdated signups
7. ISSUE-003 — Multi-threading bug

---
## Session 5


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

---
## Session 6


## Session Summary

Bug triage, feedback review, screenshot upload feature, and a full feedback-to-action-item audit. Also recovered undocumented decisions from a prior rushed session wrap.

---

## Completed This Session

### Bug Resolution
- **ISSUE-003 (Erin):** Quiz auto-selecting correct answer on iPhone Safari — diagnosed as `-webkit-tap-highlight-color` ghost state (not a real selection in state). Fixed by adding `webkit-tap-highlight-color: transparent` to `.op-quiz-opt` base style. Marked resolved in Supabase.

### Schema / Infrastructure
- Added `reviewed` boolean (default false) to `feedback` table via Supabase MCP migration. Intentionally **not** wired to admin UI — reviewed status is managed directly in Supabase during formal feedback review sessions, not via app toggle.
- Added `image_url` (text, nullable) to both `feedback` and `bug_reports` tables.
- Created `screenshots` Supabase Storage bucket (public), with RLS policies for authenticated upload and public read.

### Screenshot Upload Feature
- Added optional "📎 ATTACH SCREENSHOT" button to both **BugModal** and **FeedbackModal** in `page.js`.
- Tap opens file picker, shows thumbnail preview before submit.
- On submit: uploads to `screenshots/bugs/` or `screenshots/feedback/` subfolder, stores public URL in `image_url` column.
- Admin (`admin/page.js`): screenshots render inline on all feedback and bug cards, tap to open full size.

### Progress Report Format (New Workflow)
- Established "Progress Report" as a wake word / session-start ritual.
- Format: 🔴 Needs Attention → 👥 Users → 📋 Feedback → 🐛 Bugs → 📈 Completions → 📝 Open Items.
- Pulls live from Supabase each time. No stored report — always fresh.
- Inactive = no `last_active_date` in last 3 days.

### False Alarm
- Landon reported "all user data wiped" — investigated and confirmed false alarm. He had zero completions (never completed an entry) and saw an empty state, interpreted it as data loss.

---

## Feedback Review — Full Audit

### Post-Entry Ratings Summary
| User | Entry | Topic | Clarity | Quiz | Comment |
|---|---|---|---|---|---|
| Erin | 001 | 5 | 5 | 5 | — |
| Robbo | 001 | 4 | 4 | 5 | — |
| Brian | 001 | 5 | 4 | 5 | "Very high level." |
| Erin | 002 | 5 | 5 | 5 | "I really liked this one" |
| Robbo | 002 | 4 | 4 | 5 | — |
| Brian | 002 | 5 | 4 | 5 | "Need a way to instill accountability. Morning section was interesting but I had to really remember to try it." |
| Erin | 003 | 5 | 4 | 4 | "Would have been really cool to see an example of how it played out in a conversation. Maybe a bit more on the morning learning. Also liked the AI prompt so I could take learning further and apply it in a coached sort of way." |
| Robbo | 003 | 4 | 4 | 4 | — |

### Instant Feedback
- **Landon (3/5):** "I'm not sure who this information is for. Does it think I am a consumer using AI or that I work in it every day? I found myself challenging the ideas because we are on the forefront trying to change those assumptions. Yet, it would be super applicable for the average user. The issue is that I don't want to give it my details but I also want a custom experience... Not possible. I also didn't see a way to rate it / give feedback on the morning nugget. Maybe even having a button to state my thoughts verbally would offer the most robust feedback and simplest for me."

### Feedback → Action Item Map
| Signal | Source | Action | Priority |
|---|---|---|---|
| "Very high level" | Brian, Entry 001 | Content depth calibration | 🔴 High |
| "Had to really remember to try it" | Brian, Entry 002 | Lesson reminder email (in backlog) | 🔴 High |
| "Example of how it played out" | Erin, Entry 003 | Add real-world scenario to Morning Brief | 🟡 Medium |
| "More on morning learning" | Erin, Entry 003 | Morning brief depth review | 🟡 Medium |
| "Liked the AI prompt" | Erin, Entry 003 | Protect and potentially expand AI prompt | ✅ Validate |
| "Don't know who this is for" | Landon | Audience framing in onboarding/entries | 🔴 High |
| "Didn't see way to rate morning nugget" | Landon | Feedback discoverability issue | 🟡 Medium |
| "Button to state thoughts verbally" | Landon | Voice feedback (already planned — see below) | 🟡 Medium |
| Clarity stuck at 4, never 5 (Robbo, Brian) | All | Clarity gap — something not fully landing | 🟡 Medium |
| Quiz highest-rated element | All | Quiz working — protect it | ✅ Validate |

---

## Recovered Decisions (Previously Undocumented)

These were discussed in an earlier session (chat: b66e8f50) but the session wrap was rushed and none of it made it into the instructions or backlog. Logging now.

### 1. Content Direction — Felt Sense / Action Level
- The content depth goal is **not** about length — it's about **felt sense and action**.
- Reference: Masterclass. What they do is give you the *felt sense* of the expert's world, not just the concept.
- Current entries **explain**. They need to also **show**.
- Fix: one real, specific scenario in the Morning Brief. Not "imagine you're in a negotiation" — "You're 20 minutes into a demo and the prospect goes quiet." That specificity is the move.
- This applies to all future entries going forward. Existing entries should be revisited when bandwidth allows.

### 2. Quiz Revamp — Section-Specific (4 Questions)
- Daily post-entry feedback is being revamped from generic 1–5 ratings to **section-specific diagnostic questions**.
- New structure (4 questions, each tied to a section):
  - Morning Brief: "Did the Morning Brief make sense?" (clarity)
  - Midday Reframe: "Did the Midday Reframe change how you thought about it?" (application bridge)
  - Evening Quiz: "Could you explain this to someone else now?" (retention/confidence)
  - Overall: open comment field
- This replaces topic/clarity/quiz rating sliders.
- **Status: Discussed and approved, NOT yet built.**

### 3. Voice Feedback
- Add mic button to comment field in post-entry feedback.
- Record → browser-side Web Speech API transcription → populates text field → user can edit before submitting.
- No third-party service needed for MVP. Free, native, works on mobile Safari/Chrome.
- Landon independently requested this in his instant feedback — validates the idea.
- **Status: Discussed and approved, NOT yet built.**

### 4. Weekly Survey Logic Confirmed
- Weeks 1, 2, 3 (days 7, 14, 21): Same form, identical questions, comparable data across testers.
- Day 28: Skip (too close to graduation).
- Day 30: End-of-beta fires.
- **Status: Logic confirmed. Weekly trigger has a known bug (ISSUE-002) for backdated signups.**

### 5. Lesson Reminder Email
- When a tester completes an entry, fire a contextual reminder email tied to that entry's content.
- Not a generic nudge — pulls from the entry's actual practice prompts/asks.
- Goal: behavioral reinforcement, not just notification.
- Brian's "had to really remember to try it" feedback directly validates this.
- **Status: In backlog. Not yet built.**

---

## Open / Next Session
- **Build: Quiz revamp** — section-specific 4-question post-entry feedback (approved design above)
- **Build: Voice feedback** — mic button on post-entry comment field
- **Build: Lesson reminder email** — contextual, tied to entry content
- **Content: Felt sense direction** — apply to Entry 018 and all future entries
- **Fix: ISSUE-002** — Weekly trigger broken for backdated signups
- **Fix: Audience framing** — onboarding or entry headers need clearer POV signal
- Send retroactive welcome emails to Erin, Robbo, Brian
- Delete duplicate SPF record + stale Mailgun CNAME in GoDaddy
- Admin button states audit
- Profile page layout revisit
- Update instructions file (v1_28) with recovered decisions above

---

## Commits This Session
- `8fd3b93` — Fix Safari tap highlight ghost selection on quiz options
- `1b1dd35` — Add screenshot upload to bug and feedback forms, display in admin

---

## Tool Access Notes
- **Supabase MCP:** Connected, project ID `uuzdlubbynavybttlmeh`
- **GitHub:** Git CLI via bash, token in project instructions (expires ~Aug 17 2026)
- **Vercel:** MCP connected
- **Google Drive:** MCP connected

---

## Addendum — Claude Project Cross-Chat Capability

Matthew confirmed he wasn't aware that Claude can search past conversations within this Project. Added to instructions (v1_28).

Key points:
- We are in a Claude Project — Claude can search prior chats via `conversation_search`
- Claude should always search before saying something "wasn't discussed"
- Search is keyword-based, not perfect recall — explicit "check past chats for X" triggers a deliberate search
- This does NOT work in standard Claude outside of a Project context

---

## Addendum — Email & Wrap System Built

### Practice Reminder Email
- `reminder_sent` boolean added to `completions` table
- `send-practice-reminder` edge function deployed — fires 6hrs after completion, pulls `morning_challenge` from entry JSON, sends personalized email
- pg_cron scheduled hourly (`0 * * * *`)
- All 10 existing completions marked `reminder_sent = true` to prevent retroactive sends
- Subject: "You learned [Concept] today. Did you try it?"

### Weekly Wrap
- `WeeklyWrapModal` component added to `entry/[id]/page.js`
- Shows each entry completed that week: category color, concept, hook, quiz score
- Fires before weekly check-in modal — dismiss wrap → check-in triggers
- `send-weekly-wrap` edge function deployed — runs daily at 11:00 UTC
- Checks who hit day 7/14/21 boundary, fetches entry metadata, sends recap email
- Subject: "Week X wrap — N concepts in the vault"
- pg_cron scheduled daily at 11:00 UTC

### Cron Schedule (full)
| Job | Schedule | Purpose |
|---|---|---|
| send-weekly-wrap | 11:00 UTC daily | Week recap email |
| send-daily-reminder | 12:00 UTC daily | Come back nudge |
| send-practice-reminder | Every hour | 6hr post-completion practice nudge |

---

## Addendum — Next Session Items (End of Session)

### Zero-Completion Edge Case — Not Yet Built
- Weekly wrap in-app modal currently fires even if user has zero completions that week
- Weekly wrap email already skips zero-completion users (good)
- Need to gate the in-app modal the same way — if no completions, don't show wrap
- For Andrew and Landon (never activated): they should get a re-engagement experience instead of a wrap of nothing
- Define what that re-engagement looks like next session before building
- Log this as ISSUE-004

### Practice Reminder Email Test
- Matthew's signup_date is 1/1 — weekly wrap will trigger naturally on next entry load
- Practice reminder will fire 6hrs after next completion
- No manual test needed — will fire in the wild

### Weekly Wrap Modal — No-Completion Gate
- Add: if weekComps.length === 0, don't setShowWeeklyWrap(true)
- Instead: consider a "you haven't started yet" nudge modal or just skip entirely
- Decide next session
