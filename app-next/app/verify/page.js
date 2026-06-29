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
  { key: 'finance', label: 'Personal Finance', file: '/verify-data/finance.json' },
  { key: 'health', label: 'Health & Performance', file: '/verify-data/health.json' },
]

export default function VerifyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [cat, setCat] = useState('history')
  const [entries, setEntries] = useState([])      // from JSON
  const [checks, setChecks] = useState({})         // `${ed}|${no}` -> bool
  const [flags, setFlags] = useState({})           // `${ed}|${no}` -> { flagged, note }
  const [signoffs, setSignoffs] = useState({})     // ed -> {status, verified_at}
  const [busy, setBusy] = useState(false)
  const [lastSubmit, setLastSubmit] = useState(null) // latest submission for this category
  const [submitting, setSubmitting] = useState(false)
  const [justSubmitted, setJustSubmitted] = useState(false)
  const [view, setView] = useState('verify')        // 'verify' | 'archive'
  const [allSubs, setAllSubs] = useState([])         // all submissions, newest first

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

  const loadArchive = useCallback(async () => {
    const { data } = await supabase.from('verification_submissions')
      .select('id, category, submitted_at, status, verified_count, flagged_count, processed_at, flagged_claims, verified_editions')
      .order('submitted_at', { ascending: false })
    setAllSubs(data || [])
  }, [])

  useEffect(() => { if (userId) loadArchive() }, [userId, loadArchive])

  const loadCategory = useCallback(async (key) => {
    const def = CATEGORIES.find(c => c.key === key)
    if (!def) return
    const res = await fetch(def.file)
    const json = await res.json()
    setEntries(json)
    const eds = json.map(e => e.edition_id)
    const [{ data: chk }, { data: ent }] = await Promise.all([
      supabase.from('verification_checks').select('edition_id, claim_no, checked, flagged, flag_note').in('edition_id', eds),
      supabase.from('verification_entries').select('edition_id, status, verified_at').in('edition_id', eds),
    ])
    const cm = {}, fm = {}; (chk || []).forEach(r => {
      cm[`${r.edition_id}|${r.claim_no}`] = r.checked
      if (r.flagged || r.flag_note) fm[`${r.edition_id}|${r.claim_no}`] = { flagged: !!r.flagged, note: r.flag_note || '' }
    })
    const sm = {}; (ent || []).forEach(r => { sm[r.edition_id] = r })
    setChecks(cm); setFlags(fm); setSignoffs(sm)
    const { data: sub } = await supabase.from('verification_submissions')
      .select('id, submitted_at, status, verified_count, flagged_count, processed_at')
      .eq('category', key).order('submitted_at', { ascending: false }).limit(1)
    setLastSubmit(sub?.[0] || null)
    setJustSubmitted(false)
  }, [])

  useEffect(() => { if (userId) loadCategory(cat) }, [userId, cat, loadCategory])

  const toggleCheck = async (ed, no, val) => {
    setChecks(p => ({ ...p, [`${ed}|${no}`]: val }))
    await supabase.from('verification_checks').upsert(
      { edition_id: ed, claim_no: no, checked: val, checked_by: userId, checked_at: new Date().toISOString() },
      { onConflict: 'edition_id,claim_no' })
  }

  // Flag a single claim as "can't verify" (+ optional why). Toggling on clears its check.
  const toggleFlag = async (ed, no, val) => {
    const key = `${ed}|${no}`
    setFlags(p => ({ ...p, [key]: { flagged: val, note: p[key]?.note || '' } }))
    if (val) setChecks(p => ({ ...p, [key]: false }))
    await supabase.from('verification_checks').upsert(
      { edition_id: ed, claim_no: no, flagged: val, ...(val ? { checked: false } : {}), checked_by: userId, checked_at: new Date().toISOString() },
      { onConflict: 'edition_id,claim_no' })
  }

  const saveNote = async (ed, no, note) => {
    const key = `${ed}|${no}`
    setFlags(p => ({ ...p, [key]: { flagged: p[key]?.flagged ?? true, note } }))
    await supabase.from('verification_checks').upsert(
      { edition_id: ed, claim_no: no, flag_note: note, checked_by: userId, checked_at: new Date().toISOString() },
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

  // Freeze the current review as a submission for me (Claude) to act on next session:
  // signed-off entries get promoted to the library, flagged claims get reworked.
  const submitReview = async () => {
    if (submitting) return
    setSubmitting(true)
    const verifiedEditions = entries.filter(e => signoffs[e.edition_id]?.status === 'verified').map(e => e.edition_id)
    const flaggedClaims = []
    entries.forEach(e => e.claims.forEach(c => {
      const f = flags[`${e.edition_id}|${c.no}`]
      if (f?.flagged) flaggedClaims.push({ edition_id: e.edition_id, concept: e.concept, claim_no: c.no, claim: c.text, note: f.note || '' })
    }))
    const row = { category: cat, submitted_by: userId, submitted_at: new Date().toISOString(),
      verified_count: verifiedEditions.length, flagged_count: flaggedClaims.length,
      verified_editions: verifiedEditions, flagged_claims: flaggedClaims, status: 'pending' }
    const { data } = await supabase.from('verification_submissions').insert(row).select('id, submitted_at, status, verified_count, flagged_count, processed_at').single()
    setLastSubmit(data || row)
    setJustSubmitted(true)
    setSubmitting(false)
    loadArchive()
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 11, color: FAINT, letterSpacing: '0.2em', fontFamily: "'DM Mono', monospace" }}>LOADING…</div>
    </div>
  )

  const verifiedCount = entries.filter(e => signoffs[e.edition_id]?.status === 'verified').length
  const flaggedTotal = entries.reduce((n, e) => n + e.claims.filter(c => flags[`${e.edition_id}|${c.no}`]?.flagged).length, 0)

  return (
    <div style={{ minHeight: '100vh', background: BG, color: INK, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", lineHeight: 1.5, overflowX: 'hidden', maxWidth: '100vw' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box} html,body{overflow-x:hidden;max-width:100%}`}</style>

      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: BG, borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <button onClick={() => router.push('/admin')} style={{ background: 'none', border: 'none', color: MUT, cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.08em', padding: 0 }}>← ADMIN</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {view === 'verify' && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: MUT }}>Verified <b style={{ color: OK }}>{verifiedCount}</b> / {entries.length}</div>}
            <button onClick={() => setView(v => v === 'archive' ? 'verify' : 'archive')} style={{ background: view === 'archive' ? 'rgba(224,169,61,0.12)' : 'transparent', border: `1px solid ${view === 'archive' ? GOLD : LINE}`, color: view === 'archive' ? GOLD : MUT, cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.06em', padding: '5px 11px', borderRadius: 7 }}>{view === 'archive' ? '✕ CLOSE' : `⌗ RUNS${allSubs.length ? ` (${allSubs.length})` : ''}`}</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 18px 80px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>Verify — Dead Drop</h1>
        <div style={{ color: MUT, fontSize: 13, marginBottom: 16 }}>Two AI passes done (confirm + adversarial). This is the human check — your ticks save automatically.</div>

        {view === 'archive' && (
          <ArchivePanel subs={allSubs} cats={CATEGORIES} onOpen={(c) => { setCat(c); setView('verify') }} />
        )}

        {view === 'verify' && <>
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
          Tap <b>Verify ↗</b> on each claim → confirm the source actually says the snippet → tick the box. If a claim <b>doesn’t check out</b>, hit <b style={{ color: WARN }}>flag claim</b> and jot a quick why — I’ll rework just those before the entry goes live. When an entry looks right, hit <b>Sign off</b>. Everything saves to your account and syncs across devices.
        </div>

        {entries.map(e => {
          const so = signoffs[e.edition_id]
          const verified = so?.status === 'verified'
          const flagged = so?.status === 'flagged'
          const done = e.claims.filter(c => checks[`${e.edition_id}|${c.no}`]).length
          const flaggedClaims = e.claims.filter(c => flags[`${e.edition_id}|${c.no}`]?.flagged)
          return (
            <div key={e.edition_id} style={{ background: CARD, border: `1px solid ${verified ? OK : flagged ? WARN : LINE}`, borderRadius: 12, padding: 16, marginBottom: 14, opacity: verified ? 0.9 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 16, fontWeight: 600, flex: '1 1 auto', minWidth: 0, overflowWrap: 'anywhere' }}>{e.edition_id} · {e.concept}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 1, minWidth: 0 }}>
                  {e.fix ? <span style={{ fontSize: 10, letterSpacing: '0.06em', padding: '3px 9px', borderRadius: 12, border: `1px solid ${WARN}`, color: WARN, overflowWrap: 'anywhere' }}>{e.verdict} · {e.fix}</span>
                         : <span style={{ fontSize: 10, letterSpacing: '0.08em', padding: '3px 9px', borderRadius: 20, border: `1px solid ${OK}`, color: OK, whiteSpace: 'nowrap' }}>{e.verdict}</span>}
                </div>
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: FAINT, marginBottom: 6 }}>your checks: {done}/{e.claims.length}{flaggedClaims.length > 0 ? <span style={{ color: WARN }}> · ⚑ {flaggedClaims.length} flagged</span> : null}</div>

              {e.claims.map(c => {
                const key = `${e.edition_id}|${c.no}`
                const on = !!checks[key]
                const fl = !!flags[key]?.flagged
                const note = flags[key]?.note || ''
                return (
                  <div key={c.no} style={{ borderTop: `1px solid ${LINE}`, padding: '11px 0' }}>
                    <label style={{ display: 'flex', gap: 11, cursor: 'pointer' }}>
                      <input type="checkbox" checked={on} disabled={fl} onChange={ev => toggleCheck(e.edition_id, c.no, ev.target.checked)}
                        style={{ appearance: 'none', WebkitAppearance: 'none', minWidth: 22, height: 22, marginTop: 1, borderRadius: 6, border: `2px solid ${on ? OK : fl ? `${WARN}66` : FAINT}`, background: on ? OK : 'transparent', position: 'relative', cursor: fl ? 'default' : 'pointer', opacity: fl ? 0.5 : 1 }} />
                      <span style={{ fontSize: 14, opacity: fl ? 0.65 : 1, minWidth: 0 }}>
                        {c.kind ? <span style={{ color: GOLD, fontSize: 11, letterSpacing: '0.04em' }}>{c.kind} </span> : null}{c.text}
                        <div style={{ color: MUT, fontSize: 13, fontStyle: 'italic', margin: '3px 0 6px', overflowWrap: 'anywhere' }}>{c.snippet}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, color: GOLD, margin: '0 0 7px', overflowWrap: 'anywhere' }}>
                          📍 {c.locate ? c.locate : <>on the page, find: “{(c.snippet || '').replace(/[“”"]/g, '').split(/\s+/).slice(0, 6).join(' ')}…”</>}
                        </div>
                        <a href={c.url} target="_blank" rel="noopener noreferrer" onClick={ev => ev.stopPropagation()}
                          style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', color: '#06212b', background: OK, padding: '5px 12px', borderRadius: 7, textDecoration: 'none' }}>Verify ↗</a>
                      </span>
                    </label>

                    {/* Per-claim flag + why */}
                    <div style={{ marginLeft: 33, marginTop: 8 }}>
                      <button onClick={() => toggleFlag(e.edition_id, c.no, !fl)}
                        style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.06em', padding: '5px 11px', borderRadius: 7, cursor: 'pointer',
                          border: `1px solid ${fl ? WARN : 'rgba(255,140,71,0.3)'}`, background: fl ? `${WARN}22` : 'transparent', color: WARN }}>
                        {fl ? '⚑ CAN’T VERIFY' : 'flag claim'}
                      </button>
                      {fl && (
                        <textarea defaultValue={note} onBlur={ev => saveNote(e.edition_id, c.no, ev.target.value)} rows={2}
                          placeholder="Why can't this be verified? (e.g. source dead, number not found, contradicts another source)"
                          style={{ display: 'block', width: '100%', marginTop: 8, background: BG, border: `1px solid ${WARN}55`, borderRadius: 8, color: INK, fontSize: 13, padding: '9px 11px', fontFamily: "-apple-system,sans-serif", resize: 'vertical', lineHeight: 1.45 }} />
                      )}
                    </div>
                  </div>
                )
              })}

              {flaggedClaims.length > 0 && !verified && (
                <div style={{ marginTop: 12, padding: '10px 12px', background: `${WARN}14`, border: `1px solid ${WARN}44`, borderRadius: 9, fontSize: 12.5, color: INK }}>
                  <span style={{ color: WARN, fontWeight: 600 }}>⚑ {flaggedClaims.length} claim{flaggedClaims.length > 1 ? 's' : ''} can’t be verified.</span> Tell me <i>"fix {e.edition_id}"</i> and I’ll rework {flaggedClaims.length > 1 ? 'them' : 'it'} from your notes before this entry goes live.
                </div>
              )}

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

        {entries.length > 0 && verifiedCount === entries.length && flaggedTotal === 0 && (
          <div style={{ marginTop: 14, padding: '14px 16px', background: `${OK}14`, border: `1px solid ${OK}55`, borderRadius: 10, fontSize: 13.5, color: INK }}>
            <span style={{ color: OK, fontWeight: 700, fontFamily: "'DM Mono', monospace", letterSpacing: '0.04em' }}>✓ {verifiedCount}/{entries.length} COMPLETE.</span> This category is fully signed off. Hit <b>Submit for review</b> to archive the run — I’ll promote the set into the library and it’ll show under <b>⌗ Runs</b>.
          </div>
        )}

        <div style={{ color: FAINT, fontSize: 12, marginTop: 8 }}>
          Everything you tick, flag, and sign off saves automatically. When you’ve been through the whole category, hit <b style={{ color: OK }}>Submit for review</b> below — that hands the batch to me: I rework the flagged claims and promote the signed-off entries into the library.
        </div>
        </>}
      </div>

      {/* Sticky submit bar */}
      {view === 'verify' && <div style={{ position: 'sticky', bottom: 0, zIndex: 10, background: 'rgba(14,20,28,0.96)', backdropFilter: 'blur(10px)', borderTop: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: MUT, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span><b style={{ color: OK }}>{verifiedCount}</b> signed off</span>
            <span><b style={{ color: WARN }}>{flaggedTotal}</b> flagged</span>
            <span style={{ color: FAINT }}>{entries.length - verifiedCount} left</span>
            {lastSubmit && !justSubmitted && (
              <span style={{ color: FAINT }}>· last submitted {new Date(lastSubmit.submitted_at).toLocaleDateString()}{lastSubmit.status === 'processed' ? ' ✓ processed' : ' (pending)'}</span>
            )}
          </div>
          {justSubmitted ? (
            <span style={{ color: OK, fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600 }}>✓ SUBMITTED — I’ll pick this up next session</span>
          ) : (
            <button onClick={submitReview} disabled={submitting || (verifiedCount === 0 && flaggedTotal === 0)}
              style={{ background: (verifiedCount === 0 && flaggedTotal === 0) ? 'rgba(255,255,255,0.08)' : GOLD, border: 'none', color: (verifiedCount === 0 && flaggedTotal === 0) ? FAINT : '#06212b', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', padding: '11px 20px', borderRadius: 9, cursor: (submitting || (verifiedCount === 0 && flaggedTotal === 0)) ? 'default' : 'pointer', fontFamily: "'DM Mono', monospace" }}>
              {submitting ? 'SUBMITTING…' : 'SUBMIT FOR REVIEW →'}
            </button>
          )}
        </div>
      </div>}
    </div>
  )
}

// Archive of past verification runs (all categories). Read-only history so completed
// runs stay accessible as new ones come through.
function ArchivePanel({ subs, cats, onOpen }) {
  const label = (k) => cats.find(c => c.key === k)?.label || k
  const statusStyle = (s) => s === 'promoted'
    ? { color: OK, border: `1px solid ${OK}`, label: '✓ PROMOTED' }
    : s === 'processed'
    ? { color: OK, border: `1px solid ${OK}66`, label: '✓ PROCESSED' }
    : { color: GOLD, border: `1px solid ${GOLD}66`, label: 'PENDING' }
  if (!subs.length) return (
    <div style={{ color: FAINT, fontSize: 13, padding: '24px 4px' }}>No submitted runs yet. Sign off a category and hit <b>Submit for review</b> — it’ll show up here.</div>
  )
  return (
    <div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: MUT, marginBottom: 12 }}>SUBMITTED RUNS — {subs.length}</div>
      {subs.map(s => {
        const st = statusStyle(s.status)
        return (
          <div key={s.id} style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 11, padding: 14, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{label(s.category)}</div>
              <span style={{ fontSize: 9.5, letterSpacing: '0.08em', padding: '3px 9px', borderRadius: 12, color: st.color, border: st.border, fontFamily: "'DM Mono', monospace" }}>{st.label}</span>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, color: FAINT, marginBottom: 8 }}>
              {new Date(s.submitted_at).toLocaleString()} · <span style={{ color: OK }}>{s.verified_count} signed off</span> · <span style={{ color: WARN }}>{s.flagged_count} flagged</span>
            </div>
            {Array.isArray(s.flagged_claims) && s.flagged_claims.length > 0 && (
              <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 8, marginBottom: 8 }}>
                {s.flagged_claims.map((f, i) => (
                  <div key={i} style={{ fontSize: 12, color: MUT, marginBottom: 4 }}>
                    <span style={{ color: WARN, fontFamily: "'DM Mono', monospace", fontSize: 10 }}>⚑ {f.edition_id}</span> {f.claim}{f.note ? <span style={{ color: FAINT }}> — “{f.note}”</span> : null}
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => onOpen(s.category)} style={{ background: 'none', border: `1px solid ${LINE}`, color: MUT, fontSize: 11, padding: '6px 12px', borderRadius: 7, cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>open {label(s.category)} →</button>
          </div>
        )
      })}
    </div>
  )
}
