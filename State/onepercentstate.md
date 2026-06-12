# One Percent — State Snapshot
**Generated:** 2026-06-12 (v11)

---

## App Status
- **Live at:** one-percent-app.vercel.app
- **Beta testers:** DonRobbo (24+ done), Erin, Justin, Brian, Landon, Andrew (active beta)
- **Total entries published:** 040
- **Last entry:** 040 — Epistemic Humility (PH.5)
- **Directions:** onepercentinstructions-v1_36.md

---

## Content — Last 10 Published
| # | Edition | Concept | Category | Verified |
|---|---|---|---|---|
| 031 | NC.4 | Spaced Repetition | Neuroscience & Cognition | ✓ |
| 032 | CM.4 | The BLUF Principle | Communication | ✓ |
| 033 | PH.4 | Memento Mori | Philosophy | ✓ |
| 034 | SC.3 | Calibrated Questions | Sales Craft | ✓ |
| 035 | AI.4.1 | System Prompts | AI | ✓ |
| 036 | VL.4.1 | The Overton Window | Vocab & Language | ✓ |
| 037 | SC.5 | The Accusation Audit | Sales Craft | ✓ |
| 038 | MM.5 | First Principles Thinking | Mental Models | ✓ |
| 039 | AI.4.2 | Temperature & Sampling | AI | ✓ |
| 040 | PH.5 | Epistemic Humility | Philosophy | ✓ |

---

## Content — Next Rotation
| Slot | Category |
|---|---|
| 041 | Communication |
| 042 | Sales Craft |
| 043 | Neuroscience & Cognition |
| 044 | AI |
| 045 | Vocab & Language |

---

## Current Design System
- **Aesthetic:** DARK — `#0e141c` page background, `#1a2a3a` cards, `rgba(11,17,25,.97)` header
- **Fonts:** DM Sans (body), DM Mono (labels/tags)
- **Nav:** Today / Library / Prompts / Progress (bottom on mobile, sidebar on desktop)
- **Naming:** Concept / In the Wild / Lock It In
- **Prompt Farm → Prompt Vault** (renamed this session)

## Category Accent Colors
- Sales Craft `#E8FF47` · AI `#47FFE8` · Vocab & Language `#FF8C47`
- Mental Models `#C847FF` · Philosophy `#FF4778`
- Neuroscience & Cognition `#47C8FF` · Communication `#FF8C00`

---

## Infrastructure
- **Email:** Resend via matthew@mpgink.com — `send-daily-reminder` + `send-weekly-wrap` edge functions live
- **Auth:** Supabase session auth. Magic link rate limit: increase in Auth → Rate Limits for heavy dev sessions
- **Deployment:** Vercel auto-deploy on push to main
- **Supabase project:** uuzdlubbynavybttlmeh
- **GitHub:** mgolia6/one-percent-app

## Database — Key Tables / Columns
- `profiles.goal_what/goal_when/goal_proof` — SMART commitment fields
- `profiles.streak_freezes` + `streak_freeze_used_at` — freeze system
- `badge_definitions` + `user_badges` — badge catalog (40 badges seeded)

---

## What Shipped This Session (2026-06-12)
- **Full dark mode overhaul** — `#0e141c` page bg, dark header, dark bottom nav
- **WHY I'M HERE editorial treatment** — no card box, target icon, 15px text, pencil edit affordance bottom-right, bottom divider separates from KPIs
- **BETA pill** — yellow-green `#c8d800` on dark, pops clearly
- **ADMIN pill** — teal `#00c4ad` on dark, distinct from BETA
- **KPI font bump** — values 22→26px, labels 7→11px
- **On Deck lock/chevron conditional** — lock SVG when nextUnlocked (locked entry), chevron › when in-progress incomplete
- **Library category chips — flat** — no background boxes, icon + colored label + count, transparent bg, active dot indicator
- **Prompt Farm → Prompt Vault** — renamed throughout, compact single-row hero (lock icon left, title + sub right)
- **Progress streak section** — background container removed entirely, 🔥 number and week grid float on page
- **Streak freeze strip** — 🧊 inline strip inside streak section, shows `profile.streak_freezes` count
- **Bottom nav** — `#1a2a3a` dark background, colored underline pip on active tab, icon strokes light on dark
- **sec label font bump** — 13→15px, color `#e8eef5`
- **Badge system** — DB tables + 40 seeded badges, profile page badge shelf, BadgeEarnOverlay, `checkAndAwardBadges()` on load
- **Welcome overlay** — context-aware, streak chip, vault count chip, 7 nudge variants
- **DonRobbo streak fix** — corrected to 24 days in Supabase
- **Daily reminder edge function** — 3-segment behavioral emails (active/at-risk/lapsed), 21 distinct variants
- **Weekly wrap edge function** — momentum headline by entry count, even sends for zero-entry weeks

---

## Open Items (Prioritized)
1. **Scroll breathing room** — all tabs need paddingBottom so last card isn't cut off at bottom nav
2. **About / Changelog pages** — need dark style treatment to match new aesthetic
3. **Bug modal + Feedback modal** — too much gray, need visual liveliness to match dark theme
4. **Tab scroll position** — Library and Prompts default to top of first card instead of top of page; returning to a tab should reset to top (not last scroll position)
5. **Library chips active state** — Option B: subtle border on active chip so selection is clear
6. **Profile page overhaul** — redundant with Progress tab in places; needs rethink as a distinct surface
7. **ENH-007 email allowlist** — 🔴 HIGH PRIORITY before expanding beta
8. **User signs name in ritual** — input in goal sheet
9. **Social sharing card** — Web Share API
10. **001–008 quiz backfill** — recall → application format
11. **Zoho Mail inbox** — matthew@mpgink.com receiving
12. **Push notifications** — Capacitor, post-launch
