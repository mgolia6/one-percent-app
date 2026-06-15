# One Percent — State Snapshot
**Generated:** 2026-06-15 (v12)

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
- **Analytics:** PostHog wired in (project 470392). lib/analytics.js is the single import for all events. Admin ANALYTICS tab live.
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

## What Shipped This Session (2026-06-15)
- **PostHog analytics** — posthog-js installed, PostHogProvider in layout, lib/analytics.js event library
- **Full event instrumentation** — 11 event types across page.js, entry page, EntryViewer
- **Admin ANALYTICS tab** — Today / Funnel / Engagement / Entry Performance / Top Prompts / Deep Dive links

---

## Open Items (Prioritized)
1. **Scroll buffer** — 🔴 bottom nav cuts off content on all tabs. Need paddingBottom on tab content containers in page.js. Quick fix — do first next session.
2. **Streak month view** — expandable streak section, full month grid, scroll back through months via completions table
3. **Quiz content audit** — Dichotomy of Control quiz had sales-bias questions. Audit ALL non-sales entries. Also: reframe Sales Craft category to be universally relevant (everyone has a sales component to their job)
4. **AI agent** — embedded chat in app, pre-filled with entry ai_prompt, aware of user's completed entries. Anthropic API (claude-sonnet-4-6). Scope next session.
5. **About / Changelog pages** — need dark style treatment
6. **Bug modal + Feedback modal** — too gray
7. **Tab scroll position** — returning to a tab should reset to top
8. **Library chips active state** — Option B border
9. **Profile page overhaul** — redundant with Progress tab
10. **ENH-007 email allowlist** — 🔴 HIGH PRIORITY before expanding beta
11. **Zoho Mail inbox** — matthew@mpgink.com receiving
12. **Push notifications** — Capacitor, post-launch

## Session Notes
- bash_tool stopped responding mid-session. Next session: verify bash works immediately after clone before starting any work.
- Changelog v0.8 in Supabase (published: false) — needs approval
