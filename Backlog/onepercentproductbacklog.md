# One Percent — Product Backlog
**onepercentproductbacklog.md | Living file — updated each session**
Last updated: 2026-06-15 (Session 2)

This file tracks all non-content work: features, bugs, platform upgrades, infrastructure, and notifications. Content concept candidates live in `onepercentbacklog.md`.

---

## ✅ Shipped 2026-06-28 — Lock It In + Spaced Repetition + Domain

| Item | Notes |
|---|---|
| ~~Deep Cut not working~~ | ✅ Wrong env var — route now reads `CLAUDE_API_KEY` (ANTHROPIC fallback); also fixed metadata-only entry passing + `.number`→`.entry` |
| ~~Lock It In (AI-coached recall)~~ | ✅ Built + **released to ALL users** (admin gate removed). 3-move arc (recall→recognize→distill keeper), `/api/lock-it-in`, model claude-sonnet-4-6, memory hook, **keeper quality gate** so lazy/wrong keepers can't be locked in |
| ~~Keep It Sharp (spaced repetition)~~ | ✅ `lockins` table + RLS, Leitner 2d/5d/12d/30d (`lib/lockins.js`), "Keep this one sharp" enrollment, `/review` recall page, home REVIEW badge, `send-lockin-review` edge fn + daily cron (14:00 UTC). Verified end-to-end (200) |
| ~~Category single source of truth~~ | ✅ `lib/categories.js` canonical; consolidated 6 color maps + 3 lists; **now 10 categories** (added History, Personal Finance, Health & Performance — hidden until they have content) |
| ~~Announcement modal at login~~ | ✅ Reused WhatsNewModal; changelog **v1.0** published (`show_modal=true`), leads with new domain |
| ~~Custom domain~~ | ✅ App now at **onepercent.mpgink.com** (Vercel alias; .vercel.app still serves) |
| ~~Dark-on-dark in welcome/boot~~ | ✅ Wordmark + "TAP TO CONTINUE" were `#2a2a2a` on near-black → `rgba(255,255,255,0.3/0.4)` |
| ~~Claude Code hooks~~ | ✅ PreToolUse (missing-file block + vercel.json check) + Stop (build check) in `.claude/` |

## ⚙️ Env / setup checklist (Vercel)

| Var | For | Status |
|---|---|---|
| `CLAUDE_API_KEY` | Deep Cut, Lock It In, On This Day, feedback summary | ✅ set |
| `SUPABASE_SERVICE_ROLE_KEY` | On This Day cron self-cache (route persists daily card) | ✅ set |
| `POSTHOG_PERSONAL_KEY` | Admin Analytics tab (PostHog query API needs a `phx_` personal key) | ⏳ **needs adding** — then redeploy |

Note: the old `NEXT_PUBLIC_POSTHOG_KEY` is the public **ingest** key (`phc_`) and can't read the query API — that was why Analytics 401'd. Queries now proxy through `/api/admin/analytics` (admin-authed, server-side key).

## ✅ Shipped 2026-06-28 (admin overhaul)

