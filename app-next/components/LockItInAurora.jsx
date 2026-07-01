'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

// "Lock It In" — Aurora treatment (design handoff, 2026-07). A full-screen,
// immersive coached chat: presence orb, three open-text moves with streamed
// coaching, and a canvas "bloom" payoff where the user saves a keeper.
// Same props + same /api/lock-it-in backend as the classic LockItIn; this only
// re-skins. The design's green is replaced by the lesson's category accent.

const MOVES = [
  (c) => `In your own words — what is **${c}**, and why does it matter?`,
  () => `Can you think of an example of this in action — where it shows up, or where it could come in handy?`,
  (c) => `Last one: if you kept a single sentence about **${c}** — the thing you don't want to forget — what's the keeper?`,
]

// "#3DE88A" -> "61,232,138"
function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '')
  return m ? `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}` : '61,232,138'
}

// Split "…**Concept**…" into leading / highlighted / trailing parts.
function splitConcept(md) {
  const m = /^(.*?)\*\*(.+?)\*\*(.*)$/s.exec(md)
  return m ? { before: m[1], concept: m[2], after: m[3] } : { before: md, concept: '', after: '' }
}

export default function LockItInAurora({ entry, accent = '#3DE88A', onComplete, onSwitch }) {
  const concept = entry.concept
  const A = accent
  const rgb = hexToRgb(accent)

  const [mv, setMv] = useState(0)
  const [phase, setPhase] = useState('ask') // ask | thinking | coach | coached
  const [input, setInput] = useState('')
  const [answers, setAnswers] = useState([])
  const [stream, setStream] = useState('')
  const [payoff, setPayoff] = useState(false)
  const [result, setResult] = useState(null) // { score, recap, hook, keeperOk, theirKeeper, suggested }
  const [keeperDraft, setKeeperDraft] = useState('')
  const [keeperChoice, setKeeperChoice] = useState('yours') // yours | sharper | edit

  // Render full-screen via a portal to <body> so no transformed/overflow ancestor
  // can clip it; lock background scroll while open.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const qa = useRef([])
  const taRef = useRef(null)
  const keeperRef = useRef(null)
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  // Auto-grow a textarea with its content, up to ~40% of the viewport, then scroll.
  const autosize = (el) => {
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, Math.round(window.innerHeight * 0.4)) + 'px'
  }
  useEffect(() => { autosize(taRef.current) }, [input, mv, phase])
  useEffect(() => { autosize(keeperRef.current) }, [keeperDraft, payoff])

  const speaking = phase === 'coach' || phase === 'coached'
  const thinking = phase === 'thinking'
  const q = splitConcept(MOVES[mv] ? MOVES[mv](concept) : '')

  const send = useCallback(async () => {
    if (phase !== 'ask') return
    const a = input.trim()
    if (!a) return
    const idx = mv
    setInput('')
    setAnswers((prev) => { const n = prev.slice(); n[idx] = a; return n })
    qa.current[idx] = { q: MOVES[idx](concept).replace(/\*\*/g, ''), a }

    // Moves 1 & 2 — stream real coaching, then let the user Continue.
    if (idx < MOVES.length - 1) {
      setPhase('thinking')
      setStream('')
      let coaching = ''
      try {
        const res = await fetch('/api/lock-it-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'coach',
            entry,
            messages: [{ role: 'user', content: `Question ${idx + 1}: ${qa.current[idx].q}\nMy answer: ${a}` }],
          }),
        })
        if (!res.ok) throw new Error('coach failed')
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        setPhase('coach')
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          coaching += decoder.decode(value, { stream: true })
          setStream(coaching)
        }
      } catch {
        coaching = "Good — that's the kind of thinking that makes it stick."
        setStream(coaching)
      }
      setStream(coaching)
      setPhase('coached')
      return
    }

    // Final move (the keeper) — go to payoff, close out for real.
    setPayoff(true)
    setKeeperDraft(a)
    setKeeperChoice('yours')
    let r = { score: 3, recap: '', hook: '', keeper_ok: true, keeper_suggested: a }
    try {
      const res = await fetch('/api/lock-it-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'close', entry, qa: qa.current }),
      })
      const data = await res.json()
      if (data && typeof data.score === 'number') r = data
    } catch { /* keep their keeper, pass */ }
    const theirKeeper = a
    const suggested = r.keeper_suggested || theirKeeper
    setResult({ score: r.score, recap: r.recap, hook: r.hook, keeperOk: r.keeper_ok !== false, theirKeeper, suggested })
    setKeeperDraft(r.keeper_ok !== false ? theirKeeper : suggested)
    // If we had to tighten their keeper, default the toggle to the sharper version
    // so the highlighted tab matches the text that's actually shown.
    setKeeperChoice(r.keeper_ok !== false ? 'yours' : 'sharper')
  }, [phase, input, mv, entry, concept])

  const onContinue = () => {
    if (phase !== 'coached') return
    setMv((m) => m + 1)
    setPhase('ask')
    setStream('')
    setInput('')
    setTimeout(() => taRef.current?.focus(), 120)
  }

  const finish = () => {
    if (!result) return
    const keeper = (keeperDraft || '').trim() || result.theirKeeper
    onComplete?.({ score: result.score, answers: { mode: 'chat', keeper, hook: result.hook || null } })
  }

  const eq = (x, y) => (x || '').trim() === (y || '').trim()

  // ---- Payoff canvas: node-bloom. Starts as soon as we enter the payoff (a full
  // provisional bloom while the AI scores), then re-runs with the real score. ----
  useEffect(() => {
    if (!payoff || !canvasRef.current) return
    const cv = canvasRef.current
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const W = cv.clientWidth || 280, H = cv.clientHeight || 150
    cv.width = W * dpr; cv.height = H * dpr
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const cx = W / 2, cy = H / 2
    const N = 7
    const sc = result?.score
    const connected = sc == null || sc >= 3 ? 7 : sc === 2 ? 5 : 3
    const nodes = []
    for (let i = 0; i < N; i++) {
      const ring = i < 3 ? 0 : 1, r = ring ? 64 : 36
      const ang = (i / N) * Math.PI * 2 + (ring ? 0.5 : 0)
      nodes.push({ baseAng: ang, r, litAt: 16 + i * 7, on: i < connected })
    }
    const parts = Array.from({ length: 14 }, () => ({
      x: Math.random() * W, y: cy + (Math.random() - 0.2) * H * 0.8,
      vy: -(0.12 + Math.random() * 0.3), s: Math.random() * 1.3 + 0.3, a: Math.random() * 0.3 + 0.07,
    }))
    const speed = sc == null || sc >= 3 ? 0.0026 : 0.0018
    let f = 0
    const draw = () => {
      f++; ctx.clearRect(0, 0, W, H); const rot = f * speed
      parts.forEach((p) => {
        p.y += p.vy; if (p.y < cy - H * 0.55) p.y = cy + H * 0.55
        ctx.beginPath(); ctx.fillStyle = `rgba(${rgb},${p.a})`; ctx.arc(p.x, p.y, p.s, 0, 7); ctx.fill()
      })
      nodes.forEach((nd, i) => {
        if (!nd.on) return
        const ang = nd.baseAng + rot, nx = cx + Math.cos(ang) * nd.r, ny = cy + Math.sin(ang) * nd.r
        const prog = Math.min(1, Math.max(0, (f - nd.litAt) / 18))
        if (prog > 0) {
          const ex = cx + (nx - cx) * prog, ey = cy + (ny - cy) * prog
          ctx.beginPath(); ctx.strokeStyle = `rgba(${rgb},${0.22 * prog})`; ctx.lineWidth = 1
          ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke()
          if (prog >= 1) {
            const pl = 1 + 0.2 * Math.sin(f * 0.07 + i * 1.3)
            ctx.shadowColor = `rgba(${rgb},0.9)`; ctx.shadowBlur = 11
            ctx.beginPath(); ctx.fillStyle = 'rgba(214,255,235,0.95)'; ctx.arc(nx, ny, 2.3 * pl, 0, 7); ctx.fill(); ctx.shadowBlur = 0
          }
        }
      })
      const grow = Math.min(1, f / 22)
      const rGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40)
      rGrad.addColorStop(0, `rgba(${rgb},${0.45 * grow})`); rGrad.addColorStop(1, `rgba(${rgb},0)`)
      ctx.fillStyle = rGrad; ctx.beginPath(); ctx.arc(cx, cy, 40, 0, 7); ctx.fill()
      ctx.shadowColor = `rgba(${rgb},1)`; ctx.shadowBlur = 20
      ctx.beginPath(); ctx.fillStyle = `rgba(224,255,240,${grow})`
      ctx.arc(cx, cy, Math.max(0.5, 4.6 * grow + 1.2 * Math.sin(f * 0.07)), 0, 7); ctx.fill(); ctx.shadowBlur = 0
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [payoff, result, rgb])

  const score = result?.score ?? 3
  const kicker = score >= 3 ? 'LOCKED IN' : score === 2 ? 'ALMOST' : 'NOT YET'
  const verdict = result?.recap || (score >= 3
    ? 'You nailed all three — explained it, used it, and kept the part that matters.'
    : score === 2 ? 'Two of three landed. One more rep and it’s yours.'
    : 'A couple slipped. Reps fix this — come back and run it again.')

  const answered = answers[mv] !== undefined
  const primaryCTA = {
    width: '100%', appearance: 'none', cursor: 'pointer', padding: '16px', borderRadius: 14, border: 'none',
    fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, letterSpacing: '0.02em', color: '#06140c',
    background: `linear-gradient(180deg, ${A}f2, ${A} 60%, ${A}cc)`,
    boxShadow: `0 12px 30px -8px rgba(${rgb},0.55), inset 0 1px 0 rgba(255,255,255,0.5)`,
  }
  const toggle = (active) => ({
    flex: 1, appearance: 'none', cursor: 'pointer', padding: 9, borderRadius: 10, fontFamily: "'DM Sans',sans-serif",
    fontSize: 12, fontWeight: 600, transition: 'all .2s ease',
    background: active ? `rgba(${rgb},0.16)` : 'rgba(255,255,255,0.03)',
    border: `1px solid ${active ? A : 'rgba(255,255,255,0.1)'}`, color: active ? A : 'rgba(232,238,245,0.6)',
  })

  const overlay = (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000, overflow: 'hidden', fontFamily: "'DM Sans',sans-serif",
      background: 'radial-gradient(125% 60% at 50% 8%, #16242f 0%, #101b24 44%, #0b1118 100%)',
    }}>
      <style>{`
        @keyframes liaDrift{0%{transform:translate(-3%,-2%) scale(1)}50%{transform:translate(3%,2%) scale(1.06)}100%{transform:translate(-3%,-2%) scale(1)}}
        @keyframes liaOrb{0%,100%{transform:scale(1);opacity:0.92}50%{transform:scale(1.12);opacity:1}}
        @keyframes liaThink{0%{transform:scale(0.6);opacity:0.7}100%{transform:scale(2.4);opacity:0}}
        @keyframes liaRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes liaCaret{0%,49%{opacity:1}50%,100%{opacity:0}}
        @keyframes liaPulse{0%,100%{opacity:0.45}50%{opacity:1}}
        .lia-ta::placeholder{color:rgba(232,238,245,0.32)}
        .lia-ta:focus{outline:none}
      `}</style>

      {/* ambient aurora */}
      <div style={{
        position: 'absolute', left: '-25%', top: '-16%', width: '150%', height: '62%', pointerEvents: 'none',
        background: `radial-gradient(50% 60% at 50% 35%, rgba(${rgb},${payoff ? 0.5 : speaking ? 0.2 : 0.12}), transparent 66%)`,
        filter: 'blur(8px)', animation: 'liaDrift 16s ease-in-out infinite', transition: 'background 1s ease',
      }} />

      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2,
        paddingTop: 'env(safe-area-inset-top, 12px)',
      }}>
        {/* header */}
        <div style={{ padding: '18px 24px 0', flex: 'none', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.26em', color: A }}>LOCK IT IN</span>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', color: 'rgba(241,246,251,0.92)' }}>{concept}</span>
          </div>
          <div style={{ display: 'flex', gap: 7, alignItems: 'center', paddingTop: 4 }}>
            {[0, 1, 2].map((i) => {
              const done = i < mv || (i === mv && (answered || payoff)) || payoff
              const cur = i === mv && !payoff
              return (
                <div key={i} style={{
                  width: cur ? 20 : 8, height: 8, borderRadius: 999, transition: 'all .4s ease',
                  background: done ? A : cur ? 'rgba(232,238,245,0.5)' : 'rgba(232,238,245,0.16)',
                  boxShadow: done ? `0 0 10px rgba(${rgb},0.6)` : 'none',
                }} />
              )
            })}
          </div>
        </div>

        {/* ===== CHAT STAGE ===== */}
        {!payoff && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 30px', minHeight: 0, overflowY: 'auto' }}>
              {/* presence orb */}
              <div style={{ position: 'relative', width: 60, height: 60, flex: 'none', marginBottom: 26 }}>
                <div style={{
                  position: 'absolute', inset: 14, borderRadius: '50%', border: `1px solid rgba(${rgb},0.7)`,
                  opacity: 0, animation: thinking ? 'liaThink 1.1s ease-out infinite' : 'none',
                }} />
                <div style={{
                  position: 'absolute', inset: 14, borderRadius: '50%',
                  background: `radial-gradient(circle at 38% 32%, #aaffd2, ${A} 60%, #1f9c5e)`,
                  boxShadow: `0 0 26px rgba(${rgb},${speaking ? 0.85 : 0.5}), inset 0 1px 2px rgba(255,255,255,0.5)`,
                  animation: `liaOrb ${speaking ? '1.8s' : '3.4s'} ease-in-out infinite`,
                }} />
              </div>

              {/* question */}
              <div key={mv} style={{
                fontSize: 23, fontWeight: 600, lineHeight: 1.32, letterSpacing: '-0.02em', color: '#f1f6fb',
                textAlign: 'center', maxWidth: 320, animation: 'liaRise .5s ease both',
              }}>
                <span>{q.before}</span>
                {q.concept && <span style={{ color: A, fontWeight: 600 }}>{q.concept}</span>}
                <span>{q.after}</span>
              </div>

              {/* your answer */}
              {answered && (thinking || speaking) && (
                <div style={{ width: '100%', maxWidth: 320, marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)', animation: 'liaRise .4s ease both' }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.2em', color: 'rgba(232,238,245,0.4)' }}>YOU</span>
                  <div style={{ fontSize: 15, lineHeight: 1.5, color: 'rgba(241,246,251,0.9)', marginTop: 6 }}>{answers[mv]}</div>
                </div>
              )}

              {/* coaching stream */}
              {speaking && (
                <div style={{ width: '100%', maxWidth: 320, marginTop: 16, animation: 'liaRise .4s ease both' }}>
                  <span style={{ fontSize: 15.5, lineHeight: 1.6, color: `rgba(${rgb},0.95)`, fontWeight: 500 }}>{stream}</span>
                  {phase === 'coach' && (
                    <span style={{ display: 'inline-block', width: 7, height: 15, marginLeft: 2, background: A, verticalAlign: -3, animation: 'liaCaret .9s steps(1,end) infinite' }} />
                  )}
                </div>
              )}
            </div>

            {/* footer */}
            <div style={{ padding: '14px 24px calc(30px + env(safe-area-inset-bottom, 0px))', flex: 'none' }}>
              {phase === 'ask' && (
                <div style={{ animation: 'liaRise .4s ease both' }}>
                  {onSwitch && mv === 0 && qa.current.length === 0 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                      <button onClick={onSwitch} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.16em', color: 'rgba(232,238,245,0.4)' }}>
                        ↳ PREFER THE QUIZ?
                      </button>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                    <textarea
                      ref={taRef} className="lia-ta" rows={1} value={input}
                      onChange={(e) => { setInput(e.target.value); autosize(e.target) }}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                      placeholder="Answer in your own words…"
                      style={{
                        flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14,
                        padding: '13px 15px', fontSize: 15, lineHeight: 1.45, color: '#f1f6fb', fontFamily: "'DM Sans',sans-serif",
                        resize: 'none', boxSizing: 'border-box', minHeight: 50, maxHeight: '40vh', overflowY: 'auto',
                      }}
                    />
                    <button onClick={send} style={{
                      flex: 'none', appearance: 'none', cursor: input.trim() ? 'pointer' : 'default', height: 48, padding: '0 18px',
                      borderRadius: 13, border: 'none', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: '#06140c',
                      background: input.trim() ? `linear-gradient(180deg, ${A}, ${A}d9)` : 'rgba(255,255,255,0.08)',
                      boxShadow: input.trim() ? `0 8px 20px -8px rgba(${rgb},0.6)` : 'none', transition: 'all .2s ease',
                      opacity: input.trim() ? 1 : 0.5,
                    }}>{mv === 2 ? 'Finish' : 'Send'}</button>
                  </div>
                </div>
              )}
              {phase === 'coached' && (
                <button onClick={onContinue} style={{
                  display: 'block', width: '100%', appearance: 'none', cursor: 'pointer', padding: 15, borderRadius: 14,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.13)', color: '#eafff4',
                  fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, animation: 'liaRise .4s ease both',
                }}>Continue →</button>
              )}
            </div>
          </div>
        )}

        {/* ===== PAYOFF ===== */}
        {payoff && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 26px 0' }}>
              <canvas ref={canvasRef} style={{ width: 280, height: 150, display: 'block', flex: 'none' }} />
              {!result ? (
                <div style={{ marginTop: 18, textAlign: 'center', animation: 'liaRise .5s ease both' }}>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '0.34em', color: A, animation: 'liaPulse 1.4s ease-in-out infinite' }}>LOCKING IT IN</div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.5, color: 'rgba(232,238,245,0.5)', marginTop: 10 }}>Scoring your answers…</div>
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '0.34em', color: score >= 2 ? A : 'rgba(232,238,245,0.6)', marginTop: 2 }}>{kicker}</div>
                  <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.03em', color: '#eafff3', lineHeight: 1, marginTop: 10, textShadow: score >= 3 ? `0 2px 30px rgba(${rgb},0.5)` : 'none' }}>{score} / 3</div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.5, color: 'rgba(232,238,245,0.6)', textAlign: 'center', marginTop: 12, maxWidth: 280 }}>{verdict}</div>

                  {result.hook && (
                    <div style={{ width: '100%', background: `rgba(${rgb},0.07)`, border: `1px solid rgba(${rgb},0.28)`, borderRadius: 14, padding: '15px 16px', marginTop: 18 }}>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.16em', fontWeight: 500, color: A, marginBottom: 7 }}>🧠 MAKE IT STICK</div>
                      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'rgba(241,246,251,0.82)' }}>{result.hook}</div>
                    </div>
                  )}

                  <div style={{ width: '100%', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14, padding: '15px 16px', marginTop: 11 }}>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.16em', fontWeight: 500, color: 'rgba(232,238,245,0.5)', marginBottom: 9 }}>YOUR KEEPER — saved to revisit</div>
                    {!result.keeperOk && keeperChoice === 'sharper' && (
                      <div style={{ fontSize: 11, color: A, marginBottom: 8, lineHeight: 1.5 }}>Tightened this so what you revisit later is accurate — edit it to sound like you.</div>
                    )}
                    <textarea
                      ref={keeperRef} className="lia-ta" rows={4} value={keeperDraft}
                      onChange={(e) => { setKeeperDraft(e.target.value); setKeeperChoice('edit'); autosize(e.target) }}
                      style={{
                        width: '100%', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                        padding: '12px 14px', fontSize: 14.5, lineHeight: 1.55, color: '#f1f6fb', fontFamily: "'DM Sans',sans-serif",
                        resize: 'none', boxSizing: 'border-box', minHeight: 112, maxHeight: '40vh', overflowY: 'auto',
                      }}
                    />
                    {!eq(result.suggested, result.theirKeeper) && (
                      <div style={{ display: 'flex', gap: 9, marginTop: 9 }}>
                        <button onClick={() => { setKeeperDraft(result.theirKeeper); setKeeperChoice('yours') }} style={toggle(keeperChoice === 'yours')}>Your version</button>
                        <button onClick={() => { setKeeperDraft(result.suggested); setKeeperChoice('sharper') }} style={toggle(keeperChoice === 'sharper')}>Sharper version</button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            {result && (
              <div style={{ padding: '14px 26px calc(30px + env(safe-area-inset-bottom, 0px))', flex: 'none' }}>
                <button onClick={finish} disabled={!keeperDraft.trim()} style={{ ...primaryCTA, opacity: keeperDraft.trim() ? 1 : 0.5, cursor: keeperDraft.trim() ? 'pointer' : 'default' }}>LOCK IT IN →</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return mounted ? createPortal(overlay, document.body) : null
}
