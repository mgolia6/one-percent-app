'use client'

import { useState, useEffect, useRef } from 'react'

// Returning-user boot — "Ignition" (design handoff 3c). Replaces the typewriter
// WelcomeOverlay. Greeting + name, the product-mark "Begin" control that charges
// up on load, Today's Drop teaser. Tapping the mark fires a neon ignite flash,
// then dismisses to the Today page. Accent-themed.

const GOLD = '#E0A93D', GOLD_RGB = '224,169,61'
const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '')
  return m ? `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}` : '61,232,138'
}

export default function IgnitionBoot({ firstName, streak = 0, todayEntry, accent = '#3DE88A', onDismiss }) {
  const A = accent
  const rgb = hexToRgb(accent)
  const name = firstName && firstName !== 'there' ? firstName : ''
  const [teaser, setTeaser] = useState('')
  const [igniting, setIgniting] = useState(false)
  const [now, setNow] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    setNow(Date.now())
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    if (!todayEntry?.entry) return
    let ok = true
    fetch(`/entries/${String(todayEntry.entry).padStart(3, '0')}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((e) => { if (ok && e?.morning?.hook) setTeaser(e.morning.hook) })
      .catch(() => {})
    return () => { ok = false }
  }, [todayEntry?.entry])

  const ignite = () => {
    if (igniting || done.current) return
    setIgniting(true)
    done.current = true
    setTimeout(() => onDismiss?.(), 1150)
  }

  const d = new Date(now || Date.now())
  let hr = d.getHours(); const ampm = hr >= 12 ? 'AM' : 'AM' // display like design; keep simple
  const h12 = ((hr + 11) % 12) + 1
  const timeStr = `${DAYS[d.getDay()]} · ${h12}:${String(d.getMinutes()).padStart(2, '0')} ${d.getHours() < 12 ? 'AM' : 'PM'}`

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400, overflow: 'hidden', fontFamily: "'DM Sans',sans-serif",
      background: 'radial-gradient(120% 55% at 50% 44%, #10201a 0%, #0b1511 46%, #080c0a 100%)',
      display: 'flex', flexDirection: 'column', padding: 'calc(52px + env(safe-area-inset-top, 0px)) 34px calc(40px + env(safe-area-inset-bottom, 0px))',
    }}>
      <style>{`
        @keyframes ibRise{from{opacity:0;transform:translateY(13px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ibCharge{from{stroke-dashoffset:194.78}to{stroke-dashoffset:0}}
        @keyframes ibGlow{0%,100%{opacity:0.5;transform:scale(0.96)}50%{opacity:0.85;transform:scale(1.04)}}
        @keyframes ibPulse{0%,100%{opacity:0.4}50%{opacity:0.85}}
        @keyframes ibIgnite{0%{transform:translate(-50%,-50%) scale(.3);opacity:.9}20%{transform:translate(-50%,-50%) scale(1.55);opacity:1}44%{transform:translate(-50%,-50%) scale(1.66);opacity:1}100%{transform:translate(-118px,-315px) scale(.05);opacity:0}}
      `}</style>

      {/* status strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'ibRise .6s cubic-bezier(.2,.7,.2,1) both' }}>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.16em', color: 'rgba(232,238,245,0.32)' }}>{timeStr}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 11px', borderRadius: 100, background: `rgba(${GOLD_RGB},0.1)`, border: `1px solid rgba(${GOLD_RGB},0.3)` }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, boxShadow: `0 0 8px rgba(${GOLD_RGB},0.9)` }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.1em', color: GOLD }}>{streak} DAY STREAK</span>
        </div>
      </div>

      {/* greeting */}
      <div style={{ marginTop: 40, animation: 'ibRise .6s cubic-bezier(.2,.7,.2,1) .1s both' }}>
        <div style={{ fontSize: 17, fontWeight: 300, fontStyle: 'italic', color: 'rgba(232,238,245,0.55)' }}>Welcome back,</div>
        <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.03em', color: '#f6fbff', marginTop: 4 }}>{name || 'there'}.</div>
      </div>

      {/* the Begin mark */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={ignite} style={{ position: 'relative', width: 200, height: 200, appearance: 'none', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
          <div style={{ position: 'absolute', inset: '10%', borderRadius: '50%', background: `radial-gradient(circle, rgba(${rgb},0.35), transparent 68%)`, filter: 'blur(18px)', animation: 'ibGlow 3.6s ease-in-out infinite' }} />
          <svg width="200" height="200" viewBox="0 0 64 64" style={{ position: 'relative' }}>
            <defs>
              <radialGradient id="ibOrb" cx="42%" cy="38%" r="62%"><stop offset="0%" stopColor="#eafff5" /><stop offset="42%" stopColor={A} /><stop offset="100%" stopColor="#178a4f" /></radialGradient>
            </defs>
            <circle cx="32" cy="32" r="31" fill="none" stroke={`rgba(${rgb},0.13)`} strokeWidth="1.1" />
            <circle cx="32" cy="32" r="25.9" fill="none" stroke={`rgba(${rgb},0.26)`} strokeWidth="1.1" />
            <circle cx="32" cy="32" r="20.8" fill="none" stroke={`rgba(${rgb},0.42)`} strokeWidth="1.1" />
            <circle cx="32" cy="32" r="15.7" fill="none" stroke={`rgba(${rgb},0.62)`} strokeWidth="1.1" />
            {/* charging sweep */}
            <circle cx="32" cy="32" r="31" fill="none" stroke={A} strokeWidth="2" strokeLinecap="round" strokeDasharray="194.78" transform="rotate(-90 32 32)" style={{ animation: 'ibCharge 1.3s cubic-bezier(.2,.7,.2,1) .45s both', filter: `drop-shadow(0 0 4px rgba(${rgb},0.9))` }} />
            <circle cx="32" cy="32" r="9.6" fill="url(#ibOrb)" />
            <circle cx="29.4" cy="29.1" r="4.5" fill="rgba(255,255,255,0.7)" />
          </svg>
        </button>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, letterSpacing: '0.2em', color: 'rgba(232,238,245,0.4)', marginTop: 26, animation: 'ibPulse 2.6s ease-in-out infinite' }}>TAP TO BEGIN</div>
      </div>

      {/* Today's Drop teaser */}
      {todayEntry && (
        <div style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)', animation: 'ibRise .6s cubic-bezier(.2,.7,.2,1) .3s both' }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.2em', color: A }}>TODAY'S DROP · DAY {String(todayEntry.entry).padStart(2, '0')}</div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#f6fbff', marginTop: 8 }}>{todayEntry.concept}</div>
          {teaser && <div style={{ fontSize: 13.5, fontWeight: 300, lineHeight: 1.5, color: 'rgba(232,238,245,0.5)', marginTop: 8 }}>{teaser}</div>}
        </div>
      )}

      {/* ignite flash */}
      {igniting && (
        <div style={{
          position: 'absolute', left: '50%', top: '46%', width: 620, height: 620, borderRadius: '50%', pointerEvents: 'none',
          mixBlendMode: 'screen', background: 'radial-gradient(circle, #ffffff 0%, #c9ffe4 24%, #4dffb0 46%, transparent 70%)',
          animation: 'ibIgnite 1.15s cubic-bezier(.45,.03,.25,1) forwards',
        }} />
      )}
    </div>
  )
}
