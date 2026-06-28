// Spaced-repetition ("Keep It Sharp") — client-side Leitner scheduling.
//
// A user flags a lesson to keep sharp; we resurface it on an expanding schedule.
// Remembering it cleanly promotes it to the next box (longer gap); a fuzzy recall
// resets it to box 0. After a clean recall at the top box it graduates to 'done'.
//
// The daily `send-lockin-review` edge function only nudges; all box math is here
// so the schedule and the UI never disagree.

import { supabase } from '@/lib/supabase'

// Days until next review, indexed by Leitner box.
export const BOX_INTERVALS_DAYS = [2, 5, 12, 30]
export const TOP_BOX = BOX_INTERVALS_DAYS.length - 1

const DAY_MS = 86400000

function dueAfter(box) {
  const days = BOX_INTERVALS_DAYS[Math.min(box, TOP_BOX)]
  return new Date(Date.now() + days * DAY_MS).toISOString()
}

// Enroll a lesson (upsert — re-enrolling an existing one just refreshes the keeper).
export async function enrollLockin({ userId, entry, keeper = null, hook = null }) {
  if (!userId || !entry) return { error: 'missing args' }
  const row = {
    user_id: userId,
    entry_number: String(entry.entry ?? entry.number),
    concept: entry.concept || null,
    category: entry.category || null,
    keeper: keeper || null,
    hook: hook || null,
    box: 0,
    status: 'active',
    due_at: dueAfter(0),
    reminder_sent_at: null,
  }
  const { data, error } = await supabase
    .from('lockins')
    .upsert(row, { onConflict: 'user_id,entry_number' })
    .select()
    .maybeSingle()
  return { data, error }
}

export async function removeLockin({ userId, entryNumber }) {
  return supabase.from('lockins').delete().eq('user_id', userId).eq('entry_number', String(entryNumber))
}

// Is this entry already enrolled (any status)?
export async function getLockin({ userId, entryNumber }) {
  const { data } = await supabase
    .from('lockins')
    .select('*')
    .eq('user_id', userId)
    .eq('entry_number', String(entryNumber))
    .maybeSingle()
  return data
}

// All active lock-ins that are due now, soonest first.
export async function getDueLockins(userId) {
  const { data } = await supabase
    .from('lockins')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .lte('due_at', new Date().toISOString())
    .order('due_at', { ascending: true })
  return data || []
}

// Count of due reviews — used for the home banner.
export async function getDueCount(userId) {
  const { count } = await supabase
    .from('lockins')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'active')
    .lte('due_at', new Date().toISOString())
  return count || 0
}

// All of a user's active lock-ins (for the review page, including not-yet-due).
export async function getActiveLockins(userId) {
  const { data } = await supabase
    .from('lockins')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('due_at', { ascending: true })
  return data || []
}

// Record a review outcome and reschedule.
//   remembered === true  → promote a box (graduate to 'done' past the top box)
//   remembered === false → reset to box 0
export async function reviewLockin(lockin, remembered) {
  const nextBox = remembered ? lockin.box + 1 : 0
  const graduated = remembered && lockin.box >= TOP_BOX
  const patch = {
    box: graduated ? TOP_BOX : nextBox,
    status: graduated ? 'done' : 'active',
    due_at: graduated ? lockin.due_at : dueAfter(nextBox),
    last_reviewed_at: new Date().toISOString(),
    review_count: (lockin.review_count || 0) + 1,
    reminder_sent_at: null,
  }
  const { data, error } = await supabase
    .from('lockins')
    .update(patch)
    .eq('id', lockin.id)
    .select()
    .maybeSingle()
  return { data, error, graduated }
}
