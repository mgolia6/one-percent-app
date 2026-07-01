# One Percent — State Snapshot
**Last updated: 2026-07-01 (Session 5)**
Session 5: shipped a branded **favicon + installable PWA** (neon "1%" icon, `app/manifest.js`, apple/maskable icons, theme-color) and a **Context Checkpoint hook** (`PreCompact` → auto-commits in-flight work to the feature branch before the ~1M-token window compacts; CLAUDE.md protocol added). Confirmed **Aurora is NOT in the repo or Canva** — it's in **Claude design**; will import via its share URL (Vercel `import-claude-design-from-url`) when Matthew has it. Drafted changelog v1.2 + v1.3 (published=false). Full detail: `Logs/onepercentlog2026-07-01.md`.
Session 4: built /verify into a real verification workstation (per-claim flags, Submit, ⌗ Runs archive, lifecycle states, source tiers/⚠ caveats/📍 locate/copy-search) + verified the 30 rotation drafts (27 PASS, 3 FLAG fixed) + upgraded Finance/Health sources (tier-3 11→1, 6→0; caught real errors) + editionId renumber (flat per category) + Today/On-Deck bug fix + integrated the top action strip + kicked off a GitHub-connected **design-tool** pass (Phase 1 = the "Lock It In" conversational mode, codenamed **Aurora**). Content promotion HELD (interleave-at-end built + ready). Full detail: `Logs/onepercentlog2026-06-30.md`. Session 3: 60 draft lessons + "Why Today" fix. Session 2: On This Day + admin overhaul. Session 1: Lock It In + Keep It Sharp + domain.

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
- **Total entries live:** 60 (nothing promoted — promotion held for interleaved batch)
- **Last commit:** `91a5ce9` — branded favicon + PWA icons/manifest + context-checkpoint hook
- **Working branch:** `claude/ai-chat-agent-feedback-jx5un9` (== main, all Session-4 work fast-forwarded to main)

---

## Content State

### Published Entries: 001–060
All verified. (Entry 044 AMC→Codeforces correction applied 2026-06-25.)
**Why-Today fix (Session 3):** every live entry's `morning.why_today` now argues present-day relevance (was citation dumps on 28 of them). Citations stay in the `sources` array. Verification flags untouched.

### Drafts pending Dead Drop (NOT live) — 60 lessons
- `Drafts/new-categories/` — History HS.1–10, Personal Finance PF.1–10, Health & Performance HP.1–10 (seeds the 3 new categories).
- `Drafts/rotation/` — SC.14–17, AI.13–16, VL.10–13, MM.6–10, PH.6–10, NC.9–12, CM.9–12 (existing 7, deduped vs 001–060).
- All `verified: false`, no entry numbers, no four-file sync. Next session: Dead Drop → fix their why_today (relevance-first) → assign 061–120 → four-file sync → go live.

### Content rule (locked Session 3)
**"Why Today" = relevance-first, citations-in-sources.** The why_today box must answer "why learn THIS, now?" with modern context — never a list of authors/years. See instructions v1.41.

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
- **Verification tables (Session 4, admin-only RLS via `is_admin()`):**
  - `verification_checks` — per-claim ticks: edition_id, claim_no, checked, **flagged, flag_note**, checked_by/at.
  - `verification_entries` — per-entry signoff: edition_id, category, concept, status, verified_by/at, **needs_recheck, recheck_note**.
  - `verification_submissions` — frozen batches: category, counts, verified_editions jsonb, flagged_claims jsonb, status (pending|processed|promoted).
  - `verification_category_state` — category pk, state (active|submitted|re_review|promoted), promoted_at.