| Item | Notes |
|---|---|
| ~~On This Day un-gated~~ | ✅ Live for all users (card + archive); backfill stays admin-only |
| ~~On This Day daily cron + backfill~~ | ✅ `send-otd` via route self-cache (service key) + admin backfill 7/30/90 days; verified end-to-end |
| ~~Admin responsive user cards~~ | ✅ Stats reflow below identity on mobile; KPI grid 2-col |
| ~~Feedback: surveys surfaced~~ | ✅ Check-in Surveys section (7/14/21/30-day) with ratings; weekly blob now parsed into a key/value table (was a wall of text) |
| ~~Feedback: summary + AI~~ | ✅ Aggregate card + ✦ Summarize with AI (`/api/admin/feedback-summary`) |
| ~~Feedback: addressed toggle~~ | ✅ Mark synthesized/addressed (feedback.reviewed); added admin UPDATE policy |
| ~~Admin phone entry for users~~ | ✅ Edit any user's phone from the card; admin profiles-update policy via `is_admin()` |
| ~~Admin systems strip~~ | ✅ Keep It Sharp / Lock It In / On This Day visibility |
| ~~Bug triage~~ | ✅ Won't-fix + reopen, filters w/ counts, optimistic, mobile |
| ~~API Health: email-blast bug~~ | ✅ Removed; it invoked real senders on every check. New safe `/api/health` (Claude + env) |
| ~~Admin dark theme~~ | ✅ Converted to app dark system (#0e141c / #1a2a3a) |
| ~~Analytics PostHog key fix~~ | ✅ Proxied via `/api/admin/analytics` (needs `POSTHOG_PERSONAL_KEY`) |

## 🔜 New / queued (from 2026-06-28)

| ID | Item | Notes |
|---|---|---|
| SR-001 | Redeploy `send-lockin-review` for domain | Source points at onepercent.mpgink.com; live fn still uses .vercel.app alias (works, unbranded). Optional |
| SR-002 | Login-time review prompt | Optional: surface due reviews in a modal on app open (currently REVIEW nav + badge only) |
| CAT-001 | Rotation re-balance for 10 categories | New 3 need first entries before they surface |
| FEAT-002 | Favorites + block categories (up to 2) | Profile preference model (`favorited[]`/`blocked[]`) + daily-selection filter; designed, not built |
| ~~FEAT-003~~ | ~~"On This Day" daily bonus~~ | ✅ Built + shipped to all users (Wikipedia-sourced, Claude-framed, cron + backfill) |
| Q-001 | Welcome-overlay frequency | Currently once per browser session (sessionStorage). Revisit if we want once/day or every load |
| **REFACTOR-001** | Refactoring assessment before native | page.js ~1,900 lines (split modals/tabs); admin ~1,050; **entry manifest still duplicated** (page.js + profile.js → extract `lib/entries.js`). Recommendation: do cheap high-leverage extractions on web now (clean seams for the port), defer deep restructuring to native. See State Roadmap. |
| **DESIGN-001** | Design / appeal review | Structured aesthetic review: is the app genuinely appealing, not just functional? Audit design-system consistency, empty/loading states, mobile feel, Today-tab hierarchy (now carries commitment + KPIs + On This Day + lesson). Output: prioritized punch-list + retention verdict. Can be its own session. See State Roadmap. |
| FEEDBACK-001 | Post-entry feedback → show concept name | Now shows ENTRY #N; could map number→concept (needs entries manifest in admin) for readability |
| ~~CONTENT-002~~ | ~~"Why Today" was citation dumps~~ | ✅ Fixed all 28 affected live entries (001–060) → genuine present-day relevance; citations kept in `sources`. Rule locked in v1.41: why_today = relevance-first. |
| CONTENT-003 | 60 drafts pending Dead Drop | `Drafts/new-categories/` (30) + `Drafts/rotation/` (30). Verify (Claude in Chrome) → rewrite their why_today relevance-first → number 061–120 → four-file sync → go live |

---

## 🔴 Before Beta Ends (Highest Priority)

| ID | Item | Notes |
|---|---|---|
| ENH-007 | Email allowlist for beta access | Close beta gate before expanding. Only pre-approved emails can sign in. |
| ~~UI-001~~ | ~~Scroll breathing room — all tabs~~ | ✅ Done Jun 15 — 90px paddingBottom on all tab containers |
| ~~UI-002~~ | ~~Tab scroll position reset~~ | ✅ Done Jun 15 — window.scrollTo instant on tab switch |
| ~~UI-003~~ | ~~Library chips active state~~ | ✅ Done Jun 15 — border + dim fill on active chip |
| ~~UI-004~~ | ~~About + Changelog pages — dark styling~~ | ✅ Done Jun 15 — #0e141c bg, white wordmark, DM Mono |
| ~~UI-005~~ | ~~Bug + Feedback modals~~ | ✅ Done Jun 15 — lifted contrast, DM Mono, accent eyebrows |
| ~~UI-006~~ | ~~Profile page overhaul~~ | ✅ Done Jun 15 — killed Progress tab, Account tab: name/phone/email reminders, footer links to About + Privacy |
| ~~UI-007~~ | ~~Streak month view~~ | ✅ Done Jun 15 — full month grid, category-colored dots, real completed_at data |
| CONTENT-001 | Quiz content audit — remove sales bias | Erin feedback on Dichotomy of Control: quiz questions were sales-driven. Audit ALL non-sales entries for sales-tilted quiz questions and rewrite. Also: review Sales Craft category framing — reposition as universal (everyone has a sales component to their job regardless of role). |
| ~~FEAT-001~~ | ~~AI agent — Deep Cut~~ | ✅ Done Jun 15 — circle FAB (color cycling), app-level entry picker, streaming chat grounded in verified sources, today's ai_prompt as first suggestion, /api/deep-cut server-side route |

---

## Platform Upgrades — Queued

| ID | Item | Notes |
|---|---|---|
| ~~PU-002~~ | ~~Weekly survey — update notifications section~~ | ✅ Done Jun 15 — PostHog covers this now |
| PU-003 | Admin — add progress report section | ✅ Done Jun 15 — ANALYTICS tab in admin, live PostHog data + deep dive links |
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
| ISSUE-008 | Deep Cut — test source grounding + orange flag behavior on device | Open — needs device test | Jun 15 |

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
- ✅ `email_reminders` boolean added to profiles Jun 15 — toggle in Account tab, CAN-SPAM ready
- ✅ `phone` column on `profiles` added Jun 15 (optional, for future SMS)
- ✅ `email_reminders boolean default true` on `profiles` added Jun 15
- ✅ `completed_at` on `completions` added to query Jun 15 (powers streak month grid)

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
