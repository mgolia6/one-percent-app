'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { TOTAL_ENTRIES } from '@/lib/config'

const ACCENT = '#1a2a3a'
const CYAN = '#47FFE8'
const YELLOW = '#E8FF47'
const PINK = '#FF4778'
const PURPLE = '#C847FF'
const ORANGE = '#FF8C47'

const CAT_COLORS = {
  'AI': '#47FFE8', 'Sales Craft': '#E8FF47', 'Vocab & Language': '#FF8C47',
  'Mental Models': '#C847FF', 'Philosophy': '#FF4778',
  'Neuroscience & Cognition': '#47C8FF', 'Communication': '#FF8C00',
}

function timeAgo(ts) {
  if (!ts) return 'never'
  const diff = Date.now() - new Date(ts)
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function daysSince(ts) {
  if (!ts) return null
  return Math.floor((Date.now() - new Date(ts)) / 86400000)
}

function engagementColor(lastActive) {
  if (!lastActive) return '#555'
  const d = daysSince(lastActive)
  if (d <= 1) return '#47FFE8'
  if (d <= 3) return '#E8FF47'
  if (d <= 7) return '#FF8C47'
  return '#FF4778'
}

function StatusDot({ color }) {
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
}

function Chip({ label, color, bg }) {
  return (
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 4, background: bg || color + '18', color: color, border: `1px solid ${color}40`, fontWeight: 600 }}>
      {label}
    </span>
  )
}

function Card({ children, style }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid rgba(26,42,58,0.08)', boxShadow: '0 1px 4px rgba(26,42,58,0.04)', ...style }}>
      {children}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: 'rgba(26,42,58,0.4)', marginBottom: 12, marginTop: 4 }}>
      {children}
    </div>
  )
}

