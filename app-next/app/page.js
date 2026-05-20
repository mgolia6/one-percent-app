'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUnlockedCount } from '@/lib/unlock'

const TOTAL_ENTRIES = 17

const CATEGORY_COLORS = {
  'AI': '#47FFE8',
  'Sales Craft': '#E8FF47',
  'Vocab & Language': '#FF8C47',
  'Mental Models': '#C847FF',
  'Philosophy': '#FF4778',
  'Neuroscience & Cognition': '#47C8FF',
  'Communication': '#FF8C00',
}

const ENTRIES = [
  { entry: '001', editionId: 'AI.1.1', concept: 'Context Window', category: 'AI' },
  { entry: '002', editionId: 'VL.1', concept: 'Framing Effect', category: 'Vocab & Language' },
  { entry: '003', editionId: 'SC.1.1', concept: 'Discovery Questions', category: 'Sales Craft' },
  { entry: '004', editionId: 'MM.1', concept: 'Inversion', category: 'Mental Models' },
  { entry: '005', editionId: 'PH.1', concept: 'Premeditatio Malorum', category: 'Philosophy' },
  { entry: '006', editionId: 'AI.1.2', concept: 'Prompt Sensitivity', category: 'AI' },
  { entry: '007', editionId: 'SC.1.2', concept: 'Talk/Listen Ratio', category: 'Sales Craft' },
  { entry: '008', editionId: 'VL.2', concept: 'Euphemism Treadmill', category: 'Vocab & Language' },
  { entry: '009', editionId: 'MM.2', concept: 'Second-Order Thinking', category: 'Mental Models' },
  { entry: '010', editionId: 'AI.2.1', concept: 'Chain-of-Thought Prompting', category: 'AI' },
  { entry: '011', editionId: 'SC.2.1', concept: 'Anchoring in Negotiation', category: 'Sales Craft' },
  { entry: '012', editionId: 'AI.2.2', concept: 'Hallucination / Confabulation', category: 'AI' },
  { entry: '013', editionId: 'PH.2', concept: 'Dichotomy of Control', category: 'Philosophy' },
  { entry: '014', editionId: 'NC.1', concept: 'Neuroplasticity', category: 'Neuroscience & Cognition' },
  { entry: '015', editionId: 'SC.2.2', concept: 'Tactical Empathy', category: 'Sales Craft' },
  { entry: '016', editionId: 'CM.1', concept: 'Active Listening', category: 'Communication' },
  { entry: '017', editionId: 'SC.3.1', concept: 'Multi-Threading', category: 'Sales Craft' },
]

