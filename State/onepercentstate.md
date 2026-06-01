# One Percent — State Snapshot
**Generated:** 2026-05-31 (v5)

---

## Rotation Position
- **Total entries:** 25
- **Last entry generated:** NC.3 (Dopamine & Motivation) — position 013
- **Next entry due:** SC.3.2 (Sales Craft)

## Category Counts
| Category | Count |
|---|---|
| Sales Craft | 6 |
| AI | 5 |
| Vocab & Language | 3 |
| Mental Models | 3 |
| Philosophy | 3 |
| Neuroscience & Cognition | 3 |
| Communication | 3 |

---

## Top Priorities (Before Beta Ends)
1. **Quiz backfill — entries 001–008** — old recall format, testers actively hitting these
2. **Personalized goal-setting** — promised in all 5 beta check-in emails; must ship before beta ends
3. **Email consistency audit** — 2 users flagged missing daily reminder emails
4. **Verify Jahic quote — Entry 017 (SC.3.1 Multi-Threading)** — Dead Drop protocol, still open

---

## Open Issues
| ID | Summary |
|---|---|
| ISSUE-006 | Firefox Focus login friction — privacy browser wipes session, forces re-auth every visit |

---

## Tester Progress (as of 2026-05-31)
You=25 (admin), DonRobbo=8+, Erin=6+, Brian=3+, Landon=3+, Andrew=1, Justin=0 (just joined)

---

## This Session (2026-05-31)

### Shipped
- **Beta check-in survey** — `/survey/[userId]`, v3 parchment aesthetic, no auth, saves to `beta_checkin` table
- **Beta check-in emails** — 5 personalized emails sent via Resend from `matthew@mpgink.com`. All confirmed delivered.
- **Roadmap** — `onepercentroadmap.md` in repo root. Three tiers: Before Beta Ends, Post-Beta Pre-Launch, Long-Term.
- **Bookmarking / favorites** — `bookmarks` table, star icon on unlocked entry cards, Saved filter tab in library
- **Admin BETA CHECK-IN tab** — reads `beta_checkin`, shows design pref, prompt farm, friction, feature priorities, open comment

### Confirmed Already Done (cleared from backlog)
- Zero-completion gate ✅ (done May 27)
- PU-001 Library refresh button ✅ (done prior session)
- PU-004 Leaderboard trophy emoji ✅ (done prior session)
- Quiz revamp ✅
- Voice feedback ✅
- AI Prompt copy button ✅

---

## Design Prototype Status
Three prototype iterations produced (HTML files, not in repo):
- v1: dark, neon — too similar to current app
- v2: sand palette, morph+reveal transitions, SMART goal flow
- v3: dimensional today card, custom SVG tab icons, profile avatar header, legibility pass

**Sent to beta testers for feedback** via check-in survey (side-by-side current vs v3). Awaiting responses.

**Still to resolve in design:**
- Header presence — feels unheroic, needs weight
- Quiz completion micro-moment ("you got it" state)
- Completed vs locked entry differentiation
- Stats row emotional weight

---

## Infrastructure
- **Supabase tables:** profiles, completions, feedback, bug_reports, changelog, beta_checkin, bookmarks
- **Edge functions:** send-daily-reminder, send-practice-reminder, send-weekly-wrap, send-welcome-email, send-beta-checkin
- **Survey URLs:** `/survey/[userId]` — unique per user, no auth required
- **Roadmap file:** `onepercentroadmap.md` in repo root

---

## App / Repo
- **URL:** one-percent-app.vercel.app
- **Repo:** mgolia6/one-percent-app
- **Supabase:** uuzdlubbynavybttlmeh
- **Instructions:** Directions/onepercentinstructions-v1_35.md
- **GitHub token:** See Matthew's secure notes (expires ~Aug 17, 2026)
- **Resend API key:** See Matthew's secure notes
