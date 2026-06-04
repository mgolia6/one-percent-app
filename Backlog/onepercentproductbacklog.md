# One Percent — Product Backlog
**onepercentproductbacklog.md | Living file — updated each session**
Last updated: May 30, 2026

This file tracks all non-content work: features, bugs, platform upgrades, infrastructure, and notifications. Content concept candidates live in `onepercentbacklog.md`.

---

## Platform Upgrades — Queued (unranked)

| ID | Item | Notes |
|---|---|---|
| PU-002 | Weekly survey — update notifications section | Unclear scope — needs clarification |
| PU-003 | Admin — add progress report section | New tab or tile in admin dashboard |
| ~~PU-001~~ | ~~Library page — fix loading/refresh button~~ | ✅ Done prior session |
| ~~PU-004~~ | ~~Leaderboard — trophy emoji next to heading~~ | ✅ Done prior session |
| ~~PU-005~~ | ~~Profile — restructure to 3 tabs~~ | ✅ Done May 27 |
| ~~PU-006~~ | ~~Admin users section — expandable cards~~ | ✅ Done May 27 |
| ~~PU-007~~ | ~~AI Prompt — copy button in EntryViewer + full backfill~~ | ✅ Done May 27 |

---

## Approved Builds (Not Yet Built)

| Item | Notes |
|---|---|
| ~~Quiz revamp~~ | ✅ Done — application-based questions replacing memorization/slider format |
| ~~Voice feedback~~ | ✅ Done — audio recording added to feedback flow |
| ~~Zero-completion gate~~ | ✅ Done May 27 — confirmed in code May 31 |
| ~~Entry bookmarking / favorites~~ | ✅ Done May 31 — `bookmarks` table, star icon, Saved filter tab |
| ~~Admin — beta check-in tab~~ | ✅ Done May 31 — BETA CHECK-IN tab reads from `beta_checkin` table |
| Personalized goal-setting | Promised in beta check-in emails. Must ship before beta ends. |

---

## Enhancement Backlog

| ID | Feature | Notes |
|---|---|---|
| ENH-001 | Profile picture upload | Replace 👤 emoji. Supabase Storage likely needed. |
| ENH-002 | Profile page build-out | Streak, completed count, category breakdown, joined date. |
| ENH-003 | Weekly quiz | Standalone quiz mode, no entry content visible. Tests retention across the week. |
| ENH-004 | Audio lessons | Text-to-speech or recorded audio for Morning Brief. **User-requested x2 — future priority.** |
| ENH-005 | Admin changelog UI | Write/publish entries without touching Supabase directly. |
| ENH-006 | User feedback & bug history | Let users read back their own submissions. RLS read policy + profile page surface. |
| ENH-007 | Email allowlist for beta access | 🔴 NOW PRIORITY — Close beta gate before expanding. Only pre-approved emails can sign in. |
| ENH-008 | Gate entry JSON behind auth | Move entries out of /public. Post-beta, pre-launch priority. |
| ENH-009 | Rate limiting on feedback & bug submissions | No throttling currently. Fine for closed beta — fix before public launch. |
| ENH-010 | Push notifications | Mobile push with customizable timing. **User-requested x2 — future priority.** |
| ENH-011 | Home screen widget + streak counter | Habit surface for daily access. User-requested. |

---

## Known Issues

| ID | Summary | Status | Flagged |
|---|---|---|---|
| ISSUE-002 | Weekly feedback trigger broken for backdated/admin signups | ✅ Fixed May 27 | May 20 |
| ISSUE-003 | Multi-threading bug (parallel entry loading) | ✅ Closed — no parallel loading code exists, ghost issue | May 20 |
| ISSUE-004 | Weekly wrap modal fires for zero-completion users | ✅ Fixed May 27 (same fix as ISSUE-002) | May 22 |
| ISSUE-005 | Onboarding text overlap on mobile — last few cards (iPhone/Chrome iOS) | ✅ Fixed May 27 | May 20 |
| ISSUE-006 | Firefox Focus login friction — privacy browser wipes session, forces re-auth on every visit | Open — no fix yet | May 28 |