function FeedbackModal({ userId, onClose }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    if (!rating) return
    setSubmitting(true)
    await supabase.from('feedback').insert({
      user_id: userId,
      feedback_type: 'landing',
      rating,
      comment: comment.trim() || null,
    })
    setDone(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: 8, padding: 32, maxWidth: 400, width: '100%' }}>
        {done ? (
          <div style={{ textAlign: 'center', fontSize: 13, color: '#47FFE8', letterSpacing: '0.08em' }}>THANKS 🙏</div>
        ) : (
          <>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', color: '#555', marginBottom: 8, fontWeight: 600 }}>FEEDBACK</div>
            <div style={{ fontSize: 16, color: '#fff', fontWeight: 500, marginBottom: 24 }}>How's One Percent working for you?</div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRating(n)} style={{
                  flex: 1, padding: '12px 0', borderRadius: 4, border: `1px solid ${rating >= n ? '#47FFE8' : '#222'}`,
                  background: rating >= n ? '#47FFE822' : '#111', color: rating >= n ? '#47FFE8' : '#555',
                  fontSize: 14, cursor: 'pointer', fontFamily: "'Inter',sans-serif"
                }}>{n}</button>
              ))}
            </div>
            <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.1em', marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
              <span>NOT USEFUL</span><span>ESSENTIAL</span>
            </div>

            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Anything specific? (optional)"
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', borderRadius: 4, padding: '12px 14px', fontSize: 13, color: '#bbb', fontFamily: "'Inter',sans-serif", resize: 'vertical', minHeight: 80, outline: 'none' }}
            />

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '12px 0', background: 'none', border: '1px solid #222', borderRadius: 4, fontSize: 11, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>CANCEL</button>
              <button onClick={submit} disabled={!rating || submitting} style={{ flex: 2, padding: '12px 0', background: rating ? '#47FFE8' : '#1a1a1a', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600, color: '#0a0a0a', cursor: rating ? 'pointer' : 'not-allowed', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'SENDING...' : 'SEND'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function BugModal({ userId, onClose }) {
  const [description, setDescription] = useState('')
  const [page, setPage] = useState('Library')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    if (!description.trim()) return
    setSubmitting(true)
    await supabase.from('bug_reports').insert({
      user_id: userId,
      page,
      description: description.trim(),
      browser_info: navigator.userAgent,
    })
    setDone(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
      <div style={{ background: '#111', border: '1px solid #222', borderRadius: 8, padding: 32, maxWidth: 400, width: '100%' }}>
        {done ? (
          <div style={{ textAlign: 'center', fontSize: 13, color: '#FF4778', letterSpacing: '0.08em' }}>REPORTED — THANKS 🐛</div>
        ) : (
          <>
            <div style={{ fontSize: 11, letterSpacing: '0.15em', color: '#555', marginBottom: 8, fontWeight: 600 }}>REPORT A BUG</div>
            <div style={{ fontSize: 16, color: '#fff', fontWeight: 500, marginBottom: 24 }}>What broke?</div>

            <select value={page} onChange={e => setPage(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', borderRadius: 4, padding: '10px 14px', fontSize: 13, color: '#bbb', fontFamily: "'Inter',sans-serif", marginBottom: 12, outline: 'none' }}>
              <option>Library</option>
              <option>Entry — Morning</option>
              <option>Entry — Midday</option>
              <option>Entry — Evening / Quiz</option>
              <option>Login</option>
              <option>Other</option>
            </select>

            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what happened..."
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', borderRadius: 4, padding: '12px 14px', fontSize: 13, color: '#bbb', fontFamily: "'Inter',sans-serif", resize: 'vertical', minHeight: 100, outline: 'none' }}
            />

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '12px 0', background: 'none', border: '1px solid #222', borderRadius: 4, fontSize: 11, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>CANCEL</button>
              <button onClick={submit} disabled={!description.trim() || submitting} style={{ flex: 2, padding: '12px 0', background: description.trim() ? '#FF4778' : '#1a1a1a', border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600, color: '#fff', cursor: description.trim() ? 'pointer' : 'not-allowed', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'SENDING...' : 'REPORT'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [completions, setCompletions] = useState({})
  const [loading, setLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [showBug, setShowBug] = useState(false)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)

      let { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (!prof) {
        const { data: newProf } = await supabase.from('profiles').insert({ id: session.user.id, email: session.user.email, signup_date: new Date().toISOString() }).select().single()
        prof = newProf
      }

      // New users go through onboarding first
      if (!prof?.onboarding_complete) {
        router.push('/onboarding')
        return
      }

      setProfile(prof)

      const { data: comps } = await supabase.from('completions').select('entry_number, score, time_to_quiz').eq('user_id', session.user.id)
      const compMap = {}
      if (comps) comps.forEach(c => { compMap[c.entry_number] = c })
      setCompletions(compMap)
      setLoading(false)
    }
    init()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 11, color: '#333', letterSpacing: '0.2em', fontFamily: "'Inter',sans-serif" }}>LOADING...</div>
    </div>
  )

  const isAdmin = profile?.is_admin || false
  const unlockedCount = profile ? getUnlockedCount(profile.signup_date, isAdmin, TOTAL_ENTRIES) : 0
  const completedCount = Object.keys(completions).length
  const totalScore = Object.values(completions).reduce((a, c) => a + (c.score || 0), 0)
  const avgScore = completedCount > 0 ? (totalScore / completedCount).toFixed(1) : '—'
  const streak = profile?.current_streak || 0

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Inter',sans-serif", color: '#fff' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {showFeedback && <FeedbackModal userId={user?.id} onClose={() => setShowFeedback(false)} />}
      {showBug && <BugModal userId={user?.id} onClose={() => setShowBug(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #141414', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.2em', fontWeight: 600 }}>ONE PERCENT</span>
          {isAdmin && <span style={{ fontSize: 9, background: '#47FFE822', color: '#47FFE8', border: '1px solid #47FFE844', borderRadius: 3, padding: '2px 7px', letterSpacing: '0.1em', fontWeight: 600 }}>ADMIN</span>}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setShowBug(true)} style={{ background: 'none', border: '1px solid #1a1a1a', borderRadius: 3, padding: '6px 12px', fontSize: 10, color: '#FF4778', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>BUG</button>
          <button onClick={() => setShowFeedback(true)} style={{ background: 'none', border: '1px solid #1a1a1a', borderRadius: 3, padding: '6px 12px', fontSize: 10, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>FEEDBACK</button>
          <button onClick={handleSignOut} style={{ background: 'none', border: '1px solid #222', borderRadius: 3, padding: '6px 12px', fontSize: 10, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>SIGN OUT</button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 32 }}>
          {[
            { label: 'STREAK', value: streak > 0 ? `🔥 ${streak}` : '—' },
            { label: 'COMPLETED', value: `${completedCount}/${unlockedCount}` },
            { label: 'AVG SCORE', value: avgScore !== '—' ? `${avgScore}/3` : '—' },
            { label: 'UNLOCKED', value: `${unlockedCount}` },
          ].map(s => (
            <div key={s.label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 4, padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: '#fff', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.12em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Admin link */}
        {isAdmin && (
          <div style={{ marginBottom: 24, padding: '12px 16px', background: '#47FFE808', border: '1px solid #47FFE822', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#47FFE8', letterSpacing: '0.1em' }}>ADMIN MODE — all entries unlocked</span>
            <button onClick={() => router.push('/admin')} style={{ background: 'none', border: '1px solid #47FFE844', borderRadius: 3, padding: '4px 10px', fontSize: 10, color: '#47FFE8', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>VIEW FEEDBACK →</button>
          </div>
        )}

        {/* Entry list */}
        <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>YOUR LIBRARY</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ENTRIES.map((e, idx) => {
            const entryNum = idx + 1
            const unlocked = entryNum <= unlockedCount
            const completed = !!completions[e.entry]
            const accent = CATEGORY_COLORS[e.category] || '#fff'
            const comp = completions[e.entry]

            return (
              <div
                key={e.entry}
                onClick={() => unlocked && router.push(`/entry/${e.entry}`)}
                style={{
                  background: '#111', border: `1px solid ${unlocked ? '#1a1a1a' : '#111'}`,
                  borderRadius: 4, padding: '16px 18px', cursor: unlocked ? 'pointer' : 'default',
                  opacity: unlocked ? 1 : 0.35, transition: 'border-color 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: completed ? accent : '#333', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, color: unlocked ? '#fff' : '#555', fontWeight: 500, marginBottom: 2 }}>{e.concept}</div>
                    <div style={{ fontSize: 10, color: '#444', letterSpacing: '0.08em' }}>{e.editionId} · {e.category}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  {completed && <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>{comp.score}/3</span>}
                  {!unlocked && <span style={{ fontSize: 10, color: '#333' }}>🔒</span>}
                  {unlocked && !completed && <span style={{ fontSize: 10, color: accent, letterSpacing: '0.08em' }}>START →</span>}
                  {completed && <span style={{ fontSize: 10, color: '#444', letterSpacing: '0.08em' }}>REVIEW →</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
