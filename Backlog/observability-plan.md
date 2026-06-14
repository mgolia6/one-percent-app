# One Percent — Observability Plan
**Created:** 2026-06-14
**Standard:** Standards/observability-standard.md in mpgink-program-manager

---

## Status

| Layer | Status | Notes |
|---|---|---|
| PostHog env var | ✅ Done | `NEXT_PUBLIC_POSTHOG_KEY` set in Vercel |
| PostHog SDK wired | ❌ Not done | Key exists, no init code yet |
| PostHog error tracking | ❌ Not done | Depends on SDK wiring |
| Sentry | ⏭ Skipped | Using PostHog errors instead |
| Admin monitoring endpoint | ⚠️ Partial | Admin panel exists at `/admin` but no clean JSON endpoint for PM dashboard |
| PM dashboard integration | ❌ Not done | No `/api/admin/monitoring` endpoint to call |

---

## What Already Exists (don't rebuild)

- `app-next/app/admin/page.js` — full admin UI: users, bugs, feedback, API health, email tabs
- Manual API health check (on-demand button, hits Supabase + edge functions)
- `supabase/functions/` — 5 edge functions for email (daily reminder, weekly wrap, etc.)
- `profiles`, `completions`, `feedback`, `bug_reports`, `badge_definitions`, `user_badges` tables

The gap: PostHog not initialized, no automated monitoring endpoint, no PM dashboard feed.

---

## Work to Do

### 1. Wire PostHog into the Next.js app

PostHog env var: `NEXT_PUBLIC_POSTHOG_KEY` — set in Vercel, not yet in code.

**Standard Next.js PostHog setup:**

```javascript
// app-next/lib/posthog.js
import posthog from 'posthog-js'

export function initPosthog() {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: false,
    capture_exceptions: true,   // PostHog error tracking
  })
}

export function identifyUser(user) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !user) return
  posthog.identify(String(user.id), {
    email: user.email,
    name: user.name || user.first_name,
    created_at: user.signup_date,
  })
}

export function resetIdentity() {
  posthog.reset()
}

export function track(event, props = {}) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
  posthog.capture(event, props)
}

export const Analytics = {
  // Auth
  loginSuccess:       ()              => track('login_success'),
  registered:         ()              => track('registered'),
  loggedOut:          ()              => track('logged_out'),

  // Library
  entryOpened:        (entry, cat)    => track('entry_opened',     { entry, category: cat }),
  entryCompleted:     (entry, score)  => track('entry_completed',  { entry, score }),
  bookmarkToggled:    (entry, saved)  => track('bookmark_toggled', { entry, saved }),

  // Navigation
  tabViewed:          (tab)           => track('tab_viewed',       { tab }),

  // Streak / engagement
  streakViewed:       (streak)        => track('streak_viewed',    { streak }),

  // Feedback
  feedbackSubmitted:  (type)          => track('feedback_submitted', { type }),
  bugReported:        (page)          => track('bug_reported',     { page }),

  // Surveys
  weeklySurveyDone:   (week)          => track('weekly_survey_done', { week }),
  endOfBetaDone:      ()              => track('end_of_beta_done'),

  // Badges
  badgeEarned:        (badge)         => track('badge_earned',    { badge }),

  // Goal commitment
  goalCommitted:      ()              => track('goal_committed'),
}
```

Wire `initPosthog()` into `app-next/app/layout.js` (client component wrapper).
Wire `identifyUser()` into auth success in `app-next/app/page.js` init flow.
Wire `resetIdentity()` into sign-out handler.

### 2. Install posthog-js

```bash
cd app-next && npm install posthog-js
```

### 3. Add /api/monitoring route (Next.js API route)

New file: `app-next/app/api/monitoring/route.js`

Admin-gated. Returns clean JSON for PM dashboard.

```javascript
// GET /api/monitoring
{
  activation: {
    posthog: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
    resend: true,  // inferred from edge functions being live
  },
  users: { total, last_7d, last_24h },
  completions: { total, last_7d },
  feedback: { total, unread },
  bugs: { open, resolved },
  streak: { avg_current, users_with_streak }
}
```

Pull from Supabase using service role key (server-side only in route handler).

### 4. Wire into PM dashboard

Once `/api/monitoring` is live:
- Update `api/metrics.js` in mpgink-program-manager to call One Percent's monitoring endpoint
- Add signal pills to One Percent ProjectCard
- Add expanded view to DetailPanel

---

## Priority Order

1. `npm install posthog-js` + `lib/posthog.js` + wire into layout + auth
2. `/api/monitoring/route.js` — unblocks PM dashboard
3. PM dashboard integration
4. Verify PostHog error tracking is capturing JS exceptions

---

## Key Decisions

- **No Sentry** — PostHog error tracking (`capture_exceptions: true`) covers client-side. Vercel logs cover server-side (Next.js API routes surface there natively).
- **No server-side PostHog** — One Percent has no heavy server logic outside Supabase edge functions. Client-side PostHog is sufficient.
- **Monitoring route is Next.js App Router style** (`route.js`, not `api.js`) — matches the existing `app-next/app/` structure.

---

## Environment Variables (Vercel — one-percent-app project)

| Var | Status | Purpose |
|---|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | ✅ Set | PostHog project API key |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Set | Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Set | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Set | Server-side Supabase access |
