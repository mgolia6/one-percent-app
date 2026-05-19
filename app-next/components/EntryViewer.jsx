'use client'

import { useState, useEffect, useRef } from 'react'
import { BookOpen, Lightbulb, Award } from 'lucide-react'

function Celebration({ score, accent }) {
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
          ctx.font = "bold 28px 'Inter',sans-serif"; ctx.textAlign = 'center'; ctx.fillText('LOCKED IN 🔒', cx, cy + 60); ctx.restore()
        }
        frame++
        if (frame < 140) animRef.current = requestAnimationFrame(tick)
      }
      animRef.current = requestAnimationFrame(tick)
    } else {
      let frame = 0
      function tickArc() {
        ctx.clearRect(0, 0, W, H)
        const fa = frame > 60 ? 1 - (frame - 60) / 20 : 1, pr = Math.min(1, frame / 50)
        ctx.save(); ctx.translate(cx, cy); ctx.globalAlpha = fa
        ctx.beginPath(); ctx.arc(0, 0, 55, 0, Math.PI * 2); ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 6; ctx.stroke()
        ctx.beginPath(); ctx.arc(0, 0, 55, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 4 / 3) * pr); ctx.strokeStyle = accent; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.shadowColor = accent; ctx.shadowBlur = 10; ctx.stroke()
        ctx.fillStyle = '#fff'; ctx.font = "bold 24px 'Inter',sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('2/3', 0, 0)
        ctx.restore(); frame++
        if (frame < 80) animRef.current = requestAnimationFrame(tickArc)
      }
      animRef.current = requestAnimationFrame(tickArc)
    }
    return () => cancelAnimationFrame(animRef.current)
  }, [score, accent])
  if (score < 2) return null
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }} />
}

