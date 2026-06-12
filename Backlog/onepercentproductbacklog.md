# One Percent — Product Backlog
**onepercentproductbacklog.md | Living file — updated each session**
Last updated: 2026-06-12

This file tracks all non-content work: features, bugs, platform upgrades, infrastructure, and notifications. Content concept candidates live in `onepercentbacklog.md`.

---

## 🔴 Before Beta Ends (Highest Priority)

| ID | Item | Notes |
|---|---|---|
| ENH-007 | Email allowlist for beta access | Close beta gate before expanding. Only pre-approved emails can sign in. |
| UI-001 | Scroll breathing room — all tabs | Last card cut off at bottom nav on every tab. Add paddingBottom to all tab scroll containers. |
| UI-002 | Tab scroll position reset | Library and Prompts default to top of first card, not top of page. Returning to a tab should scroll to top (not restore last position). |
| UI-003 | Library chips active state — Option B | Add subtle border on active chip so selection is visually clear. Currently active dot is too subtle. |
| UI-004 | About + Changelog pages — dark styling | These pages still use light/parchment aesthetic. Need to match dark mode design system. |
| UI-005 | Bug + Feedback modals — liven up | Too much gray. Match dark theme energy — more contrast, cleaner form treatment. |
| UI-006 | Profile page overhaul | Redundant with Progress tab in several places. Needs rethink as a distinct surface. Separate identity/settings from progress data. |

---

## Platform Upgrades — Queued

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
| ~~Personalized goal-setting~~ | ✅ Done Jun 10 — 3-step SMART commitment, saves to Supabase |
| ~~Badge system~~ | ✅ Done Jun 12 — `badge_definitions` + `user_badges` tables, 40 badges seeded, earn overlay |
| ~~Dark mode overhaul~~ | ✅ Done Jun 12 — Full dark aesthetic across all 4 home tabs |
| ~~Prompt Farm → Prompt Vault~~ | ✅ Done Jun 12 — Renamed, compact hero |
| ~~Streak freeze system~~ | ✅ Done Jun 12 — DB columns, freeze strip in Progress, awarded at 7/14/30 day milestones |
| User signs name in ritual | Input in goal sheet, store on profile, show as paper signature |
| Social sharing card | "I just learned X with One Percent" → Web Share API + copy fallback |
| 001–008 quiz backfill | Old recall format → application/conceptual questions |

---

## Enhancement Backlog

| ID | Feature | Notes |
|---|---|---|
| ENH-001 | Profile picture upload | Replace 👤 emoji. Supabase Storage likely needed. |
| ENH-002 | Profile page build-out | Separate from Progress. Identity + settings surface. |
| ENH-003 | Weekly quiz | Standalone quiz mode, no entry content visible. Tests retention across the week. |
| ENH-004 | Audio lessons | Text-to-speech or recorded audio for Morning Brief. **User-requested x2 — future priority.** |
| ENH-005 | Admin changelog UI | Write/publish entries without touching Supabase directly. |
| ENH-006 | User feedback & bug history | Let users read back their own submissions. |
| ENH-007 | Email allowlist for beta access | 🔴 HIGH PRIORITY — see above |
| ENH-008 | Gate entry JSON behind auth | Move entries out of /public. Post-beta, pre-launch priority. |
| ENH-009 | Rate limiting on feedback & bug submissions | Fine for closed beta — fix before public launch. |
| ENH-010 | Push notifications | Mobile push with customizable timing. **User-requested x2 — future priority.** |
| ENH-011 | Home screen widget + streak counter | Habit surface for daily access. User-requested. |

---

## Known Issues

| ID | Summary | Status | Flagged |
|---|---|---|---|
| ISSUE-002 | Weekly feedback trigger broken for backdated/admin signups | ✅ Fixed May 27 | May 20 |
| ISSUE-003 | Multi-threading bug (parallel entry loading) | ✅ Closed — ghost issue | May 20 |
| ISSUE-004 | Weekly wrap modal fires for zero-completion users | ✅ Fixed May 27 | May 22 |
| ISSUE-005 | Onboarding text overlap on mobile | ✅ Fixed May 27 | May 20 |
| ISSUE-006 | Firefox Focus login friction | Open — no fix yet | May 28 |
| ISSUE-007 | HITL icon not appearing in app | Open — flagged, not resolved | Jun 10 |

---

## Profile & Identity (Planned)

- **Profile page** `/profile` — needs overhaul. Currently redundant with Progress tab. Should focus on identity/settings: name, avatar, goal, joined date, beta founder badge. Progress data lives in Progress tab only.
- **Profile picture** — upload via Supabase Storage. Display on profile + header avatar.

---

## Badges & Gamification
✅ Shipped Jun 12:
- `badge_definitions` table (40 badges seeded across milestone, category, easter egg types)
- `user_badges` table with RLS
- BadgeEarnOverlay (full-screen earn moment, queue system)
- `checkAndAwardBadges()` fires on load, non-blocking
- Streak freeze grants at 7/14/30 day milestones

Remaining:
- Founders Club badge — permanent for all beta testers
- Badge display on profile page (already in profile/page.js, DB-driven)

---

## Notification System

### Email — Resend + Supabase Edge Functions

| Job | Schedule | Status |
|---|---|---|
| send-practice-reminder | Every hour (6hr post-completion) | ✅ Live |
| send-daily-reminder | 12:00 UTC daily | ✅ Live — 3 behavioral segments, 21 distinct variants |
| send-weekly-wrap | 11:00 UTC daily | ✅ Live — momentum headline by entry count, zero-week send |

**Infrastructure notes:**
- Send from `matthew@mpgink.com` via Resend
- SPF/DKIM DNS configured on mpgink.com
- **Pre-launch:** Add `email_reminders boolean default true` to `profiles` + unsubscribe link (CAN-SPAM)
- **Future:** `phone` column on `profiles` for SMS via Twilio

---

## Beta Expansion — Outreach Leads
*Contacted via LinkedIn DM — 2026-06-04*

| Name | Connection | Background | Status |
|---|---|---|---|
| John Calamita | Enterprise Holdings alumni | BD Manager at Sprout, former AE | DM sent |
| Wade Stock | AB Nonprofit team | Enterprise AE at Amazon, AI Sales Strategy Lead | DM sent |
| Ankur Khanna | AB colleague | BD at Walmart Business, ex-Amazon/Apple | DM sent |
| Chris Sherman | Enterprise Holdings alumni | Sr. AE at Qualtrics, Challenger Sales | DM sent |
| Reza Saboury | AB Nonprofit team | AE at Amazon | DM sent |
| Larissa Rodriguez | Enterprise Holdings | Sales Enablement Manager at Elsevier | DM sent |
| Amy Burnette | AB colleague | Sr. Technical BD at Amazon | DM sent |
| Michelle Hentz | AB Bulk Buy overlay | Sr. AI Specialist at Zoom | DM sent |
| Matt Golia | Namesake | Strategic AE at Quickbase | DM sent |

**Next step:** When replies come in, add to Supabase allowlist (ENH-007) and send onboarding access.

---

*Maintained by Claude. Matthew can add, flag, or reprioritize at any time.*
