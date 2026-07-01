'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// "Quiz Aurora" — immersive multiple-choice treatment (design handoff, 2026-07).
// One question at a time with immediate feedback, an ambient glow that grows with
// correctness, and a canvas node-graph "peak" payoff. Same completion contract as
// the classic quiz: onComplete({ score, answers }). Accent themes to the category.
// Real data: entry.quiz [{ question, options[], correct, explanation }].

const AMBER = '#E0A93D'
const AMBER_RGB = '224,169,61'

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
  const [sub, setSub] = useState('ask') // ask | fb
  const [chosen, setChosen] = useState(null)
  const [answers, setAnswers] = useState({}) // { qi: optionIndex }
  const [score, setScore] = useState(0)
  const [pk, setPk] = useState(0) // peak reveal step 0..4

  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const timers = useRef([])
  const after = (ms, fn) => { timers.current.push(setTimeout(fn, ms)) }
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  useEffect(() => () => { clearTimers(); cancelAnimationFrame(rafRef.current) }, [])

  const q = Q[qi] || Q[0]
  const fb = sub === 'fb'
  const correctSoFar = Object.keys(answers).filter((k) => answers[k] === Q[k].correct).length

  const choose = (i) => {
    if (sub !== 'ask') return
    setChosen(i)
    setSub('fb')
    setAnswers((prev) => ({ ...prev, [qi]: i }))
  }

  const onContinue = () => {
    if (qi < total - 1) {
      setQi(qi + 1); setSub('ask'); setChosen(null)
    } else {
      const sc = Q.filter((qq, i) => answers[i] === qq.correct).length
      setScore(sc); setPhase('peak'); setPk(0)
    }
  }

  // Peak reveal + canvas, once we enter the peak.
  useEffect(() => {
    if (phase !== 'peak') return
    after(140, () => setPk(1)); after(660, () => setPk(2)); after(1140, () => setPk(3)); after(1540, () => setPk(4))
    const raf = () => startGraphic(score)
    after(70, raf)
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
    const N = 7, nodes = []
    for (let i = 0; i < N; i++) {
      const ring = i < 3 ? 0 : 1, r = ring ? 86 : 50
      const ang = (i / N) * Math.PI * 2 + (ring ? 0.5 : 0)
      const connected = sc >= total ? true : sc === total - 1 ? i !== N - 1 : i < 2
      nodes.push({ baseAng: ang, r, litAt: 20 + i * 8, connected })
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
        if (nd.connected) {
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

  const finish = () => {
    onComplete?.({ score, answers })
  }

  // ---- ambient intensity ----
  let amb = 0.14 + correctSoFar * 0.09
  if (phase === 'peak') { const full = score >= total ? 0.66 : score === total - 1 ? 0.34 : 0.1; amb = pk >= 2 ? full : 0.07 }

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

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, overflow: 'hidden', fontFamily: "'DM Sans',sans-serif", background: '#0c1117' }}>
      <style>{`
        @keyframes qaDrift{0%{transform:translate(-3%,-2%) scale(1)}50%{transform:translate(3%,2%) scale(1.06)}100%{transform:translate(-3%,-2%) scale(1)}}
        @keyframes qaRise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes qaHalo{0%{opacity:0.55;transform:scale(0.96)}50%{opacity:0.9;transform:scale(1.02)}100%{opacity:0.55;transform:scale(0.96)}}
      `}</style>

      {/* ambient aurora + warm floor */}
      <div style={{
        position: 'absolute', left: '-25%', top: '-18%', width: '150%', height: '78%', pointerEvents: 'none',
        background: `radial-gradient(50% 55% at 50% 38%, rgba(${rgb},${amb}), rgba(${rgb},${amb * 0.25}) 38%, transparent 68%)`,
        filter: 'blur(8px)', animation: 'qaDrift 14s ease-in-out infinite', transition: 'background 1.1s ease',
      }} />
      <div style={{ position: 'absolute', left: '-20%', bottom: '-22%', width: '140%', height: '55%', pointerEvents: 'none', background: `radial-gradient(60% 100% at 50% 100%, rgba(${AMBER_RGB},0.10), transparent 70%)` }} />

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

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px 30px 0', minHeight: 0, overflowY: 'auto' }}>
              <div key={qi} style={{ fontSize: 25, fontWeight: 600, lineHeight: 1.22, letterSpacing: '-0.02em', color: '#f1f6fb', animation: 'qaRise .5s ease both' }}>{q.question}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 30 }}>
                {q.options.map((text, i) => {
                  const isChosen = chosen === i, isCorrect = i === q.correct
                  let bg = 'linear-gradient(165deg, rgba(38,54,66,0.9), rgba(22,34,44,0.9))'
                  let border = '1px solid rgba(255,255,255,0.09)'
                  let shadow = 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 24px -16px rgba(0,0,0,0.7)'
                  let textColor = 'rgba(241,246,251,0.92)', opacity = 1
                  let dot = { width: 24, height: 24, borderRadius: '50%', flex: 'none', border: '1px solid rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'transparent', transition: 'all .3s ease' }
                  let dotMark = '', tag = '', tagColor = 'transparent'
                  if (fb) {
                    if (isCorrect) {
                      bg = `linear-gradient(165deg, rgba(${rgb},0.26), rgba(${rgb},0.10))`
                      border = `1px solid rgba(${rgb},0.55)`
                      shadow = `inset 0 1px 0 rgba(255,255,255,0.1), 0 0 36px -6px rgba(${rgb},0.55)`
                      textColor = '#eafff4'
                      dot = { ...dot, border: 'none', background: `radial-gradient(circle at 35% 30%, #7dffba, ${A})`, color: '#06140c', boxShadow: `0 0 16px rgba(${rgb},0.7)` }
                      dotMark = '✓'; tag = isChosen ? 'YOUR ANSWER' : 'THE ANSWER'; tagColor = A
                    } else if (isChosen) {
                      bg = `linear-gradient(165deg, rgba(${AMBER_RGB},0.16), rgba(${AMBER_RGB},0.05))`
                      border = `1px solid rgba(${AMBER_RGB},0.45)`; shadow = 'none'; textColor = 'rgba(241,246,251,0.78)'
                      dot = { ...dot, border: 'none', background: `rgba(${AMBER_RGB},0.92)`, color: '#160f02', boxShadow: `0 0 14px rgba(${AMBER_RGB},0.45)` }
                      dotMark = '✕'; tag = 'YOUR PICK'; tagColor = AMBER
                    } else { opacity = 0.4 }
                  }
                  return (
                    <button key={i} onClick={() => choose(i)} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, width: '100%', textAlign: 'left',
                      cursor: fb ? 'default' : 'pointer', padding: '16px 18px', borderRadius: 16, background: bg, border, boxShadow: shadow, opacity,
                      transition: 'background .35s ease, border-color .35s ease, box-shadow .35s ease, opacity .35s ease',
                    }}>
                      <span style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                        {fb && tag && <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8.5, letterSpacing: '0.18em', color: tagColor, marginBottom: 4 }}>{tag}</span>}
                        <span style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.4, color: textColor }}>{text}</span>
                      </span>
                      <span style={dot}>{dotMark}</span>
                    </button>
                  )
                })}
              </div>

              {fb && (
                <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)', animation: 'qaRise .45s ease both' }}>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10.5, letterSpacing: '0.24em', marginBottom: 8, fontWeight: 500, color: chosen === q.correct ? A : AMBER }}>{chosen === q.correct ? 'CORRECT' : 'NOT QUITE'}</div>
                  <div style={{ fontSize: 14.5, lineHeight: 1.6, color: 'rgba(232,238,245,0.7)' }}>{q.explanation}</div>
                </div>
              )}
            </div>

            <div style={{ padding: '0 30px calc(38px + env(safe-area-inset-bottom, 0px))', flex: 'none' }}>
              <button onClick={onContinue} disabled={!fb} style={{ ...primaryBtn, opacity: fb ? 1 : 0, pointerEvents: fb ? 'auto' : 'none', transition: 'opacity .35s ease' }}>
                {qi < total - 1 ? 'Continue' : 'See result'}
              </button>
            </div>
          </div>
        )}

        {/* ===== PEAK ===== */}
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
                fontSize: 30, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.04, marginTop: 12, color: perfect ? '#eafff3' : '#eef3f9',
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
      </div>
    </div>
  )
}