export default function EntryViewer({ entry, onComplete, userStats }) {
  const [tab, setTab] = useState('morning')
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [srcOpen, setSrcOpen] = useState(false)
  const [startTime] = useState(Date.now())
  const scoreRef = useRef(null)
  const isFirst = useRef(true)

  const ACCENT = entry.accent
  const ACCENT_DIM = entry.accentDim

  // Restore previous quiz state if already completed
  useEffect(() => {
    if (userStats?.answers) {
      setAnswers(userStats.answers)
      setSubmitted(true)
    }
  }, [userStats])

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [tab])

  const allAnswered = entry.quiz.every((_, i) => answers[i] !== undefined)
  const score = entry.quiz.filter((q, i) => answers[i] === q.correct).length

  const handleSubmit = () => {
    if (!allAnswered) return
    const timeToQuiz = Math.round((Date.now() - startTime) / 1000)
    setSubmitted(true)
    if (score >= 2) setShowCelebration(true)
    setTimeout(() => scoreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150)
    // Report completion upward to parent (page will save to Supabase)
    if (onComplete) onComplete({ score, timeToQuiz, answers })
  }

  const tabs = [
    { id: 'morning', label: 'MORNING', icon: BookOpen },
    { id: 'midday', label: 'MIDDAY', icon: Lightbulb },
    { id: 'evening', label: 'EVENING', icon: Award },
  ]

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', fontFamily: "'Inter',sans-serif", color: '#fff', maxWidth: 720, margin: '0 auto', paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#0A0A0A;font-family:'Inter',sans-serif;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{0%{transform:scale(0.85);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
        @keyframes pulseBorder{0%,100%{box-shadow:0 0 0 0 ${ACCENT}44}50%{box-shadow:0 0 0 8px ${ACCENT}11}}
        .fade-in{animation:fadeIn 0.28s ease forwards}
        .op-tab-btn{background:none;border:none;cursor:pointer;font-family:'Inter',sans-serif;font-size:11px;font-weight:500;letter-spacing:0.08em;padding:10px 14px;color:#555;transition:color 0.2s;border-bottom:2px solid transparent;display:flex;align-items:center}
        .op-tab-btn:hover{color:#aaa}
        .op-tab-btn.active{color:${ACCENT};border-bottom-color:${ACCENT}}
        .op-next-btn{display:block;width:100%;margin-top:32px;padding:14px 20px;background:${ACCENT};color:#0A0A0A;border:none;border-radius:4px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;cursor:pointer;text-align:center;transition:opacity 0.2s}
        .op-next-btn:hover{opacity:0.85}
        .op-quiz-opt{background:#111;border:1px solid #222;border-radius:4px;padding:14px 16px;cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;color:#999;margin-bottom:8px;transition:all 0.18s;text-align:left;width:100%;line-height:1.6}
        .op-quiz-opt:hover:not(:disabled){border-color:${ACCENT}44;color:#ddd;background:#141414}
        .op-quiz-opt.selected{border-color:${ACCENT};background:${ACCENT}22;color:#eee}
        .op-quiz-opt.correct{border-color:#4ade80;color:#4ade80;background:#4ade8011}
        .op-quiz-opt.wrong{border-color:#f87171;color:#f87171;background:#f8717111}
        .op-submit-btn{background:${ACCENT};color:#0A0A0A;border:none;padding:12px 24px;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;cursor:pointer;border-radius:3px;margin-top:8px}
        .op-submit-btn:disabled{opacity:0.3;cursor:not-allowed}
        .op-score-box{border-radius:6px;padding:28px 20px;text-align:center;margin:24px 0;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards}
        .op-score-perfect{background:${ACCENT}0f;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards,pulseBorder 1.8s ease-in-out 0.4s 3}
        .op-score-close{background:#1a1a1a}
        .op-score-low{background:#111}
        .op-src-toggle{background:none;border:1px solid #222;padding:7px 14px;font-family:'Inter',sans-serif;font-size:11px;font-weight:500;color:#555;cursor:pointer;border-radius:3px;letter-spacing:0.08em}
        .op-src-toggle:hover{color:#999;border-color:#444}
        .op-src-link{color:${ACCENT};text-decoration:none;font-size:12px;display:block;margin-bottom:4px;font-family:'Inter',sans-serif;font-weight:500}
        .op-src-link:hover{text-decoration:underline}
      `}</style>

      {showCelebration && <Celebration score={score} accent={ACCENT} />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 12px', borderBottom: '1px solid #141414' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.15em', color: '#fff', fontWeight: 600 }}>ONE PERCENT</span>
          <span style={{ fontSize: 10, color: '#333', letterSpacing: '0.1em', fontWeight: 500 }}>#{entry.entry}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {userStats?.streak > 0 && <span style={{ fontSize: 11, color: '#aaa', fontWeight: 500 }}>🔥 {userStats.streak}</span>}
          <span style={{ fontSize: 9, letterSpacing: '0.12em', padding: '4px 9px', borderRadius: 3, fontWeight: 600, background: ACCENT, color: '#0A0A0A' }}>{entry.categoryTag}</span>
        </div>
      </div>

      {/* Datebar */}
      <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.1em', padding: '8px 24px', borderBottom: '1px solid #0f0f0f', fontWeight: 500 }}>
        {entry.editionId} · {entry.concept}
      </div>

      {/* Concept */}
      <div style={{ padding: '28px 24px 0' }}>
        <div style={{ fontSize: 32, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{entry.concept}</div>
        <div style={{ width: 40, height: 3, background: ACCENT, marginTop: 12 }} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #141414', marginTop: 20, padding: '0 12px', gap: 4 }}>
        {tabs.map(t => {
          const Icon = t.icon
          return (
            <button key={t.id} className={`op-tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
              <Icon size={16} style={{ marginRight: 6 }} />{t.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={{ padding: '24px 24px 0' }} className="fade-in" key={tab}>
        {tab === 'morning' && (
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', color: ACCENT }}>☀ MORNING BRIEF</div>
            <div style={{ fontSize: 20, color: '#fff', lineHeight: 1.5, fontWeight: 400, marginBottom: 20, letterSpacing: '-0.01em' }}>{entry.morning.hook}</div>
            <div style={{ marginBottom: 20 }}>
              {entry.morning.explanation_paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: 15, color: '#bbb', lineHeight: 1.8, marginBottom: i < entry.morning.explanation_paragraphs.length - 1 ? 16 : 0 }}>{p}</p>
              ))}
            </div>
            <div style={{ background: ACCENT_DIM, border: `1px solid ${ACCENT}33`, borderRadius: 4, padding: '16px 18px', marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', color: ACCENT }}>WHY TODAY</div>
              <div style={{ fontSize: 14, color: '#bbb', lineHeight: 1.7 }}>{entry.morning.why_today}</div>
            </div>
            <div style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', color: ACCENT }}>⚡ MORNING CHALLENGE</div>
              <div style={{ fontSize: 14, color: '#999', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{entry.morning.morning_challenge}</div>
            </div>
            <button className="op-next-btn" onClick={() => setTab('midday')}>☁ MIDDAY →</button>
          </div>
        )}

        {tab === 'midday' && (
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', color: ACCENT }}>☁ MIDDAY REFRAME</div>
            <div style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 17, color: '#fff', lineHeight: 1.5, fontWeight: 500 }}>{entry.midday.reframe}</div>
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', marginBottom: 14, fontWeight: 600, textTransform: 'uppercase', color: '#555' }}>👁 {entry.midday.itw_label}</div>
            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 16, marginBottom: 20 }}>
              {entry.midday.itw_paragraphs.map((p, i) => (
                <p key={i} style={{ fontSize: 15, color: '#bbb', lineHeight: 1.8, marginBottom: i < entry.midday.itw_paragraphs.length - 1 ? 16 : 0 }}>{p}</p>
              ))}
            </div>
            <div style={{ border: `1px solid ${ACCENT}44`, borderRadius: 4, padding: '16px 18px', marginBottom: 20, background: ACCENT_DIM }}>
              <div style={{ fontSize: 15, color: '#ddd', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 10 }}>"{entry.midday.quote}"</div>
              <div style={{ fontSize: 12, color: '#666', letterSpacing: '0.04em' }}>— {entry.midday.attribution}</div>
            </div>
            <div style={{ fontSize: 14, color: '#777', lineHeight: 1.7, borderTop: '1px solid #141414', paddingTop: 16, marginBottom: 8 }}>{entry.midday.midday_nudge}</div>
            <button className="op-next-btn" onClick={() => setTab('evening')}>🔥 EVENING →</button>
          </div>
        )}

        {tab === 'evening' && (
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', color: ACCENT }}>🔥 TEST YOURSELF</div>
            {entry.quiz.map((q, qi) => (
              <div key={qi} style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 14, color: '#ccc', lineHeight: 1.7, marginBottom: 12, fontWeight: 400 }}>{qi + 1}. {q.question}</div>
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
                {submitted && <div style={{ fontSize: 13, color: '#666', lineHeight: 1.7, marginTop: 10, paddingLeft: 4 }}>{q.explanation}</div>}
              </div>
            ))}
            {!submitted && <button className="op-submit-btn" onClick={handleSubmit} disabled={!allAnswered}>SUBMIT</button>}
            {submitted && (
              <div ref={scoreRef} className={`op-score-box ${score === 3 ? 'op-score-perfect' : score === 2 ? 'op-score-close' : 'op-score-low'}`} style={{ border: `2px solid ${score === 3 ? ACCENT : score === 2 ? '#606060' : '#333'}` }}>
                <div style={{ fontSize: 36, fontWeight: 500, color: score === 3 ? ACCENT : score === 2 ? '#ccc' : '#555' }}>{score}/3</div>
                <div style={{ fontSize: 13, letterSpacing: '0.15em', color: score === 3 ? '#fff' : '#888', marginTop: 6 }}>
                  {score === 3 ? 'PERFECT SCORE' : score === 2 ? 'ALMOST THERE' : score === 1 ? 'KEEP GOING' : 'REVIEW & RETRY'}
                </div>
                <div style={{ fontSize: 12, color: '#555', marginTop: 8, lineHeight: 1.5 }}>
                  {score === 3 ? "You've got this one locked in." : score === 2 ? 'One away. Come back and get that third.' : 'The concepts will stick with more reps. Come back.'}
                </div>
              </div>
            )}
            <div style={{ fontSize: 14, color: '#aaa', borderTop: '1px solid #1a1a1a', paddingTop: 20, marginTop: 20, lineHeight: 1.8, fontStyle: 'italic' }}>{entry.closing}</div>
          </div>
        )}
      </div>

      {/* Sources */}
      <div style={{ padding: '28px 24px 48px' }}>
        <div style={{ borderTop: '1px solid #141414', marginBottom: 18 }} />
        <button className="op-src-toggle" onClick={() => setSrcOpen(!srcOpen)}>{srcOpen ? '▲' : '▼'} SOURCES</button>
        {srcOpen && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {entry.sources.map((s, i) => (
              <div key={i}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="op-src-link">{s.label}</a>
                <div style={{ fontSize: 12, color: '#444', lineHeight: 1.6 }}>{s.detail}</div>
              </div>
            ))}
            <div style={{ fontSize: 10, color: '#2a2a2a', letterSpacing: '0.1em', marginTop: 8, paddingTop: 12, borderTop: '1px solid #141414', fontWeight: 500 }}>
              ✓ ALL SOURCES VERIFIED · ENTRY {entry.entry} · {entry.editionId}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
