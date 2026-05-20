'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUnlockedCount } from '@/lib/unlock'

const GREETINGS = [
  "Sharp minds don't take days off.",
  "One concept. Every day. That's the edge.",
  "What you learn today compounds.",
  "Show up. Do the work. That's it.",
  "Consistency is the only strategy that works.",
  "Today's concept is tomorrow's instinct.",
  "The reps are what matter.",
  "You're here. That counts.",
  "Small inputs. Long-term outputs.",
  "One percent better. Again.",
  "The work doesn't care how you feel.",
  "Keep going.",
  "Most people stop. You didn't.",
  "This is how it adds up.",
  "Do the reading. Apply the thing.",
]

function getDailyGreeting(name) {
  const dayIndex = new Date().getDay() * 3 + new Date().getDate()
  const greeting = GREETINGS[dayIndex % GREETINGS.length]
  return { name: name || 'there', line: greeting }
}

function ThinkingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: '50%',
          background: '#333',
          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

function WelcomeOverlay({ fullText, line, fading, onDismiss }) {
  const [displayed, setDisplayed] = useState('')
  const [lineVisible, setLineVisible] = useState(false)

  useEffect(() => {
    let i = 0
    const speed = 90
    const timer = setInterval(() => {
      i++
      setDisplayed(fullText.slice(0, i))
      if (i >= fullText.length) {
        clearInterval(timer)
        setTimeout(() => setLineVisible(true), 400)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [fullText])

  return (
    <div onClick={onDismiss} style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: '#0A0A0A',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32, cursor: 'pointer',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.6s ease',
    }}>
      <div style={{ fontSize: 9, letterSpacing: '0.25em', color: '#333', fontWeight: 600, marginBottom: 32 }}>ONE PERCENT</div>
      <div style={{
        fontSize: 36, fontWeight: 500, color: '#fff',
        letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.2,
        marginBottom: 20, minHeight: 88,
        fontFamily: "'Inter', sans-serif",
      }}>
        {displayed}
        <span style={{ opacity: lineVisible ? 0 : 1, transition: 'opacity 0.3s', borderRight: '2px solid #fff', marginLeft: 2 }}>&nbsp;</span>
      </div>
      <div style={{
        fontSize: 13, color: '#444', letterSpacing: '0.04em',
        textAlign: 'center', maxWidth: 260, lineHeight: 1.8,
        opacity: lineVisible ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>
        {line}
      </div>
    </div>
  )
}

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
  { entry: '008', editionId: 'AI.2.1', concept: 'Chain-of-Thought Prompting', category: 'AI' },
  { entry: '009', editionId: 'VL.2', concept: 'Euphemism Treadmill', category: 'Vocab & Language' },
  { entry: '010', editionId: 'SC.2.1', concept: 'Anchoring in Negotiation', category: 'Sales Craft' },
  { entry: '011', editionId: 'MM.2', concept: 'Second-Order Thinking', category: 'Mental Models' },
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
      overall_rating: rating,
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

const HOW_IT_WORKS = [
  {
    eyebrow: 'WELCOME',
    heading: "You're in the beta.",
    body: "One Percent is a daily micro-learning system — one concept, every day, across seven categories. Sales. AI. Language. Mental models. Philosophy. Neuroscience. Communication.\n\nVerified sources. Real content. No filler.",
  },
  {
    eyebrow: 'WHAT YOU\'RE GETTING',
    heading: '30 days. All seven categories. Daily.',
    body: "Full access to everything — every category, every entry, unlocked one per day for 30 days.\n\nEach entry has three parts: a Morning Brief to start your day sharp, a Midday Reframe to apply it, and an Evening Quiz to lock it in.",
  },
  {
    eyebrow: 'FEEDBACK — 1 OF 4',
    heading: 'Something breaks — tell me.',
    body: "There's a BUG button in the top right of your library. Hit it, describe what happened, pick which page it was on.\n\nThat's it. I get the report instantly. Don't hold bugs — they slow everything down.",
  },
  {
    eyebrow: 'FEEDBACK — 2 OF 4',
    heading: 'General feedback — anytime.',
    body: "FEEDBACK button, same spot in the library header. Use it whenever something feels off, something lands well, or you have a thought that doesn't fit anywhere else.\n\nNot just for problems. If something works, that's signal too.",
  },
  {
    eyebrow: 'FEEDBACK — 3 OF 4',
    heading: 'Rate every entry. Every day.',
    body: "After the quiz, you'll get three quick ratings — the topic, the content, the quiz itself. Takes 20 seconds.\n\nThis is not optional. This daily signal is the whole point of having beta users. Without it, I'm building blind.\n\nDon't save it for later. Do it right after you finish while it's fresh.",
  },
  {
    eyebrow: 'FEEDBACK — 4 OF 4',
    heading: 'Every 7 days: go deeper.',
    body: "Every week, a check-in appears automatically when you open an entry. It asks about clarity, relevance, the quiz, whether you'd recommend it — and what's missing.\n\nThis one needs actual words. Be specific. Be honest. Nice feedback is useless feedback.",
  },
  {
    eyebrow: 'END OF BETA',
    heading: 'One more ask at the end.',
    body: "At day 30, you'll get a final feedback form — same questions but zoomed out across the whole experience.\n\nIf you want to talk through it directly, I'm available for that too. No pressure on the call. The form is the real ask. But the offer stands.",
  },
]

function HowItWorksModal({ onClose }) {
  const [step, setStep] = useState(0)
  const [animate, setAnimate] = useState(true)

  const current = HOW_IT_WORKS[step]
  const isLast = step === HOW_IT_WORKS.length - 1
  const isFirst = step === 0
  const progress = (step / (HOW_IT_WORKS.length - 1)) * 100

  const go = (dir) => {
    setAnimate(false)
    setTimeout(() => {
      setStep(s => s + dir)
      setAnimate(true)
    }, 160)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'linear-gradient(160deg, #f0f4f8 0%, #e8eef5 50%, #dde6f0 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px', overflow: 'hidden',
        fontFamily: "'DM Mono', 'Courier New', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        .hiw-card { opacity: 0; transform: translateY(14px); transition: opacity 0.28s ease, transform 0.28s ease; }
        .hiw-card.visible { opacity: 1; transform: translateY(0); }
        .hiw-btn { background: #1a2a3a; color: #e8eef5; border: none; border-radius: 4px; padding: 14px 24px; font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500; letter-spacing: 0.12em; cursor: pointer; transition: background 0.15s, transform 0.1s; }
        .hiw-btn:hover { background: #243548; transform: translateY(-1px); }
        .hiw-btn:active { transform: translateY(0); }
        .hiw-btn-ghost { background: none; border: 1px solid rgba(26,42,58,0.15); color: rgba(26,42,58,0.45); border-radius: 4px; padding: 14px 24px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.12em; cursor: pointer; transition: border-color 0.15s, color 0.15s; }
        .hiw-btn-ghost:hover { border-color: rgba(26,42,58,0.3); color: rgba(26,42,58,0.65); }
        .noise-hiw { position: fixed; inset: 0; pointer-events: none; opacity: 0.025; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size: 200px 200px; }
      `}</style>

      <div className="noise-hiw" />
      <div style={{ position: 'fixed', top: '-15%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,197,235,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,210,240,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, background: 'rgba(26,42,58,0.08)' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'rgba(26,42,58,0.3)', transition: 'width 0.4s ease' }} />
      </div>

      {/* Top bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(26,42,58,0.4)', fontWeight: 500 }}>HOW IT WORKS</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 16, color: 'rgba(26,42,58,0.35)', cursor: 'pointer', padding: 4, lineHeight: 1 }}>✕</button>
      </div>

      {/* Step dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 40 }} onClick={e => e.stopPropagation()}>
        {HOW_IT_WORKS.map((_, i) => (
          <div
            key={i}
            onClick={() => { setAnimate(false); setTimeout(() => { setStep(i); setAnimate(true) }, 160) }}
            style={{
              width: i === step ? 20 : 6, height: 6, borderRadius: 3,
              background: i <= step ? 'rgba(26,42,58,0.5)' : 'rgba(26,42,58,0.12)',
              transition: 'all 0.3s ease', cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div className={`hiw-card${animate ? ' visible' : ''}`} style={{ width: '100%', maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(26,42,58,0.4)', fontWeight: 500, marginBottom: 14 }}>
          {current.eyebrow}
        </div>
        <div style={{ fontSize: 26, fontWeight: 400, color: '#1a2a3a', lineHeight: 1.25, marginBottom: 20, fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em' }}>
          {current.heading}
        </div>
        <div style={{ marginBottom: 36 }}>
          {current.body.split('\n\n').map((para, i, arr) => (
            <p key={i} style={{ fontSize: 14, color: 'rgba(26,42,58,0.65)', lineHeight: 1.8, marginBottom: i < arr.length - 1 ? 14 : 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              {para}
            </p>
          ))}
        </div>

        {/* Nav buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          {!isFirst && (
            <button className="hiw-btn-ghost" onClick={() => go(-1)} style={{ flex: 1 }}>← BACK</button>
          )}
          {!isLast ? (
            <button className="hiw-btn" onClick={() => go(1)} style={{ flex: isFirst ? 1 : 2 }}>NEXT →</button>
          ) : (
            <button className="hiw-btn" onClick={onClose} style={{ flex: isFirst ? 1 : 2 }}>DONE →</button>
          )}
        </div>
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
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [welcomeFading, setWelcomeFading] = useState(false)

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
      if (!sessionStorage.getItem('welcomed')) {
        sessionStorage.setItem('welcomed', '1')
        setShowWelcome(true)
        setTimeout(() => setWelcomeFading(true), 6000)
        setTimeout(() => setShowWelcome(false), 6700)
      }
    }
    init()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ThinkingDots />
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
      {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}

      {/* Welcome overlay */}
      {showWelcome && (() => {
        const { line } = getDailyGreeting(profile?.name)
        const fullText = `Welcome back, ${profile?.name || 'there'}.`
        return (
          <WelcomeOverlay
            fullText={fullText}
            line={line}
            fading={welcomeFading}
            onDismiss={() => { setWelcomeFading(true); setTimeout(() => setShowWelcome(false), 500) }}
          />
        )
      })()}

      {/* Header */}
      <div style={{ maxWidth: 720, margin: '0 auto', borderBottom: '1px solid #141414' }}>

        {/* Row 1 — wordmark */}
        <div style={{ padding: '20px 24px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, letterSpacing: '0.22em', fontWeight: 600, color: '#fff' }}>ONE PERCENT</span>
          {isAdmin && (
            <span style={{ fontSize: 9, background: '#47FFE822', color: '#47FFE8', border: '1px solid #47FFE844', borderRadius: 3, padding: '2px 7px', letterSpacing: '0.1em', fontWeight: 600 }}>ADMIN</span>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#141414', margin: '0 24px' }} />

        {/* Row 2 — action bar, scrollable */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '10px 24px 12px',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          <style>{`.action-bar::-webkit-scrollbar { display: none; }`}</style>

          {/* Feedback group */}
          <button onClick={() => setShowBug(true)} style={{ background: 'none', border: '1px solid #2a1a1e', borderRadius: 3, padding: '5px 11px', fontSize: 10, color: '#FF4778', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0 }}>BUG</button>
          <button onClick={() => setShowFeedback(true)} style={{ background: 'none', border: '1px solid #1e1e1e', borderRadius: 3, padding: '5px 11px', fontSize: 10, color: '#888', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0 }}>FEEDBACK</button>
          <button onClick={() => setShowHowItWorks(true)} style={{ background: 'none', border: '1px solid #1e1e1e', borderRadius: 3, padding: '5px 11px', fontSize: 10, color: '#888', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0 }}>INFO</button>

          {/* Separator dot */}
          <span style={{ color: '#2a2a2a', fontSize: 14, flexShrink: 0, margin: '0 4px' }}>·</span>

          {/* Account group */}
          {isAdmin && (
            <button onClick={() => router.push('/admin')} style={{ background: 'none', border: '1px solid #47FFE822', borderRadius: 3, padding: '5px 11px', fontSize: 10, color: '#47FFE8', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0 }}>ADMIN →</button>
          )}
          <button onClick={handleSignOut} style={{ background: 'none', border: '1px solid #1a1a1a', borderRadius: 3, padding: '5px 11px', fontSize: 10, color: '#444', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap', flexShrink: 0 }}>SIGN OUT</button>
        </div>

      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>

        {/* Analytics label */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', marginBottom: 3 }}>
            {profile?.name ? `${profile.name}'s Analytics` : 'Your Analytics'}
          </div>
          <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.1em' }}>
            THE DATA DOESN'T LIE
          </div>
        </div>

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
