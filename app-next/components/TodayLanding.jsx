'use client'

import { useState, useEffect } from 'react'
import OnThisDay from '@/components/OnThisDay'

// Reimagined "Today" landing (design handoff 5a "Today · v2 blend"). Hero-driven:
// header (favicon + avatar), date + welcome, low-weight streak line, the Today's
// Drop hero, On This Day, On Deck. Accent-themed. Data comes from page.js.

const GOLD = '#E0A93D', GOLD_RGB = '224,169,61'
const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '')
  return m ? `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}` : '61,232,138'
}

// The product mark (favicon): concentric accent rings + glowing orb.
function Mark({ size = 30, rgb, accent }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <defs>
        <radialGradient id="tlOrb" cx="42%" cy="38%" r="62%"><stop offset="0%" stopColor="#eafff5" /><stop offset="42%" stopColor={accent} /><stop offset="100%" stopColor="#178a4f" /></radialGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="none" stroke={`rgba(${rgb},0.13)`} strokeWidth="1.1" />
      <circle cx="32" cy="32" r="25.9" fill="none" stroke={`rgba(${rgb},0.26)`} strokeWidth="1.1" />
      <circle cx="32" cy="32" r="20.8" fill="none" stroke={`rgba(${rgb},0.42)`} strokeWidth="1.1" />
      <circle cx="32" cy="32" r="15.7" fill="none" stroke={`rgba(${rgb},0.62)`} strokeWidth="1.1" />
      <circle cx="32" cy="32" r="9.6" fill="url(#tlOrb)" />
      <circle cx="29.4" cy="29.1" r="4.5" fill="rgba(255,255,255,0.7)" />
    </svg>
  )
}

