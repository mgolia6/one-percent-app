# One Percent — Session Log
**onepercentlog2026-05-20-v5.md**
**Session date: May 20, 2026 (session 5 — auth/RLS debugging, admin fixes, feature planning)**

---

## Session Summary

No new content generated. Session focused on diagnosing and fixing a cascade of auth, RLS, and admin UI bugs triggered by adding a new beta user (Robb). All issues resolved. Feature enhancements logged for upcoming sprints.

---

## What Triggered This Session

Matthew's friend Robb (rmcnaugher@gmail.com) signed up as the first external beta user. He was confirmed in `auth.users` and `profiles` but not visible in the admin USERS tab. Diagnosing that surfaced a chain of related issues.

---

## Bugs Fixed This Session

### 1. Admin USERS tab — Robb not showing
- **Root cause:** No admin SELECT policy on `profiles`. `profiles_self` only let users read their own row. Admin query silently returned 1 row (Matthew only).
- **Fix path (multiple iterations):**
  - First attempt: added `profiles_select_admin` with subquery → circular dependency → Matthew lost admin status and entries locked
  - Second attempt: `(auth.uid() = id OR is_admin = true)` → wrong — `is_admin` evaluated on the row being read, not the requesting user → still only returned Matthew's row
  - **Final fix:** `SECURITY DEFINER` function `public.is_admin()` that bypasses RLS to check admin status, used in policy → no recursion, works correctly
- **Status:** ✓ Resolved — both users visible in admin

### 2. Onboarding loop after adding RLS policy
- **Root cause:** Profile read in `page.js` used `.single()` — errors on unexpected results, returns null, triggers new profile insert with `onboarding_complete: false`, redirects to `/onboarding` → loop
- **Fix:** Switched to `.maybeSingle()` throughout (`page.js` and `onboarding/page.js`). Added error guards — on fetch error or insert error, halt and setLoading(false) rather than falling through to onboarding redirect
- **Status:** ✓ Resolved

### 3. Sign out looping
- **Root cause:** `router.push('/login')` is client-side nav — Supabase session in localStorage still valid, pages re-read it and redirect back
- **Fix:** Changed to `window.location.href = '/login'` — full page reload clears React state, forces fresh session check
- **Status:** ✓ Resolved

### 4. Entries locked / admin badge missing
- **Root cause:** Intermediate RLS policy `(auth.uid() = id OR is_admin = true)` — `is_admin` checked against the row being read, not the requesting user. Matthew's own row came back (via `profiles_self`), but `is_admin` in the policy evaluated to false for other rows. `getUnlockedCount` received `isAdmin: false` → all entries locked.
- **Fix:** Resolved by the `SECURITY DEFINER` fix above — clean policies, correct `is_admin` resolution
- **Status:** ✓ Resolved

### 5. Admin page profile check using `.single()`
- **Root cause:** Admin page `init()` used `.single()` on profile read — same failure mode as page.js
- **Fix:** Switched to `.maybeSingle()`, added error logging
- **Status:** ✓ Resolved

---

## Features Added This Session

### DB schema additions
- `first_name` (text, nullable) — added to `profiles`
- `last_name` (text, nullable) — added to `profiles`
- `phone` (text, nullable) — added to `profiles`

### Admin USERS tab improvements
- Added inline debug block temporarily (removed end of session)
- User cards now display `first_name` + `last_name` if populated, fall back to `name`, then email
- Phone shown in meta line if present

---

## Commits This Session

1. `49c5867` — Fix: switch profile read to maybeSingle, guard insert to only fire on genuinely missing row — prevents onboarding loop
2. `1d529b4` — Fix: hard redirect on signout to fully clear session; maybeSingle on onboarding profile read
3. `87c3a41` — Fix: stop on profile fetch/insert error instead of falling through to onboarding redirect
4. `28b6f44` — Fix: admin page maybeSingle on profile read; add console logging to trace is_admin fetch in library + admin
5. `64b67f6` — Add logging to admin users fetch to diagnose RLS issue
6. `432ae68` — Add inline debug output to admin users tab for mobile diagnosis (temporary)
7. `2b4e67c` — Admin users: remove debug block, add first/last name + phone display; add columns to profiles table

---

## RLS — Final Clean State (profiles table)

