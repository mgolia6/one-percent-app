# One Percent — State Snapshot
**Last updated: 2026-06-28**
Regenerated after the feature/platform session: Lock It In live for all, Keep It Sharp (spaced repetition) shipped, categories → 10, app moved to onepercent.mpgink.com.

---

## ★ North Star (set 2026-06-28)

**Goal: by end of August 2026 — ~400 verified entries + a validated learning loop on the PWA. THEN go native (proper Expo/React Native rebuild — "do it right the first time," not a wrapper).**

- **Categories: now 10.** Original 7 + **History, Personal Finance, Health & Performance**. (Psychology considered and passed — absorbed into Neuroscience & Cognition / Mental Models.)
- **Content target (10 categories; user can block up to 2):**
  - **August bar: ~40/category × 10 ≈ ~400.** A user who blocks 2 still gets ~8 months unique before gentle recycling (fine for a daily habit reinforced by spaced repetition).
- **Remaining to target ≈ +340** (60 → ~400), **balanced** across all 10 (not skewed to AI/Sales). Candidate banks for all 10 are mapped in `Backlog/onepercentbacklog.md`. The 3 new categories have **0 live entries** and stay hidden from user-facing lists until they have content.

**Because native is the destination (~2 months out):**
- Keep all logic UI-agnostic (Supabase queries, scoring, **SR scheduling in lib/lockins.js**, AI routes already are) so the rebuild is "rebuild the views."
- **Web push deferred** — validate the spaced-repetition loop via email + in-app now; do real push **natively** (APNs/FCM).
- Document design tokens cleanly for a faithful RN port (`lib/categories.js` is the canonical category registry).

---

## App Status
- **Live at:** **onepercent.mpgink.com** (primary) · one-percent-app.vercel.app (alias, still serves prod)
- **Auth:** Email/password
- **Beta status:** Closed beta, ~6 active testers
- **Total entries live:** 60
- **Last commit:** `6d326b4` — Fix dark-on-dark text in welcome/boot sequence
- **Latest prod deploy:** `fb7c0ec` (READY) + `6d326b4` (boot fix, deploying)

---

## Content State

### Published Entries: 001–060
All verified. (Entry 044 AMC→Codeforces correction applied 2026-06-25.)

### Category Counts (live entries; registry now 10 categories)
| Cat | Key | Live Entries |
|---|---|---|
| Sales Craft | SC | 13 |
| AI | AI | 12 |
| Vocab & Language | VL | 9 |
| Neuroscience & Cognition | NC | 8 |
| Communication | CM | 8 |
| Mental Models | MM | 5 |
| Philosophy | PH | 5 |
| **History** | HS | **0** (new) |
| **Personal Finance** | PF | **0** (new) |
| **Health & Performance** | HP | **0** (new) |

### Next Rotation
Entry 061 → **CM** (Communication, CM.9). Rotation needs **re-balancing for 10 categories** — the 3 new categories need their first entries before they surface in user-facing lists.

---

## Infrastructure
- **Repo:** github.com/mgolia6/one-percent-app (app in `/app-next/`)
- **Hosting:** Vercel (auto-deploy on push to main; preview per branch)
- **DB:** Supabase project `uuzdlubbynavybttlmeh`
- **Email:** Resend from matthew@mpgink.com
- **Analytics:** PostHog project 470392
- **AI:** Anthropic API (claude-sonnet-4-6) — Deep Cut (`/api/deep-cut`) + Lock It In (`/api/lock-it-in`). Env var: **`CLAUDE_API_KEY`** (ANTHROPIC_API_KEY fallback).
- **Config:** TOTAL_ENTRIES = 60 in app-next/lib/config.js

### pg_cron jobs (Supabase)
| id | job | schedule | function |
|---|---|---|---|
| 1 | send-daily-reminder | `0 12 * * *` | send-daily-reminder |
| 2 | send-practice-reminder | `0 * * * *` | send-practice-reminder |
| 3 | send-weekly-wrap | `0 11 * * *` | send-weekly-wrap |
| 4 | **send-lockin-review** | `0 14 * * *` | **send-lockin-review** (NEW) |

---

## DB Schema changes this session
- **NEW table `lockins`** (spaced repetition): `id, user_id→profiles, entry_number, concept, category, keeper, hook, box (0–3), status (active/done/archived), due_at, last_reviewed_at, review_count, reminder_sent_at, created_at`. Unique (user_id, entry_number). Explicit per-operation RLS (own rows).
- **Edge function `send-lockin-review`** deployed (Verify JWT OFF). Source in `supabase/functions/send-lockin-review/index.ts`.
- **changelog v1.0** row inserted + published (`show_modal=true`) — the login announcement.

---

## Features Live
- Email/password auth + reset flow
- **Lock It In** — AI-coached recall alternative to the quiz, **live for all users**; keeper quality gate; memory hook
- **Keep It Sharp** — spaced repetition: "Keep this one sharp" enrollment, `/review` recall page, daily email nudge, Leitner 2d/5d/12d/30d
- Deep Cut AI agent (FAB, per-category accent pulse, claude-sonnet-4-6)
- PostHog analytics (admin Analytics tab)
- Badge system (40 badges, streak freeze grants)
- Streak calendar, profile (mastery rings, score trend, leaderboard), bookmarks
- Email infra: daily reminder, weekly wrap, practice reminder, **lock-in review** (pg_cron)
- Admin panel, Prompt Vault, Leaderboard
- **Single source of truth category registry** (`lib/categories.js`, 10 categories)
- Dark-first UI, DM Sans + DM Mono

---

## Pending / In Progress
- **Redeploy `send-lockin-review`** so review emails use onepercent.mpgink.com (source updated; live function still uses .vercel.app alias — works, unbranded). Optional.
- **Content sprint:** ~340 entries across 10 categories to hit ~400 by end of Aug (banks in `Backlog/onepercentbacklog.md`). Tier verification: full Dead Drop early/high-traffic, draft-verified + backfill on the tail.
- **Rotation re-balance** for 10 categories.
- **Favorites + block categories (up to 2)** — profile preference model designed, not built.
- **"On This Day" daily bonus** — per-date AI, auto-verified; separate stream; not built.
- Verify boot-sequence fix once `6d326b4` deploys.

---

## Key File Locations
- Entries: `app-next/public/entries/[NNN].json`
- Config: `app-next/lib/config.js` (TOTAL_ENTRIES = 60)
- Category registry: `app-next/lib/categories.js` (canonical, 10 cats)
- SR helpers: `app-next/lib/lockins.js`
- Main page + manifests: `app-next/app/page.js`
- Profile: `app-next/app/profile/page.js`
- Review page: `app-next/app/review/page.js`
- Lock It In: `app-next/components/LockItIn.jsx` + `app-next/app/api/lock-it-in/route.js`
- Edge functions: `supabase/functions/*/index.ts`
- State: `State/onepercentstate.md` (this file)
- Directions: `Directions/onepercentinstructions-v1_39.md` (current)

---

## Session Protocol Reminders
- Dead Drop verification mandatory before any entry commit
- Four-file sync on entry adds (config, page.js, profile.js, entry JSON)
- Wrap checklist: log → changelog → state → backlog → LAYOUT → instructions → build → commit → push → confirm
- Build check (`cd app-next && npm run build`) must be clean before every push
- Edge function deploys may be approval-gated in the agent env — Matthew deploys via Supabase dashboard/assistant when needed; remember to set **Verify JWT OFF** for cron-called functions
