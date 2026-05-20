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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,42,58,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
      <div style={{ background: 'linear-gradient(160deg, #dde4ed 0%, #d4dce8 100%)', border: '1px solid rgba(26,42,58,0.1)', borderRadius: 8, padding: 32, maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(26,42,58,0.15)' }}>
        {done ? (
          <div style={{ textAlign: 'center', fontSize: 13, color: '#1a2a3a', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>THANKS 🙏</div>
        ) : (
          <>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(26,42,58,0.4)', marginBottom: 8, fontWeight: 500, fontFamily: "'DM Mono', monospace" }}>FEEDBACK</div>
            <div style={{ fontSize: 18, color: '#1a2a3a', fontWeight: 400, marginBottom: 24, fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.01em' }}>How's One Percent working for you?</div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRating(n)} style={{
                  flex: 1, padding: '12px 0', borderRadius: 4,
                  border: `1px solid ${rating >= n ? 'rgba(26,42,58,0.4)' : 'rgba(26,42,58,0.12)'}`,
                  background: rating >= n ? 'rgba(26,42,58,0.08)' : 'rgba(255,255,255,0.5)',
                  color: rating >= n ? '#1a2a3a' : 'rgba(26,42,58,0.35)',
                  fontSize: 14, cursor: 'pointer', fontFamily: "'DM Mono', monospace",
                  transition: 'all 0.15s',
                }}>{n}</button>
              ))}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(26,42,58,0.35)', letterSpacing: '0.1em', marginBottom: 20, display: 'flex', justifyContent: 'space-between', fontFamily: "'DM Mono', monospace" }}>
              <span>NOT USEFUL</span><span>ESSENTIAL</span>
            </div>

            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Anything specific? (optional)"
              style={{ width: '100%', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(26,42,58,0.12)', borderRadius: 4, padding: '12px 14px', fontSize: 13, color: '#1a2a3a', fontFamily: "'DM Sans', sans-serif", resize: 'vertical', minHeight: 80, outline: 'none' }}
            />

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '12px 0', background: 'none', border: '1px solid rgba(26,42,58,0.12)', borderRadius: 4, fontSize: 10, color: 'rgba(26,42,58,0.4)', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>CANCEL</button>
              <button onClick={submit} disabled={!rating || submitting} style={{ flex: 2, padding: '12px 0', background: rating ? '#1a2a3a' : 'rgba(26,42,58,0.08)', border: 'none', borderRadius: 4, fontSize: 10, fontWeight: 500, color: rating ? '#e8eef5' : 'rgba(26,42,58,0.3)', cursor: rating ? 'pointer' : 'not-allowed', letterSpacing: '0.1em', fontFamily: "'DM Mono', monospace", opacity: submitting ? 0.6 : 1 }}>
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,42,58,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
      <div style={{ background: 'linear-gradient(160deg, #dde4ed 0%, #d4dce8 100%)', border: '1px solid rgba(26,42,58,0.1)', borderRadius: 8, padding: 32, maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(26,42,58,0.15)' }}>
        {done ? (
          <div style={{ textAlign: 'center', fontSize: 13, color: '#FF4778', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>REPORTED — THANKS 🐛</div>
        ) : (
          <>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(26,42,58,0.4)', marginBottom: 8, fontWeight: 500, fontFamily: "'DM Mono', monospace" }}>REPORT A BUG</div>
            <div style={{ fontSize: 18, color: '#1a2a3a', fontWeight: 400, marginBottom: 24, fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.01em' }}>What broke?</div>

            <select value={page} onChange={e => setPage(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(26,42,58,0.12)', borderRadius: 4, padding: '10px 14px', fontSize: 13, color: '#1a2a3a', fontFamily: "'DM Sans', sans-serif", marginBottom: 12, outline: 'none' }}>
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
              style={{ width: '100%', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(26,42,58,0.12)', borderRadius: 4, padding: '12px 14px', fontSize: 13, color: '#1a2a3a', fontFamily: "'DM Sans', sans-serif", resize: 'vertical', minHeight: 100, outline: 'none' }}
            />

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '12px 0', background: 'none', border: '1px solid rgba(26,42,58,0.12)', borderRadius: 4, fontSize: 10, color: 'rgba(26,42,58,0.4)', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>CANCEL</button>
              <button onClick={submit} disabled={!description.trim() || submitting} style={{ flex: 2, padding: '12px 0', background: description.trim() ? '#1a2a3a' : 'rgba(26,42,58,0.08)', border: 'none', borderRadius: 4, fontSize: 10, fontWeight: 500, color: description.trim() ? '#e8eef5' : 'rgba(26,42,58,0.3)', cursor: description.trim() ? 'pointer' : 'not-allowed', letterSpacing: '0.1em', fontFamily: "'DM Mono', monospace", opacity: submitting ? 0.6 : 1 }}>
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #dde4ed 0%, #d4dce8 50%, #c9d4e3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 10, color: 'rgba(26,42,58,0.3)', letterSpacing: '0.2em', fontFamily: "'DM Mono', monospace" }}>LOADING...</div>
    </div>
  )

  const isAdmin = profile?.is_admin || false
  const unlockedCount = profile ? getUnlockedCount(profile.signup_date, isAdmin, TOTAL_ENTRIES) : 0
  const completedCount = Object.keys(completions).length
  const totalScore = Object.values(completions).reduce((a, c) => a + (c.score || 0), 0)
  const avgScore = completedCount > 0 ? (totalScore / completedCount).toFixed(1) : '—'
  const streak = profile?.current_streak || 0
  const firstName = profile?.name?.split(' ')[0] || null

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #dde4ed 0%, #d4dce8 50%, #c9d4e3 100%)', fontFamily: "'DM Sans', sans-serif", color: '#1a2a3a', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #dde4ed; }
        .noise-overlay {
          position: fixed; inset: 0; pointer-events: none; opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
        .entry-row {
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(26,42,58,0.08);
          border-radius: 6px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12;
          transition: background 0.15s, border-color 0.15s, transform 0.12s;
          backdrop-filter: blur(4px);
        }
        .entry-row.unlocked { cursor: pointer; }
        .entry-row.unlocked:hover {
          background: rgba(255,255,255,0.8);
          border-color: rgba(26,42,58,0.15);
          transform: translateY(-1px);
        }
        .entry-row.locked { opacity: 0.4; }
        .stat-card {
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(26,42,58,0.08);
          border-radius: 6px;
          padding: 14px 12px;
          text-align: center;
          backdrop-filter: blur(4px);
        }
        .header-btn {
          background: none;
          border: 1px solid rgba(26,42,58,0.12);
          border-radius: 3px;
          padding: 6px 12px;
          font-size: 9px;
          cursor: pointer;
          letter-spacing: 0.1em;
          font-family: 'DM Mono', monospace;
          color: rgba(26,42,58,0.45);
          transition: all 0.15s;
        }
        .header-btn:hover { border-color: rgba(26,42,58,0.25); color: rgba(26,42,58,0.7); }
        .header-btn.bug { color: #FF4778; border-color: rgba(255,71,120,0.2); }
        .header-btn.bug:hover { border-color: rgba(255,71,120,0.4); }
      `}</style>

      {/* Noise + blobs */}
      <div className="noise-overlay" />
      <div style={{ position: 'fixed', top: '-15%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,197,235,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,210,240,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {showFeedback && <FeedbackModal userId={user?.id} onClose={() => setShowFeedback(false)} />}
      {showBug && <BugModal userId={user?.id} onClose={() => setShowBug(false)} />}

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(26,42,58,0.08)', maxWidth: 720, margin: '0 auto', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.2em', fontWeight: 500, color: '#1a2a3a', fontFamily: "'DM Mono', monospace" }}>ONE PERCENT</span>
          {isAdmin && <span style={{ fontSize: 8, background: 'rgba(71,255,232,0.12)', color: '#47FFE8', border: '1px solid rgba(71,255,232,0.25)', borderRadius: 3, padding: '2px 7px', letterSpacing: '0.1em', fontWeight: 500, fontFamily: "'DM Mono', monospace" }}>ADMIN</span>}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button onClick={() => setShowBug(true)} className="header-btn bug">BUG</button>
          <button onClick={() => setShowFeedback(true)} className="header-btn">FEEDBACK</button>
          <button onClick={handleSignOut} className="header-btn">SIGN OUT</button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px 80px' }}>

        {/* Greeting */}
        {firstName && (
          <div style={{ fontSize: 22, fontWeight: 400, color: '#1a2a3a', letterSpacing: '-0.01em', marginBottom: 24, lineHeight: 1.3 }}>
            Good to see you, {firstName}.
          </div>
        )}

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 32 }}>
          {[
            { label: 'STREAK', value: streak > 0 ? `🔥 ${streak}` : '—' },
            { label: 'COMPLETED', value: `${completedCount}/${unlockedCount}` },
            { label: 'AVG SCORE', value: avgScore !== '—' ? `${avgScore}/3` : '—' },
            { label: 'UNLOCKED', value: `${unlockedCount}` },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: 18, fontWeight: 500, color: '#1a2a3a', marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 8, color: 'rgba(26,42,58,0.35)', letterSpacing: '0.12em', fontFamily: "'DM Mono', monospace" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Admin link */}
        {isAdmin && (
          <div style={{ marginBottom: 24, padding: '12px 16px', background: 'rgba(71,255,232,0.06)', border: '1px solid rgba(71,255,232,0.15)', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: 'rgba(26,42,58,0.5)', letterSpacing: '0.1em', fontFamily: "'DM Mono', monospace" }}>ADMIN — all entries unlocked</span>
            <button onClick={() => router.push('/admin')} style={{ background: 'none', border: '1px solid rgba(26,42,58,0.15)', borderRadius: 3, padding: '4px 10px', fontSize: 9, color: 'rgba(26,42,58,0.5)', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>VIEW FEEDBACK →</button>
          </div>
        )}

        {/* Entry list */}
        <div style={{ fontSize: 9, color: 'rgba(26,42,58,0.35)', letterSpacing: '0.15em', marginBottom: 14, fontWeight: 500, fontFamily: "'DM Mono', monospace" }}>YOUR LIBRARY</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ENTRIES.map((e, idx) => {
            const entryNum = idx + 1
            const unlocked = entryNum <= unlockedCount
            const completed = !!completions[e.entry]
            const accent = CATEGORY_COLORS[e.category] || '#1a2a3a'
            const comp = completions[e.entry]

            return (
              <div
                key={e.entry}
                onClick={() => unlocked && router.push(`/entry/${e.entry}`)}
                className={`entry-row ${unlocked ? 'unlocked' : 'locked'}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: completed ? accent : 'rgba(26,42,58,0.15)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, color: '#1a2a3a', fontWeight: 400, marginBottom: 2, fontFamily: "'DM Sans', sans-serif" }}>{e.concept}</div>
                    <div style={{ fontSize: 9, color: 'rgba(26,42,58,0.35)', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>{e.editionId} · {e.category}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  {completed && <span style={{ fontSize: 11, color: accent, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{comp.score}/3</span>}
                  {!unlocked && <span style={{ fontSize: 10, color: 'rgba(26,42,58,0.2)' }}>🔒</span>}
                  {unlocked && !completed && <span style={{ fontSize: 9, color: 'rgba(26,42,58,0.4)', letterSpacing: '0.1em', fontFamily: "'DM Mono', monospace" }}>START →</span>}
                  {completed && <span style={{ fontSize: 9, color: 'rgba(26,42,58,0.3)', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace" }}>REVIEW →</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
