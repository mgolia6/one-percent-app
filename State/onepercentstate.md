# One Percent — State Snapshot
**Generated:** 2026-06-10 (v10)

---

## App Status
- **Live at:** one-percent-app.vercel.app
- **Beta testers:** DonRobbo (22 done), Erin (10), Brian (3), Landon (1), Andrew (1), Justin (1), John (0), Unknown (0)
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
- **Aesthetic:** Warm parchment gradient `#f0f4f8 → #e8eef5 → #dde6f0`, navy `#1a2a3a` cards
- **Fonts:** DM Sans (body), DM Mono (labels/tags), Caveat (ritual handwriting)
- **Nav:** Today / Library / Prompts / Progress (bottom on mobile, sidebar on desktop)
- **Naming:** Concept / In the Wild / Lock It In (not morning/midday/evening anywhere)
- **Section names:** YOUR MOVE (not Morning Challenge)

## Category Accent Colors
- Sales Craft `#E8FF47` · AI `#47FFE8` · Vocab & Language `#FF8C47`
- Mental Models `#C847FF` · Philosophy `#FF4778`
- Neuroscience & Cognition `#47C8FF` · Communication `#FF8C00`

---

## Infrastructure
- **Email:** Resend via matthew@mpgink.com — `send-daily-reminder` + `send-practice-reminder` edge functions confirmed working
- **Auth:** Supabase session auth. Magic link rate limit: ~3-5/hr/email — increase in Auth → Rate Limits for heavy dev sessions
- **Deployment:** Vercel auto-deploy on push to main
- **Supabase project:** uuzdlubbynavybttlmeh
- **GitHub:** mgolia6/one-percent-app

## Database — Key Columns Added This Session
- `profiles.goal_what` (text) — commitment step 1
- `profiles.goal_when` (text) — commitment step 2
- `profiles.goal_proof` (text) — commitment step 3

---

## What Shipped This Session (2026-06-10)
- **Home screen full redesign:** 4-tab layout (Today/Library/Prompts/Progress), commitment banner, KPI chips, TODAY hero card with moment strip, On Deck (next unlocked OR oldest incomplete if fully unlocked), Last Learned
- **Goal setting ritual:** 3-step SMART commitment sheet, typewriter animation, paper fold, saves to Supabase
- **Concept/In the Wild/Lock It In rename:** Applied across entire codebase
- **Desktop layout:** Dark navy sidebar ≥768px, mobile unchanged
- **Library:** Category icons in entry rows, FAVORITES chip, chip tap toggles (deselect = show all)
- **Leaderboard redesign:** Parchment bg, hero standing card, metric switcher pill, progress bar rows
- **Admin overhaul:** Light bg, user cards with status dots + nudge SMS shell, API health checker, bug log with resolve, feedback per user with score averages, email runbook
- **Bug fixes:** React import crash, init try/catch/finally, leaderboard non-blocking

---

## Open Items (Prioritized)
1. **Magic link rate limit** — increase in Supabase Auth → Rate Limits
2. **User signs name in ritual** — input in goal sheet, store on profile, show in paper signature
3. **Social sharing card** — "I just learned X with One Percent" → Web Share API + copy fallback
4. **Profile page overhaul** — additional fields, better layout
5. **001–008 quiz backfill** — old recall format → application/conceptual
6. **ENH-007 email allowlist** — before expanding beta further
7. **Zoho Mail inbox** — matthew@mpgink.com receiving
8. **Push notifications** — Capacitor, post-launch
9. **Prompt Farm content** — placeholder exists
10. **Concepts Glossary** — placeholder exists
