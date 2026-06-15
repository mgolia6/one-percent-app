'use client'

import { useState, useEffect, useRef } from 'react'
import { BookOpen, Lightbulb, Award, Flame } from 'lucide-react'
import analytics from '@/lib/analytics'

function Celebration({ score, accent, onDone }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  useEffect(() => {
    if (score < 2) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width = window.innerWidth
    const H = canvas.height = window.innerHeight
    const cx = W / 2, cy = H / 2
    if (score === 3) {
      const rays = [], particles = []
      let frame = 0
      for (let i = 0; i < 16; i++) rays.push({ angle: (i / 16) * Math.PI * 2, maxLength: 120 + Math.random() * 80 })
      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2, speed = 2 + Math.random() * 4
        particles.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, decay: 0.012 + Math.random() * 0.012, size: 2 + Math.random() * 3, color: [accent, '#ffffff', '#ffff00', '#ff69b4'][Math.floor(Math.random() * 4)] })
      }
      function tick() {
        ctx.clearRect(0, 0, W, H)
        const fadeAlpha = frame > 100 ? 1 - (frame - 100) / 40 : 1
        if (frame < 60) {
          const rp = Math.min(1, frame / 30)
          ctx.save(); ctx.globalAlpha = fadeAlpha
          rays.forEach(r => {
            const len = r.maxLength * rp
            const x1 = cx + Math.cos(r.angle) * 20, y1 = cy + Math.sin(r.angle) * 20
            const x2 = cx + Math.cos(r.angle) * len, y2 = cy + Math.sin(r.angle) * len
            const g = ctx.createLinearGradient(x1, y1, x2, y2)
            g.addColorStop(0, accent); g.addColorStop(1, accent + '00')
            ctx.strokeStyle = g; ctx.lineWidth = 3; ctx.lineCap = 'round'
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
          })
          ctx.restore()
        }
        ctx.save(); ctx.globalAlpha = fadeAlpha
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life -= p.decay
          if (p.life <= 0) { particles.splice(i, 1); continue }
          ctx.globalAlpha = p.life * fadeAlpha; ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 8
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill()
        }
        ctx.restore()
        if (frame > 50) {
          const ta = Math.min(1, (frame - 50) / 20) * fadeAlpha
          ctx.save(); ctx.globalAlpha = ta; ctx.fillStyle = accent; ctx.shadowColor = accent; ctx.shadowBlur = 20
          ctx.font = "bold 28px 'Inter',sans-serif"; ctx.textAlign = 'center'; ctx.fillText('LOCKED IN', cx, cy + 60); ctx.restore()
        }
        frame++
        if (frame < 140) { animRef.current = requestAnimationFrame(tick) } else { if (onDone) onDone() }
      }
      animRef.current = requestAnimationFrame(tick)
    } else {
      let frame = 0
      function tickArc() {
        ctx.clearRect(0, 0, W, H)
        const fa = frame > 60 ? 1 - (frame - 60) / 20 : 1, pr = Math.min(1, frame / 50)
        ctx.save(); ctx.translate(cx, cy); ctx.globalAlpha = fa
        ctx.beginPath(); ctx.arc(0, 0, 55, 0, Math.PI * 2); ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 6; ctx.stroke()
        ctx.beginPath(); ctx.arc(0, 0, 55, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 4 / 3) * pr)
        ctx.strokeStyle = accent; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.shadowColor = accent; ctx.shadowBlur = 10; ctx.stroke()
        ctx.fillStyle = '#fff'; ctx.font = "bold 24px 'Inter',sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('2/3', 0, 0)
        ctx.restore(); frame++
        if (frame < 80) { animRef.current = requestAnimationFrame(tickArc) } else { if (onDone) onDone() }
      }
      animRef.current = requestAnimationFrame(tickArc)
    }
    return () => cancelAnimationFrame(animRef.current)
  }, [score, accent])
  if (score < 2) return null
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }} />
}


import { supabase as _supabase } from '@/lib/supabase'

