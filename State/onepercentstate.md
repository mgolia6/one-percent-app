# One Percent — State Snapshot
**Last updated: 2026-06-28**
Regenerated after session: entries 041-060 shipped and verified. North Star set (below).

---

## ★ North Star (set 2026-06-28)

**Goal: by end of August 2026 — ~400 verified entries + a validated learning loop on the PWA. THEN go native (proper Expo/React Native rebuild — "do it right the first time," not a wrapper).**

- **Categories: 7 → 8.** Add **History** only. **Psychology considered and passed** (overlaps existing Neuroscience & Cognition / Mental Models) — psych-flavored concepts get absorbed into those rather than a new category.
- **Content target (8 categories; user can block up to 2):**
  - **August bar: ~50/category × 8 ≈ ~400.** Full unique year if a user blocks 1 category; ~10 months unique if they block 2 (then gently recycles — fine for a daily habit, reinforced by spaced repetition).
  - **Stretch (post-August): ~60/category ≈ ~480** for a full unique year even if 2 are blocked.
- **Per-category remaining to ~50 each:** SC +37, AI +38, VL +41, MM +45, PH +45, NC +42, CM +42, **History +50** ≈ **+340** (60 → ~400). Sprint must be **balanced**, not skewed to AI/Sales. Velocity ~20/clip → ~17 sessions over 9 weeks = feasible if focused. Tier verification: full Dead Drop on early/high-traffic, draft-verified + backfill on the tail.

**New features queued (build-now / native-ports):**
- **Favorite + block categories (block up to 2)** — profile preference model (`favorited[]`, `blocked[]`) + daily-selection filter (weight favorites, exclude blocked). Data model designed native-portable.
- **"On This Day" daily bonus** — **per-date AI, auto-verified**: generated fresh for each calendar day from a real historical event, served as a bonus card to active users. SEPARATE stream, not counted in the ~400 rotation; retention hook tied to History.

**Because native is the destination (~2 months out):**
- Keep all logic UI-agnostic (Supabase queries, scoring, SR scheduling, AI routes already are) so the rebuild is "rebuild the views," not everything.
- **Don't over-invest in web push** — validate the spaced-repetition loop via email + in-app on-open recall now; do real push **natively** (APNs/FCM). 
- Document the design tokens cleanly for a faithful RN port.

**Resolved 2026-06-28:** block up to 2 categories · History only (Psychology passed) · On-This-Day = per-date AI, auto-verified.

---

## App Status
- **Live at:** onepercentbetter.vercel.app
- **Auth:** Email/password (migrated from magic link)
- **Beta status:** Closed beta, ~6 active testers
- **Total entries live:** 60
- **Last commit:** `9eb620f` — Add entries 041-060

---

## Content State

### Published Entries: 001-060
All entries verified. Entry 044 had AMC→Codeforces correction applied during Dead Drop session 2026-06-25.

### Category Counts (after 060)
| Cat | Entries | Last Edition |
|---|---|---|
| SC | 13 | SC.13 (057) |
| AI | 12 | AI.12 (059) |
| VL | 9 | VL.9 (060) |
| MM | 5 | MM.5 (038) |
| PH | 5 | PH.5 (040) |
| NC | 8 | NC.8 (058) |
| CM | 8 | CM.8 (056) |

### Next Rotation
Entry 061 → **CM** (Communication, CM.9)
Rotation continues: CM → SC → NC → AI → VL → CM → SC → NC → AI → VL...

---

## Infrastructure
- **Repo:** github.com/mgolia6/one-percent-app
- **Hosting:** Vercel (auto-deploy on push to main)
- **DB:** Supabase project `uuzdlubbynavybttlmeh`
- **Email:** Resend from matthew@mpgink.com
- **Analytics:** PostHog project 470392
- **AI:** Anthropic API (claude-sonnet-4-6) for Deep Cut feature
- **Config:** TOTAL_ENTRIES = 60 in app-next/lib/config.js

---

## Active Beta Testers
- DonRobbo, Erin, Brian, Landon, Andrew, Corissa Furr, Justin
- Brian (3 completions), Landon (1), Andrew (1) — "last chance" texts drafted 2026-06-25
- Active testers: DonRobbo, Erin, Corissa, Justin (strong engagement)

---

## Features Live
- Email/password auth + reset password flow
- Split-layout login page
- Deep Cut AI agent (floating FAB, per-category accent pulse, claude-sonnet-4-6)
- PostHog analytics (11 event types, admin Analytics tab)
- Badge system (40 badges, streak freeze grants)
- Streak calendar with actual completion timestamps
- Profile page with mastery rings, score trend, leaderboard
- Bookmarking/favorites
- Email infrastructure (daily reminder, weekly wrap, practice reminder via pg_cron)
- Admin panel with analytics tab + "Send Password Reset Blast" button
- Prompt Vault tab (ai_prompts from entry JSONs, surfaces on completion)
- Leaderboard page
- Dark-first UI, DM Sans + DM Mono

---

## Pending / In Progress
- **Desktop layout** — mock built (2026-06-25), awaiting Matthew approval, implementation pending
- **Mock archival** — prototype-v3.html and one-percent-mock-v8.html to be archived
- **Beta roster action** — texts to Brian, Landon, Andrew drafted; send and wait one week
- **Self-serve signup with email allowlist** — ENH-007, recommended next major feature
- **Zoho Mail** — free tier for matthew@mpgink.com receiving inbox, not yet set up
- **Prompt Farm protocol** — ai_prompts now mandatory for all entries; backfill complete through 040 (verify); new entries 041-060 all have ai_prompt fields

---

## Key File Locations
- Entries: `app-next/public/entries/[NNN].json`
- Config: `app-next/lib/config.js` (TOTAL_ENTRIES = 60)
- Main page + manifests: `app-next/app/page.js`
- Profile page: `app-next/app/profile/page.js`
- State: `State/onepercentstate.md` (this file)
- Logs: `Logs/`
- Backlog (content): `Backlog/onepercentbacklog.md`
- Backlog (product): `Backlog/onepercentproductbacklog.md`
- Directions: `Directions/onepercentinstructions-v1_36.md`

---

## Session Protocol Reminders
- Dead Drop verification is mandatory before any commit
- Prompt Farm step: add ai_prompts to protocol (entries include ai_prompt field; Prompt Vault surfaces dynamically — no separate file needed)
- Wrap checklist: log → state snapshot → backlog updates → build check → commit → push → confirm
- Classic PAT required for push (fine-grained tokens have caused permission errors)
