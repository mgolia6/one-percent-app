# One Percent — State Snapshot
**Generated:** 2026-06-04 (v7)

---

## App Status
- **Live at:** one-percent-app.vercel.app
- **Beta testers:** DonRobbo, Erin, Brian, Landon, Andrew, Justin
- **Total entries published:** 030
- **Last entry:** 030 — Confirmation Bias (MM.4)

---

## Content — Last 5 Published
| # | Edition | Concept | Category | Verified |
|---|---|---|---|---|
| 026 | SC.3.2 | Mirroring | Sales Craft | ✓ Matthew 2026-06-04 |
| 027 | AI.3.2 | AI Agents | AI | ✓ Matthew 2026-06-04 |
| 028 | VL.4 | Loaded Language | Vocab & Language | ✓ Matthew 2026-06-04 |
| 029 | SC.4.1 | Labeling | Sales Craft | ✓ Matthew 2026-06-04 |
| 030 | MM.4 | Confirmation Bias | Mental Models | ✓ Matthew 2026-06-04 |

---

## Content — Next Rotation
| Slot | Category | Notes |
|---|---|---|
| 031 | NC | Neuroscience & Cognition — next in rotation |
| 032 | CM | Communication |
| 033 | PH | Philosophy |
| 034 | SC | Sales Craft (SC.4.2) |
| 035 | AI | AI (AI.4.1) |

Candidates to consider: Red Team Exercise (MM or CM — added to backlog this session)

---

## Entries Still Needing Quiz Backfill
001–008 use old recall-based format. Backfill queued — not yet scheduled.

---

## Protocol Updates This Session
- **Dead Drop protocol updated:** Search query is now mandatory with every claim. Format:
  > **Claim N:** [claim]
  > **Search:** `[exact query]`
  > What do you get?
- **Content review step formalized:** Full content (including AI prompts) must be presented to Matthew for approval before Dead Drop begins

---

## Infrastructure
- Supabase project: uuzdlubbynavybttlmeh
- GitHub: mgolia6/one-percent-app (CLI only, api.github.com blocked)
- Vercel: auto-deploys on push to main
- Resend: matthew@mpgink.com, domain verified
- pg_cron: daily reminder (12:00 UTC), practice reminder (hourly, 6hr post-completion), weekly wrap (day 7/14/21)

---

## Active Beta Infrastructure
- Survey system live: /survey/[userId] — unique links per tester
- Beta check-in tab in admin dashboard
- Bookmarking live: star icon, optimistic UI, Saved filter tab
- Changelog modal: show_modal: true + published: true triggers in-app modal

---

## Product Backlog — Top Items
See Backlog/onepercentproductbacklog.md for full list. High priority:
- Goal-setting feature (teased to testers — before beta ends)
- Quiz backfill entries 001–008
- Voice feedback (Web Speech API) — approved, not built
- 4-question post-entry quiz revamp — approved, not built
- ISSUE-002: weekly trigger broken for backdated signups
- ISSUE-004: re-engagement flow for inactive users

---

## Session Start Protocol (Every Session)
1. Clone repo with token Matthew provides
2. `git config user.email "claude@anthropic.com" && git config user.name "Claude"`
3. Read this file
4. Read latest log in Logs/
5. Wait for Matthew's wake word
