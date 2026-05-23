# One Percent — Session Log
**Date:** May 22, 2026
**Session:** v6

---

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
