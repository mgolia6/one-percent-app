/**
 * lib/analytics.js
 *
 * Thin wrapper around PostHog. All event names and properties live here.
 * Import `analytics` everywhere — never import posthog-js directly in components.
 *
 * Usage:
 *   import analytics from '@/lib/analytics'
 *   analytics.entryOpened({ entryNumber: 8, category: 'AI', concept: 'Chain-of-Thought Prompting', editionId: 'AI.2.1' })
 */

import posthog from 'posthog-js'

// ── Helpers ───────────────────────────────────────────────────────────────────
function capture(event, props = {}) {
  if (typeof window === 'undefined') return
  try {
    posthog.capture(event, props)
  } catch {
    // Never let analytics crash the app
  }
}

// ── Identity ──────────────────────────────────────────────────────────────────
function identify(userId, traits = {}) {
  if (typeof window === 'undefined') return
  try {
    posthog.identify(userId, traits)
  } catch {}
}

function reset() {
  if (typeof window === 'undefined') return
  try {
    posthog.reset()
  } catch {}
}

// ── Events ────────────────────────────────────────────────────────────────────

/**
 * User identified after login / session restore.
 * Call once per session as soon as userId is known.
 */
function userIdentified({ userId, email, name, isAdmin, streak, totalCompleted }) {
  identify(userId, {
    email,
    name,
    is_admin: isAdmin,
    current_streak: streak,
    total_completed: totalCompleted,
  })
}

/**
 * User signs out.
 */
function userSignedOut() {
  reset()
}

/**
 * User opens an entry (entry page mounts with data).
 */
function entryOpened({ entryNumber, category, concept, editionId, isFirstTime }) {
  capture('entry_opened', {
    entry_number: entryNumber,
    category,
    concept,
    edition_id: editionId,
    is_first_time: isFirstTime,
  })
}

/**
 * User switches between tabs inside an entry (Concept / In the Wild / Lock It In).
 */
function tabSwitched({ entryNumber, fromTab, toTab }) {
  capture('entry_tab_switched', {
    entry_number: entryNumber,
    from_tab: fromTab,
    to_tab: toTab,
  })
}

/**
 * User submits the quiz.
 */
function quizSubmitted({ entryNumber, category, concept, score, maxScore, timeToQuizMs }) {
  capture('quiz_submitted', {
    entry_number: entryNumber,
    category,
    concept,
    score,
    max_score: maxScore,
    score_pct: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
    time_to_quiz_ms: timeToQuizMs,
    perfect: score === maxScore,
  })
}

/**
 * Entry fully completed and written to Supabase.
 */
function entryCompleted({ entryNumber, category, concept, score, streakAfter }) {
  capture('entry_completed', {
    entry_number: entryNumber,
    category,
    concept,
    score,
    streak_after: streakAfter,
  })
}

/**
 * Badge awarded.
 */
function badgeEarned({ badgeId, badgeName, badgeCategory }) {
  capture('badge_earned', {
    badge_id: badgeId,
    badge_name: badgeName,
    badge_category: badgeCategory || null,
  })
}

/**
 * Streak updated after a completion.
 */
function streakUpdated({ newStreak, longestStreak, userId }) {
  capture('streak_updated', {
    new_streak: newStreak,
    longest_streak: longestStreak,
  })
}

/**
 * User commits their goal in the SMART goal sheet.
 */
function goalCommitted({ what, when, signal }) {
  capture('goal_committed', {
    goal_what: what,
    goal_when: when,
    goal_signal: signal,
  })
}

/**
 * User copies the AI prompt for an entry.
 */
function aiPromptCopied({ entryNumber, category, concept }) {
  capture('ai_prompt_copied', {
    entry_number: entryNumber,
    category,
    concept,
  })
}

/**
 * Post-entry feedback form submitted.
 */
function feedbackSubmitted({ entryNumber, morningRating, middayRating, quizRating, hasComment }) {
  capture('entry_feedback_submitted', {
    entry_number: entryNumber,
    morning_rating: morningRating,
    midday_rating: middayRating,
    quiz_rating: quizRating,
    has_comment: hasComment,
  })
}

/**
 * Bug report submitted.
 */
function bugReported({ page, hasDescription }) {
  capture('bug_reported', { page, has_description: hasDescription })
}

/**
 * Streak freeze used.
 */
function streakFreezeUsed({ freezesRemaining }) {
  capture('streak_freeze_used', { freezes_remaining: freezesRemaining })
}

// ── Export ────────────────────────────────────────────────────────────────────
const analytics = {
  userIdentified,
  userSignedOut,
  entryOpened,
  tabSwitched,
  quizSubmitted,
  entryCompleted,
  badgeEarned,
  streakUpdated,
  goalCommitted,
  aiPromptCopied,
  feedbackSubmitted,
  bugReported,
  streakFreezeUsed,
}

export default analytics
