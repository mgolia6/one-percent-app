# One Percent — State Snapshot
**Generated:** 2026-06-15

---

## App Status
- **Live at:** one-percent-app.vercel.app
- **Beta testers:** DonRobbo, Erin, Justin, Brian, Landon, Andrew (6 active)
- **Total entries published:** 040
- **Directions:** onepercentinstructions-v1_36.md

---

## Session Shipped (2026-06-15)

| Item | Status |
|------|--------|
| UI-001 Scroll buffer (90px paddingBottom all tabs) | ✅ |
| UI-002 Tab scroll reset (instant snap to top) | ✅ |
| UI-003 Library chip active state (border + dim fill) | ✅ |
| UI-004 About/Changelog dark mode | ✅ |
| UI-005 Bug/Feedback modal refresh | ✅ |
| UI-006 Profile overhaul — killed Progress tab, Account tab owns identity/phone/notifications | ✅ |
| UI-007 Streak month grid — real calendar, category-colored dots, completed_at data | ✅ |
| Welcome back typewriter — types before name in WelcomeOverlay | ✅ |
| ABOUT removed from action strip/sidebar | ✅ |
| Privacy Policy page (/privacy) | ✅ |
| About + Privacy links moved to profile Account tab footer | ✅ |
| DB: profiles.phone, profiles.email_reminders, completions.completed_at | ✅ |
| FEAT-001 Deep Cut AI agent — /api/deep-cut streaming route | ✅ |
| Deep Cut FAB — circle, bottom right, color cycles through all 7 category accents | ✅ |
| Deep Cut drawer — entry picker, category filters, chat state, context pill, source pills | ✅ |
| Today's ai_prompt as first suggestion chip (distinct badge + tint) | ✅ |
| Per-card DEEP CUT buttons removed from Prompt Vault | ✅ |

---

## Deep Cut Architecture

**FAB:** Circle, bottom right, 82px above nav. Cycles all 7 category accent colors every 2.5s with pulse ring. Exported as `DeepCutFAB` from DeepCut.jsx, mounted at root in page.js so it floats across all tabs.

**Drawer (92dvh slide-up):**
- State A — Entry picker: category filter chips, completed entries list, GO DEEP button activates on selection in entry's accent color
- State B — Chat: EXPLORING context pill (tap → SWITCH back to picker), source pills, messages, suggestions
- Today's ai_prompt appears as first suggestion with TODAY'S PROMPT badge in entry accent color
- Standard explore prompts below
- Streaming responses via /api/deep-cut
- Out-of-source answers flagged in orange by Claude

**API Route:** /api/deep-cut — server-side, streams claude-sonnet-4-6, injects full entry JSON + user context into system prompt, explicit source grounding rules.

**Requires:** ANTHROPIC_API_KEY in Vercel env vars (already added).

---

## Open Backlog

| ID | Item | Priority |
|----|------|----------|
| CONTENT-001 | Quiz audit — remove sales bias from non-sales entries | High |
| ISSUE-007 | HITL icon not appearing in app | Medium |
| ISSUE-006 | Firefox Focus login friction | Low |
| ENH-007 | Auth allowlist gate pre-public launch | Medium |
| POST-LAUNCH | Push notifications (Capacitor) | Future |
| POST-LAUNCH | Audio lessons | Future |
| POST-LAUNCH | Email receiving inbox (Zoho Mail) | Future |

---

## Next Session Priorities
1. Quiz content audit (CONTENT-001)
2. Test Deep Cut end-to-end on device — verify source grounding + orange flags
3. Entry 041 — Communication category

---

## Key File Paths
- app-next/app/page.js — main app
- app-next/app/profile/page.js — profile page
- app-next/app/privacy/page.js — privacy policy (new)
- app-next/app/api/deep-cut/route.js — Deep Cut API (new)
- app-next/components/DeepCut.jsx — DeepCut component + FAB (new)
- app-next/public/entries/ — entry JSON files
- State/onepercentstate.md — this file
- Backlog/onepercentproductbacklog.md — product backlog
