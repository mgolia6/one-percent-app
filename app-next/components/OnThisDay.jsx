'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { categoryColor } from '@/lib/categories'

// "On This Day" — a daily bonus card on the Today tab. Facts come from Wikipedia's
// on-this-day feed via /api/on-this-day (auto-verified, sourced); Claude only writes
// the framing. One shared card per calendar date: the first signed-in viewer of the
// day generates + caches it in `on_this_day`; everyone else reads the cache.

const ACCENT = categoryColor('History') // #E0A93D
const pad = (n) => String(n).padStart(2, '0')
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

export default function OnThisDay() {
  const [card, setCard] = useState(null)
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let alive = true
    const d = new Date()
    const today = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`

    async function load() {
      // 1) Cached card for today?
      const { data: cached } = await supabase.from('on_this_day').select('*').eq('date', today).maybeSingle()
      if (!alive) return
      if (cached) { setCard(cached); setDone(true); return }

      // 2) Generate from the API, then cache it (first viewer of the day).
      try {
        const res = await fetch('/api/on-this-day')
        if (!res.ok) { setDone(true); return }
        const fresh = await res.json()
        if (!alive) return
        if (fresh?.event) {
          setCard(fresh)
          // Best-effort cache; ignore conflicts (another user may have written first).
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

  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{
        background: '#1a2a3a', border: '1px solid rgba(224,169,61,0.22)', borderLeft: `3px solid ${ACCENT}`,
        borderRadius: 12, padding: '16px 18px', marginBottom: 16, cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: ACCENT }}>
          ON THIS DAY · {dateLabel}
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.4)', border: '1px solid rgba(232,238,245,0.14)', borderRadius: 4, padding: '2px 6px' }}>
          BONUS
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
        {card.year != null && (
          <div style={{ fontSize: 22, fontWeight: 700, color: ACCENT, letterSpacing: '-0.02em', flexShrink: 0, lineHeight: 1 }}>
            {card.year < 0 ? `${Math.abs(card.year)} BC` : card.year}
          </div>
        )}
        <div style={{ fontSize: 15, fontWeight: 600, color: '#e8eef5', lineHeight: 1.4 }}>{card.blurb || card.event}</div>
      </div>

      {open && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {card.why_today && (
            <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.75)', lineHeight: 1.65, marginBottom: 12 }}>
              <span style={{ color: ACCENT, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em', marginRight: 8 }}>WHY IT STICKS</span>
              {card.why_today}
            </div>
          )}
          {card.source_url && (
            <a
              href={card.source_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: 'rgba(232,238,245,0.5)', textDecoration: 'none' }}
            >
              ✓ Verified via Wikipedia → {card.source_title}
            </a>
          )}
        </div>
      )}

      {!open && (
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.35)', marginTop: 8 }}>
          TAP FOR WHY IT MATTERS
        </div>
      )}
    </div>
  )
}