function PostEntryFeedback({ entryNumber, userId, accent, onSubmit, theme }) {
  const T = theme
  // Section-specific ratings mapped to existing DB columns
  // morning → topic_rating, reframe → clarity_rating, quiz → quiz_rating
  const [ratings, setRatings] = useState({ morning: 0, reframe: 0, quiz: 0 })
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)
  const [listening, setListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const recognitionRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      if (!formRef.current) return
      const top = formRef.current.getBoundingClientRect().top + window.scrollY - 16
      window.scrollTo({ top, behavior: 'smooth' })
    }, 1200)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) setVoiceSupported(true)
  }, [])

  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    let finalTranscript = comment
    recognition.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalTranscript += e.results[i][0].transcript + ' '
        else interim = e.results[i][0].transcript
      }
      setComment(finalTranscript + interim)
    }
    recognition.onend = () => {
      setComment(finalTranscript.trim())
      setListening(false)
    }
    recognition.onerror = () => setListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  const allRated = ratings.morning && ratings.reframe && ratings.quiz

  const submit = async () => {
    if (!allRated) return
    if (!userId) {
      setError('Not signed in — please reload and try again.')
      return
    }
    setSubmitting(true)
    const { error } = await _supabase.from('feedback').insert({
      user_id: userId,
      feedback_type: 'post_entry',
      entry_number: entryNumber,
      topic_rating: ratings.morning,
      clarity_rating: ratings.reframe,
      quiz_rating: ratings.quiz,
      comment: comment.trim() || null,
    })
    if (error) {
      console.error('PostEntryFeedback insert error:', error.message, error.code, error.details)
      setSubmitting(false)
      setError(error.message || 'Something went wrong — tap to retry.')
      return
    }
    setDone(true)
    analytics.feedbackSubmitted({
      entryNumber,
      morningRating: ratings.morning,
      middayRating: ratings.reframe,
      quizRating: ratings.quiz,
      hasComment: !!comment.trim(),
    })
    setTimeout(() => { if (onSubmit) onSubmit() }, 2800)
  }

  const SECTIONS = [
    { field: 'morning', label: 'THE CONCEPT',  question: 'Did this click for you?' },
    { field: 'reframe', label: 'IN THE WILD', question: 'Did it shift how you think about it?' },
    { field: 'quiz',    label: 'LOCK IT IN',   question: 'Could you explain this to someone else now?' },
  ]

  const RatingRow = ({ field, label, question }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 9, color: accent, letterSpacing: '0.15em', fontWeight: 700, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.4 }}>{question}</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => setRatings(r => ({ ...r, [field]: n }))} style={{
            flex: 1, padding: '10px 0', borderRadius: 3,
            border: `1px solid ${ratings[field] >= n ? accent : T.borderMid}`,
            background: ratings[field] >= n ? accent + '22' : T.surface,
            color: ratings[field] >= n ? accent : T.textDim,
            fontSize: 13, cursor: 'pointer', fontFamily: "'Inter',sans-serif",
            transition: 'all 0.15s',
          }}>{n}</button>
        ))}
      </div>
    </div>
  )

  if (done) {
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
    return null
  }

  return (
    <div ref={formRef} style={{ background: T.surface, border: `1px solid ${T.borderMid}`, borderRadius: 6, padding: 20, marginTop: 12 }}>
      <style>{`
        @keyframes fbDot { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }
        @keyframes micPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <div style={{ fontSize: 10, color: T.textDim, letterSpacing: '0.15em', fontWeight: 600, marginBottom: 4 }}>SECTION FEEDBACK</div>
      <div style={{ fontSize: 13, color: T.textMid, marginBottom: 20, lineHeight: 1.5 }}>Rate each part of today's entry.</div>

      {SECTIONS.map(s => <RatingRow key={s.field} {...s} />)}

      <div style={{ position: 'relative', marginTop: 4, marginBottom: 14 }}>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder={listening ? 'Listening...' : 'Anything else? Tap the mic to speak. (optional)'}
          style={{
            width: '100%', background: T.inputBg, border: `1px solid ${listening ? accent : T.borderMid}`,
            borderRadius: 4, padding: '12px 44px 12px 14px', fontSize: 16, color: T.textMid,
            fontFamily: "'Inter',sans-serif", resize: 'vertical', minHeight: 64,
            outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
          }}
        />
        {voiceSupported && (
          <button
            onClick={toggleVoice}
            title={listening ? 'Stop recording' : 'Speak your feedback'}
            style={{
              position: 'absolute', right: 10, top: 10,
              background: listening ? accent + '33' : 'transparent',
              border: `1px solid ${listening ? accent : T.borderMid}`,
              borderRadius: 4, padding: '5px 7px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: listening ? 'micPulse 1.2s ease-in-out infinite' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={listening ? accent : T.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3"/>
              <path d="M5 10a7 7 0 0 0 14 0"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
              <line x1="8" y1="22" x2="16" y2="22"/>
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div style={{ fontSize: 11, color: '#f87171', marginBottom: 8, textAlign: 'center', letterSpacing: '0.05em' }}>{error}</div>
      )}
      <button onClick={submit} disabled={!allRated || submitting} style={{
        width: '100%', padding: '12px 0',
        background: allRated ? accent : '#1a1a1a',
        border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 600,
        color: '#0a0a0a', cursor: allRated ? 'pointer' : 'not-allowed',
        letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif",
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
      }}>
        {submitting ? (
          [0,1,2].map(i => (
            <span key={i} style={{
              width: 5, height: 5, borderRadius: '50%', background: '#0a0a0a', display: 'inline-block',
              animation: `fbDot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))
        ) : error ? 'RETRY' : 'SUBMIT'}
      </button>
    </div>
  )
}

