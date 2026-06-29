# Session Log — 2026-06-28

> Note: an earlier 2026-06-28 session shipped entries 041–060 + set the North Star (logged in State, no separate log file). This log covers the **feature/platform session** that followed.

## Headline
Shipped **Lock It In** (AI-coached recall) to all users, built and launched **Keep It Sharp** (spaced repetition) end-to-end, refactored categories to a single source of truth (now 10), mapped the full ~340-entry content backlog, and moved the app to its own domain **onepercent.mpgink.com**.

---

## What shipped (prod, live)

### 1. Deep Cut fix
- Root cause: wrong env var name. The route read `ANTHROPIC_API_KEY`; the Vercel secret is **`CLAUDE_API_KEY`**. Now reads `process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY`.
- Also fixed metadata-only entry passing (fetch full `/entries/NNN.json` in DeepCut) and a `.number`→`.entry` field bug.

### 2. Claude Code hooks (`.claude/settings.json` + `.claude/scripts/`)
- PreToolUse: block edits to non-existent files.
- PreToolUse: vercel.json check before creating any new `api/` file.
- Stop: run the build check before session end.

### 3. Lock It In — conversational alternative to the quiz
- 3-move arc: recall (own words) → recognize (where it shows up) → distill a one-sentence **keeper**. Learning-focused, never asks the user to commit to a personal application (that's left to the post-session AI prompt).
- `/api/lock-it-in` route: `coach` (streams) + `close` (grades 0–3, returns memory **hook** + keeper assessment). Model: claude-sonnet-4-6.
- **Keeper quality gate**: keeper is checked for accuracy/substance; a tightened, source-grounded version is offered; user approves/edits before save — so a lazy/wrong sentence never gets locked in (which SR would otherwise reinforce).
- `lockin_type` ("apply" | "aware") on all 60 entries steers coaching tone.
- **Released to ALL users this session** (admin gate removed).

### 4. Keep It Sharp — spaced repetition (NEW)
- **`lockins` table** (Leitner): `user_id, entry_number, concept, category, keeper, hook, box, status, due_at, last_reviewed_at, review_count, reminder_sent_at`. Per-operation RLS (own rows only). Unique (user_id, entry_number).
- Box schedule: **2d → 5d → 12d → 30d**. Clean recall promotes a box; fuzzy resets to box 0; clean recall at top box graduates to `done`.
- `lib/lockins.js` — enroll / due / review / counts helpers (all box math client-side).
- **"Keep this one sharp"** enrollment button in the entry completion card (threads keeper + hook).
- **`/review` page** — recall cards (reveal keeper/hook, "Got it" / "Still fuzzy"), upcoming queue.
- Home **REVIEW** nav entry + due-count badge (action strip + desktop sidebar).
- **Edge function `send-lockin-review`** + **daily cron (14:00 UTC)** — one digest email per user when reviews are due; respects `email_reminders`. Verified end-to-end (200, `{"sent":0,"users":0}`).
  - NOTE: Matthew deployed the function via the Supabase assistant (MCP deploy was approval-gated in the agent env). Had to toggle **Verify JWT OFF** so the cron's tokenless call isn't 401'd — confirmed fixed.

### 5. Category refactor — single source of truth
- `lib/categories.js` is now canonical (key, short, prefix, color, colorDim, scope). Consolidated 6 duplicated color maps + 3 hardcoded lists across page/admin/profile/leaderboard/DeepCut.
- **Now 10 categories**: the original 7 + **History, Personal Finance, Health & Performance**. New three carry colors/prefixes/icons but **stay hidden until they have content** (user-facing lists derive from categories with entries).

### 6. Announcement modal (login)
- Reused the existing `WhatsNewModal` mechanism — published **changelog v1.0** (`show_modal=true`) leading with the new domain. Fires once at login per user.

### 7. Domain
- App now lives at **onepercent.mpgink.com** (Vercel alias; old `.vercel.app` still serves prod). Review emails point at the new domain in source.

### 8. Dark-on-dark fix (welcome/boot sequence)
- Wordmark + "TAP TO CONTINUE" hint were `#2a2a2a` on near-black — invisible. Bumped to `rgba(255,255,255,0.3)` / `0.4`. Same bug class as the earlier home/entry fixes.

---

## Decisions
- **North Star (set earlier today):** ~400 verified entries + validated learning loop by end of August, THEN go native (proper Expo/RN rebuild, not a wrapper).
- **Categories: went to 10** (History + Personal Finance + Health & Performance). Psychology considered and passed (absorbed into Neuro/Mental Models).
- **Block up to 2 categories** → drives the ~400 target (~40/cat × 10).
- **"On This Day"** = per-date AI, auto-verified, separate bonus stream (queued, not built).
- SR validation via **email + in-app** now; real push deferred to **native** (APNs/FCM).
- Keep logic UI-agnostic for the native port.

---

## Open / next
- **Redeploy `send-lockin-review`** to pick up the onepercent.mpgink.com email URL (live function still uses .vercel.app alias — works, just unbranded). Optional.
- **Content sprint**: ~340 entries across 10 categories to hit ~400 by end of Aug. Banks mapped in `Backlog/onepercentbacklog.md`.
- **Rotation re-balance** for 10 categories (new three need entries before they surface).
- **Favorites/block UI** (profile preference model) — designed, not built.
- **"On This Day"** bonus — not built.
- Verify the boot-sequence fix once `6d326b4` finishes deploying.

---

## Verification notes
- Build clean before each push.
- SR backend tested live: function 200 + cron job registered (jobid 4) + JWT toggle confirmed.
- Prod deploy `fb7c0ec` READY; aliases confirm onepercent.mpgink.com + .vercel.app both serve it.

---

# Session 2 — On This Day + full admin overhaul

## On This Day (daily bonus) — built, tested, shipped to ALL users
- **Concept:** a daily history card on the Today tab. Facts pulled from **Wikipedia's on-this-day feed** (real, sourced, auto-verified); Claude only PICKS the most resonant event + writes the One Percent-voice blurb — never recalls history from memory, so it can't invent a date.
- **`on_this_day` table** (date PK, year, event, blurb, why_today, source_url, source_title, category). RLS: authed select, authed insert.
- **`/api/on-this-day`** route: read cache → else generate (Wikipedia + Claude) → persist via service role (only for real "today"). `force-dynamic` + `no-store` so the CDN never short-circuits it (caught: a `Cache-Control: max-age` header was letting the CDN serve cached responses → cron wouldn't persist).
- **Daily cron** (jobid 5, 00:05 UTC) GETs the route → fills the archive forward even on days nobody opens the app. **Needs `SUPABASE_SERVICE_ROLE_KEY` in Vercel** (added) for the route to persist.
- **`OnThisDay` card** (Today tab) + **`/on-this-day` archive page** (all cards, newest first) + admin **backfill** (7/30/90 days, writes from admin session — no service key needed).
- Verified end-to-end: deleted today's row, ran the exact cron command, row regenerated + persisted (200). Today's card: Stonewall riots (1969).
- Un-gated to all users after admin testing.

## Admin overhaul (was light-themed + rough on mobile)
- **Dark theme** — converted the whole admin to the app system (#0e141c / #1a2a3a / light text). Closed the leftover style gap.
- **Responsive user cards** — stats reflow below identity on mobile (was overflowing).
- **Feedback tab:** summary card (rating avgs, recommend breakdown) + **✦ Summarize with AI** (`/api/admin/feedback-summary`); **Check-in Surveys** section surfaces the 7/14/21/30-day responses (were invisible); weekly survey blob (`key:value | …` in missing_topics) now parsed into a **key/value table**; **Addressed toggle** (feedback.reviewed + admin UPDATE policy).
- **Admin phone entry** — edit any user's phone from the card (numbers collected off onboarding); admin profiles-UPDATE policy via `is_admin()` SECURITY DEFINER.
- **Systems strip** — Keep It Sharp / Lock It In / On This Day visibility.
- **Bug triage** — won't-fix + reopen, filter counts, optimistic, mobile.
- **API Health fix (important):** the check INVOKED the real email senders (`send-daily-reminder`/`send-practice-reminder`) on every run — **it was blasting users**. Removed; added safe `/api/health` (verifies Claude key + reports env). 
- **Analytics fix:** tab sent the public ingest key (`phc_`) to PostHog's query API (needs a personal `phx_` key) → 401. Now proxied through admin-authed **`/api/admin/analytics`**. Needs `POSTHOG_PERSONAL_KEY` in Vercel.

## Env state (Vercel)
- ✅ `CLAUDE_API_KEY`, ✅ `SUPABASE_SERVICE_ROLE_KEY`, ⏳ `POSTHOG_PERSONAL_KEY` (only open setup item).

## New surfaces / infra this session
- Routes: `/on-this-day`, `/api/on-this-day`, `/api/health`, `/api/admin/feedback-summary`, `/api/admin/analytics`.
- Table: `on_this_day`. Cron: `generate-on-this-day` (jobid 5). RLS: feedback_update_admin, profiles_update_admin, `is_admin()` helper.

## Roadmap asks captured (Matthew, this wrap)
1. **Refactoring assessment** — decide if more refactoring is needed before the native push (page.js ~1900 lines, admin ~1050, duplicated entry manifests). See State roadmap.
2. **Design / appeal review** — structured aesthetic review of whether the app is genuinely appealing. See State roadmap.

## Open / next
- Add `POSTHOG_PERSONAL_KEY` to light up Analytics.
- Content sprint (~340 across 10 categories) remains the critical path.
- Refactoring assessment + design review (new roadmap items).

---

# Session 3 — Content push (60 drafts) + catalog-wide "Why Today" fix

## 60 draft lessons generated (NOT live — pending Dead Drop tomorrow)
- **Batch 1 — seed the 3 new categories (30):** History HS.1–10, Personal Finance PF.1–10, Health & Performance HP.1–10. In `Drafts/new-categories/`.
- **Batch 2 — normal rotation, existing 7 categories (30):** SC.14–17, AI.13–16, VL.10–13, MM.6–10, PH.6–10, NC.9–12, CM.9–12. In `Drafts/rotation/`. All fresh, deduped vs 001–060.
- Generated via parallel subagents (one per category / 5-each), each matched to the 060.json schema. All `verified: false`, no four-file sync, no entry numbers — inert until verified.
- Writers logged specific Dead Drop targets (e.g., CEB Challenger five-profile research; Rozenblit & Keil 2002; colonoscopy/cold-pressor study) — compiled in chat for tomorrow.

## Catalog-wide "Why Today" fix (LIVE content)
- **Problem (Matthew caught):** the `morning.why_today` ("WHY TODAY") box was a citation dump on many entries, not a statement of present-day relevance.
- **Triage:** 041–060 → 16 of 20 were dumps/weak (4 AI ones already fine). 001–040 → only 12 dumps (earlier entries were written better); 004/015 left as already-good relevance framing.
- **Fixed 28 live entries** (16 in 041–060, 12 in 001–040) via parallel subagents: rewrote why_today to genuine "why now" relevance in the One Percent voice; citations kept in the `sources` array; **one source migrated into sources** (Mehrabian & Wiener 1967 on 056) so no attribution lost. `verified`/`verified_by` untouched (framing, not new claims). All JSON re-validated.
- Result: every live entry 001–060 now argues contemporary relevance in the WHY TODAY box.

## Content learning (locked going forward)
- **"Why Today" = relevance-first, citations-in-sources.** It must answer "why learn THIS, now?" with the modern context — never a list of authors/years. Added to instructions v1.41 + pre-gen checklist.
- The 60 drafts were generated before this rule was explicit, so they likely repeat the citation-dump pattern in why_today → **run the relevance-rewrite pass on the drafts during tomorrow's verification** before they go live.

## Wrap state
- All draft + fix commits pushed to main (drafts inert; live why_today rewrites deploy as content).
- Next session: Dead Drop the 60 drafts (Claude in Chrome) → fix their why_today → assign entry numbers 061–120 → four-file sync → go live. That clears a huge chunk of the ~340 sprint.
