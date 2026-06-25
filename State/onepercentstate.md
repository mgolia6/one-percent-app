# One Percent — State Snapshot
**Last updated: 2026-06-25**
Regenerated after session: entries 041-060 shipped and verified.

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