const THEMES = {
  morning: {
    bg: 'linear-gradient(160deg, #22252e 0%, #1e2128 50%, #1a1d24 100%)',
    bgSolid: '#1e2128',
    surface: 'rgba(255,255,255,0.06)',
    surfaceBorder: 'rgba(255,255,255,0.08)',
    text: '#f0f2f5',
    textMid: 'rgba(240,242,245,0.85)',
    textDim: 'rgba(240,242,245,0.65)',
    textFaint: 'rgba(240,242,245,0.45)',
    border: 'rgba(255,255,255,0.07)',
    borderMid: 'rgba(255,255,255,0.1)',
    headerBg: 'rgba(34,37,46,0.92)',
    quizOpt: 'rgba(255,255,255,0.05)',
    quizOptHover: 'rgba(255,255,255,0.09)',
    inputBg: 'rgba(255,255,255,0.05)',
    bodyBg: '#1e2128',
  },
  midday: {
    bg: 'linear-gradient(160deg, #161820 0%, #13151c 50%, #111318 100%)',
    bgSolid: '#13151c',
    surface: 'rgba(255,255,255,0.05)',
    surfaceBorder: 'rgba(255,255,255,0.07)',
    text: '#e8eaf0',
    textMid: 'rgba(232,234,240,0.85)',
    textDim: 'rgba(232,234,240,0.65)',
    textFaint: 'rgba(232,234,240,0.45)',
    border: 'rgba(255,255,255,0.06)',
    borderMid: 'rgba(255,255,255,0.09)',
    headerBg: 'rgba(22,24,32,0.95)',
    quizOpt: 'rgba(255,255,255,0.04)',
    quizOptHover: 'rgba(255,255,255,0.08)',
    inputBg: 'rgba(255,255,255,0.04)',
    bodyBg: '#13151c',
  },
  evening: {
    bg: 'linear-gradient(160deg, #0f1015 0%, #0A0A0A 50%, #080808 100%)',
    bgSolid: '#0A0A0A',
    surface: 'rgba(255,255,255,0.04)',
    surfaceBorder: 'rgba(255,255,255,0.06)',
    text: '#e0e2e8',
    textMid: 'rgba(224,226,232,0.85)',
    textDim: 'rgba(224,226,232,0.65)',
    textFaint: 'rgba(224,226,232,0.45)',
    border: 'rgba(255,255,255,0.05)',
    borderMid: 'rgba(255,255,255,0.08)',
    headerBg: 'rgba(10,10,10,0.97)',
    quizOpt: 'rgba(255,255,255,0.04)',
    quizOptHover: 'rgba(255,255,255,0.08)',
    inputBg: 'rgba(255,255,255,0.04)',
    bodyBg: '#0A0A0A',
  },
}