---

## Profile & Identity (Planned)

- **Profile page** `/profile` — editable first name, last name, phone. Email read-only.
- **Profile picture** — upload via Supabase Storage or external URL. Display on profile page + optionally library header.

---

## Badges & Gamification (Planned)

- **Founder's Club badge** — permanent badge for all beta testers. `is_founder` boolean on profiles. Auto-grant or admin-controlled TBD.
- **Streak badges** — 3-day, 7-day, 30-day, 100-day milestones.
- **Usage badges** — First entry, first 3/3, 10 entries, 25 entries, all 7 categories, perfect week.
- **Badge system schema** — `badges` table + `user_badges` join table. Display on profile page.

---

## Notification System

### Email — Resend + Supabase Edge Functions (partial build)

| Job | Schedule | Status |
|---|---|---|
| send-practice-reminder | Every hour (6hr post-completion) | ✅ Live |
| send-daily-reminder | 12:00 UTC daily | ✅ Live |
| send-weekly-wrap | 11:00 UTC daily | ✅ Live |

**Infrastructure notes:**
- Send from `matthew@mpgink.com` via Resend
- SPF/DKIM DNS configured on mpgink.com
- Smart send: practice reminder skips if already sent; daily reminder skips if entry completed
- **Pre-launch:** Add `email_reminders boolean default true` to `profiles` + unsubscribe link in email footer (CAN-SPAM)
- **Future:** `phone` column on `profiles` for SMS via Twilio

### Lesson Reminder Email (planned)
- Fire 6hrs after completion, pulls from entry's `morning_challenge`
- Personalized, not a generic nudge
- Validates Brian's "had to really remember to try it" feedback

---

## Content-Adjacent Items

- **PRE-7-DAY:** Revise weekly check-in and end-of-beta survey questions — current questions not capturing what we need from testers
- **Button audit** — all buttons need loading/disabled/feedback states. Sign out flagged May 20.
- **Audience framing** — onboarding or entry headers need clearer POV signal (Landon: "I'm not sure who this is for")
- **Entry depth direction** — apply "felt sense + real scenario" standard to all future entries (established May 22)
- **AI Prompt** — copy functionality added. ✅ Done May 27.

---

---

## Beta Expansion — Outreach Leads
*Contacted via LinkedIn DM — 2026-06-04*

| Name | Connection | Background | Status |
|---|---|---|---|
| John Calamita | Enterprise Holdings alumni | BD Manager at Sprout, former AE — sales DNA throughout | DM sent |
| Wade Stock | AB Nonprofit team (Matthew's direct) | Enterprise AE at Amazon, AI Sales Strategy Lead — sales + AI intersection | DM sent |
| Ankur Khanna | AB colleague | BD at Walmart Business, ex-Amazon/Apple — tech-savvy, systems thinker | DM sent |
| Chris Sherman | Enterprise Holdings alumni | Sr. AE at Qualtrics, Challenger Sales, multiple Presidents Club — wired to learn | DM sent |
| Reza Saboury | AB Nonprofit team | AE at Amazon — told Matthew he saw him running his own company; personal connection | DM sent |
| Larissa Rodriguez | Enterprise Holdings (overlapping era) | Sales Enablement Manager at Elsevier — thinks professionally about learning + performance | DM sent |
| Amy Burnette | AB colleague | Sr. Technical BD at Amazon, ex-English academic — builder, self-directed learner | DM sent |
| Michelle Hentz | AB Bulk Buy overlay | Sr. AI Specialist at Zoom, created C³ Framework™ — builder, AI thought leader | DM sent |

**Next step:** When replies come in, add to Supabase allowlist (ENH-007) and send onboarding access.

---

*Maintained by Claude. Matthew can add, flag, or reprioritize at any time.*