| Policy | Command | Rule |
|---|---|---|
| `profiles_select` | SELECT | `auth.uid() = id OR public.is_admin()` |
| `profiles_update_self` | UPDATE | `auth.uid() = id` |
| `profiles_insert_self` | INSERT | `auth.uid() = id` |
| `profiles_delete_admin` | DELETE | `is_admin = true` |

`public.is_admin()` — SECURITY DEFINER function, bypasses RLS, checks `profiles.is_admin` for `auth.uid()`.

---

## Current App State

| Area | Status |
|---|---|
| Entries | 17 live (001–017) |
| Beta users | 2 — Matthew (admin) + Robb (not yet onboarded) |
| Auth / sign out | Working — full page reload on signout |
| Onboarding loop | Fixed — maybeSingle + error guards throughout |
| Admin access | Working — SECURITY DEFINER RLS fix |
| Admin USERS tab | Shows all users, first/last name + phone if populated |
| Entries unlocked | Correct — admin gets all, users get day-based unlock |
| profiles schema | id, email, name, first_name, last_name, phone, signup_date, current_streak, longest_streak, last_active_date, onboarding_complete, is_admin |

---

## Known Issues

### ISSUE-001 (carried) — Static year references in instructions
See v1.18 known issues. Fix before public launch.

### ISSUE-002 (carried) — Weekly feedback trigger for backdated signups
Matthew's `signup_date` is `2026-01-01` (backdated). Weekly feedback trigger logic uses signup_date to determine when to prompt — won't fire correctly for admin/backdated accounts. Needs manual override or admin test trigger.

### ISSUE-003 (carried) — Multi-threading bug (parallel entry loading)
Not yet investigated.

### ISSUE-004 (new) — Sign out button has no visual feedback
Sign out works but gives the user no indication — no spinner, no disabled state, no confirmation. Needs loading state added.

---

## Feature Enhancements Logged (Future Sprints)

### Button audit — all buttons need state review
Every interactive button in the app needs a pass: loading state, disabled state during action, visual feedback on completion. Sign out was flagged this session as having none. Audit needed across: sign out, onboarding CTAs, feedback submit, bug submit, admin reset buttons, refresh button.

### Profile page
- Dedicated `/profile` page for users
- Editable fields: first name, last name, email (read-only), phone (optional)
- Profile picture: upload + display. Consider Supabase Storage bucket.
- Access: from library header or nav

### Founder's Club badge
- All beta testers get a permanent "Founder's Club" badge on their profile
- Criteria: signed up during beta period (before public launch)
- Display: profile page, potentially library header
- Implementation: `is_founder` boolean on profiles, set at signup during beta window, or manual admin grant

### Achievement / streak badges
Design TBD but system should include:

**Streak badges:**
- 🔥 3-day streak
- 🔥🔥 7-day streak
- 💎 30-day streak
- ⚡ 100-day streak (aspirational)

**Usage badges:**
- First entry completed
- First quiz 3/3
- 10 entries completed
- 25 entries completed
- All 7 categories completed (one from each)
- Perfect week (7 entries in 7 days)

**Implementation path:** `badges` table linked to `profiles`, awarded by trigger or server-side logic on completion. Display on profile page and optionally in library header.

---

## Next Steps — Priority Order

1. **Entry 017 verify audit (interactive)** — Walk through sources one at a time: Matthew confirms each before moving to next. Not a data dump — step-by-step. Flag on quote wording discrepancy ("about themselves" vs "themselves") before any post.
2. **Entry 018 generation** — AI.3.1. Run backlog check + real-time search. Top candidates: RAG, AI Agents, Temperature/Sampling.
3. **Button audit** — Full pass on all interactive buttons. Loading states, disabled states, visual feedback.
4. **Profile page** — `/profile` with editable name fields, optional phone, profile pic via Supabase Storage.
5. **Founder's Club + badge system** — Schema design first, then UI.
6. **ISSUE-002** — Weekly feedback trigger fix for backdated/admin signups.
7. **ISSUE-003** — Multi-threading bug investigation.
8. **365-entry content sprint** — Bank content ahead of beta.

---

## Open Questions for Matthew

- Founder's Club badge: auto-grant to all current beta users (Matthew + Robb) or admin-controlled grant?
- Badge display: profile page only, or also visible in the library header?
- Profile pic: Supabase Storage upload, or link to an external image URL (simpler for beta)?
- Dark theme: still locked in, light mode post-beta. Confirm still the call.
