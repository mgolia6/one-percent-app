# One Percent — State Snapshot
**Generated:** 2026-06-01 (v6)

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
1. **Personalized goal-setting** — promised in all 5 beta check-in emails; must ship before beta ends. Mock v8 is the approved design direction (see Design Prototype Status below).
2. **Quiz backfill — entries 001–008** — old recall format, testers actively hitting these
3. **Email consistency audit** — 2 users flagged missing daily reminder emails
4. **Verify Jahic quote — Entry 017 (SC.3.1 Multi-Threading)** — Dead Drop protocol, still open

---

## Open Issues
| ID | Summary |
|---|---|
| ISSUE-006 | Firefox Focus login friction — privacy browser wipes session, forces re-auth every visit |

---

## Tester Progress (as of 2026-06-01)
You=25 (admin), DonRobbo=13, Erin=7, Brian=3, Justin=1, Andrew=1, Landon=1

---

## Design Prototype Status

**Active design sprint — home/library screen redesign**

Reviewed Erin's beta check-in feedback this session. Key signals:
- Prefers dark theme over v3 parchment
- Pain points: grey text contrast, unclear completion signal
- Feature priorities: streak, bookmarks (done ✅), home widget

Iterated through mocks v1–v8. **v8 is the closest to approved direction.**

### v8 Design Decisions
- **Background:** Onboarding gradient (`#f0f4f8 → #e8eef5 → #dde6f0`) — not black, not grey
- **Cards:** Navy `#1a2a3a` — pulled from onboarding ink color, adds warmth vs flat black
- **YOUR COMMITMENT banner** — bold mono header, italic goal text, left accent border turns cyan on commit, taps to open goal modal
- **Goal modal** — full SMART 3-step flow (what/when/signal), seed chips + free text, matches onboarding aesthetic
- **KPI pills** — fully rounded, 3 distinct colored SVG icons (cyan checkmark, yellow target, purple trophy), no leaderboard link in component
- **Streak pill** — 🔥 icon, large white number, BEST below, 7-day week view where each completed day fills with that day's lesson category color
- **WHY I'M HERE** button on streak opens same goal modal as commitment banner (one modal, two entry points)
- **TODAY hero** — category icon + concept title, 3px accent bar, moment strip at bottom (state-driven, not interactive)
- **ON DECK** — compact card below today, category icon, unlocks tomorrow
- **YOUR LIBRARY** — filter pills include PROMPT FARM and CONCEPTS GLOSSARY as dashed coming-soon pills
- **Category icons** — 7 distinct SVG icons per category, shown in today card, on deck, and every entry row
- **Nav** — same pill filter style as library

### Still to resolve in design
- Whether to ship v8 as a full app redesign or implement components incrementally
- Quiz completion micro-moment ("you got it" state)
- Completed vs locked entry visual differentiation
- Mobile header sticky behavior on scroll

**Mock file:** `one-percent-mock-v8.html` (local, not in repo — share with Erin for feedback)

---

## Session Changes This Session (2026-06-01)
- Wake words updated in directions v1.35: Platform Upgrades → Enhance, Repo Check → Repo, Let's Wrap It Up → Wrap. All wake words now require standard session review.
- Design sprint: mocks v4–v8 iterated, v8 approved as direction
- No code shipped to production this session

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