export default function EntryViewer({ entry, onComplete, onBack, userStats, userId, onFeedbackDone }) {
  const [tab, setTab] = useState('morning')
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [srcOpen, setSrcOpen] = useState(false)
  const [showEntryFeedback, setShowEntryFeedback] = useState(false)
  const [themeKey, setThemeKey] = useState('morning')
  const [startTime] = useState(Date.now())
  const [promptCopied, setPromptCopied] = useState(false)

  const T = THEMES[themeKey]
  const scoreRef = useRef(null)
  const completionRef = useRef(null)
  const isFirst = useRef(true)
  const feedbackShown = useRef(false)

  const ACCENT = entry.accent
  const ACCENT_DIM = entry.accentDim

  useEffect(() => {
    if (userStats && userStats.answers) {
      setAnswers(userStats.answers)
      setSubmitted(true)
    }
  }, [userStats])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setThemeKey(tab)
  }, [tab])

  const allAnswered = entry.quiz.every((_, i) => answers[i] !== undefined)
  const score = entry.quiz.filter((q, i) => answers[i] === q.correct).length

  const handleSubmit = () => {
    if (!allAnswered) return
    const timeToQuiz = Math.round((Date.now() - startTime) / 1000)
    setSubmitted(true)
    if (score >= 2) setShowCelebration(true)
    if (!feedbackShown.current) {
      feedbackShown.current = true
      setShowEntryFeedback(true)
    }
    setTimeout(() => scoreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150)
    setTimeout(() => completionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 800)
    analytics.quizSubmitted({
      entryNumber: entry.number,
      category: entry.category,
      concept: entry.concept,
      score,
      maxScore: entry.quiz.length,
      timeToQuizMs: Date.now() - startTime,
    })
    if (onComplete) onComplete({ score, timeToQuiz, answers })
  }

  const tabs = [
    { id: 'morning', label: 'CONCEPT', icon: BookOpen },
    { id: 'midday', label: 'IN THE WILD', icon: Lightbulb },
    { id: 'evening', label: 'LOCK IT IN', icon: Award },
  ]

  const scoreBg = score === 3 ? 'op-score-perfect' : score === 2 ? 'op-score-close' : 'op-score-low'
  const scoreBorder = score === 3 ? ACCENT : score === 2 ? '#606060' : '#333'
  const scoreColor = score === 3 ? ACCENT : score === 2 ? '#ccc' : '#555'
  const scoreLabel = score === 3 ? 'PERFECT SCORE' : score === 2 ? 'ALMOST THERE' : score === 1 ? 'KEEP GOING' : 'REVIEW & RETRY'
  const scoreSub = score === 3 ? "You've got this one locked in." : score === 2 ? 'One away. Come back and get that third.' : 'The concepts will stick with more reps. Come back.'

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: "'Inter',sans-serif", color: T.text, maxWidth: 720, margin: '0 auto', paddingBottom: 80, transition: 'background 0.6s ease, color 0.4s ease' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${T.bgSolid};font-family:'Inter',sans-serif;transition:background 0.6s ease;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{0%{transform:scale(0.85);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
        @keyframes pulseBorder{0%,100%{box-shadow:0 0 0 0 ${ACCENT}44}50%{box-shadow:0 0 0 8px ${ACCENT}11}}
        @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fadeIn 0.28s ease forwards}
        .op-tab-btn{background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.08em;padding:10px 14px;color:${T.textDim};transition:color 0.3s;border-bottom:2px solid transparent;display:flex;align-items:center}
        .op-tab-btn:hover{color:${T.textMid}}
        .op-tab-btn.active{color:${ACCENT};border-bottom-color:${ACCENT}}
        .op-next-btn{display:block;width:100%;margin-top:32px;padding:14px 20px;background:${ACCENT};color:#0A0A0A;border:none;border-radius:4px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;cursor:pointer;text-align:center;transition:opacity 0.2s}
        .op-next-btn:hover{opacity:0.85}
        .op-quiz-opt{background:${T.quizOpt};border:1px solid ${T.borderMid};border-radius:4px;padding:14px 16px;cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;color:${T.textMid};margin-bottom:8px;transition:all 0.18s;text-align:left;width:100%;line-height:1.6;-webkit-tap-highlight-color:transparent}
        .op-quiz-opt:hover:not(:disabled){border-color:${ACCENT}44;color:${T.text};background:${T.quizOptHover}}
        .op-quiz-opt.selected{border-color:${ACCENT};background:${ACCENT}22;color:#eee}
        .op-quiz-opt.correct{border-color:#4ade80;color:#4ade80;background:#4ade8011}
        .op-quiz-opt.wrong{border-color:#f87171;color:#f87171;background:#f8717111}
        .op-submit-btn{background:${ACCENT};color:#0A0A0A;border:none;padding:12px 24px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;cursor:pointer;border-radius:3px;margin-top:8px}
        .op-submit-btn:disabled{opacity:0.3;cursor:not-allowed}
        .op-score-box{border-radius:6px;padding:28px 20px;text-align:center;margin:24px 0;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards}
        .op-score-perfect{background:${ACCENT}0f;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards,pulseBorder 1.8s ease-in-out 0.4s 3}
        .op-score-close{background:${T.surface}}
        .op-score-low{background:${T.surface}}
        .op-completion-card{background:${T.surface};border:1px solid ${T.surfaceBorder};border-radius:6px;padding:20px;margin-top:8px;animation:slideUp 0.35s ease forwards}
        .op-action-primary{display:block;width:100%;background:${ACCENT};color:#0A0A0A;border:none;border-radius:4px;padding:14px;font-size:12px;font-weight:600;letter-spacing:0.08em;cursor:pointer;font-family:'Inter',sans-serif;text-align:center;margin-bottom:8px}
        .op-action-secondary{display:block;width:100%;background:none;color:${T.textDim};border:1px solid ${T.borderMid};border-radius:4px;padding:12px;font-size:11px;font-weight:500;letter-spacing:0.08em;cursor:pointer;font-family:'Inter',sans-serif;text-align:center}
        .op-action-secondary:hover{color:${T.textMid};border-color:${T.border}}
        .op-src-toggle{background:none;border:1px solid ${T.borderMid};padding:7px 14px;font-family:'Inter',sans-serif;font-size:11px;font-weight:500;color:${T.textDim};cursor:pointer;border-radius:3px;letter-spacing:0.08em}
        .op-src-toggle:hover{color:${T.textMid};border-color:${T.border}}
        .op-src-link{color:${ACCENT};text-decoration:none;font-size:12px;display:block;margin-bottom:4px;font-family:'Inter',sans-serif;font-weight:500}
        .op-src-link:hover{text-decoration:underline}
      `}</style>

      {showCelebration && <Celebration score={score} accent={ACCENT} onDone={() => setShowCelebration(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 12px', borderBottom: `1px solid ${T.border}`, background: T.headerBg, backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 10, transition: 'background 0.6s ease, border-color 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.15em', color: T.text, fontWeight: 600, transition: 'color 0.4s ease' }}>ONE PERCENT</span>
          <span style={{ fontSize: 10, color: T.textFaint, letterSpacing: '0.1em', fontWeight: 500, transition: 'color 0.4s ease' }}>#{entry.entry}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {userStats?.streak > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: T.textMid, fontWeight: 500, transition: 'color 0.4s ease' }}><Flame size={11} strokeWidth={1.5} />{userStats.streak}</span>}
          <span style={{ fontSize: 9, letterSpacing: '0.12em', padding: '4px 9px', borderRadius: 3, fontWeight: 600, background: ACCENT, color: '#0A0A0A' }}>{entry.categoryTag}</span>
        </div>
      </div>

      {/* Datebar */}
      <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: '0.1em', padding: '8px 24px', borderBottom: `1px solid ${T.border}`, fontWeight: 500, transition: 'color 0.4s ease, border-color 0.4s ease' }}>
        {entry.editionId} · {entry.concept}
      </div>

      {/* Concept */}
      <div style={{ padding: '28px 24px 0' }}>
        <div style={{ fontSize: 32, fontWeight: 600, color: T.text, letterSpacing: '-0.02em', lineHeight: 1.1, transition: 'color 0.4s ease' }}>{entry.concept}</div>
        <div style={{ width: 40, height: 3, background: ACCENT, marginTop: 12 }} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${T.border}`, marginTop: 20, padding: '0 12px', gap: 4, transition: 'border-color 0.4s ease' }}>
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button key={t.id} className={`op-tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => {
              analytics.tabSwitched({ entryNumber: entry.number, fromTab: tab, toTab: t.id })
              setTab(t.id)
            }}>
              <Icon size={16} style={{ marginRight: 6 }} />{t.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={{ padding: '24px 24px 0' }} className="fade-in" key={tab}>

        {/* Morning */}
        {tab === 'morning' && (
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', color: ACCENT }}>THE CONCEPT</div>
            <div style={{ fontSize: 20, color: T.text, lineHeight: 1.5, fontWeight: 400, marginBottom: 20, letterSpacing: '-0.01em' }}>{entry.morning.hook}</div>
            <div style={{ marginBottom: 20 }}>
              {entry.morning.explanation_paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: 15, color: T.textMid, lineHeight: 1.8, marginBottom: i < entry.morning.explanation_paragraphs.length - 1 ? 16 : 0 }}>{p}</p>
              ))}
            </div>
            <div style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}33`, borderRadius: 4, padding: '16px 18px', marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', color: ACCENT }}>WHY TODAY</div>
              <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.7 }}>{entry.morning.why_today}</div>
            </div>
            <div style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', color: ACCENT }}>YOUR MOVE</div>
              <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{entry.morning.morning_challenge}</div>
            </div>
            <button className="op-next-btn" onClick={() => { analytics.tabSwitched({ entryNumber: entry.number, fromTab: 'morning', toTab: 'midday' }); setTab('midday'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>IN THE WILD →</button>
          </div>
        )}

        {/* Midday */}
        {tab === 'midday' && (
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', color: ACCENT }}>IN THE WILD</div>
            <div style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 17, color: T.text, lineHeight: 1.5, fontWeight: 500 }}>{entry.midday.reframe}</div>
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', marginBottom: 14, fontWeight: 600, textTransform: 'uppercase', color: T.textDim }}>{entry.midday.itw_label}</div>
            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 16, marginBottom: 20 }}>
              {entry.midday.itw_paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: 15, color: T.textMid, lineHeight: 1.8, marginBottom: i < entry.midday.itw_paragraphs.length - 1 ? 16 : 0 }}>{p}</p>
              ))}
            </div>
            <div style={{ border: `1px solid ${ACCENT}44`, borderRadius: 4, padding: '16px 18px', marginBottom: 20, background: ACCENT_DIM }}>
              <div style={{ fontSize: 15, color: T.text, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 10 }}>"{entry.midday.quote}"</div>
              <div style={{ fontSize: 12, color: T.textDim, letterSpacing: '0.04em' }}>— {entry.midday.attribution}</div>
            </div>
            <div style={{ fontSize: 14, color: T.textDim, lineHeight: 1.7, borderTop: `1px solid ${T.border}`, paddingTop: 16, marginBottom: 8 }}>{entry.midday.midday_nudge}</div>
            <button className="op-next-btn" onClick={() => { analytics.tabSwitched({ entryNumber: entry.number, fromTab: 'midday', toTab: 'evening' }); setTab('evening'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>LOCK IT IN →</button>
          </div>
        )}

        {/* Evening */}
        {tab === 'evening' && (
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', color: ACCENT }}>LOCK IT IN</div>
            {entry.quiz.map((q, qi) => (
              <div key={qi} style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 14, color: T.text, lineHeight: 1.7, marginBottom: 12, fontWeight: 400 }}>{qi + 1}. {q.question}</div>
                {q.options.map((opt, ai) => {
                  let cls = 'op-quiz-opt'
                  if (submitted && ai === q.correct) cls += ' correct'
                  else if (submitted && answers[qi] === ai) cls += ' wrong'
                  else if (!submitted && answers[qi] === ai) cls += ' selected'
                  return (
                    <button key={ai} className={cls} onClick={() => { if (!submitted) setAnswers(p => ({ ...p, [qi]: ai })) }} disabled={submitted}>
                      <span style={{ color: ACCENT, marginRight: 8, fontWeight: 600 }}>{String.fromCharCode(65 + ai)}.</span>{opt}
                    </button>
                  )
                })}
                {submitted && <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.7, marginTop: 10, paddingLeft: 4 }}>{q.explanation}</div>}
              </div>
            ))}

            {!submitted && <button className="op-submit-btn" onClick={handleSubmit} disabled={!allAnswered}>SUBMIT</button>}

            {submitted && (
              <>
                <div ref={scoreRef} className={`op-score-box ${scoreBg}`} style={{ border: `2px solid ${scoreBorder}` }}>
                  <div style={{ fontSize: 36, fontWeight: 500, color: scoreColor }}>{score}/3</div>
                  <div style={{ fontSize: 13, letterSpacing: '0.15em', color: score === 3 ? T.text : T.textDim, marginTop: 6 }}>{scoreLabel}</div>
                  <div style={{ fontSize: 12, color: T.textDim, marginTop: 8, lineHeight: 1.5 }}>{scoreSub}</div>
                  {score < 3 && (
                    <div style={{ marginTop: 18 }}>
                      <button
                        onClick={() => { setAnswers({}); setSubmitted(false); setShowCelebration(false); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50) }}
                        style={{
                          background: 'none', border: `1px solid ${ACCENT}44`, borderRadius: 4,
                          padding: '9px 20px', fontSize: 11, color: ACCENT, cursor: 'pointer',
                          letterSpacing: '0.1em', fontFamily: "'Inter',sans-serif", fontWeight: 600,
                          transition: 'border-color 0.15s',
                        }}
                      >
                        RETRY QUIZ
                      </button>
                      <div style={{ fontSize: 11, color: T.textFaint, marginTop: 10, lineHeight: 1.6 }}>
                        Your first attempt score is saved to the leaderboard.
                      </div>
                    </div>
                  )}
                </div>

                {/* Post-entry feedback */}
                {submitted && showEntryFeedback && (
                  <PostEntryFeedback
                    entryNumber={entry.entry}
                    userId={userId}
                    accent={ACCENT}
                    theme={T}
                    onSubmit={() => {
                      setShowEntryFeedback(false)
                      if (onFeedbackDone) onFeedbackDone(ACCENT)
                    }}
                  />
                )}

                {/* AI Prompt section */}
                {entry.ai_prompt && (
                  <div style={{
                    background: `${ACCENT}0D`,
                    border: `1px solid ${ACCENT}33`,
                    borderRadius: 6,
                    padding: '18px 18px 16px',
                    marginTop: 20,
                    marginBottom: 4,
                  }}>
                    <div style={{ fontSize: 10, letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase', color: ACCENT, marginBottom: 10 }}>
                      AI PROMPT
                    </div>
                    <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.75, marginBottom: 14 }}>
                      {entry.ai_prompt}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(entry.ai_prompt).then(() => {
                          analytics.aiPromptCopied({ entryNumber: entry.number, category: entry.category, concept: entry.concept })
                          setPromptCopied(true)
                          setTimeout(() => setPromptCopied(false), 2000)
                        })
                      }}
                      style={{
                        background: promptCopied ? `${ACCENT}22` : 'none',
                        border: `1px solid ${promptCopied ? ACCENT : ACCENT + '55'}`,
                        borderRadius: 4,
                        padding: '8px 16px',
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        fontWeight: 600,
                        color: promptCopied ? ACCENT : T.textDim,
                        cursor: 'pointer',
                        fontFamily: "'Inter',sans-serif",
                        transition: 'all 0.15s',
                        width: '100%',
                      }}
                    >
                      {promptCopied ? '✓ COPIED' : 'COPY PROMPT'}
                    </button>
                  </div>
                )}

                {/* Completion action card */}
                <div ref={completionRef} className="op-completion-card">
                  <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: '0.12em', fontWeight: 600, marginBottom: 14 }}>WHAT'S NEXT</div>
                  {onBack && (
                    <button className="op-action-primary" onClick={onBack}>
                      BACK TO LIBRARY
                    </button>
                  )}
                  <button className="op-action-secondary" onClick={() => { setSrcOpen(true); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }}>
                    VIEW SOURCES
                  </button>

                </div>
              </>
            )}

            <div style={{ fontSize: 14, color: T.textMid, borderTop: `1px solid ${T.border}`, paddingTop: 20, marginTop: 20, lineHeight: 1.8, fontStyle: 'italic' }}>{entry.closing}</div>
          </div>
        )}
      </div>

      {/* Sources */}
      <div style={{ padding: '28px 24px 48px' }}>
        <div style={{ borderTop: `1px solid ${T.border}`, marginBottom: 18 }} />
        <button className="op-src-toggle" onClick={() => setSrcOpen(!srcOpen)}>{srcOpen ? 'HIDE SOURCES' : 'VIEW SOURCES'}</button>
        {srcOpen && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {entry.sources.map((s, i) => (
              <div key={i}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="op-src-link">{s.label}</a>
                <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.6 }}>{s.detail}</div>
              </div>
            ))}
            <div style={{ fontSize: 10, color: T.textFaint, letterSpacing: '0.1em', marginTop: 8, paddingTop: 12, borderTop: `1px solid ${T.border}`, fontWeight: 500 }}>
              ALL SOURCES VERIFIED · ENTRY {entry.entry} · {entry.editionId}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
