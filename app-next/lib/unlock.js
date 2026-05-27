// Returns how many entries are unlocked for a user
// Admins (is_admin = true) get all entries unlocked regardless of signup date

export function getUnlockedCount(signupDate, isAdmin = false, totalEntries = 25) {
  if (isAdmin) return totalEntries
  const now = new Date()
  const signup = new Date(signupDate)
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const signupDay = new Date(signup.getFullYear(), signup.getMonth(), signup.getDate())
  const diffMs = nowDay - signupDay
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return Math.min(diffDays + 1, totalEntries)
}

export function isUnlocked(entryNumber, signupDate, isAdmin = false, totalEntries = 25) {
  return entryNumber <= getUnlockedCount(signupDate, isAdmin, totalEntries)
}

export function entryId(n) {
  return String(n).padStart(3, '0')
}