export default function TodayLanding({ firstName, streak = 0, completedCount = 0, dueCount = 0, todayEntry, onDeckEntry, todayCompleted, accent = '#3DE88A', onBegin }) {
  const A = accent
  const rgb = hexToRgb(accent)
  const [teaser, setTeaser] = useState('')
  const [now, setNow] = useState(0)
  const name = firstName && firstName !== 'there' ? firstName : ''

  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
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

  const d = new Date(now || Date.now())
  const hr = d.getHours()
  const partOfDay = hr < 12 ? 'morning' : hr < 18 ? 'afternoon' : 'evening'
  const dateLine = `${DAYS[d.getDay()]} · ${MONTHS[d.getMonth()]} ${d.getDate()}`
  const streakInWeek = (streak % 7) || (streak > 0 ? 7 : 0)

  const countdown = (() => {
    const t = new Date(d); t.setHours(8, 0, 0, 0); if (t.getTime() <= d.getTime()) t.setDate(t.getDate() + 1)
    let s = Math.max(0, Math.floor((t.getTime() - d.getTime()) / 1000))
    const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60)
    return `${h}H ${String(m).padStart(2, '0')}M`
  })()

  const rise = (i) => ({ animation: 'tlRise .6s cubic-bezier(.2,.7,.2,1) both', animationDelay: `${(0.12 + i * 0.06).toFixed(2)}s` })
  const primaryBtn = {
    width: '100%', appearance: 'none', cursor: 'pointer', padding: 16, borderRadius: 14, border: 'none', marginTop: 18,
    fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, letterSpacing: '0.05em', color: '#06140c',
    background: `linear-gradient(180deg, #6cffb0, ${A} 60%, #2fc676)`, boxShadow: `0 12px 30px -8px rgba(${rgb},0.5), inset 0 1px 0 rgba(255,255,255,0.5)`,
  }
  const parts = ['CONCEPT', 'IN THE WILD', 'LOCK IT IN']

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", padding: '6px 22px 40px', position: 'relative', zIndex: 2 }}>
      <style>{`
        @keyframes tlRise{from{opacity:0;transform:translateY(13px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tlPulse{0%,100%{opacity:0.5}50%{opacity:1}}
        @keyframes tlGlow{0%{transform:translate(-4%,-3%) scale(1)}50%{transform:translate(4%,3%) scale(1.08)}100%{transform:translate(-4%,-3%) scale(1)}}
      `}</style>

      {/* header */}
      <div style={{ ...rise(0), display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 2px 6px' }}>
        <Mark size={30} rgb={rgb} accent={A} />
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'rgba(241,246,251,0.85)' }}>{(name || 'M')[0].toUpperCase()}</div>
      </div>

      {/* date + welcome */}
      <div style={{ ...rise(1), marginTop: 14 }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.2em', color: 'rgba(232,238,245,0.4)' }}>{dateLine}</div>
        <div style={{ fontSize: 23, fontWeight: 600, color: '#f6fbff', marginTop: 6 }}>Good {partOfDay}{name ? `, ${name}` : ''}.</div>
      </div>

      {/* streak line */}
      <div style={{ ...rise(2), display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
        <span style={{ fontSize: 13, color: GOLD }}>🔥</span>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: '#fdf1dc' }}>{streak}-day streak</span>
        <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(232,238,245,0.3)' }} />
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, color: 'rgba(232,238,245,0.4)' }}>{completedCount} in the vault</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 5, alignItems: 'center' }}>
          {Array.from({ length: 7 }, (_, i) => {
            const filled = i < streakInWeek, today = i === streakInWeek - 1, last = i === 6
            return <div key={i} style={{ width: today ? 8 : 6, height: today ? 8 : 6, borderRadius: '50%', background: filled ? GOLD : 'transparent', border: filled ? 'none' : `1px dashed rgba(232,238,245,${last ? 0.35 : 0.2})`, boxShadow: today ? `0 0 7px rgba(${GOLD_RGB},0.7)` : 'none' }} />
          })}
        </div>
      </div>

      {/* HERO — Today's Drop */}
      {todayEntry && (
        <div style={{ ...rise(3), marginTop: 24 }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: '0.22em', color: A, marginBottom: 10 }}>TODAY'S DROP · DAY {String(todayEntry.entry).padStart(2, '0')}</div>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, background: `linear-gradient(165deg, rgba(${rgb},0.1), rgba(18,28,38,0.72))`, border: `1px solid rgba(${rgb},0.28)`, boxShadow: `0 24px 54px -26px rgba(0,0,0,0.85), 0 0 44px -20px rgba(${rgb},0.38)`, padding: '20px 20px 22px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: A }} />
            <div style={{ position: 'absolute', top: '-30%', left: '20%', width: '80%', height: '90%', pointerEvents: 'none', background: `radial-gradient(50% 50% at 50% 50%, rgba(${rgb},0.16), transparent 70%)`, filter: 'blur(12px)', animation: 'tlGlow 16s ease-in-out infinite' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.5)' }}>{String(todayEntry.category || '').toUpperCase()} · {todayEntry.editionId}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.12em', color: A, animation: 'tlPulse 2.4s ease-in-out infinite' }}>● {todayCompleted ? 'DONE' : 'UNLOCKED'}</span>
              </div>
              <div style={{ fontSize: 35, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#f6fbff' }}>{todayEntry.concept}</div>
              {teaser && <div style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.5, color: 'rgba(232,238,245,0.6)', marginTop: 10 }}>{teaser}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                {parts.map((p, i) => (
                  <div key={i} style={{ flex: 1 }}>
                    <div style={{ height: 3, borderRadius: 2, background: todayCompleted ? A : 'rgba(255,255,255,0.12)' }} />
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 7.5, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.4)', marginTop: 7 }}>{p}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => onBegin?.(todayEntry.entry)} style={primaryBtn}>{todayCompleted ? 'REVISIT →' : 'BEGIN →'}</button>
            </div>
          </div>
        </div>
      )}

      {/* On This Day */}
      <div style={{ ...rise(4), marginTop: 22 }}>
        <OnThisDay />
      </div>

      {/* On Deck · Tomorrow */}
      {onDeckEntry && (
        <div style={{ ...rise(5), marginTop: 16, borderRadius: 16, background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.09)', padding: '16px 17px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{ width: 42, height: 42, flex: 'none', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'rgba(232,238,245,0.6)' }}>{String(onDeckEntry.entry).padStart(2, '0')}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#f1f6fb' }}>{onDeckEntry.concept}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.4)', marginTop: 4 }}>{String(onDeckEntry.category || '').toUpperCase()} · UNLOCKS IN {countdown}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(232,238,245,0.35)" strokeWidth="1.7" strokeLinecap="round"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)', fontSize: 12.5, lineHeight: 1.5, color: 'rgba(232,238,245,0.5)' }}>On deck for tomorrow — it builds directly on today.</div>
        </div>
      )}
    </div>
  )
}
