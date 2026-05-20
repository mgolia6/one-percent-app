# One Percent — Session Log
**onepercentlog2026-05-20-v4.md**
**Session date: May 20, 2026 (session 4 — UX polish, bug fixes, admin improvements)**

---

## Session Summary

UX and admin polish session. No new content generated. Work focused on: INFO modal (how it works reference), header redesign, onboarding callout, prayer hands removal, feedback system debugging, admin improvements, Supabase RLS fixes.

---

## Features Built / Fixed This Session

### 1. INFO modal — How It Works
- Added `HOW IT WORKS` button to library header (alongside BUG, FEEDBACK)
- Modal is a full step-through reusing the onboarding aesthetic: light gradient background, DM Mono/DM Sans fonts, progress bar, step dots, BACK/NEXT/DONE nav, slide animation
- Content: all 7 onboarding steps verbatim, read-only, no commitment CTAs
- Click outside or ✕ to dismiss
- File: `app-next/app/page.js` — `HOW_IT_WORKS` array + `HowItWorksModal` component

### 2. Onboarding — INFO callout
- Added inline note below CTA button from step 2 onward: "You can revisit this anytime — INFO in your library."
- Positioned inline in the card (not fixed-position — avoids overlap with commitment pills)
- File: `app-next/app/onboarding/page.js`

### 3. Welcome overlay fix
- Onboarding completion now clears `sessionStorage.removeItem('welcomed')` before `router.push('/')`
- Ensures welcome overlay fires on first library load post-onboarding
- File: `app-next/app/onboarding/page.js`

### 4. Library header redesign
- Was: single row, wordmark + all buttons crammed together, no visual hierarchy
- Now: two-row layout
  - Row 1: ONE PERCENT wordmark + ADMIN badge (brand anchor only)
  - Hairline divider
  - Row 2: horizontally scrollable action bar — BUG (red) · FEEDBACK · INFO · separator dot · ADMIN → · SIGN OUT
- Removed redundant ADMIN block below stats dashboard
- File: `app-next/app/page.js`

### 5. Prayer hands removed
- Removed 🙏 from library FeedbackModal done state (`app/page.js`)
- Removed 🙏 from weekly feedback done state (`app/entry/[id]/page.js`)
- All three locations confirmed clean

### 6. Bug modal — page dropdown updated
- Added: Onboarding, Info
- Full list now: Library · Entry — Morning · Entry — Midday · Entry — Evening / Quiz · Onboarding · Info · Login · Other
- File: `app-next/app/page.js`

### 7. Supabase RLS fixes — feedback table
- **Root cause:** `feedback_self` policy was `for all` with only a `USING` clause — inserts require `WITH CHECK`, so all post_entry inserts were silently failing
- Dropped 5 conflicting/redundant policies, replaced with 3 clean ones:
  - `feedback_insert` — users insert own rows (WITH CHECK)
  - `feedback_select_own` — users read own rows
  - `feedback_select_admin` — admins read all rows
- Confirmed via Supabase MCP: `execute_sql` and `apply_migration` used directly

### 8. Supabase RLS fixes — admin reset buttons
- **Root cause:** Admin had read access but no delete/update policies on feedback, completions, profiles, bug_reports
- RESET DATA and HARD RESET were silently failing
- Added via `apply_migration`:
  - `feedback_delete_admin`
  - `completions_delete_admin`
  - `profiles_update_admin`
  - `bug_reports_delete_admin`
- Resets are user-scoped (`.eq('user_id', userId)`) — not blanket

### 9. Admin — INSTANT stat tile added
- Stats bar was missing INSTANT count
- Now 6 tiles: USERS · ENTRY FB · WEEKLY · END OF BETA · INSTANT · BUGS
- Grid updated to `1fr 1fr 1fr 1fr 1fr 1fr`

### 10. Admin — tab renamed
- "ENTRY FEEDBACK" → "POST-LESSON" for clarity (post-quiz rating, not general feedback)
- Heading inside tab updated to match

### 11. Admin — REFRESH button
- Added ↻ REFRESH button (teal, top right of admin header)
- Fetches all feedback/bugs/users fresh without page reload
- Shows `...` and disables while fetching
- Errors logged to console if fetch fails
- File: `app-next/app/admin/page.js`

### 12. PostEntryFeedback — error surfacing
- Added `userId` null guard with user-facing error message
- Full Supabase error message now surfaces in UI (not just generic "something went wrong")
- Errors also logged to console with `error.message`, `error.code`, `error.details`
- File: `app-next/components/EntryViewer.jsx`

