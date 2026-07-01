'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { TOTAL_ENTRIES } from '@/lib/config'
import { enrollLockin, removeLockin, getLockin } from '@/lib/lockins'

// "Return Moment" — end-of-session re-engagement screen (design handoff, 2026-07).
// Streak count-up over an ember canvas → locked-in chip → tomorrow's drop + live
// countdown → "go deeper" (real spaced-repetition enroll) → visual reminder hook.
// Full-screen via portal. Reminder is visual-only for now (per product call).

const G = '61,232,138'   // brand green
const A = '224,169,61'   // streak amber

export default function ReturnMoment({ entry, userId, streak = 0, keeper = null, hook = null, onClose }) {
  const [rv, setRv] = useState(0)          // reveal step 0..5
  const [count, setCount] = useState(0)     // streak count-up
  const [now, setNow] = useState(0)
  const [deep, setDeep] = useState(false)   // enrolled in spaced review
  const [reminderOn, setReminderOn] = useState(false)
  const [next, setNext] = useState(null)    // { num, title, teaser } | 'none' | null
  const [mounted, setMounted] = useState(false)

  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const timers = useRef([])
  const flare = useRef({ go: false, start: null })

  const num = (entry.entry ?? entry.number)
  const goal = 7
  const streakInWeek = (streak % 7) || (streak > 0 ? 7 : 0)
  const remaining = Math.max(0, goal - streakInWeek)
  const milestone = remaining === 1 ? 'One more day for a perfect week.'
    : remaining === 0 ? 'Perfect week — a new one starts tomorrow.'
    : `${remaining} days to a full week.`

  // mount: portal + scroll lock + reveal sequence + countdown tick
  useEffect(() => {
    setMounted(true)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setNow(Date.now())
    const after = (ms, fn) => { timers.current.push(setTimeout(fn, ms)) }
    after(140, () => { setRv(1); startEmber(); countUp() })
    after(1000, () => setRv(2))
    after(1520, () => setRv(3))
    after(2040, () => setRv(4))
    after(2620, () => setRv(5))
    const tick = setInterval(() => setNow(Date.now()), 1000)
    return () => {
      document.body.style.overflow = prevOverflow
      timers.current.forEach(clearTimeout); timers.current = []
      clearInterval(tick); clearInterval(cuRef.current); cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // already enrolled? reflect it
  useEffect(() => {
    let ok = true
    if (userId) getLockin({ userId, entryNumber: num }).then((l) => { if (ok && l && l.status !== 'done') setDeep(true) })
    return () => { ok = false }
  }, [userId, num])

  // fetch tomorrow's drop teaser
  useEffect(() => {
    const nextNum = num + 1
    if (nextNum > TOTAL_ENTRIES) { setNext('none'); return }
    let ok = true
    fetch(`/entries/${String(nextNum).padStart(3, '0')}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((e) => {
        if (!ok) return
        if (!e) { setNext('none'); return }
        const teaser = e.morning?.hook || e.closing || 'A fresh three-minute drop tomorrow.'
        setNext({ num: nextNum, title: e.concept, teaser })
      })
      .catch(() => ok && setNext('none'))
    return () => { ok = false }
  }, [num])

  const cuRef = useRef(null)
  const countUp = () => {
    clearInterval(cuRef.current)
    const step = Math.max(1, Math.round(streak / 24)) // finish in ~24 ticks max
    let c = 0
    cuRef.current = setInterval(() => {
      c = Math.min(streak, c + step)
      setCount(c)
      if (c >= streak) { clearInterval(cuRef.current); flare.current.go = true }
    }, 95)
  }

  const toggleDeep = async () => {
    const nextState = !deep
    setDeep(nextState)
    if (!userId) return
    if (nextState) await enrollLockin({ userId, entry, keeper, hook })
    else await removeLockin({ userId, entryNumber: num })
  }

  // ---- ember canvas (warm, streak celebration) ----
  const startEmber = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    flare.current.start = null
    const cv = canvasRef.current; if (!cv) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const W = cv.clientWidth || 320, H = cv.clientHeight || 250
    cv.width = W * dpr; cv.height = H * dpr
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const cx = W / 2, cy = H * 0.5, hot = '255,214,138'
    const mk = (init) => ({
      x: cx + (Math.random() - 0.5) * 95,
      y: init ? cy + Math.random() * H * 0.45 : cy + H * 0.30 + Math.random() * 30,
      vy: -(0.25 + Math.random() * 0.6), vx: (Math.random() - 0.5) * 0.25,
      s: Math.random() * 1.7 + 0.5, a: Math.random() * 0.5 + 0.2,
      life: 0.6 + Math.random() * 0.4, hot: Math.random() < 0.4,
    })
    const parts = Array.from({ length: 26 }, () => mk(true))
    let f = 0
    const draw = () => {
      f++; ctx.clearRect(0, 0, W, H)
      const grow = Math.min(1, f / 26)
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 155)
      rg.addColorStop(0, `rgba(${A},${0.20 * grow})`); rg.addColorStop(0.42, `rgba(${A},${0.08 * grow})`); rg.addColorStop(1, `rgba(${A},0)`)
      ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(cx, cy, 155, 0, 7); ctx.fill()
      parts.forEach((p) => {
        p.y += p.vy; p.x += p.vx; p.vx *= 0.99; p.life -= 0.008
        if (p.y < cy - H * 0.42 || p.life <= 0) Object.assign(p, mk(false))
        const al = p.a * Math.max(0, p.life)
        ctx.beginPath(); ctx.fillStyle = p.hot ? `rgba(${hot},${al})` : `rgba(${A},${al})`
        if (p.hot) { ctx.shadowColor = `rgba(${hot},0.8)`; ctx.shadowBlur = 6 }
        ctx.arc(p.x, p.y, p.s, 0, 7); ctx.fill(); ctx.shadowBlur = 0
      })
      if (flare.current.go && flare.current.start == null) flare.current.start = f
      if (flare.current.start != null) {
        const t = (f - flare.current.start) / 42
        if (t < 1) { const r = 20 + t * 130; ctx.beginPath(); ctx.strokeStyle = `rgba(${hot},${0.5 * (1 - t)})`; ctx.lineWidth = 2; ctx.arc(cx, cy, r, 0, 7); ctx.stroke() }
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
  }, [streak])

  const countdown = (() => {
    const d = new Date(now || Date.now())
    const t = new Date(d); t.setHours(8, 0, 0, 0); if (t.getTime() <= d.getTime()) t.setDate(t.getDate() + 1)
    let s = Math.max(0, Math.floor((t.getTime() - d.getTime()) / 1000))
    const h = Math.floor(s / 3600); s %= 3600; const m = Math.floor(s / 60); s %= 60
    const p = (n) => String(n).padStart(2, '0')
    return `${p(h)}h ${p(m)}m ${p(s)}s`
  })()

  const gate = (n, extra = {}) => ({ opacity: rv >= n ? 1 : 0, transform: rv >= n ? 'translateY(0)' : 'translateY(14px)', transition: 'opacity .6s ease, transform .7s cubic-bezier(.2,.7,.2,1)', ...extra })

  const overlay = (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000, overflow: 'hidden', fontFamily: "'DM Sans',sans-serif",
      background: 'radial-gradient(120% 55% at 50% 4%, #1c2233 0%, #121a26 40%, #0b1118 100%)',
      paddingTop: 'env(safe-area-inset-top, 0px)',
    }}>
      <style>{`@keyframes rmWarmDrift{0%{transform:translate(2%,-1%) scale(1)}50%{transform:translate(-2%,2%) scale(1.05)}100%{transform:translate(2%,-1%) scale(1)}}@keyframes rmDrift{0%{transform:translate(-3%,-2%) scale(1)}50%{transform:translate(3%,2%) scale(1.06)}100%{transform:translate(-3%,-2%) scale(1)}}@keyframes rmTodayPulse{0%,100%{box-shadow:0 0 0 0 rgba(224,169,61,0.55)}50%{box-shadow:0 0 0 5px rgba(224,169,61,0)}}`}</style>

      {/* ambient warm (top) + cool (bottom) */}
      <div style={{ position: 'absolute', left: '-20%', top: '-22%', width: '140%', height: '62%', pointerEvents: 'none', background: `radial-gradient(50% 60% at 50% 40%, rgba(${A},${rv >= 1 ? 0.24 : 0.05}), transparent 66%)`, filter: 'blur(10px)', animation: 'rmWarmDrift 15s ease-in-out infinite', transition: 'background 1.1s ease' }} />
      <div style={{ position: 'absolute', left: '-25%', bottom: '-26%', width: '150%', height: '56%', pointerEvents: 'none', background: `radial-gradient(55% 70% at 50% 100%, rgba(${G},${rv >= 4 ? 0.20 : 0.05}), transparent 68%)`, filter: 'blur(10px)', animation: 'rmDrift 17s ease-in-out infinite', transition: 'background 1.1s ease' }} />

      {/* ember canvas — kept out of the reveal subtree (its RAF blocks sibling opacity commits) */}
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)', width: 320, height: 250, pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px 26px 0', minHeight: 0, overflowY: 'auto' }}>

          {/* STREAK HERO */}
          <div style={{ position: 'relative', flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 26 }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '0.34em', color: `rgba(${A},0.95)`, marginBottom: 6, opacity: rv >= 1 ? 1 : 0 }}>STREAK EXTENDED</div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <span style={{ fontSize: 96, fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.05em', color: '#fff7e8', textShadow: `0 4px 40px rgba(${A},0.55), 0 0 18px rgba(${A},0.4)`, transform: count >= streak ? 'scale(1)' : 'scale(0.96)', transition: 'transform .3s cubic-bezier(.2,1.4,.4,1)' }}>{count}</span>
              <span style={{ fontSize: 20, fontWeight: 600, color: `rgba(${A},0.85)`, marginTop: 12, letterSpacing: '-0.01em' }}>days</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
              {Array.from({ length: goal }, (_, i) => {
                const filled = i < streakInWeek, today = i === streakInWeek - 1, goalDot = i === goal - 1
                const shown = rv >= 2
                return (
                  <div key={i} style={{
                    width: today ? 13 : 9, height: today ? 13 : 9, borderRadius: '50%', flex: 'none',
                    transition: `all .5s cubic-bezier(.2,.7,.2,1) ${i * 0.05}s`, transform: shown ? 'scale(1)' : 'scale(0)',
                    background: filled ? (today ? 'radial-gradient(circle at 35% 30%, #ffd98a, #E0A93D)' : `rgba(${A},0.9)`) : 'transparent',
                    border: filled ? 'none' : `1px dashed rgba(232,238,245,${goalDot ? 0.4 : 0.2})`,
                    boxShadow: filled ? `0 0 ${today ? 12 : 7}px rgba(${A},${today ? 0.8 : 0.45})` : 'none',
                    animation: today && shown ? 'rmTodayPulse 2.4s ease-out 0.6s infinite' : 'none',
                  }} />
                )
              })}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(232,238,245,0.6)', marginTop: 16, opacity: rv >= 2 ? 1 : 0 }}>{milestone}</div>
          </div>

          {/* LOCKED IN CHIP */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 26, padding: '12px 15px', borderRadius: 13, background: `rgba(${G},0.07)`, border: `1px solid rgba(${G},0.24)`, ...gate(3) }}>
            <span style={{ width: 20, height: 20, flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#06140c', background: 'radial-gradient(circle at 35% 30%, #7dffba, #3DE88A)', boxShadow: `0 0 12px rgba(${G},0.55)` }}>✓</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(241,246,251,0.92)' }}>{entry.concept}</span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.14em', color: `rgba(${G},0.85)`, marginLeft: 'auto' }}>FILED FOR LIFE</span>
          </div>

          <div style={{ flex: 1, minHeight: 8 }} />

          {/* NEXT DROP */}
          {next && next !== 'none' && (
            <div style={{ padding: 18, borderRadius: 18, background: 'linear-gradient(165deg, rgba(30,44,56,0.85), rgba(18,28,38,0.9))', border: `1px solid rgba(${G},0.22)`, boxShadow: `0 20px 50px -24px rgba(0,0,0,0.8), 0 0 40px -18px rgba(${G},0.4)`, ...gate(4) }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.26em', color: '#3DE88A' }}>TOMORROW'S DROP</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.4)' }}>DAY {String(next.num).padStart(2, '0')}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.18, letterSpacing: '-0.02em', color: '#eef3f9' }}>{next.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: 'rgba(232,238,245,0.5)', marginTop: 9 }}>{next.teaser}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ width: 18, height: 18, flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: `rgba(${G},0.9)`, border: `1px solid rgba(${G},0.4)`, background: `rgba(${G},0.08)` }}>●</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '0.06em', color: 'rgba(232,238,245,0.62)' }}>Unlocks in</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, fontWeight: 500, letterSpacing: '0.04em', color: '#eef3f9' }}>{countdown}</span>
              </div>
            </div>
          )}
          {next === 'none' && (
            <div style={{ padding: 18, borderRadius: 18, background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.1)', ...gate(4) }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.26em', color: '#3DE88A', marginBottom: 8 }}>ALL CAUGHT UP</div>
              <div style={{ fontSize: 15, lineHeight: 1.5, color: 'rgba(232,238,245,0.7)' }}>You're at the front of the catalog — fresh drops land soon.</div>
            </div>
          )}

          {/* GO DEEPER — spaced repetition */}
          <button onClick={toggleDeep} style={{
            display: 'flex', alignItems: 'center', gap: 13, width: '100%', appearance: 'none', cursor: 'pointer', textAlign: 'left',
            marginTop: 16, padding: '14px 15px', borderRadius: 14,
            background: deep ? `rgba(${G},0.10)` : 'rgba(255,255,255,0.035)',
            border: deep ? `1px solid rgba(${G},0.5)` : '1px solid rgba(255,255,255,0.1)',
            boxShadow: deep ? `0 0 28px -10px rgba(${G},0.6)` : 'none',
            transition: 'background .3s ease, border-color .3s ease, box-shadow .3s ease', ...gate(5),
          }}>
            <span style={{ width: 34, height: 34, flex: 'none', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: deep ? '#eafff4' : 'rgba(232,238,245,0.6)', background: deep ? `rgba(${G},0.16)` : 'rgba(255,255,255,0.05)', border: deep ? `1px solid rgba(${G},0.4)` : '1px solid rgba(255,255,255,0.09)', transition: 'all .3s ease' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.8 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', color: deep ? '#eafff4' : 'rgba(241,246,251,0.92)', transition: 'color .3s ease' }}>{deep ? 'In your review track' : `Go deeper on ${entry.concept}`}</span>
              <span style={{ fontSize: 11.5, lineHeight: 1.45, color: deep ? `rgba(${G},0.85)` : 'rgba(232,238,245,0.5)', transition: 'color .3s ease' }}>{deep ? "First check in a few days, then spaced out over weeks — that's how it sticks." : 'Add it to spaced review so it resurfaces right before you’d forget.'}</span>
            </div>
            <span style={{ width: 26, height: 26, flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: deep ? 13 : 17, fontWeight: 600, lineHeight: 1, color: deep ? '#06140c' : 'rgba(232,238,245,0.65)', background: deep ? 'radial-gradient(circle at 35% 30%, #7dffba, #3DE88A)' : 'transparent', border: deep ? 'none' : '1px solid rgba(255,255,255,0.22)', boxShadow: deep ? `0 0 12px rgba(${G},0.55)` : 'none', transition: 'all .3s ease' }}>{deep ? '✓' : '+'}</span>
          </button>

          {/* RETURN HOOK */}
          <div style={{ marginTop: 20, paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))', flex: 'none', ...gate(5) }}>
            <button onClick={() => setReminderOn((v) => !v)} style={reminderOn
              ? { width: '100%', appearance: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 17, borderRadius: 15, fontSize: 15, fontWeight: 600, color: '#eafff4', background: `rgba(${G},0.12)`, border: `1px solid rgba(${G},0.5)`, boxShadow: `0 0 30px -10px rgba(${G},0.6)`, fontFamily: "'DM Sans',sans-serif" }
              : { width: '100%', appearance: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 17, borderRadius: 15, border: 'none', fontSize: 16, fontWeight: 600, letterSpacing: '0.01em', color: '#06140c', background: 'linear-gradient(180deg, #6cffb0 0%, #3DE88A 60%, #2fc676 100%)', boxShadow: `0 12px 30px -8px rgba(${G},0.55), inset 0 1px 0 rgba(255,255,255,0.5)`, fontFamily: "'DM Sans',sans-serif" }}>
              <span style={{ fontSize: reminderOn ? 15 : 16, lineHeight: 1 }}>{reminderOn ? '✓' : '🔔'}</span>
              <span>{reminderOn ? "You're set — see you at 8:00 AM" : 'Remind me tomorrow, 8:00 AM'}</span>
            </button>
            <div onClick={onClose} style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'rgba(232,238,245,0.4)', cursor: 'pointer' }}>{reminderOn ? 'Done for today' : 'Done for today'}</div>
          </div>
        </div>
      </div>
    </div>
  )

  return mounted ? createPortal(overlay, document.body) : null
}
