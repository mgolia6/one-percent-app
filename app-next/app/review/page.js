'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { categoryColor } from '@/lib/categories'
import { getActiveLockins, reviewLockin, BOX_INTERVALS_DAYS, TOP_BOX } from '@/lib/lockins'

const BG = '#0e141c'
const CARD = '#1a2a3a'

function fmtDue(due) {
  const ms = new Date(due).getTime() - Date.now()
  if (ms <= 0) return 'due now'
  const days = Math.ceil(ms / 86400000)
  if (days <= 1) return 'tomorrow'
  return `in ${days} days`
}

export default function ReviewPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [active, setActive] = useState([]) // all active lock-ins
  const [queue, setQueue] = useState([]) // due ones to work through
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [entryMeta, setEntryMeta] = useState(null) // fallback reveal from entry JSON
  const [reviewedCount, setReviewedCount] = useState(0)
  const [graduatedCount, setGraduatedCount] = useState(0)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled) return
      if (!session) { router.push('/login'); return }
      setUserId(session.user.id)
      const all = await getActiveLockins(session.user.id)
      if (cancelled) return
      setActive(all)
      const now = Date.now()
      setQueue(all.filter(l => new Date(l.due_at).getTime() <= now))
      setLoading(false)
    }
    init()
    return () => { cancelled = true }
  }, [router])

  const current = queue[idx]

  // Pull entry JSON for the reveal fallback (quiz-mode enrollments have no keeper)
  // and to offer a "revisit the full lesson" link.
  useEffect(() => {
    setRevealed(false)
    setEntryMeta(null)
    if (!current) return
    let alive = true
    const num = String(current.entry_number).padStart(3, '0')
    fetch(`/entries/${num}.json`).then(r => r.ok ? r.json() : null).then(d => {
      if (alive) setEntryMeta(d)
    }).catch(() => {})
    return () => { alive = false }
  }, [current])

  const grade = async (remembered) => {
    if (!current || busy) return
    setBusy(true)
    const { graduated } = await reviewLockin(current, remembered)
    setReviewedCount(c => c + 1)
    if (graduated) setGraduatedCount(c => c + 1)
    setBusy(false)
    setIdx(i => i + 1)
  }

  const upcoming = active.filter(l => new Date(l.due_at).getTime() > Date.now())
                         .sort((a, b) => new Date(a.due_at) - new Date(b.due_at))

  if (loading) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.2em', fontFamily: "'DM Mono', monospace" }}>LOADING…</div>
    </div>
  )

  const accent = current ? categoryColor(current.category) : '#47FFE8'
  const done = idx >= queue.length

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'DM Sans', sans-serif", color: '#e8eef5' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: BG, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'rgba(232,238,245,0.6)', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace", padding: 0 }}>← LIBRARY</button>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: 'rgba(232,238,245,0.5)' }}>KEEP IT SHARP</div>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '28px 22px 80px' }}>

        {/* No lock-ins at all */}
        {active.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 12px' }}>
            <div style={{ fontSize: 34, marginBottom: 16 }}>📌</div>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>Nothing to review yet</div>
            <div style={{ fontSize: 14, color: 'rgba(232,238,245,0.6)', lineHeight: 1.7, maxWidth: 360, margin: '0 auto 28px' }}>
              When a concept really lands, tap <strong style={{ color: '#e8eef5' }}>Keep this one sharp</strong> at the end of a lesson. We'll bring it back here on a spaced schedule so it sticks for good.
            </div>
            <button onClick={() => router.push('/')} style={{ background: '#47FFE8', color: '#06212b', border: 'none', borderRadius: 8, padding: '13px 28px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>GO TO A LESSON →</button>
          </div>
        )}

        {/* Active recall flow */}
        {active.length > 0 && !done && current && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.5)' }}>{idx + 1} OF {queue.length} DUE</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: TOP_BOX + 1 }).map((_, i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i <= current.box ? accent : 'rgba(255,255,255,0.14)' }} />
                ))}
              </div>
            </div>

            <div style={{ background: CARD, border: `1px solid ${accent}33`, borderLeft: `3px solid ${accent}`, borderRadius: 10, padding: '24px 22px' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: accent, marginBottom: 12 }}>{current.category || 'CONCEPT'}</div>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 18 }}>{current.concept || `Entry ${current.entry_number}`}</div>

              {!revealed && (
                <>
                  <div style={{ fontSize: 14, color: 'rgba(232,238,245,0.7)', lineHeight: 1.7, marginBottom: 22 }}>
                    Before you peek — can you still explain this in your own words? Say it out loud, then reveal.
                  </div>
                  <button onClick={() => setRevealed(true)} style={{ width: '100%', background: accent, color: '#06212b', border: 'none', borderRadius: 8, padding: '13px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>REVEAL →</button>
                </>
              )}

              {revealed && (
                <div style={{ animation: 'none' }}>
                  {current.keeper ? (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.45)', marginBottom: 6 }}>YOUR KEEPER</div>
                      <div style={{ fontSize: 16, color: '#e8eef5', lineHeight: 1.6 }}>"{current.keeper}"</div>
                    </div>
                  ) : entryMeta?.morning?.hook ? (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.45)', marginBottom: 6 }}>THE IDEA</div>
                      <div style={{ fontSize: 16, color: '#e8eef5', lineHeight: 1.6 }}>{entryMeta.morning.hook}</div>
                    </div>
                  ) : null}

                  {(current.hook || entryMeta?.midday?.reframe) && (
                    <div style={{ background: `${accent}0d`, border: `1px solid ${accent}33`, borderRadius: 8, padding: '12px 14px', marginBottom: 18 }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em', color: accent, marginBottom: 6 }}>{current.hook ? '🧠 MEMORY HOOK' : 'IN THE WILD'}</div>
                      <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.85)', lineHeight: 1.6 }}>{current.hook || entryMeta.midday.reframe}</div>
                    </div>
                  )}

                  <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.6)', marginBottom: 12 }}>How clean was the recall?</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => grade(false)} disabled={busy} style={{ flex: 1, background: 'none', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(232,238,245,0.8)', borderRadius: 8, padding: '13px', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', cursor: busy ? 'default' : 'pointer', fontFamily: "'DM Mono', monospace" }}>STILL FUZZY</button>
                    <button onClick={() => grade(true)} disabled={busy} style={{ flex: 1, background: accent, border: 'none', color: '#06212b', borderRadius: 8, padding: '13px', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', cursor: busy ? 'default' : 'pointer', fontFamily: "'DM Mono', monospace" }}>GOT IT</button>
                  </div>

                  <button onClick={() => router.push(`/entry/${parseInt(current.entry_number)}`)} style={{ width: '100%', marginTop: 12, background: 'none', border: 'none', color: 'rgba(232,238,245,0.45)', fontSize: 11, cursor: 'pointer', fontFamily: "'DM Mono', monospace", letterSpacing: '0.06em' }}>REVISIT THE FULL LESSON →</button>
                </div>
              )}
            </div>

            <div style={{ fontSize: 12, color: 'rgba(232,238,245,0.4)', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
              Recall it cleanly and the gap before the next review grows. Fumble it and it comes back sooner.
            </div>
          </div>
        )}

        {/* Finished the due queue (or none were due) */}
        {active.length > 0 && done && (
          <div>
            <div style={{ textAlign: 'center', padding: '24px 12px 8px' }}>
              <div style={{ fontSize: 30, marginBottom: 14 }}>{queue.length > 0 ? '✓' : '🗓️'}</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                {queue.length === 0 ? 'Nothing due right now' : reviewedCount > 0 ? `Reviewed ${reviewedCount}.` : 'All caught up.'}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(232,238,245,0.6)', lineHeight: 1.7, maxWidth: 360, margin: '0 auto' }}>
                {graduatedCount > 0 && <span style={{ color: '#47FFE8' }}>{graduatedCount} locked in for good. </span>}
                You're keeping {active.length - graduatedCount} concept{active.length - graduatedCount !== 1 ? 's' : ''} sharp. We'll nudge you when the next one is due.
              </div>
            </div>

            {upcoming.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.4)', marginBottom: 12 }}>COMING UP</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {upcoming.slice(0, 8).map(l => {
                    const c = categoryColor(l.category)
                    return (
                      <div key={l.id} style={{ background: CARD, border: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${c}`, borderRadius: 6, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#e8eef5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.concept || `Entry ${l.entry_number}`}</div>
                          <div style={{ fontSize: 11, color: c, marginTop: 2 }}>{l.category}</div>
                        </div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(232,238,245,0.5)', flexShrink: 0, letterSpacing: '0.04em' }}>{fmtDue(l.due_at)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <button onClick={() => router.push('/')} style={{ width: '100%', marginTop: 28, background: 'none', border: '1px solid rgba(255,255,255,0.16)', color: 'rgba(232,238,245,0.8)', borderRadius: 8, padding: '13px', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>BACK TO LIBRARY</button>
          </div>
        )}
      </div>
    </div>
  )
}