---

## Commits This Session (13 total)

1. `5976336` — Library: INFO button + HowItWorksModal — all 7 onboarding steps, scrollable, read-only
2. `fd8640e` — INFO modal: step-through with onboarding aesthetic + reference note in onboarding from step 2
3. `21c0ea7` — Fix: clear welcomed flag on onboarding complete so library shows welcome overlay on first arrival
4. `d32b223` — Header: two-row layout — wordmark row + scrollable action bar, visual separation between groups
5. `0e388e9` — Onboarding: move INFO note inline below CTA — no more fixed positioning conflict
6. `cff39ba` — Remove prayer hands from weekly feedback confirmation
7. `d9c2700` — PostEntryFeedback: add userId null guard + surface actual error message for debugging
8. `44886f9` — Remove prayer hands from library feedback modal
9. `a47ed72` — Admin: add REFRESH button to re-fetch all feedback/bugs/users without page reload
10. `d732dc6` — Admin: add INSTANT stat tile, rename ENTRY FEEDBACK tab to POST-LESSON
11. `c0765df` — Admin refresh: add loading state, error logging, visual feedback on button
12. `1f8522c` — Bug modal: add Onboarding and Info to page dropdown
13. *(RLS fixes applied directly via Supabase MCP — no code commits needed)*

---

## Supabase MCP — How to Use

Claude has direct Supabase access via MCP. **Always use this for schema work — never ask Matthew to run SQL manually.**

**Project ID:** `uuzdlubbynavybttlmeh`

**Available tools (load with `tool_search` first):**
- `Supabase:list_projects` — find project ID
- `Supabase:list_tables` — inspect schema with columns, constraints, FK
- `Supabase:execute_sql` — run any read query or DML (SELECT, INSERT, DELETE)
- `Supabase:apply_migration` — run DDL (CREATE TABLE, ALTER, CREATE POLICY, DROP POLICY)

**Pattern for RLS debugging:**
```sql
-- Check all policies on a table
select polname, polcmd, pg_get_expr(polqual, polrelid) as using_expr, pg_get_expr(polwithcheck, polrelid) as with_check
from pg_policy where polrelid = 'public.feedback'::regclass;
```

**Pattern for constraint inspection:**
```sql
select conname, pg_get_constraintdef(oid) from pg_constraint where conrelid = 'public.feedback'::regclass;
```

---

## Current App State

| Area | Status |
|---|---|
| Entries | 17 live (001–017) |
| Library header | Two-row: wordmark + scrollable action bar |
| INFO modal | Step-through, onboarding aesthetic, 7 steps |
| Onboarding | 8 steps, INFO callout inline from step 2 |
| Welcome overlay | Fires correctly post-onboarding |
| Post-lesson feedback | Working — inserts to `feedback` table as `post_entry` |
| Weekly feedback | Exists but won't trigger for backdated signups (ISSUE-002) |
| Instant feedback | Working — `landing` type, shows in INSTANT tab |
| Admin stats | 6 tiles: USERS / ENTRY FB / WEEKLY / END OF BETA / INSTANT / BUGS |
| Admin tabs | POST-LESSON / WEEKLY / END OF BETA / INSTANT / BUGS / USERS |
| Admin refresh | ↻ REFRESH button, live data without page reload |
| Admin resets | RESET DATA + HARD RESET both working (RLS fixed) |
| Supabase RLS | Clean — 3 feedback policies, 4 admin delete/update policies |
| Prayer hands | Fully removed from all locations |
| Bug modal | All pages covered including Onboarding and Info |

---

## Next Steps — Priority Order

1. **Interactive audit of Entry 017 (SC.3.1 — Multi-Threading)** — Matthew wants to test this next session. Walk through the entry in the app, check all three tabs, quiz, post-lesson feedback flow end to end.
2. **Content generation** — Entry 018 is AI.3.1. Candidates: RAG, AI Agents, Temperature/Sampling. Run backlog check + real-time search signal at generation time.
3. **ISSUE-002** — Weekly feedback trigger fix for backdated/admin signups. Needs manual override or admin test trigger.
4. **ISSUE-003** — Multi-threading bug (parallel entry loading) — not yet investigated.
5. **365-entry sprint** — Bank content ahead of beta launch target.

---

## Open Questions for Matthew

- Dark theme is locked in. Light mode deferred to post-beta. Confirm this is still the call.
- Entry 017 audit: do you want to do this as a live walkthrough in chat, or should Claude pre-audit the JSON and flag issues first?
