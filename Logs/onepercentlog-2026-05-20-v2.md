# One Percent — Session Log
**Date:** May 20, 2026 | **Session:** App Build / Bug Fix / UI Polish

---

## Session Summary

Full app polish and bug fix session. No content generated. All work was platform.

---

## Bugs Fixed

### Evening theme unreadable (CRITICAL — user reported)
- **Root cause:** Commit `fda133c` ("Remove all hardcoded #0A0A0A") swept too broadly and inverted the evening theme to a light background (`#dadada`) with dark text. Six subsequent landing page color commits kept dragging the wrong value forward.
- **Fix:** Restored evening theme to full dark spec (`#0A0A0A` base, correct text/surface values). Also fixed hardcoded `color: '#333'` on retake-quiz line.
- **Bug report:** Marked resolved in Supabase (`status = 'resolved'`, ID: `52ad9b03`)

### Library filter tabs floating / unreadable
- **Root cause:** `translateY(2px)` on selected tab + neon colors against `#dadada` background
- **Fix (iterative — 4 passes):** Removed all position transforms. Landed on `#1e1e1e` dark pill container with `rgba(255,255,255,0.07)` chip for selected state. No movement, no border tricks.

---

## Features Added

### Supabase: `status` column on `bug_reports`
- Values: `open` / `resolved` / `wont_fix` (default: `open`)
- Admin-only UPDATE policy
- Evening quiz bug marked resolved

### Action bar redesign
- Wrapped BUG / FEEDBACK / INFO / ADMIN / SIGN OUT in `#1e1e1e` dark pill
- Matches library tab treatment — consistent design language

### ABOUT page (`/about`)
- Brand/identity page: what One Percent is, how the three daily sections work, all seven categories with accent colors, ethos
- Accessible from action bar

### CHANGELOG page (`/changelog`)
- Pulls published entries from Supabase `changelog` table, newest first
- Shows version badge, LATEST tag on first entry, date, plain English title + description
- Accessible from action bar

### `changelog` Supabase table
- Schema: `id`, `version`, `title`, `description`, `published`, `created_at`
- RLS: authenticated users read published=true; admins write all
- Seeded with v0.1 and v0.2 entries (v0.2 unpublished pending Matthew approval)

### Enhancement backlog seeded (in instructions v1.23)
- ENH-001: Profile picture upload
- ENH-002: Profile page build-out
- ENH-003: Weekly quiz (no content access)
- ENH-004: Audio lessons
- ENH-005: Admin changelog UI

---

## Instructions Updated

- **v1.23 written** — adds: Wrap It Up protocol with changelog step, enhancement backlog, changelog workflow, updated schema, updated app routes, wake words table

---

## Other Fixes
- Badge visibility (BETA/ADMIN): solid `#1a1a1a` backing so neon colors pop on any background
- Gap between action bar and stats: reduced from 44px to 22px
- Library tab scrollbar: `className` correctly applied so webkit scrollbar CSS fires
- ABOUT / CHANGELOG buttons added to action bar

---

## Commits This Session (chronological)
1. Fix: restore evening theme to dark
2. Add `status` to `bug_reports`, admin-only policy
3. Fix library tabs: underline style, slideable, scroll-to-section
4. Tabs: dark `#1e1e1e` pill container
5. Tabs: lighter container, readable system labels, underline indicator, no scroll-on-filter
6. Tabs: kill all position shifting — bg highlight only
7. Header action bar: dark pill matching tabs
8. Fix: reduce gap between action bar and stats
9. Add About + Changelog pages; fix badges; add ABOUT/CHANGELOG to action bar
10. Instructions v1.23

---

## Changelog Entry (Supabase — unpublished, pending Matthew approval)
**v0.2 — "UI polish, About, and Changelog"**
Evening quiz fix, tab/nav redesign, About page, Changelog page, badge fixes.

---

## Next Session Priorities
1. Publish v0.2 changelog entry (Matthew to approve)
2. Fix ISSUE-005: Onboarding text overlap on mobile
3. Generate Entry 018 (AI — AI.3.1)
4. Enhancement backlog: assess priority order
