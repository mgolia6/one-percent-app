'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isUnlocked } from '@/lib/unlock'
import EntryViewer from '@/components/EntryViewer'

function WeeklyFeedbackModal({ userId, onClose }) {
  const [ratings, setRatings] = useState({ clarity: 0, relevance: 0, quiz: 0 })
  const [wouldRecommend, setWouldRecommend] = useState(null)
  const [missing, setMissing] = useState('')
  const [biggestWin, setBiggestWin] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const allRated = ratings.clarity && ratings.relevance && ratings.quiz && wouldRecommend !== null

  const submit = async () => {
    if (!allRated) return
    setSubmitting(true)
    await supabase.from('feedback').insert({
      user_id: userId,
      feedback_type: 'weekly',
      clarity_rating: ratings.clarity,
      topic_rating: ratings.relevance,
      quiz_rating: ratings.quiz,
      would_recommend: wouldRecommend,
      missing_topics: missing.trim() || null,
      biggest_win: biggestWin.trim() || null,
    })
    setDone(true)
    setTimeout(onClose, 2000)
  }

  const RatingRow = ({ label, field }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, color: '#555', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => setRatings(r => ({ ...r, [field]: n }))} style={{
            flex: 1, padding: '10px 0', borderRadius: 3, border: `1px solid ${ratings[field] >= n ? '#47FFE8' : '#222'}`,
            background: ratings[field] >= n ? '#47FFE822' : '#111', color: ratings[field] >= n ? '#47FFE8' : '#555',
            fontSize: 13, cursor: 'pointer', fontFamily: "'Inter',sans-serif"
          }}>{n}</button>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24, overflowY: 'auto' }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: 8, padding: 32, maxWidth: 440, width: '100%', margin: 'auto' }}>
        {done ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 13, color: '#47FFE8', letterSpacing: '0.08em' }}>FEEDBACK RECEIVED</div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 8 }}>This helps a lot. For real.</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', color: '#555', marginBottom: 6, fontWeight: 600 }}>WEEKLY CHECK-IN</div>
            <div style={{ fontSize: 18, color: '#fff', fontWeight: 600, marginBottom: 6 }}>One week in. Be honest.</div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 28, lineHeight: 1.6 }}>This feedback directly shapes what One Percent becomes. Don't be nice — be useful.</div>

            <RatingRow label="CLARITY — How clear is the content?" field="clarity" />
            <RatingRow label="RELEVANCE — How useful to your actual work?" field="relevance" />
            <RatingRow label="QUIZ — Is it testing the right things?" field="quiz" />

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#555', letterSpacing: '0.1em', marginBottom: 8 }}>WOULD YOU RECOMMEND THIS TO SOMEONE?</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Yes', 'Not yet', 'No'].map(v => (
                  <button key={v} onClick={() => setWouldRecommend(v)} style={{
                    flex: 1, padding: '10px 0', borderRadius: 3, border: `1px solid ${wouldRecommend === v ? '#47FFE8' : '#222'}`,
                    background: wouldRecommend === v ? '#47FFE822' : '#111', color: wouldRecommend === v ? '#47FFE8' : '#555',
                    fontSize: 12, cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontWeight: 500
                  }}>{v}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#555', letterSpacing: '0.1em', marginBottom: 8 }}>WHAT'S MISSING OR SHOULD BE DIFFERENT?</div>
              <textarea value={missing} onChange={e => setMissing(e.target.value)} placeholder="Be specific." style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', borderRadius: 4, padding: '12px 14px', fontSize: 13, color: '#bbb', fontFamily: "'Inter',sans-serif", resize: 'vertical', minHeight: 72, outline: 'none' }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: '#555', letterSpacing: '0.1em', marginBottom: 8 }}>BIGGEST WIN SO FAR — anything you actually used?</div>
              <textarea value={biggestWin} onChange={e => setBiggestWin(e.target.value)} placeholder="Even small counts." style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', borderRadius: 4, padding: '12px 14px', fontSize: 13, color: '#bbb', fontFamily: "'Inter',sans-serif", resize: 'vertical', minHeight: 72, outline: 'none' }} />
            </div>

            <button onClick={submit} disabled={!allRated || submitting} style={{ width: '100%', padding: '12px 0', background: allRated ? '#47FFE8' : '#1a1a1a', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600, color: '#0a0a0a', cursor: allRated ? 'pointer' : 'not-allowed', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", opacity: submitting ? 0.6 : 1 }}>
              {submitting ? 'SENDING...' : 'SUBMIT FEEDBACK'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

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
  const [showWeeklyFeedback, setShowWeeklyFeedback] = useState(false)
  const [showFeedbackOverlay, setShowFeedbackOverlay] = useState(false)
  const [feedbackAccent, setFeedbackAccent] = useState('#47FFE8')

  useEffect(() => {
    let cancelled = false

    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled) return
      if (!session) { router.push('/login'); return }
      setUser(session.user)

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (cancelled) return
      if (!prof) { router.push('/'); return }
      setProfile(prof)

      const entryNum = parseInt(entryId)
      const isAdmin = prof.is_admin || false
      if (!isUnlocked(entryNum, prof.signup_date, isAdmin, 19)) {
        router.push('/')
        return
      }

      // Check if weekly feedback is due (every 7 days from signup)
      // Guard: if signup_date is missing, skip entirely
      if (prof.signup_date) {
        const signupDate = new Date(prof.signup_date)
        const daysSinceSignup = Math.floor((Date.now() - signupDate) / 86400000)
        // Fire on day 7, 14, 21... — must be past day 0 and on a 7-day boundary
        if (daysSinceSignup > 0 && daysSinceSignup % 7 === 0) {
          // Check if weekly feedback already submitted in the last 7 days
          const sevenDaysAgo = new Date(Date.now() - 7 * 86400000)
          const { data: recentWeekly } = await supabase.from('feedback')
            .select('id').eq('user_id', session.user.id).eq('feedback_type', 'weekly')
            .gte('created_at', sevenDaysAgo.toISOString()).limit(1)
          if (!cancelled && (!recentWeekly || recentWeekly.length === 0)) {
            setShowWeeklyFeedback(true)
          }
        }
      }

      try {
        const res = await fetch(`/entries/${entryId}.json`)
        if (!res.ok) throw new Error('Entry not found')
        const data = await res.json()
        if (cancelled) return
        setEntry(data)
      } catch (e) {
        if (cancelled) return
        setError('Entry not found')
        setLoading(false)
        return
      }

      const { data: comp } = await supabase.from('completions').select('*').eq('user_id', session.user.id).eq('entry_number', entryId).single()
      if (cancelled) return
      const streak = prof.current_streak || 0
      setUserStats({ answers: comp?.answers || null, streak })
      setLoading(false)
    }
    init()
    return () => { cancelled = true }
  }, [entryId, router])

  const handleComplete = async ({ score, timeToQuiz, answers }) => {
    if (!user) return
    await supabase.from('completions').upsert({
      user_id: user.id, entry_number: entryId, score, time_to_quiz: timeToQuiz, answers,
      completed_at: new Date().toISOString()
    }, { onConflict: 'user_id,entry_number' })

    const today = new Date().toDateString()
    const lastActive = profile?.last_active_date
    let newStreak = profile?.current_streak || 0
    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      newStreak = lastActive === yesterday ? newStreak + 1 : 1
      await supabase.from('profiles').update({
        current_streak: newStreak, last_active_date: today,
        longest_streak: Math.max(newStreak, profile?.longest_streak || 0)
      }).eq('id', user.id)
    }

    // Prompt quick daily feedback after quiz (5% of the time to not be annoying)
    // This is handled by a post-completion card in EntryViewer
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
      {showWeeklyFeedback && <WeeklyFeedbackModal userId={user?.id} onClose={() => setShowWeeklyFeedback(false)} />}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#0A0A0A', borderBottom: '1px solid #141414' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '12px 24px' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#555', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", padding: 0 }}>
            ← LIBRARY
          </button>
        </div>
      </div>
      {showFeedbackOverlay && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: '#0A0A0A',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 32,
          animation: 'fadeInFb 0.4s ease forwards',
        }}>
          <style>{`@keyframes fadeInFb { from { opacity: 0; } to { opacity: 1; } }`}</style>
          <div style={{ fontSize: 9, letterSpacing: '0.25em', color: '#333', fontWeight: 600, marginBottom: 32, fontFamily: "'Inter',sans-serif" }}>ONE PERCENT</div>
          <div style={{ fontSize: 36, fontWeight: 500, color: '#fff', letterSpacing: '-0.02em', marginBottom: 16, textAlign: 'center', lineHeight: 1.2, fontFamily: "'Inter',sans-serif" }}>
            Logged.
          </div>
          <div style={{ fontSize: 13, color: '#444', letterSpacing: '0.04em', textAlign: 'center', maxWidth: 260, lineHeight: 1.8, fontFamily: "'Inter',sans-serif" }}>
            That helps. For real.
          </div>
          <div style={{ marginTop: 20, width: 32, height: 2, borderRadius: 1, background: feedbackAccent, opacity: 0.6 }} />
        </div>
      )}
      <EntryViewer
        entry={entry}
        onComplete={handleComplete}
        onBack={() => router.push('/')}
        userStats={userStats}
        userId={user?.id}
        onFeedbackDone={(accent) => {
          setFeedbackAccent(accent || '#47FFE8')
          setShowFeedbackOverlay(true)
          setTimeout(() => setShowFeedbackOverlay(false), 3000)
        }}
      />
    </div>
  )
}