function TabBtn({ id, label, active, onClick, badge }) {
  return (
    <button onClick={() => onClick(id)} style={{
      padding: '9px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
      fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em',
      background: active ? ACCENT : 'transparent',
      color: active ? '#fff' : 'rgba(26,42,58,0.5)',
      fontWeight: active ? 600 : 400, whiteSpace: 'nowrap', flexShrink: 0,
      position: 'relative', transition: 'all 0.15s',
    }}>
      {label}
      {badge > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: '50%', background: PINK }} />}
    </button>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('users')
  const [feedback, setFeedback] = useState([])
  const [bugs, setBugs] = useState([])
  const [users, setUsers] = useState([])
  const [userCompletions, setUserCompletions] = useState({})
  const [expandedUser, setExpandedUser] = useState(null)
  const [nudgeUser, setNudgeUser] = useState(null)
  const [nudgeMsg, setNudgeMsg] = useState('')
  const [apiStatus, setApiStatus] = useState({})
  const [apiChecking, setApiChecking] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [bugFilter, setBugFilter] = useState('open')
  const [feedbackUser, setFeedbackUser] = useState(null)
  const [resetting, setResetting] = useState(null)
  const [resetConfirm, setResetConfirm] = useState(null)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      const { data: prof } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).maybeSingle()
      if (!prof?.is_admin) { router.push('/'); return }
      await loadAll()
      setLoading(false)
    }
    init()
  }, [router])

  async function loadAll() {
    const [{ data: fb }, { data: br }, { data: us }, { data: comps }] = await Promise.all([
      supabase.from('feedback').select('*, profiles(email, first_name)').order('created_at', { ascending: false }),
      supabase.from('bug_reports').select('*, profiles(email, first_name)').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, email, name, first_name, last_name, signup_date, current_streak, longest_streak, last_active_date, onboarding_complete, is_admin, avatar_url').order('signup_date', { ascending: false }),
      supabase.from('completions').select('user_id, entry_number, score, completed_at'),
    ])
    setFeedback(fb || [])
    setBugs(br || [])
    setUsers(us || [])
    const summary = {}
    ;(comps || []).forEach(c => {
      if (!summary[c.user_id]) summary[c.user_id] = { count: 0, lastDate: null, scores: [] }
      summary[c.user_id].count++
      summary[c.user_id].scores.push(c.score || 0)
      if (!summary[c.user_id].lastDate || c.completed_at > summary[c.user_id].lastDate)
        summary[c.user_id].lastDate = c.completed_at
    })
    setUserCompletions(summary)
  }

  async function refreshAll() {
    setRefreshing(true)
    await loadAll()
    setRefreshing(false)
  }

  async function checkApis() {
    setApiChecking(true)
    const results = {}

    // Check Supabase
    try {
      const start = Date.now()
      const { error } = await supabase.from('profiles').select('id').limit(1)
      results.supabase = { ok: !error, ms: Date.now() - start, label: 'Supabase DB', detail: error?.message || 'Connected' }
    } catch(e) {
      results.supabase = { ok: false, ms: null, label: 'Supabase DB', detail: e.message }
    }

    // Check Resend via edge function ping
    try {
      const start = Date.now()
      const { data, error } = await supabase.functions.invoke('send-daily-reminder', { body: { dry_run: true } })
      results.resend = { ok: !error, ms: Date.now() - start, label: 'Resend / Email', detail: error ? error.message : 'Edge function reachable' }
    } catch(e) {
      results.resend = { ok: false, ms: null, label: 'Resend / Email', detail: e.message }
    }

    // Check practice reminder
    try {
      const start = Date.now()
      const { error } = await supabase.functions.invoke('send-practice-reminder', { body: { dry_run: true } })
      results.practice = { ok: !error, ms: Date.now() - start, label: 'Practice Reminder', detail: error ? error.message : 'Edge function reachable' }
    } catch(e) {
      results.practice = { ok: false, ms: null, label: 'Practice Reminder', detail: e.message }
    }

    // Auth check
    try {
      const start = Date.now()
      const { data: { session } } = await supabase.auth.getSession()
      results.auth = { ok: !!session, ms: Date.now() - start, label: 'Supabase Auth', detail: session ? 'Session valid' : 'No session' }
    } catch(e) {
      results.auth = { ok: false, ms: null, label: 'Supabase Auth', detail: e.message }
    }

    setApiStatus(results)
    setApiChecking(false)
  }

  async function markBugResolved(id) {
    await supabase.from('bug_reports').update({ status: 'resolved' }).eq('id', id)
    await loadAll()
  }

  async function resetUserData(userId) {
    setResetting(userId + '-data')
    await Promise.all([
      supabase.from('completions').delete().eq('user_id', userId),
      supabase.from('feedback').delete().eq('user_id', userId),
      supabase.from('profiles').update({ current_streak: 0, longest_streak: 0, last_active_date: null }).eq('id', userId),
    ])
    setResetting(null); setResetConfirm(null)
    await loadAll()
  }

  async function hardResetUser(userId) {
    setResetting(userId + '-hard')
    await Promise.all([
      supabase.from('completions').delete().eq('user_id', userId),
      supabase.from('feedback').delete().eq('user_id', userId),
      supabase.from('bug_reports').delete().eq('user_id', userId),
      supabase.from('profiles').update({ current_streak: 0, longest_streak: 0, last_active_date: null, onboarding_complete: false, name: null }).eq('id', userId),
    ])
    setResetting(null); setResetConfirm(null)
    await loadAll()
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f0f4f8 0%,#e8eef5 50%,#dde6f0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: 'rgba(26,42,58,0.4)' }}>LOADING...</div>
    </div>
  )

  const nonAdminUsers = users.filter(u => !u.is_admin)
  const openBugs = bugs.filter(b => b.status === 'open' || !b.status)
  const resolvedBugs = bugs.filter(b => b.status === 'resolved')
  const displayedBugs = bugFilter === 'open' ? openBugs : bugFilter === 'resolved' ? resolvedBugs : bugs

  // Feedback by user
  const feedbackByUser = {}
  feedback.forEach(f => {
    const uid = f.user_id
    if (!feedbackByUser[uid]) feedbackByUser[uid] = { items: [], user: f.profiles }
    feedbackByUser[uid].items.push(f)
  })

  const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : null

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f0f4f8 0%,#e8eef5 50%,#dde6f0 100%)', fontFamily: "'DM Sans', sans-serif", color: '#1a2a3a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .admin-tabs::-webkit-scrollbar{display:none;}
        .nudge-overlay{position:fixed;inset:0;background:rgba(10,14,22,0.6);backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;z-index:200;}
        textarea{resize:vertical;}
      `}</style>

      {/* NUDGE MODAL */}
      {nudgeUser && (
        <div className="nudge-overlay" onClick={e => e.target.className === 'nudge-overlay' && setNudgeUser(null)}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 480, borderRadius: '20px 20px 0 0', padding: '24px 24px 48px' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(26,42,58,0.12)', margin: '0 auto 20px' }} />
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'rgba(26,42,58,0.4)', marginBottom: 6 }}>NUDGE</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: '#1a2a3a', marginBottom: 4 }}>{nudgeUser.first_name || nudgeUser.email}</div>
            <div style={{ fontSize: 13, color: 'rgba(26,42,58,0.5)', marginBottom: 20 }}>{nudgeUser.phone ? nudgeUser.phone : 'No phone number on file — SMS unavailable'}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', color: 'rgba(26,42,58,0.5)', marginBottom: 8 }}>MESSAGE</div>
            <textarea
              value={nudgeMsg}
              onChange={e => setNudgeMsg(e.target.value)}
              placeholder={`Hey ${nudgeUser.first_name || 'there'}, just checking in — how's One Percent going?`}
              style={{ width: '100%', background: 'rgba(26,42,58,0.04)', border: '1px solid rgba(26,42,58,0.12)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#1a2a3a', minHeight: 100, outline: 'none', fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setNudgeUser(null)} style={{ flex: 1, padding: 12, background: 'transparent', border: '1px solid rgba(26,42,58,0.12)', borderRadius: 10, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', color: 'rgba(26,42,58,0.5)', cursor: 'pointer' }}>CANCEL</button>
              <button
                onClick={() => {
                  if (nudgeUser.phone) {
                    window.open(`sms:${nudgeUser.phone}?body=${encodeURIComponent(nudgeMsg)}`)
                  } else {
                    alert('No phone number on file. Add one in Supabase profiles table.')
                  }
                  setNudgeUser(null)
                }}
                style={{ flex: 2, padding: 12, background: '#1a2a3a', border: 'none', borderRadius: 10, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                {nudgeUser.phone ? 'SEND SMS →' : 'COPY MESSAGE →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ background: 'rgba(240,244,248,0.96)', backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(26,42,58,0.07)', padding: '14px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, letterSpacing: '0.16em', color: '#1a2a3a' }}>ONE PERCENT</span>
            <Chip label="ADMIN" color={CYAN} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={refreshAll} disabled={refreshing} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(26,42,58,0.12)', background: 'transparent', color: 'rgba(26,42,58,0.5)', cursor: 'pointer' }}>
              {refreshing ? 'REFRESHING…' : '↺ REFRESH'}
            </button>
            <button onClick={() => router.push('/')} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '6px 12px', borderRadius: 8, border: 'none', background: '#1a2a3a', color: '#fff', cursor: 'pointer' }}>← APP</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 24px 60px' }}>

        {/* QUICK KPI ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'TESTERS', val: nonAdminUsers.length, color: CYAN },
            { label: 'OPEN BUGS', val: openBugs.length, color: openBugs.length > 0 ? PINK : CYAN },
            { label: 'FEEDBACK ITEMS', val: feedback.length, color: YELLOW },
            { label: 'AVG COMPLETED', val: nonAdminUsers.length ? Math.round(Object.values(userCompletions).filter((_, i) => {
              const uid = nonAdminUsers[i]?.id
              return !!uid
            }).reduce((a, c) => a + c.count, 0) / nonAdminUsers.length) : 0, color: PURPLE },
          ].map(k => (
            <Card key={k.label} style={{ padding: '14px 16px' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: 'rgba(26,42,58,0.4)', marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', color: k.color, lineHeight: 1 }}>{k.val}</div>
            </Card>
          ))}
        </div>

        {/* TAB NAV */}
        <div className="admin-tabs" style={{ display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none', background: 'rgba(26,42,58,0.05)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
          <TabBtn id="users" label="USERS" active={tab==='users'} onClick={setTab} />
          <TabBtn id="bugs" label="BUGS" active={tab==='bugs'} onClick={setTab} badge={openBugs.length} />
          <TabBtn id="feedback" label="FEEDBACK" active={tab==='feedback'} onClick={setTab} />
          <TabBtn id="apis" label="API HEALTH" active={tab==='apis'} onClick={setTab} />
          <TabBtn id="email" label="EMAIL" active={tab==='email'} onClick={setTab} />
        </div>

        {/* ── USERS TAB ── */}
        {tab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {nonAdminUsers.map(u => {
              const comp = userCompletions[u.id] || { count: 0, lastDate: null, scores: [] }
              const avgScore = comp.scores?.length ? avg(comp.scores) : null
              const lastActive = u.last_active_date || comp.lastDate
              const dotColor = engagementColor(lastActive)
              const daysSinceSignup = daysSince(u.signup_date)
              const isExpanded = expandedUser === u.id
              const name = u.first_name ? `${u.first_name}${u.last_name ? ' ' + u.last_name : ''}` : u.email

              return (
                <Card key={u.id} style={{ padding: 0, overflow: 'hidden' }}>
                  {/* Header row */}
                  <div onClick={() => setExpandedUser(isExpanded ? null : u.id)} style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <StatusDot color={dotColor} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: '#1a2a3a' }}>{name}</span>
                        {!u.onboarding_complete && <Chip label="ONBOARDING" color={ORANGE} />}
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(26,42,58,0.4)', letterSpacing: '0.05em' }}>{u.email}</div>
                    </div>
                    {/* Stats inline */}
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: CYAN, letterSpacing: '-0.02em' }}>{comp.count}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.1em', color: 'rgba(26,42,58,0.35)' }}>DONE</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: YELLOW, letterSpacing: '-0.02em' }}>{u.current_streak || 0}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.1em', color: 'rgba(26,42,58,0.35)' }}>STREAK</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: dotColor }}>{timeAgo(lastActive)}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.1em', color: 'rgba(26,42,58,0.35)' }}>LAST SEEN</div>
                      </div>
                    </div>
                    {/* Nudge + expand */}
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                      <button
                        onClick={e => { e.stopPropagation(); setNudgeMsg(''); setNudgeUser(u) }}
                        style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', padding: '6px 12px', borderRadius: 8, border: `1px solid ${CYAN}40`, background: `${CYAN}10`, color: CYAN, cursor: 'pointer', fontWeight: 600 }}
                      >NUDGE</button>
                      <span style={{ color: 'rgba(26,42,58,0.25)', fontSize: 16, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>⌄</span>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid rgba(26,42,58,0.07)', padding: '16px 18px', background: 'rgba(26,42,58,0.02)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
                        {[
                          { l: 'SIGNED UP', v: daysSinceSignup != null ? `${daysSinceSignup}d ago` : '—' },
                          { l: 'AVG SCORE', v: avgScore ? `${avgScore}/3` : '—' },
                          { l: 'BEST STREAK', v: `${u.longest_streak || 0}d` },
                        ].map(s => (
                          <div key={s.l} style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(26,42,58,0.07)' }}>
                            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.14em', color: 'rgba(26,42,58,0.35)', marginBottom: 5 }}>{s.l}</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: '#1a2a3a' }}>{s.v}</div>
                          </div>
                        ))}
                      </div>
                      {/* Completion progress bar */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', color: 'rgba(26,42,58,0.4)' }}>PROGRESS</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(26,42,58,0.4)' }}>{comp.count}/{TOTAL_ENTRIES}</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(26,42,58,0.08)', borderRadius: 2 }}>
                          <div style={{ height: '100%', width: `${Math.round((comp.count / TOTAL_ENTRIES) * 100)}%`, background: CYAN, borderRadius: 2, transition: 'width 0.5s' }} />
                        </div>
                      </div>
                      {/* Feedback count */}
                      {feedbackByUser[u.id] && (
                        <div style={{ marginBottom: 16, fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(26,42,58,0.4)', letterSpacing: '0.08em', cursor: 'pointer' }}
                          onClick={() => { setFeedbackUser(u.id); setTab('feedback') }}>
                          {feedbackByUser[u.id].items.length} FEEDBACK ITEMS → VIEW
                        </div>
                      )}
                      {/* Reset actions */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        {resetConfirm === u.id + '-data' ? (
                          <>
                            <button onClick={() => resetUserData(u.id)} disabled={!!resetting} style={{ flex: 1, padding: '8px 12px', background: ORANGE, color: '#fff', border: 'none', borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', cursor: 'pointer', fontWeight: 600 }}>CONFIRM RESET DATA</button>
                            <button onClick={() => setResetConfirm(null)} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid rgba(26,42,58,0.12)', borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(26,42,58,0.5)', cursor: 'pointer' }}>CANCEL</button>
                          </>
                        ) : resetConfirm === u.id + '-hard' ? (
                          <>
                            <button onClick={() => hardResetUser(u.id)} disabled={!!resetting} style={{ flex: 1, padding: '8px 12px', background: PINK, color: '#fff', border: 'none', borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', cursor: 'pointer', fontWeight: 600 }}>CONFIRM HARD RESET</button>
                            <button onClick={() => setResetConfirm(null)} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid rgba(26,42,58,0.12)', borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(26,42,58,0.5)', cursor: 'pointer' }}>CANCEL</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setResetConfirm(u.id + '-data')} style={{ padding: '8px 12px', background: 'transparent', border: `1px solid ${ORANGE}40`, borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.08em', color: ORANGE, cursor: 'pointer' }}>RESET DATA</button>
                            <button onClick={() => setResetConfirm(u.id + '-hard')} style={{ padding: '8px 12px', background: 'transparent', border: `1px solid ${PINK}40`, borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.08em', color: PINK, cursor: 'pointer' }}>HARD RESET</button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}

        {/* ── BUGS TAB ── */}
        {tab === 'bugs' && (
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {[['open','OPEN'],['resolved','RESOLVED'],['all','ALL']].map(([k,l]) => (
                <button key={k} onClick={() => setBugFilter(k)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '6px 14px', borderRadius: 8, border: 'none', background: bugFilter === k ? ACCENT : 'rgba(26,42,58,0.07)', color: bugFilter === k ? '#fff' : 'rgba(26,42,58,0.5)', cursor: 'pointer' }}>{l} {k === 'open' ? `(${openBugs.length})` : k === 'resolved' ? `(${resolvedBugs.length})` : `(${bugs.length})`}</button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {displayedBugs.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'rgba(26,42,58,0.35)', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em' }}>NO BUGS IN THIS FILTER</div>}
              {displayedBugs.map(b => (
                <Card key={b.id} style={{ borderLeft: b.status === 'resolved' ? '3px solid rgba(26,42,58,0.12)' : `3px solid ${PINK}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <Chip label={b.page || 'Unknown'} color={ORANGE} />
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(26,42,58,0.35)' }}>{timeAgo(b.created_at)}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(26,42,58,0.35)' }}>{b.profiles?.first_name || b.profiles?.email || 'Unknown'}</span>
                      </div>
                      <div style={{ fontSize: 14, color: '#1a2a3a', lineHeight: 1.5, marginBottom: b.browser_info ? 8 : 0 }}>{b.description}</div>
                      {b.browser_info && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(26,42,58,0.3)', marginTop: 6, wordBreak: 'break-all' }}>{b.browser_info.slice(0, 120)}{b.browser_info.length > 120 ? '…' : ''}</div>}
                    </div>
                    {b.status !== 'resolved' && (
                      <button onClick={() => markBugResolved(b.id)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', padding: '6px 12px', borderRadius: 8, border: `1px solid ${CYAN}40`, background: `${CYAN}10`, color: CYAN, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>RESOLVE</button>
                    )}
                    {b.status === 'resolved' && <Chip label="RESOLVED" color={CYAN} />}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── FEEDBACK TAB ── */}
        {tab === 'feedback' && (
          <div>
            {/* User selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              <button onClick={() => setFeedbackUser(null)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '6px 14px', borderRadius: 8, border: 'none', background: !feedbackUser ? ACCENT : 'rgba(26,42,58,0.07)', color: !feedbackUser ? '#fff' : 'rgba(26,42,58,0.5)', cursor: 'pointer' }}>ALL</button>
              {Object.entries(feedbackByUser).map(([uid, { user }]) => {
                const u = users.find(x => x.id === uid)
                const name = u?.first_name || user?.first_name || user?.email?.split('@')[0] || 'Unknown'
                return (
                  <button key={uid} onClick={() => setFeedbackUser(uid)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '6px 14px', borderRadius: 8, border: 'none', background: feedbackUser === uid ? ACCENT : 'rgba(26,42,58,0.07)', color: feedbackUser === uid ? '#fff' : 'rgba(26,42,58,0.5)', cursor: 'pointer' }}>{name.toUpperCase()}</button>
                )
              })}
            </div>

            {/* Feedback items */}
            {Object.entries(feedbackByUser)
              .filter(([uid]) => !feedbackUser || uid === feedbackUser)
              .map(([uid, { items, user }]) => {
                const u = users.find(x => x.id === uid)
                const name = u?.first_name || user?.first_name || user?.email?.split('@')[0] || 'Unknown'
                const postEntry = items.filter(f => f.feedback_type === 'post_entry')
                const other = items.filter(f => f.feedback_type !== 'post_entry')
                const topicAvg = avg(postEntry.map(f => f.topic_rating).filter(Boolean))
                const clarityAvg = avg(postEntry.map(f => f.clarity_rating).filter(Boolean))
                const quizAvg = avg(postEntry.map(f => f.quiz_rating).filter(Boolean))
                const overallAvg = avg(postEntry.map(f => f.overall_rating).filter(Boolean))

                return (
                  <Card key={uid} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#1a2a3a', marginBottom: 3 }}>{name}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(26,42,58,0.35)' }}>{items.length} ITEMS TOTAL · {postEntry.length} POST-LESSON</div>
                      </div>
                      {/* Score summary */}
                      {topicAvg && (
                        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                          {[{ l: 'TOPIC', v: topicAvg, c: YELLOW }, { l: 'CLARITY', v: clarityAvg, c: CYAN }, { l: 'QUIZ', v: quizAvg, c: PURPLE }].map(s => s.v ? (
                            <div key={s.l} style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 16, fontWeight: 700, color: s.c, letterSpacing: '-0.02em' }}>{s.v}</div>
                              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, color: 'rgba(26,42,58,0.35)', letterSpacing: '0.08em' }}>{s.l}</div>
                            </div>
                          ) : null)}
                        </div>
                      )}
                    </div>

                    {/* Comments */}
                    {items.filter(f => f.comment || f.biggest_win || f.missing_topics).slice(0, 5).map((f, i) => (
                      <div key={i} style={{ borderTop: '1px solid rgba(26,42,58,0.07)', paddingTop: 12, marginTop: 12 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                          <Chip label={f.feedback_type?.replace('_', '-').toUpperCase() || 'FEEDBACK'} color={f.feedback_type === 'weekly' ? YELLOW : f.feedback_type === 'end_of_beta' ? PINK : CYAN} />
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(26,42,58,0.35)' }}>{timeAgo(f.created_at)}</span>
                          {f.overall_rating && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(26,42,58,0.35)' }}>{f.overall_rating}/5</span>}
                        </div>
                        {f.comment && <div style={{ fontSize: 13, color: '#1a2a3a', lineHeight: 1.6, marginBottom: f.biggest_win ? 6 : 0 }}>{f.comment}</div>}
                        {f.biggest_win && <div style={{ fontSize: 13, color: 'rgba(26,42,58,0.7)', lineHeight: 1.6, fontStyle: 'italic' }}>"{f.biggest_win}"</div>}
                        {f.missing_topics && f.missing_topics.length > 20 && (
                          <div style={{ fontSize: 11, color: 'rgba(26,42,58,0.4)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.04em', marginTop: 6, wordBreak: 'break-word' }}>{f.missing_topics.slice(0, 200)}{f.missing_topics.length > 200 ? '…' : ''}</div>
                        )}
                      </div>
                    ))}
                    {items.filter(f => f.comment || f.biggest_win).length > 5 && (
                      <div style={{ marginTop: 10, fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(26,42,58,0.35)', cursor: 'pointer' }}>+{items.filter(f => f.comment || f.biggest_win).length - 5} MORE</div>
                    )}
                  </Card>
                )
              })}
            {feedback.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'rgba(26,42,58,0.35)', fontFamily: "'DM Mono', monospace", fontSize: 10 }}>NO FEEDBACK YET</div>}
          </div>
        )}

        {/* ── API HEALTH TAB ── */}
        {tab === 'apis' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <button onClick={checkApis} disabled={apiChecking} style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.12em', padding: '10px 24px', borderRadius: 10, border: 'none', background: ACCENT, color: '#fff', cursor: apiChecking ? 'default' : 'pointer', opacity: apiChecking ? 0.6 : 1 }}>
                {apiChecking ? 'CHECKING…' : 'RUN HEALTH CHECK →'}
              </button>
            </div>

            {Object.keys(apiStatus).length === 0 && !apiChecking && (
              <Card style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', color: 'rgba(26,42,58,0.35)', marginBottom: 8 }}>NO RESULTS YET</div>
                <div style={{ fontSize: 13, color: 'rgba(26,42,58,0.5)' }}>Run a health check to see API status.</div>
              </Card>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(apiStatus).map(([key, s]) => (
                <Card key={key} style={{ borderLeft: `3px solid ${s.ok ? CYAN : PINK}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <StatusDot color={s.ok ? CYAN : PINK} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2a3a', marginBottom: 3 }}>{s.label}</div>
                        <div style={{ fontSize: 12, color: 'rgba(26,42,58,0.5)' }}>{s.detail}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <Chip label={s.ok ? 'OK' : 'FAIL'} color={s.ok ? CYAN : PINK} />
                      {s.ms != null && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(26,42,58,0.35)', marginTop: 4 }}>{s.ms}ms</div>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Resend note */}
            <Card style={{ marginTop: 16, background: `${YELLOW}18`, border: `1px solid ${YELLOW}40` }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ fontSize: 16 }}>⚠</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a2a3a', marginBottom: 4 }}>Resend API key is critical</div>
                  <div style={{ fontSize: 13, color: 'rgba(26,42,58,0.6)', lineHeight: 1.6 }}>If the email check fails, verify the RESEND_API_KEY secret in Supabase Edge Functions settings. This was the cause of the week-long email outage. The key must be set on each edge function individually.</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ── EMAIL TAB ── */}
        {tab === 'email' && (
          <div>
            <SectionLabel>EDGE FUNCTIONS</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { name: 'send-daily-reminder', label: 'Daily Reminder', schedule: '12:00 UTC daily', color: CYAN },
                { name: 'send-practice-reminder', label: 'Practice Reminder', schedule: 'Every hour (6h post-completion)', color: YELLOW },
                { name: 'send-weekly-wrap', label: 'Weekly Wrap', schedule: '11:00 UTC daily', color: PURPLE },
              ].map(fn => (
                <Card key={fn.name} style={{ borderTop: `3px solid ${fn.color}` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a2a3a', marginBottom: 4 }}>{fn.label}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(26,42,58,0.4)', letterSpacing: '0.06em', marginBottom: 12 }}>{fn.schedule}</div>
                  <Chip label={fn.name} color={fn.color} />
                </Card>
              ))}
            </div>
            <Card style={{ background: `${PINK}0d`, border: `1px solid ${PINK}30` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a2a3a', marginBottom: 8 }}>If emails stop working</div>
              <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Check Supabase → Edge Functions → each function → Secrets', 'Verify RESEND_API_KEY is set and not expired', 'Go to resend.com → API Keys → confirm key is active', 'Check Resend dashboard for bounce/block events', 'Re-add the key to all three edge functions if rotated'].map((step, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'rgba(26,42,58,0.7)', lineHeight: 1.5 }}>{step}</li>
                ))}
              </ol>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}