- **Edge function `send-lockin-review`** (Verify JWT OFF). On This Day generation is a **Next.js route** (`/api/on-this-day`), not an edge function — cron GETs it.
- **changelog:** v1.0 published; **drafted & awaiting approval (published=false):** v1.1 (On This Day), **v1.2 "A sharper home screen"** (Session-4 visible: Today/On-Deck oldest-incomplete, integrated top bar, natural-language "why I'm here"), **v1.3 "Add One Percent to your home screen"** (Session-5 favicon + install). Publish once Matthew approves wording.

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
- **Installable PWA** — branded neon "1%" favicon/app icon, `app/manifest.js`, apple + maskable icons, Add-to-Home-Screen (standalone), dark theme-color
- Dark-first UI, DM Sans + DM Mono

---

## Pending / In Progress
- **Verify the 60 drafts in `/verify`** (now a real workstation, not Claude-in-Chrome). All 60 are
  loaded as 10 category tabs with two-pass data (snippet/url/locate/tier/paraphrase + ⚠ caveat).
  History signed off (8 + HS.2/HS.6 re-sourced); PF/Health sources upgraded to tier-1; user verifying
  the rest. **Workflow:** verify → Submit (tab shows SUBMITTED) → I rework flags (RE-REVIEW) → re-sign
  → promote.
- **PROMOTION HELD — interleave-at-end (decided Session 4).** New entries go at 061+ **interleaved by
  category** (round-robin), NEVER mid-catalog, so advanced users (DonRobbo, most complete) get a
  rotating next-up not one category in a row. `scripts/promote.mjs --dirs a,b,c` interleave mode built
  + dry-run-tested. Run it once a content batch is signed off (dry-run → --write → mark category state
  promoted + submission status → build → push). Then update the four-file-sync entry count (now 3
  files: config TOTAL_ENTRIES, page.js manifest, entry JSONs — profile dropped its array).
- **DESIGN PASS in flight (design tool, GitHub-connected).** Phase 1 = the conversational **Lock It In**
  experience (codenamed **Aurora** in the tool). Identity-first: lock the language on this one
  interaction, then roll across screens (`DESIGN-SYSTEM-BRIEF.md`), moments inside it
  (`DESIGN-MOMENTS.md`), per the playbook (`WORKING-WITH-CLAUDE-DESIGN.md`). **Aurora confirmed NOT in
  the repo or Canva (checked Session 5) — it lives in Claude design.** Import path: get the Aurora
  **share URL** from Claude design → Vercel MCP `import-claude-design-from-url` → review vs. brief →
  wire into real `LockItIn.jsx`, admin-gated. Waiting on Matthew for the URL.
  **Next design chunk:** the post-lesson **slip-back** (WHAT'S NEXT/Keep-Sharp, closing, sources,
  `ai_prompt`, feedback) — pending user confirm on what "prompt / additional content / feedback" map to.
- **Add `POSTHOG_PERSONAL_KEY` to Vercel** → lights up the admin Analytics tab. Only open setup item.
- **Content sprint:** ~340 entries across 10 categories to hit ~400 by end of Aug (60 now drafted; banks in `Backlog/onepercentbacklog.md`). Critical path. Tier verification: full Dead Drop early/high-traffic, draft-verified + backfill on the tail.
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
- Directions: `Directions/onepercentinstructions-v1_42.md` (current)
- Drafts (pending verification): `Drafts/new-categories/` + `Drafts/rotation/`

---

## Session Protocol Reminders
- Dead Drop verification mandatory before any entry commit
- Four-file sync on entry adds (config, page.js, profile.js, entry JSON)
- Wrap checklist: log → changelog → state → backlog → LAYOUT → instructions → build → commit → push → confirm
- Build check (`cd app-next && npm run build`) must be clean before every push
- **Context Checkpoint** (`PreCompact` hook): before the window compacts, in-flight work auto-commits to the feature branch (never main). Proactively flush open decisions into this file when the session runs long — see CLAUDE.md "Context Checkpoint Protocol"
- Edge function deploys may be approval-gated in the agent env — Matthew deploys via Supabase dashboard/assistant when needed; remember to set **Verify JWT OFF** for cron-called functions
