'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isUnlocked } from '@/lib/unlock'
import EntryViewer from '@/components/EntryViewer'

export default function EntryPage() {
  const router = useRouter()
  const params = useParams()
  const entryId = params.id

  const [entry, setEntry] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function init() {
      // Auth check
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)

      // Load profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (!prof) { router.push('/'); return }
      setProfile(prof)

      // Check unlock
      const entryNum = parseInt(entryId)
      if (!isUnlocked(entryNum, prof.signup_date)) {
        router.push('/')
        return
      }

      // Load entry JSON
      try {
        const res = await fetch(`/entries/${entryId}.json`)
        if (!res.ok) throw new Error('Entry not found')
        const data = await res.json()
        setEntry(data)
      } catch (e) {
        setError('Entry not found')
        setLoading(false)
        return
      }

      // Load existing completion if any
      const { data: comp } = await supabase
        .from('completions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('entry_number', entryId)
        .single()

      // Load streak
      const streak = prof.current_streak || 0
      setUserStats({ answers: comp?.answers || null, streak })
      setLoading(false)
    }
    init()
  }, [entryId, router])

  const handleComplete = async ({ score, timeToQuiz, answers }) => {
    if (!user) return

    // Upsert completion
    await supabase.from('completions').upsert({
      user_id: user.id,
      entry_number: entryId,
      score,
      time_to_quiz: timeToQuiz,
      answers,
      completed_at: new Date().toISOString()
    }, { onConflict: 'user_id,entry_number' })

    // Update streak in profile
    const today = new Date().toDateString()
    const lastActive = profile?.last_active_date
    let newStreak = profile?.current_streak || 0

    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      newStreak = lastActive === yesterday ? newStreak + 1 : 1
      await supabase.from('profiles').update({
        current_streak: newStreak,
        last_active_date: today,
        longest_streak: Math.max(newStreak, profile?.longest_streak || 0)
      }).eq('id', user.id)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 11, color: '#333', letterSpacing: '0.2em', fontFamily: "'Inter',sans-serif" }}>LOADING...</div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 13, color: '#555', fontFamily: "'Inter',sans-serif" }}>{error}</div>
    </div>
  )

  return (
    <div>
      {/* Back nav */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px 24px 0' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#555', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", padding: 0 }}>
          ← LIBRARY
        </button>
      </div>
      <EntryViewer entry={entry} onComplete={handleComplete} userStats={userStats} />
    </div>
  )
}
