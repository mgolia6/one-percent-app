'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// Standalone, admin-gated content-verification tool. Claim definitions are static
// JSON (public/verify-data/<cat>.json); the human's checks + sign-offs persist in
// Supabase (verification_checks / verification_entries) so they sync across devices.

const BG = '#0e141c', CARD = '#1a2a3a', INK = '#e8eef5', MUT = 'rgba(232,238,245,0.6)'
const FAINT = 'rgba(232,238,245,0.4)', GOLD = '#E0A93D', OK = '#47FFE8', WARN = '#FF8C47', LINE = 'rgba(255,255,255,0.08)'

const CATEGORIES = [
  { key: 'history', label: 'History', file: '/verify-data/history.json' },
  // future: { key: 'finance', label: 'Personal Finance', file: '/verify-data/finance.json' }, ...
]

export default function VerifyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [cat, setCat] = useState('history')
  const [entries, setEntries] = useState([])      // from JSON
  const [checks, setChecks] = useState({})         // `${ed}|${no}` -> bool
  const [signoffs, setSignoffs] = useState({})     // ed -> {status, verified_at}
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled) return
      if (!session) { router.push('/login'); return }
      const { data: prof } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
      if (cancelled) return
      if (!prof?.is_admin) { router.push('/'); return }
      setUserId(session.user.id)
      setLoading(false)
    }
    init()
    return () => { cancelled = true }
  }, [router])

  const loadCategory = useCallback(async (key) => {
    const def = CATEGORIES.find(c => c.key === key)
    if (!def) return
    const res = await fetch(def.file)
    const json = await res.json()
    setEntries(json)
    const eds = json.map(e => e.edition_id)
    const [{ data: chk }, { data: ent }] = await Promise.all([
      supabase.from('verification_checks').select('edition_id, claim_no, checked').in('edition_id', eds),
      supabase.from('verification_entries').select('edition_id, status, verified_at').in('edition_id', eds),
    ])
    const cm = {}; (chk || []).forEach(r => { cm[`${r.edition_id}|${r.claim_no}`] = r.checked })
    const sm = {}; (ent || []).forEach(r => { sm[r.edition_id] = r })
    setChecks(cm); setSignoffs(sm)
  }, [])

  useEffect(() => { if (userId) loadCategory(cat) }, [userId, cat, loadCategory])

  const toggleCheck = async (ed, no, val) => {
    setChecks(p => ({ ...p, [`${ed}|${no}`]: val }))
    await supabase.from('verification_checks').upsert(
      { edition_id: ed, claim_no: no, checked: val, checked_by: userId, checked_at: new Date().toISOString() },
      { onConflict: 'edition_id,claim_no' })
  }

  const signOff = async (entry, status) => {
    if (busy) return
    setBusy(true)
    const row = { edition_id: entry.edition_id, category: cat, concept: entry.concept, status,
      verified_by: status === 'verified' ? userId : null, verified_at: status === 'verified' ? new Date().toISOString() : null, updated_at: new Date().toISOString() }
    setSignoffs(p => ({ ...p, [entry.edition_id]: row }))
    await supabase.from('verification_entries').upsert(row, { onConflict: 'edition_id' })
    setBusy(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 11, color: FAINT, letterSpacing: '0.2em', fontFamily: "'DM Mono', monospace" }}>LOADING…</div>
    </div>
  )

  const verifiedCount = entries.filter(e => signoffs[e.edition_id]?.status === 'verified').length

  return (
    <div style={{ minHeight: '100vh', background: BG, color: INK, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", lineHeight: 1.5 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box}`}</style>

      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: BG, borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <button onClick={() => router.push('/admin')} style={{ background: 'none', border: 'none', color: MUT, cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.08em', padding: 0 }}>← ADMIN</button>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: MUT }}>Verified <b style={{ color: OK }}>{verifiedCount}</b> / {entries.length}</div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 18px 80px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>Verify — Dead Drop</h1>
        <div style={{ color: MUT, fontSize: 13, marginBottom: 16 }}>Two AI passes done (confirm + adversarial). This is the human check — your ticks save automatically.</div>

        {/* Category switcher */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCat(c.key)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.06em', padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: cat === c.key ? GOLD : 'rgba(255,255,255,0.06)', color: cat === c.key ? '#06212b' : MUT, fontWeight: 600 }}>{c.label}</button>
          ))}
        </div>

        {/* How-to */}
        <div style={{ background: CARD, border: `1px solid ${GOLD}`, borderLeft: `4px solid ${GOLD}`, borderRadius: 10, padding: '14px 16px', marginBottom: 18, fontSize: 13.5 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: GOLD, marginBottom: 8 }}>HOW TO USE</div>
          Tap <b>Verify ↗</b> on each claim → confirm the source actually says the snippet → tick the box. Spot-check the <b>⛑ quotes</b> and <b>⚡ fixes</b> at minimum. When an entry looks right, hit <b>Sign off</b>. Everything you do here is saved to your account and syncs across devices. Signed-off entries are what I promote to live.
        </div>

        {entries.map(e => {
          const so = signoffs[e.edition_id]
          const verified = so?.status === 'verified'
          const flagged = so?.status === 'flagged'
          const done = e.claims.filter(c => checks[`${e.edition_id}|${c.no}`]).length
          return (
            <div key={e.edition_id} style={{ background: CARD, border: `1px solid ${verified ? OK : flagged ? WARN : LINE}`, borderRadius: 12, padding: 16, marginBottom: 14, opacity: verified ? 0.9 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{e.edition_id} · {e.concept}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                  {e.fix ? <span style={{ fontSize: 10, letterSpacing: '0.06em', padding: '3px 9px', borderRadius: 20, border: `1px solid ${WARN}`, color: WARN, whiteSpace: 'nowrap' }}>{e.verdict} · {e.fix}</span>
                         : <span style={{ fontSize: 10, letterSpacing: '0.08em', padding: '3px 9px', borderRadius: 20, border: `1px solid ${OK}`, color: OK }}>{e.verdict}</span>}
                </div>
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: FAINT, marginBottom: 6 }}>your checks: {done}/{e.claims.length}</div>

              {e.claims.map(c => {
                const on = !!checks[`${e.edition_id}|${c.no}`]
                return (
                  <label key={c.no} style={{ display: 'flex', gap: 11, padding: '11px 0', borderTop: `1px solid ${LINE}`, cursor: 'pointer' }}>
                    <input type="checkbox" checked={on} onChange={ev => toggleCheck(e.edition_id, c.no, ev.target.checked)}
                      style={{ appearance: 'none', WebkitAppearance: 'none', minWidth: 22, height: 22, marginTop: 1, borderRadius: 6, border: `2px solid ${on ? OK : FAINT}`, background: on ? OK : 'transparent', position: 'relative', cursor: 'pointer' }} />
                    <span style={{ fontSize: 14 }}>
                      {c.kind ? <span style={{ color: GOLD, fontSize: 11, letterSpacing: '0.04em' }}>{c.kind} </span> : null}{c.text}
                      <div style={{ color: MUT, fontSize: 13, fontStyle: 'italic', margin: '3px 0 6px' }}>{c.snippet}</div>
                      <a href={c.url} target="_blank" rel="noopener noreferrer" onClick={ev => ev.stopPropagation()}
                        style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', color: '#06212b', background: OK, padding: '5px 12px', borderRadius: 7, textDecoration: 'none' }}>Verify ↗</a>
                    </span>
                  </label>
                )
              })}

              <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 12, borderTop: `1px dashed ${LINE}`, alignItems: 'center', flexWrap: 'wrap' }}>
                {verified ? (
                  <>
                    <span style={{ color: OK, fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600 }}>✓ SIGNED OFF</span>
                    <button onClick={() => signOff(e, 'pending')} style={{ background: 'none', border: `1px solid ${LINE}`, color: FAINT, fontSize: 11, padding: '5px 11px', borderRadius: 7, cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>undo</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => signOff(e, 'verified')} disabled={busy} style={{ background: OK, border: 'none', color: '#06212b', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', padding: '9px 18px', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>SIGN OFF →</button>
                    <button onClick={() => signOff(e, flagged ? 'pending' : 'flagged')} style={{ background: flagged ? `${WARN}22` : 'none', border: `1px solid ${WARN}55`, color: WARN, fontSize: 11, padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>{flagged ? 'flagged ✕' : 'flag issue'}</button>
                  </>
                )}
              </div>
            </div>
          )
        })}

        <div style={{ color: FAINT, fontSize: 12, marginTop: 8 }}>
          Sign-offs are recorded here (who + when). Drafts stay <code style={{ color: OK }}>verified:false</code> in their files until I promote the signed-off set to live (numbering + four-file sync). Tell me "promote History" when a category is fully signed off.
        </div>
      </div>
    </div>
  )
}
