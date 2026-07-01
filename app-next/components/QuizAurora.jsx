'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

// "Quiz Aurora" — immersive multiple-choice. Right/wrong interaction per the lesson-flow
// handoff: a CORRECT pick flashes green and auto-advances; a WRONG pick raises a feedback
// sheet with the correct answer + "why" + Got it. Ends on the node-bloom peak with the
// numeric score (kept from the earlier payoff). onComplete matches the classic quiz.
// Real data: entry.quiz [{ question, options[], correct, explanation }]. Accent-themed.

const AMBER = '#E0A93D'
const AMBER_RGB = '224,169,61'
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '')
  return m ? `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}` : '61,232,138'
}

export default function QuizAurora({ entry, accent = '#3DE88A', onComplete, onSwitch }) {
  const A = accent
  const rgb = hexToRgb(accent)
  const Q = entry.quiz
  const total = Q.length

  const [phase, setPhase] = useState('start') // start | quiz | peak
  const [qi, setQi] = useState(0)
  const [sub, setSub] = useState('ask') // ask | correct | wrong
  const [chosen, setChosen] = useState(null)
  const [answers, setAnswers] = useState({}) // { qi: optionIndex } — drives orbs
  const [fb, setFb] = useState(false) // wrong-answer feedback sheet up
  const [score, setScore] = useState(0)
  const [pk, setPk] = useState(0) // peak reveal step 0..4
  const [mounted, setMounted] = useState(false)

  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const timers = useRef([])
  const answersRef = useRef({}) // reliable read inside timeouts
  const after = (ms, fn) => { timers.current.push(setTimeout(fn, ms)) }
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  useEffect(() => {
    setMounted(true)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])
  useEffect(() => () => { clearTimers(); cancelAnimationFrame(rafRef.current) }, [])

  const q = Q[qi] || Q[0]

  const advance = (isLast) => {
    setFb(false)
    if (!isLast) { setQi((n) => n + 1); setSub('ask'); setChosen(null) }
    else {
      const sc = Q.filter((qq, i) => answersRef.current[i] === qq.correct).length
      setScore(sc); setPhase('peak'); setPk(0)
    }
  }

  const choose = (i) => {
    if (sub !== 'ask') return
    const correct = i === q.correct
    const isLast = qi === total - 1
    answersRef.current = { ...answersRef.current, [qi]: i }
    setChosen(i)
    setAnswers({ ...answersRef.current })
    setSub(correct ? 'correct' : 'wrong')
    if (correct) after(720, () => advance(isLast))
    else after(460, () => setFb(true))
  }

  const onGotIt = () => {
    if (!fb) return
    const isLast = qi === total - 1
    setFb(false)
    after(240, () => advance(isLast))
  }

  // Peak reveal + canvas
  useEffect(() => {
    if (phase !== 'peak') return
    after(140, () => setPk(1)); after(660, () => setPk(2)); after(1140, () => setPk(3)); after(1540, () => setPk(4))
    after(70, () => startGraphic(score))
    return () => { clearTimers(); cancelAnimationFrame(rafRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const startGraphic = useCallback((sc) => {
    cancelAnimationFrame(rafRef.current)
    const cv = canvasRef.current; if (!cv) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const W = cv.clientWidth || 300, H = cv.clientHeight || 216
    cv.width = W * dpr; cv.height = H * dpr
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const cx = W / 2, cy = H / 2
    const N = 7
    const connected = sc >= total ? 7 : sc === total - 1 ? 5 : 3
    const nodes = []
    for (let i = 0; i < N; i++) {
      const ring = i < 3 ? 0 : 1, r = ring ? 86 : 50
      const ang = (i / N) * Math.PI * 2 + (ring ? 0.5 : 0)
      nodes.push({ baseAng: ang, r, litAt: 20 + i * 8, on: i < connected })
    }
    const parts = Array.from({ length: 16 }, () => ({
      x: Math.random() * W, y: cy + (Math.random() - 0.2) * H * 0.7,
      vy: -(0.15 + Math.random() * 0.35), s: Math.random() * 1.5 + 0.4, a: Math.random() * 0.35 + 0.08,
    }))
    const perfect = sc >= total
    let f = 0
    const draw = () => {
      f++; ctx.clearRect(0, 0, W, H)
      const rot = f * 0.0016 * (perfect ? 1 : 0.5)
      parts.forEach((p) => {
        p.y += p.vy; if (p.y < cy - H * 0.55) p.y = cy + H * 0.55
        ctx.beginPath(); ctx.fillStyle = `rgba(${rgb},${p.a})`; ctx.arc(p.x, p.y, p.s, 0, 7); ctx.fill()
      })
      nodes.forEach((nd, i) => {
        const ang = nd.baseAng + rot, nx = cx + Math.cos(ang) * nd.r, ny = cy + Math.sin(ang) * nd.r
        if (nd.on) {
          const prog = Math.min(1, Math.max(0, (f - nd.litAt) / 20))
          if (prog > 0) {
            const ex = cx + (nx - cx) * prog, ey = cy + (ny - cy) * prog
            ctx.beginPath(); ctx.strokeStyle = `rgba(${rgb},${0.22 * prog})`; ctx.lineWidth = 1
            ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke()
            if (prog >= 1) {
              const pl = 1 + 0.2 * Math.sin(f * 0.07 + i * 1.3)
              ctx.shadowColor = `rgba(${rgb},0.9)`; ctx.shadowBlur = 12
              ctx.beginPath(); ctx.fillStyle = 'rgba(214,255,235,0.95)'; ctx.arc(nx, ny, 2.6 * pl, 0, 7); ctx.fill(); ctx.shadowBlur = 0
            }
          }
        } else {
          ctx.beginPath(); ctx.fillStyle = 'rgba(232,238,245,0.12)'; ctx.arc(nx, ny, 1.8, 0, 7); ctx.fill()
        }
      })
      const grow = Math.min(1, f / 24)
      const rGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 46)
      rGrad.addColorStop(0, `rgba(${rgb},${0.45 * grow})`); rGrad.addColorStop(1, `rgba(${rgb},0)`)
      ctx.fillStyle = rGrad; ctx.beginPath(); ctx.arc(cx, cy, 46, 0, 7); ctx.fill()
      const core = 5.5 * grow + 1.4 * Math.sin(f * 0.07)
      ctx.shadowColor = `rgba(${rgb},1)`; ctx.shadowBlur = 22
      ctx.beginPath(); ctx.fillStyle = `rgba(224,255,240,${grow})`; ctx.arc(cx, cy, Math.max(0.5, core), 0, 7); ctx.fill(); ctx.shadowBlur = 0
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
  }, [rgb, total])

  const finish = () => onComplete?.({ score, answers })

  const primaryBtn = {
    width: '100%', appearance: 'none', cursor: 'pointer', padding: 17, borderRadius: 15, border: 'none',
    fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, letterSpacing: '0.01em', color: '#06140c',
    background: `linear-gradient(180deg, ${A}f2 0%, ${A} 60%, ${A}cc 100%)`,
    boxShadow: `0 12px 30px -8px rgba(${rgb},0.55), inset 0 1px 0 rgba(255,255,255,0.5)`,
  }

  const perfect = score >= total
  const peakKicker = perfect ? 'LOCKED IN' : score === total - 1 ? 'ALMOST' : 'NOT YET'
  const peakSub = perfect ? `${entry.concept} — filed for life. Tomorrow, something new.`
    : score === total - 1 ? 'One away. One more rep and it’s yours.'
    : 'A couple slipped. Reps fix this — come back and run it again.'

  const hint = sub === 'correct' ? '✓ NICE — NEXT UP' : sub === 'ask' ? 'PICK THE BEST ANSWER' : ''

  const overlay = (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, overflow: 'hidden', fontFamily: "'DM Sans',sans-serif", background: '#0b0f14' }}>
      <style>{`
        @keyframes qaDrift{0%{transform:translate(-3%,-2%) scale(1)}50%{transform:translate(3%,2%) scale(1.06)}100%{transform:translate(-3%,-2%) scale(1)}}
        @keyframes qaRise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes qaHalo{0%{opacity:0.55;transform:scale(0.96)}50%{opacity:0.9;transform:scale(1.02)}100%{opacity:0.55;transform:scale(0.96)}}
        @keyframes qaFlash{0%{box-shadow:0 0 0 0 rgba(${rgb},0)}40%{box-shadow:0 0 34px -4px rgba(${rgb},0.6)}100%{box-shadow:0 0 0 0 rgba(${rgb},0)}}
      `}</style>

      {/* ambient */}
      <div style={{
        position: 'absolute', left: '-25%', top: '-18%', width: '150%', height: '78%', pointerEvents: 'none',
        background: `radial-gradient(50% 55% at 50% 38%, rgba(${rgb},${phase === 'peak' ? (perfect ? 0.5 : 0.2) : 0.12}), transparent 68%)`,
        filter: 'blur(8px)', animation: 'qaDrift 14s ease-in-out infinite', transition: 'background 1.1s ease',
      }} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2, paddingTop: 'env(safe-area-inset-top, 12px)' }}>

        {/* ===== START ===== */}
        {phase === 'start' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 34px' }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '0.32em', color: A, marginBottom: 20 }}>{(entry.category || '').toUpperCase()}</div>
              <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.035em', color: '#f1f6fb' }}>{entry.concept}</div>
              <div style={{ fontSize: 17, lineHeight: 1.55, color: 'rgba(232,238,245,0.62)', marginTop: 20, maxWidth: 300 }}>{total} questions to lock it in.</div>
              {onSwitch && (
                <button onClick={onSwitch} style={{ alignSelf: 'flex-start', marginTop: 22, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.16em', color: 'rgba(232,238,245,0.4)' }}>↳ PREFER TO TALK IT OUT?</button>
              )}
            </div>
            <div style={{ padding: '0 30px calc(40px + env(safe-area-inset-bottom, 0px))', flex: 'none' }}>
              <button onClick={() => setPhase('quiz')} style={primaryBtn}>Begin</button>
            </div>
          </div>
        )}

        {/* ===== QUIZ ===== */}
        {phase === 'quiz' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ padding: '14px 30px 0', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                {Q.map((_, i) => {
                  const ans = answers[i]
                  const done = ans !== undefined, ok = done && ans === Q[i].correct, cur = i === qi
                  return (
                    <div key={i} style={{
                      width: cur && !done ? 22 : 9, height: 9, borderRadius: 999, transition: 'all .4s ease',
                      background: ok ? A : (done && !ok) ? AMBER : cur ? 'rgba(232,238,245,0.5)' : 'rgba(232,238,245,0.16)',
                      boxShadow: ok ? `0 0 12px rgba(${rgb},0.7)` : (done && !ok) ? `0 0 10px rgba(${AMBER_RGB},0.5)` : 'none',
                    }} />
                  )
                })}
              </div>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '0.18em', color: 'rgba(232,238,245,0.5)' }}>{String(qi + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '26px 30px 0', minHeight: 0, overflowY: 'auto' }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.28em', color: A }}>QUICK QUIZ</div>
              <div key={qi} style={{ fontSize: 23, fontWeight: 600, lineHeight: 1.26, letterSpacing: '-0.02em', color: '#f1f6fb', marginTop: 10, animation: 'qaRise .45s ease both' }}>{q.question}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 28 }}>
                {q.options.map((text, i) => {
                  const isChosen = chosen === i, isCorrect = i === q.correct, resolved = sub !== 'ask'
                  let bg = 'linear-gradient(165deg, rgba(38,54,66,0.9), rgba(22,34,44,0.9))'
                  let border = '1px solid rgba(255,255,255,0.09)', textColor = 'rgba(241,246,251,0.92)', opacity = 1
                  let letterBg = 'rgba(255,255,255,0.06)', letterColor = 'rgba(232,238,245,0.6)', mark = '', markColor = 'transparent', anim = 'none'
                  if (resolved) {
                    if (isChosen && isCorrect) { bg = `linear-gradient(165deg, rgba(${rgb},0.26), rgba(${rgb},0.10))`; border = `1px solid rgba(${rgb},0.55)`; textColor = '#eafff4'; letterBg = `radial-gradient(circle at 35% 30%, #7dffba, ${A})`; letterColor = '#06140c'; mark = '✓'; markColor = A; anim = 'qaFlash .7s ease' }
                    else if (isChosen && !isCorrect) { bg = `linear-gradient(165deg, rgba(${AMBER_RGB},0.18), rgba(${AMBER_RGB},0.06))`; border = `1px solid rgba(${AMBER_RGB},0.5)`; textColor = 'rgba(241,246,251,0.85)'; letterBg = `rgba(${AMBER_RGB},0.9)`; letterColor = '#160f02'; mark = '✕'; markColor = AMBER }
                    else if (isCorrect && sub === 'wrong') { border = `1px solid rgba(${rgb},0.4)`; letterColor = `rgba(${rgb},0.9)` }
                    else opacity = 0.4
                  }
                  return (
                    <button key={i} onClick={() => choose(i)} style={{
                      display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', cursor: resolved ? 'default' : 'pointer',
                      padding: '15px 16px', borderRadius: 15, background: bg, border, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 24px -16px rgba(0,0,0,0.7)', opacity, animation: anim,
                      transition: 'background .3s ease, border-color .3s ease, opacity .3s ease',
                    }}>
                      <span style={{ width: 26, height: 26, flex: 'none', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 500, background: letterBg, color: letterColor, transition: 'all .3s ease' }}>{LETTERS[i]}</span>
                      <span style={{ flex: 1, minWidth: 0, fontSize: 15.5, fontWeight: 500, lineHeight: 1.4, color: textColor, transition: 'color .3s ease' }}>{text}</span>
                      <span style={{ flex: 'none', fontSize: 15, fontWeight: 600, color: markColor, width: mark ? 'auto' : 0, transition: 'color .3s ease' }}>{mark}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ padding: '14px 26px calc(26px + env(safe-area-inset-bottom, 0px))', flex: 'none' }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.12em', color: sub === 'correct' ? A : 'rgba(232,238,245,0.32)', textAlign: 'center', transition: 'color .3s ease' }}>{hint}</div>
            </div>
          </div>
        )}

        {/* ===== PEAK (score reveal — unchanged) ===== */}
        {phase === 'peak' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '50%', top: '42%', width: 460, height: 460, marginLeft: -230, marginTop: -230, pointerEvents: 'none',
              borderRadius: '50%', background: `radial-gradient(circle, rgba(${rgb},${perfect ? 0.42 : score === total - 1 ? 0.2 : 0.06}), transparent 62%)`,
              opacity: pk >= 2 ? 1 : 0, transition: 'opacity 1.1s ease', animation: (perfect && pk >= 2) ? 'qaHalo 4s ease-in-out 1.3s infinite' : 'none',
            }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center', position: 'relative' }}>
              <canvas ref={canvasRef} style={{ width: 300, height: 216, display: 'block' }} />
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, letterSpacing: '0.4em', color: perfect ? A : 'rgba(232,238,245,0.5)', opacity: pk >= 3 ? 1 : 0, transform: pk >= 3 ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity .6s ease, transform .6s cubic-bezier(.2,.7,.2,1)' }}>{peakKicker}</div>
              <div style={{
                fontSize: 46, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 8, color: perfect ? '#eafff3' : '#eef3f9',
                textShadow: perfect ? `0 2px 30px rgba(${rgb},0.5)` : 'none',
                opacity: pk >= 2 ? 1 : 0, transform: pk >= 2 ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1)',
              }}>{score} <span style={{ color: 'rgba(232,238,245,0.4)', fontWeight: 600 }}>/ {total}</span></div>
              <div style={{
                fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: 10, color: perfect ? '#eafff3' : '#eef3f9',
                textShadow: perfect ? (pk >= 3 ? `0 2px 48px rgba(${rgb},0.7), 0 0 22px rgba(${rgb},0.45)` : `0 2px 20px rgba(${rgb},0.25)`) : 'none',
                opacity: pk >= 2 ? 1 : 0, transform: pk >= 2 ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
                transition: 'opacity .7s ease, transform .85s cubic-bezier(.2,.7,.2,1), text-shadow .7s ease',
              }}>{entry.concept}</div>
              <div style={{ fontSize: 16, lineHeight: 1.55, color: 'rgba(232,238,245,0.62)', marginTop: 22, maxWidth: 280, opacity: pk >= 4 ? 1 : 0, transform: pk >= 4 ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity .6s ease, transform .6s ease' }}>{peakSub}</div>
            </div>
            <div style={{ padding: '0 30px calc(40px + env(safe-area-inset-bottom, 0px))', flex: 'none' }}>
              <button onClick={finish} style={{
                ...(perfect
                  ? { width: '100%', appearance: 'none', cursor: 'pointer', padding: 17, borderRadius: 15, fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 600, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', color: '#eafff4', backdropFilter: 'blur(8px)' }
                  : primaryBtn),
                opacity: pk >= 4 ? 1 : 0, pointerEvents: pk >= 4 ? 'auto' : 'none', transition: 'opacity .6s ease',
              }}>{perfect ? 'Done' : 'Continue →'}</button>
            </div>
          </div>
        )}

        {/* ===== WRONG-ANSWER FEEDBACK SHEET ===== */}
        {phase === 'quiz' && (
          <>
            <div onClick={onGotIt} style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'rgba(4,7,11,0.55)', opacity: fb ? 1 : 0, pointerEvents: fb ? 'auto' : 'none', transition: 'opacity .3s ease' }} />
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 4, background: 'linear-gradient(180deg, #16212c, #0f171f)',
              borderTopLeftRadius: 26, borderTopRightRadius: 26, borderTop: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 -30px 70px -20px rgba(0,0,0,0.8)',
              transform: fb ? 'translateY(0)' : 'translateY(115%)', transition: 'transform .42s cubic-bezier(.2,.7,.2,1)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}>
              <div style={{ width: 38, height: 4, borderRadius: 999, background: 'rgba(232,238,245,0.22)', margin: '12px auto 18px' }} />
              <div style={{ padding: '0 26px 28px' }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '0.28em', color: AMBER }}>NOT QUITE</div>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-start', gap: 12, padding: '15px 16px', borderRadius: 15, background: `rgba(${rgb},0.09)`, border: `1px solid rgba(${rgb},0.4)` }}>
                  <span style={{ width: 24, height: 24, flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#06140c', background: `radial-gradient(circle at 35% 30%, #7dffba, ${A})`, boxShadow: `0 0 14px rgba(${rgb},0.6)` }}>✓</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8.5, letterSpacing: '0.18em', color: A }}>THE ANSWER</span>
                    <span style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.35, color: '#eafff4' }}>{q.options[q.correct]}</span>
                  </div>
                </div>
                <div style={{ fontSize: 14.5, lineHeight: 1.62, color: 'rgba(232,238,245,0.72)', marginTop: 16 }}>{q.explanation}</div>
                <button onClick={onGotIt} style={{ ...primaryBtn, marginTop: 22, padding: 16, borderRadius: 14, fontSize: 15 }}>{qi < total - 1 ? 'Got it — next' : 'Got it — finish'}</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )

  return mounted ? createPortal(overlay, document.body) : null
}
