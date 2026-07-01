'use client'

import { useState, useEffect } from 'react'
import { enrollLockin, removeLockin, getLockin } from '@/lib/lockins'

// Reimagined "Lock It In" lesson tab (design handoff, 2026-07). Two states:
//  • Launcher (not completed): "Make it yours" + two choice cards (tutor / quiz)
//  • Completed summary: node score badge, feedback, tutor nudge, make-it-stick,
//    keeper, keep-it-sharp (real enroll), about, revisit.
// Inline tab content (not a full-screen overlay). Accent-themed.

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '')
  return m ? `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}` : '61,232,138'
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export default function LockItInTab({ entry, accent = '#3DE88A', userId, completed, method = 'tutor', score = 3, total = 3, keeper = null, hook = null, onPickTutor, onPickQuiz, onRevisit }) {
  const A = accent
  const rgb = hexToRgb(accent)
  const isTutor = method === 'tutor'
  const num = (entry.entry ?? entry.number)
  const [sharp, setSharp] = useState(false)

  useEffect(() => {
    let ok = true
    if (userId && completed) getLockin({ userId, entryNumber: num }).then((l) => { if (ok && l && l.status !== 'done') setSharp(true) })
    return () => { ok = false }
  }, [userId, num, completed])

  const toggleSharp = async () => {
    const next = !sharp
    setSharp(next)
    if (!userId) return
    if (next) await enrollLockin({ userId, entry, keeper, hook })
    else await removeLockin({ userId, entryNumber: num })
  }

  const dateStr = (() => { const d = new Date(); return `${MONTHS[d.getMonth()]} ${d.getDate()}` })()
  const about = entry.closing || entry.morning?.hook || null

  const wrap = { fontFamily: "'DM Sans',sans-serif", animation: 'liiUp .5s ease both' }

  const keyframes = (
    <style>{`
      @keyframes liiUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      @keyframes liiOrb{0%,100%{box-shadow:0 0 40px -6px rgba(${rgb},0.6), inset 0 2px 4px rgba(255,255,255,0.4)}50%{box-shadow:0 0 58px -2px rgba(${rgb},0.8), inset 0 2px 4px rgba(255,255,255,0.4)}}
      @keyframes liiNode{0%,100%{opacity:0.55}50%{opacity:1}}
    `}</style>
  )

  // ---------------- LAUNCHER ----------------
  if (!completed) {
    const cardBase = {
      width: '100%', appearance: 'none', cursor: 'pointer', display: 'block', padding: 18, borderRadius: 18,
      background: 'linear-gradient(165deg, rgba(30,44,56,0.7), rgba(18,28,38,0.85))', border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 18px 44px -26px rgba(0,0,0,0.8)', transition: 'border-color .2s ease, transform .15s ease',
    }
    return (
      <div style={wrap}>
        {keyframes}
        <div style={{ padding: '4px 2px 12px' }}>
          <div style={{ fontSize: 23, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.24, color: '#f1f6fb' }}>Make it yours<br />before you move on.</div>
          <div style={{ fontSize: 14.5, lineHeight: 1.55, color: 'rgba(232,238,245,0.6)', marginTop: 10 }}>You've read the drop. Now lock it in — pick how you want to cement it.</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
          {/* tutor */}
          <button onClick={onPickTutor} style={{ ...cardBase, border: `1px solid rgba(${rgb},0.32)`, boxShadow: `0 18px 44px -26px rgba(0,0,0,0.8), 0 0 40px -20px rgba(${rgb},0.5)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, flex: 'none', borderRadius: '50%', background: `radial-gradient(circle at 38% 32%, #aaffd2, ${A} 60%, #1f9c5e)`, boxShadow: `0 0 20px rgba(${rgb},0.6), inset 0 1px 2px rgba(255,255,255,0.5)` }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.18em', color: A }}>INTERACTIVE · ~2 MIN</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, letterSpacing: '0.14em', color: '#06140c', background: A, padding: '2px 6px', borderRadius: 4, fontWeight: 500 }}>PICKED MOST</span>
                </div>
                <span style={{ fontSize: 17, fontWeight: 600, color: '#f1f6fb' }}>Talk it through</span>
              </div>
              <span style={{ fontSize: 20, color: 'rgba(232,238,245,0.5)' }}>→</span>
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'rgba(232,238,245,0.6)', marginTop: 12, textAlign: 'left' }}>Explain it in your own words. Your tutor coaches you and helps you keep the one line that matters.</div>
          </button>
          {/* quiz */}
          <button onClick={onPickQuiz} style={cardBase}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, flex: 'none', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: A }} />
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: `rgba(${rgb},0.5)` }} />
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: `rgba(${rgb},0.25)` }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0, textAlign: 'left' }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.18em', color: 'rgba(232,238,245,0.5)' }}>{total} QUESTIONS · ~1 MIN</span>
                <span style={{ fontSize: 17, fontWeight: 600, color: '#f1f6fb' }}>Quick quiz</span>
              </div>
              <span style={{ fontSize: 20, color: 'rgba(232,238,245,0.5)' }}>→</span>
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'rgba(232,238,245,0.6)', marginTop: 12, textAlign: 'left' }}>{total} multiple-choice questions with instant feedback — the fastest check of what stuck.</div>
          </button>
        </div>
        <div style={{ padding: '20px 4px 10px', textAlign: 'center' }}>
          <span style={{ fontSize: 12.5, color: 'rgba(232,238,245,0.4)' }}>Either way takes about a minute — and you can keep it sharp after.</span>
        </div>
      </div>
    )
  }

  // ---------------- COMPLETED SUMMARY ----------------
  const perfect = score >= total
  const feedback = isTutor
    ? 'You explained it, used it, and kept the part that matters.'
    : perfect ? 'Three for three — the fundamentals clearly landed.' : 'Locked in — the fundamentals are taking hold.'

  return (
    <div style={wrap}>
      {keyframes}
      <div style={{ padding: '4px 2px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* node score badge */}
        <div style={{ position: 'relative', width: 156, height: 156, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <svg width="156" height="156" viewBox="0 0 156 156" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="78" cy="78" r="62" fill="none" stroke={`rgba(${rgb},0.16)`} strokeWidth="1.2" />
            <line x1="78" y1="78" x2="131.7" y2="47" stroke={`rgba(${rgb},0.28)`} strokeWidth="1.1" />
            <line x1="78" y1="78" x2="19.7" y2="56.8" stroke={`rgba(${rgb},0.28)`} strokeWidth="1.1" />
            <line x1="78" y1="78" x2="72.6" y2="139.8" stroke={`rgba(${rgb},0.28)`} strokeWidth="1.1" />
            <circle cx="131.7" cy="47" r="4.2" fill="#d6ffe9" style={{ filter: 'drop-shadow(0 0 4px rgba(122,255,186,0.95))', animation: 'liiNode 2.6s ease-in-out infinite' }} />
            <circle cx="19.7" cy="56.8" r="4.2" fill="#d6ffe9" style={{ filter: 'drop-shadow(0 0 4px rgba(122,255,186,0.95))', animation: 'liiNode 2.6s ease-in-out 0.5s infinite' }} />
            <circle cx="72.6" cy="139.8" r="4.2" fill="#d6ffe9" style={{ filter: 'drop-shadow(0 0 4px rgba(122,255,186,0.95))', animation: 'liiNode 2.6s ease-in-out 1s infinite' }} />
          </svg>
          <div style={{ width: 92, height: 92, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', background: `radial-gradient(circle at 38% 32%, #d6ffe9, ${A} 62%, #1f9c5e)`, animation: 'liiOrb 3.4s ease-in-out infinite' }}>
            <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#06140c' }}>{score}/{total}</span>
          </div>
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '0.34em', color: A, marginTop: 16 }}>LOCKED IN · {dateStr}</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.55, color: 'rgba(232,238,245,0.62)', textAlign: 'center', marginTop: 10, maxWidth: 290 }}>{feedback}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 22 }}>
        {/* FROM YOUR TUTOR — ai prompt */}
        {entry.ai_prompt && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: '16px 17px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', flex: 'none', background: `radial-gradient(circle at 38% 32%, #aaffd2, ${A} 60%, #1f9c5e)`, boxShadow: `0 0 12px rgba(${rgb},0.5)` }} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.16em', color: A }}>FROM YOUR TUTOR</span>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(241,246,251,0.82)' }}>{entry.ai_prompt}</div>
          </div>
        )}

        {/* MAKE IT STICK — memory hook */}
        {hook && (
          <div style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: '16px 17px' }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.16em', color: 'rgba(232,238,245,0.5)', marginBottom: 9 }}>MAKE IT STICK</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(241,246,251,0.82)' }}>{hook}</div>
          </div>
        )}

        {/* KEEPER */}
        {keeper && (
          <div style={{ background: `rgba(${rgb},0.07)`, border: `1px solid rgba(${rgb},0.28)`, borderRadius: 16, padding: '16px 17px' }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.16em', color: A, marginBottom: 9 }}>{isTutor ? 'YOUR KEEPER' : 'THE KEEPER'}</div>
            <div style={{ fontSize: 16, lineHeight: 1.5, fontWeight: 500, color: '#eafff4' }}>{keeper}</div>
          </div>
        )}

        {/* KEEP IT SHARP */}
        <button onClick={toggleSharp} style={{
          width: '100%', appearance: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 13, padding: '14px 15px', borderRadius: 14, textAlign: 'left',
          background: sharp ? `rgba(${rgb},0.10)` : 'rgba(255,255,255,0.035)',
          border: sharp ? `1px solid rgba(${rgb},0.5)` : '1px solid rgba(255,255,255,0.1)',
          boxShadow: sharp ? `0 0 28px -10px rgba(${rgb},0.6)` : 'none', transition: 'all .3s ease',
        }}>
          <span style={{ width: 34, height: 34, flex: 'none', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: sharp ? '#eafff4' : 'rgba(232,238,245,0.6)', background: sharp ? `rgba(${rgb},0.16)` : 'rgba(255,255,255,0.05)', border: sharp ? `1px solid rgba(${rgb},0.4)` : '1px solid rgba(255,255,255,0.09)', transition: 'all .3s ease' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.8 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', color: sharp ? '#eafff4' : 'rgba(241,246,251,0.92)', transition: 'color .3s ease' }}>{sharp ? 'Keeping it sharp' : 'Keep it sharp'}</span>
            <span style={{ fontSize: 11.5, lineHeight: 1.45, color: sharp ? `rgba(${rgb},0.85)` : 'rgba(232,238,245,0.5)', transition: 'color .3s ease' }}>{sharp ? 'In your review track — first check in a few days, then spaced out over weeks.' : "Add it to spaced review and we'll resurface it right before you'd forget."}</span>
          </div>
          <span style={{ width: 26, height: 26, flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: sharp ? 13 : 17, fontWeight: 600, lineHeight: 1, color: sharp ? '#06140c' : 'rgba(232,238,245,0.65)', background: sharp ? `radial-gradient(circle at 35% 30%, #7dffba, ${A})` : 'transparent', border: sharp ? 'none' : '1px solid rgba(255,255,255,0.22)', boxShadow: sharp ? `0 0 12px rgba(${rgb},0.5)` : 'none', transition: 'all .3s ease' }}>{sharp ? '✓' : '+'}</span>
        </button>

        {/* ABOUT */}
        {about && (
          <div style={{ padding: '16px 4px 4px' }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.16em', color: 'rgba(232,238,245,0.42)', marginBottom: 9 }}>ABOUT {String(entry.concept || '').toUpperCase()}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.65, color: 'rgba(232,238,245,0.72)' }}>{about}</div>
          </div>
        )}
      </div>

      {onRevisit && (
        <div style={{ padding: '8px 2px 10px' }}>
          <button onClick={onRevisit} style={{ width: '100%', appearance: 'none', cursor: 'pointer', padding: 14, borderRadius: 13, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(232,238,245,0.82)', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600 }}>Revisit the lesson</button>
        </div>
      )}
    </div>
  )
}
