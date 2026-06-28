# One Percent — State Snapshot
**Last updated: 2026-06-28 (Session 2)**
Regenerated after Session 2: On This Day daily bonus shipped to all users; full admin overhaul (dark theme, feedback summary/surveys/addressed, phone entry, bug triage, API-health + analytics fixes). Session 1 had shipped Lock It In + Keep It Sharp + the onepercent.mpgink.com domain.

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
| 4 | send-lockin-review | `0 14 * * *` | send-lockin-review |
| 5 | **generate-on-this-day** | `5 0 * * *` | GETs `/api/on-this-day` (NEW) |

### Vercel env vars
- ✅ `CLAUDE_API_KEY` — Deep Cut, Lock It In, On This Day, feedback summary
- ✅ `SUPABASE_SERVICE_ROLE_KEY` — On This Day route self-cache (cron persistence)
- ⏳ `POSTHOG_PERSONAL_KEY` — **needs adding** for the admin Analytics tab (PostHog query API needs a `phx_` personal key; the public `phc_` ingest key 401s)

---

## DB Schema / infra (current)
- **`lockins`** (spaced repetition): user_id, entry_number, concept, category, keeper, hook, box(0–3), status, due_at, last_reviewed_at, review_count, reminder_sent_at. Unique (user_id, entry_number). Per-op RLS.
- **`on_this_day`** (daily bonus): date PK, year, event, blurb, why_today, source_url, source_title, category. RLS: authed select + insert.
- **RLS added:** `feedback_update_admin`, `profiles_update_admin`, `is_admin()` SECURITY DEFINER helper.
- **Edge function `send-lockin-review`** (Verify JWT OFF). On This Day generation is a **Next.js route** (`/api/on-this-day`), not an edge function — cron GETs it.
- **changelog:** v1.0 published (Lock It In + Keep It Sharp + domain); **v1.1 drafted** (On This Day, published=false, awaiting approval).

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
- **On This Day** — daily history bonus card (Today tab) + `/on-this-day` archive + daily cron + admin backfill. Wikipedia-sourced, Claude-framed, auto-verified. **Live for all users.**
- **Admin (overhauled):** dark theme, responsive cards, feedback summary + AI summarize + check-in surveys + addressed toggle, admin phone entry, systems strip, bug triage, fixed API-health email bug, analytics proxy.
- **Single source of truth category registry** (`lib/categories.js`, 10 categories)
- Dark-first UI, DM Sans + DM Mono

---

## Pending / In Progress
- **Add `POSTHOG_PERSONAL_KEY` to Vercel** → lights up the admin Analytics tab. Only open setup item.
- **Content sprint:** ~340 entries across 10 categories to hit ~400 by end of Aug (banks in `Backlog/onepercentbacklog.md`). Critical path. Tier verification: full Dead Drop early/high-traffic, draft-verified + backfill on the tail.
- **Rotation re-balance** for 10 categories (new 3 need first entries before they surface).
- **Favorites + block categories (up to 2)** — profile preference model designed, not built.
- **Redeploy `send-lockin-review`** so review emails use onepercent.mpgink.com (optional, works via alias).

---

## ★ Roadmap — strategic (added 2026-06-28, Session 2)

**1. Refactoring assessment — before the native push.** Initial read (do a focused pass before August native work):
- `app/page.js` is **~1,900 lines** — home, all tabs, ~8 modals, goal sheet, commit ritual, welcome overlay all in one file. Prime candidate to split (modals → `components/`, tabs → per-tab components).
- `app/admin/page.js` **~1,050 lines** — could split per-tab, but lower priority (admin-only).
- **Entry manifest is still duplicated** in `page.js` and `profile/page.js` (the recurring four-file-sync risk) — move to a shared `lib/entries.js` like we did for categories.
- Category registry is done ✅; SR/scoring logic already UI-agnostic ✅.
- **Decision needed:** how much to refactor on web now vs. let the native rebuild be the clean break. Recommendation: do the cheap, high-leverage extractions (entry manifest, page.js modals) so the native port has clean seams; defer deep restructuring to native.

**2. Design / appeal review.** Is the app genuinely appealing, not just functional? Run a structured review:
- Audit against the locked design system (neon-on-dark, DM Sans/Mono, category accents) for consistency drift.
- First-run / empty-state / loading-state polish; mobile feel; motion/animation taste.
- Visual hierarchy on the Today tab now that it carries commitment + KPIs + On This Day + today's lesson (is it cluttered?).
- Output: a prioritized punch-list of aesthetic fixes + a verdict on whether the look earns retention. Can run as a dedicated session (optionally with screenshots / a design-focused agent).

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
- On This Day: `app/components/OnThisDay.jsx`, `app/on-this-day/page.js`, `app/api/on-this-day/route.js`
- Admin: `app/admin/page.js` (+ `app/api/admin/feedback-summary`, `app/api/admin/analytics`, `app/api/health`)
- Directions: `Directions/onepercentinstructions-v1_40.md` (current)

---

## Session Protocol Reminders
- Dead Drop verification mandatory before any entry commit
- Four-file sync on entry adds (config, page.js, profile.js, entry JSON)
- Wrap checklist: log → changelog → state → backlog → LAYOUT → instructions → build → commit → push → confirm
- Build check (`cd app-next && npm run build`) must be clean before every push
- Edge function deploys may be approval-gated in the agent env — Matthew deploys via Supabase dashboard/assistant when needed; remember to set **Verify JWT OFF** for cron-called functions
