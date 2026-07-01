'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// "On This Day" — a daily bonus card on the Today tab. Facts come from Wikipedia's
// on-this-day feed via /api/on-this-day (auto-verified, sourced); Claude only writes
// the framing. One shared card per calendar date: the first signed-in viewer of the
// day generates + caches it in `on_this_day`; everyone else reads the cache.

const PURPLE = '#C847FF', P_RGB = '200,71,255'
const pad = (n) => String(n).padStart(2, '0')
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export default function OnThisDay() {
  const router = useRouter()
  const [card, setCard] = useState(null)
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let alive = true
    const d = new Date()
    const today = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`

    async function load() {
      const { data: cached } = await supabase.from('on_this_day').select('*').eq('date', today).maybeSingle()
      if (!alive) return
      if (cached) { setCard(cached); setDone(true); return }
      try {
        const res = await fetch('/api/on-this-day')
        if (!res.ok) { setDone(true); return }
        const fresh = await res.json()
        if (!alive) return
        if (fresh?.event) {
          setCard(fresh)
          supabase.from('on_this_day').upsert(fresh, { onConflict: 'date', ignoreDuplicates: true }).then(() => {})
        }
      } catch (_) { /* hide on failure */ }
      if (alive) setDone(true)
    }
    load()
    return () => { alive = false }
  }, [])

  if (!card) return null

  const d = new Date(card.date + 'T12:00:00Z')
  const dateLabel = `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`
  const yearLabel = card.year != null ? (card.year < 0 ? `${Math.abs(card.year)} BC` : card.year) : null

  return (
    <div onClick={() => setOpen(o => !o)} style={{ borderRadius: 14, background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)', padding: '14px 15px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 38, height: 38, flex: 'none', borderRadius: 11, background: `rgba(${P_RGB},0.12)`, border: `1px solid rgba(${P_RGB},0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PURPLE} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v4l2.5 2" /></svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: PURPLE }}>ON THIS DAY · {dateLabel}</div>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: '#f1f6fb', marginTop: 4, lineHeight: 1.35 }}>
            {yearLabel != null && <span style={{ color: PURPLE }}>{yearLabel} · </span>}{card.blurb || card.event}
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(232,238,245,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s ease' }}><polyline points="6 9 12 15 18 9" /></svg>
      </div>

      {open && (
        <div style={{ marginTop: 12, paddingLeft: 50 }}>
          {card.why_today && (
            <div style={{ paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.16em', color: PURPLE, marginBottom: 8 }}>WHY THIS STICKS</div>
              <div style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(232,238,245,0.72)' }}>{card.why_today}</div>
            </div>
          )}
          {card.source_url && (
            <a href={card.source_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: 9.5, letterSpacing: '0.06em', color: 'rgba(232,238,245,0.45)', textDecoration: 'none', marginTop: 10 }}>✓ Verified via Wikipedia → {card.source_title}</a>
          )}
          <button onClick={e => { e.stopPropagation(); router.push('/on-this-day') }} style={{ background: 'none', border: 'none', padding: 0, marginTop: 10, cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 9.5, letterSpacing: '0.1em', fontWeight: 600, color: PURPLE }}>VIEW THE ARCHIVE →</button>
        </div>
      )}
    </div>
  )
}
