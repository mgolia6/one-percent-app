// Returns how many entries are unlocked for a user
// based on days since their signup date (Option A — time-based unlock)
// Entry 1 unlocks on Day 1 (signup day), Entry 2 on Day 2, etc.

export function getUnlockedCount(signupDate) {
  const now = new Date()
  const signup = new Date(signupDate)
  // Zero out time component for clean day diff
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const signupDay = new Date(signup.getFullYear(), signup.getMonth(), signup.getDate())
  const diffMs = nowDay - signupDay
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  // Day 0 = Entry 1, Day 1 = Entry 2, etc.
  return Math.min(diffDays + 1, 30) // cap at total entries available
}

// Returns true if a given entry number is unlocked
export function isUnlocked(entryNumber, signupDate) {
  return entryNumber <= getUnlockedCount(signupDate)
}

// Format entry number as zero-padded string for JSON filename
export function entryId(n) {
  return String(n).padStart(3, '0')
}
