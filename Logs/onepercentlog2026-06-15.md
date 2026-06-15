# One Percent — Session Log
**Date:** 2026-06-15
**Session:** PostHog Analytics Integration

---

## What We Did

### PostHog Wired In (fully shipped)
- Installed `posthog-js`
- Built `PostHogProvider` client component — initializes PostHog, manual `$pageview` capture on every route change, `autocapture: false`
- Built `lib/analytics.js` — typed event helper library. All components import this, never posthog-js directly
- Wrapped `layout.js` in PostHogProvider + Suspense (required for useSearchParams)

### Events Instrumented
- `$pageview` — every route change
- `user_identified` — on session load in page.js and entry page
- `entry_opened` — entry page mount, includes `is_first_time` flag
- `entry_tab_switched` — tab buttons + advance buttons (morning → midday → evening)
- `quiz_submitted` — score, score_pct, perfect flag, time_to_quiz_ms
- `entry_completed` — score, streak_after
- `streak_updated` — new_streak, longest_streak
- `badge_earned` — per badge, fires for each badge on award
- `goal_committed` — what/when/signal
- `ai_prompt_copied` — entry_number, category, concept
- `entry_feedback_submitted` — ratings + has_comment
- `bug_reported` — page, has_description

### Admin ANALYTICS Tab (shipped)
- New tab in admin nav between FEEDBACK and API HEALTH
- Lazy loads when tab is selected (doesn't block initial admin page load)
- Sections:
  - TODAY — entries opened / completed / quizzes (live PostHog)
  - 7-DAY FUNNEL — opened → In the Wild → Lock It In → Quiz, color-coded drop-off bars
  - ENGAGEMENT (7 days) — AI prompt copies, goals committed, badges earned, feedback, streaks
  - ENTRY PERFORMANCE TABLE — all entries, submission count, avg score, perfect %
  - TOP AI PROMPT COPIES — all time, ranked
  - DIVE DEEPER — 6 direct links into PostHog (Events Explorer, Replay, Funnels, Paths, Retention, Persons)
- Refresh button + POSTHOG DASHBOARD ↗ link in header
- Skeleton loading state + error card if query fails
- PostHog project ID: 470392

### Builds & Commits
- Commit 1: `7e9b25e` — PostHog provider + lib/analytics.js + full instrumentation
- Commit 2: `42d4c73` — Admin ANALYTICS tab

---

## Open Items Identified This Session (not yet built)
1. **Scroll buffer** — bottom nav cuts off content on all tabs. Need paddingBottom on tab content containers in page.js. Did not ship — session ended before fix applied.
2. **Streak month view** — expand streak section to show full month grid, scroll back through months
3. **Quiz content audit** — Dichotomy of Control feedback showed sales-bias in philosophy entry. Audit all non-sales entries for sales-tilted quiz questions. Reminder set.
4. **AI agent** — chat interface for going deeper on entries. Concept confirmed: embedded in app, pre-filled with entry's ai_prompt, aware of user's completed entries. Anthropic API (claude-sonnet-4-6). Scope to be finalized next session.

---

## Session Notes
- bash_tool stopped responding mid-session for unknown reason — could not read/write files after PostHog work was shipped. Next session should verify bash is working before starting work.
- Changelog v0.8 inserted to Supabase (published: false) — needs Matthew approval to go live.
