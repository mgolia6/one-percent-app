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
