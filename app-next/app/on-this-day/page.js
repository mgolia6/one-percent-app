'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { categoryColor } from '@/lib/categories'

// "On This Day" archive — the growing collection of daily bonus cards.
// Reads every cached row from `on_this_day` (newest first). Admin-gated for now,
// matching the home card; un-gate both together when the feature launches.

const BG = '#0e141c'
const CARD = '#1a2a3a'
const ACCENT = categoryColor('History') // #E0A93D
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function fmtDate(iso) {
  const d = new Date(iso + 'T12:00:00Z')
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

function ArchiveCard({ row }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{
        background: CARD, border: '1px solid rgba(224,169,61,0.18)', borderLeft: `3px solid ${ACCENT}`,
        borderRadius: 10, padding: '16px 18px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', color: ACCENT, marginBottom: 8 }}>
        {fmtDate(row.date)}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        {row.year != null && (
          <div style={{ fontSize: 20, fontWeight: 700, color: ACCENT, letterSpacing: '-0.02em', flexShrink: 0, lineHeight: 1 }}>
            {row.year < 0 ? `${Math.abs(row.year)} BC` : row.year}
          </div>
        )}
        <div style={{ fontSize: 15, fontWeight: 600, color: '#e8eef5', lineHeight: 1.4 }}>{row.blurb || row.event}</div>
      </div>
      {open && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {row.why_today && (
            <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.75)', lineHeight: 1.65, marginBottom: 12 }}>
              <span style={{ color: ACCENT, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em', marginRight: 8 }}>WHY IT STICKS</span>
              {row.why_today}
            </div>
          )}
          {row.source_url && (
            <a href={row.source_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: 'rgba(232,238,245,0.5)', textDecoration: 'none' }}>
              ✓ Verified via Wikipedia → {row.source_title}
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default function OnThisDayArchive() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [backfill, setBackfill] = useState({ running: false, msg: '' })

  useEffect(() => {
    let cancelled = false
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled) return
      if (!session) { router.push('/login'); return }
      // Admin-gated while the feature is in live testing.
      const { data: prof } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
      if (cancelled) return
      if (!prof?.is_admin) { router.push('/'); return }

      const { data } = await supabase.from('on_this_day').select('*').order('date', { ascending: false })
      if (cancelled) return
      setRows(data || [])
      setLoading(false)
    }
    init()
    return () => { cancelled = true }
  }, [router])

  // Admin backfill: generate + save any missing days in the last `days`.
  // The route's ?date= calls generate but don't persist, so we upsert from the
  // admin session here (RLS allows authenticated inserts).
  async function runBackfill(days) {
    if (backfill.running) return
    const pad = n => String(n).padStart(2, '0')
    const have = new Set(rows.map(r => r.date))
    const now = new Date()
    let added = 0, skipped = 0, failed = 0
    setBackfill({ running: true, msg: 'Starting…' })
    for (let i = 0; i <= days; i++) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i))
      const iso = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
      if (have.has(iso)) { skipped++; continue }
      setBackfill({ running: true, msg: `Filling ${iso}… (${added} added)` })
      try {
        const res = await fetch(`/api/on-this-day?date=${iso}`)
        if (!res.ok) { failed++; continue }
        const card = await res.json()
        if (!card?.event) { failed++; continue }
        const { error } = await supabase.from('on_this_day').upsert(card, { onConflict: 'date', ignoreDuplicates: true })
        if (error) { failed++; continue }
        added++; have.add(iso)
      } catch (_) { failed++ }
    }
    const { data } = await supabase.from('on_this_day').select('*').order('date', { ascending: false })
    setRows(data || [])
    setBackfill({ running: false, msg: `Done — ${added} added · ${skipped} already had · ${failed} skipped.` })
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.2em', fontFamily: "'DM Mono', monospace" }}>LOADING…</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'DM Sans', sans-serif", color: '#e8eef5' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: BG, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'rgba(232,238,245,0.6)', letterSpacing: '0.08em', fontFamily: "'DM Mono', monospace", padding: 0 }}>← LIBRARY</button>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: ACCENT }}>ON THIS DAY</div>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '28px 22px 80px' }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>The archive</div>
        <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.55)', lineHeight: 1.6, marginBottom: 18 }}>
          Every "On This Day" card, collected. {rows.length} {rows.length === 1 ? 'entry' : 'entries'} so far — one more lands each day.
        </div>

        {/* Admin backfill — generate + save missing past days */}
        <div style={{ background: CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px', marginBottom: 24 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: 'rgba(232,238,245,0.5)', marginBottom: 10 }}>BACKFILL · ADMIN</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[7, 30, 90].map(n => (
              <button
                key={n}
                onClick={() => runBackfill(n)}
                disabled={backfill.running}
                style={{
                  flex: 1, minWidth: 90, padding: '10px 12px', borderRadius: 8,
                  border: `1px solid ${ACCENT}55`, background: backfill.running ? 'transparent' : `${ACCENT}14`,
                  color: ACCENT, fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.06em', cursor: backfill.running ? 'default' : 'pointer', opacity: backfill.running ? 0.5 : 1,
                }}
              >
                {`LAST ${n} DAYS`}
              </button>
            ))}
          </div>
          {backfill.msg && (
            <div style={{ fontSize: 12, color: backfill.running ? ACCENT : 'rgba(232,238,245,0.6)', marginTop: 10, fontFamily: "'DM Mono', monospace", letterSpacing: '0.03em' }}>
              {backfill.running ? '⏳ ' : '✓ '}{backfill.msg}
            </div>
          )}
          <div style={{ fontSize: 11, color: 'rgba(232,238,245,0.4)', marginTop: 8, lineHeight: 1.5 }}>
            Generates a card for each missing day (skips ones you already have). A few seconds per day.
          </div>
        </div>

        {rows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 12px' }}>
            <div style={{ fontSize: 30, marginBottom: 14 }}>🗓️</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Nothing collected yet</div>
            <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.55)', lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>
              Cards are saved as the daily "On This Day" runs. Check back as they accumulate.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rows.map(r => <ArchiveCard key={r.date} row={r} />)}
          </div>
        )}
      </div>
    </div>
  )
}
