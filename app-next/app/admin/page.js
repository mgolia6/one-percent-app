'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { TOTAL_ENTRIES } from '@/lib/config'
import { CATEGORIES } from '@/lib/categories'

const ACCENT = '#33506e'
const CYAN = '#47FFE8'
const YELLOW = '#E8FF47'
const PINK = '#FF4778'
const PURPLE = '#C847FF'
const ORANGE = '#FF8C47'

const CAT_COLORS = Object.fromEntries(CATEGORIES.map(c => [c.key, c.color]))

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

// Weekly surveys cram every answer into one pipe-delimited string
// ("entries:1-2 | time:No pattern | device:Phone | ..."). Parse it back into
// key/value pairs so it can render as a scannable table instead of a wall.
function parseKV(text) {
  if (!text || !text.includes('|') || !text.includes(':')) return null
  const parts = text.split('|').map(s => s.trim()).filter(Boolean)
  const pairs = []
  for (const p of parts) {
    const idx = p.indexOf(':')
    if (idx === -1) return null // not clean key:value — treat as free text
    const k = p.slice(0, idx).trim()
    const v = p.slice(idx + 1).trim()
    if (!k) return null
    pairs.push({ k, v })
  }
  return pairs.length >= 2 ? pairs : null
}

function SurveyDetail({ text }) {
  const pairs = parseKV(text)
  if (!pairs) {
    return (
      <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.7)', lineHeight: 1.6 }}>
        <span style={{ color: ORANGE, fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', marginRight: 6 }}>NOTES</span>{text}
      </div>
    )
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(88px,auto) 1fr', gap: '7px 12px', alignItems: 'baseline' }}>
      {pairs.map((p, i) => (
        <React.Fragment key={i}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8.5, letterSpacing: '0.06em', color: 'rgba(232,238,245,0.4)', textTransform: 'uppercase' }}>{p.k.replace(/_/g, ' ')}</div>
          <div style={{ fontSize: 13, color: '#e8eef5', lineHeight: 1.45 }}>{p.v}</div>
        </React.Fragment>
      ))}
    </div>
  )
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

function ReviewToggle({ reviewed, onToggle }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle() }}
      title={reviewed ? 'Synthesized & addressed — tap to unmark' : 'Mark as synthesized & addressed in an update'}
      style={{
        fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.08em', padding: '5px 10px',
        borderRadius: 7, cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap',
        border: reviewed ? `1px solid ${CYAN}` : '1px solid rgba(232,238,245,0.18)',
        background: reviewed ? `${CYAN}18` : 'transparent',
        color: reviewed ? CYAN : 'rgba(232,238,245,0.45)',
      }}
    >
      {reviewed ? '✓ ADDRESSED' : 'MARK ADDRESSED'}
    </button>
  )
}

function Card({ children, style }) {
  return (
    <div style={{ background: '#1a2a3a', borderRadius: 14, padding: '18px 20px', border: '1px solid rgba(232,238,245,0.08)', boxShadow: '0 1px 4px rgba(232,238,245,0.04)', ...style }}>
      {children}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: 'rgba(232,238,245,0.4)', marginBottom: 12, marginTop: 4 }}>
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
      color: active ? '#fff' : 'rgba(232,238,245,0.5)',
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
  const [analyticsData, setAnalyticsData] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState(null)
  const [resetBlastState, setResetBlastState] = useState('idle') // idle | confirm | sending | done | error
  const [systems, setSystems] = useState(null)
  const [aiSummary, setAiSummary] = useState({ state: 'idle', text: '' }) // idle | loading | done | error
  const [phoneEdits, setPhoneEdits] = useState({})
  const [phoneSaving, setPhoneSaving] = useState(null)

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

  useEffect(() => {
    if (tab === 'analytics' && !analyticsData && !analyticsLoading) {
      loadAnalytics()
    }
  }, [tab])

  async function loadAll() {
    const [{ data: fb }, { data: br }, { data: us }, { data: comps }, { data: locks }, { data: otd }] = await Promise.all([
      supabase.from('feedback').select('*, profiles(email, first_name)').order('created_at', { ascending: false }),
      supabase.from('bug_reports').select('*, profiles(email, first_name)').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, email, name, first_name, last_name, phone, email_reminders, signup_date, current_streak, longest_streak, last_active_date, onboarding_complete, is_admin, avatar_url').order('signup_date', { ascending: false }),
      supabase.from('completions').select('user_id, entry_number, score, completed_at, answers'),
      supabase.from('lockins').select('id, user_id, status, due_at'),
      supabase.from('on_this_day').select('date'),
    ])
    setFeedback(fb || [])
    setBugs(br || [])
    setUsers(us || [])
    // Systems snapshot — Keep It Sharp (spaced repetition) + On This Day.
    const nowIso = new Date().toISOString()
    const active = (locks || []).filter(l => l.status === 'active')
    const chatCompletions = (comps || []).filter(c => c.answers?.mode === 'chat').length
    setSystems({
      lockinsActive: active.length,
      lockinsDue: active.filter(l => l.due_at && l.due_at <= nowIso).length,
      lockinsUsers: new Set(active.map(l => l.user_id)).size,
      otdCount: (otd || []).length,
      otdToday: (otd || []).some(o => o.date === nowIso.slice(0, 10)),
      chatLockins: chatCompletions,
    })
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

  async function saveUserPhone(userId) {
    const value = (phoneEdits[userId] ?? '').trim()
    setPhoneSaving(userId)
    const { error } = await supabase.from('profiles').update({ phone: value || null }).eq('id', userId)
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, phone: value || null } : u))
      setPhoneEdits(prev => { const n = { ...prev }; delete n[userId]; return n })
    }
    setPhoneSaving(null)
  }

  async function toggleReviewed(id, current) {
    // Optimistic flip; revert on failure.
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, reviewed: !current } : f))
    const { error } = await supabase.from('feedback').update({ reviewed: !current }).eq('id', id)
    if (error) setFeedback(prev => prev.map(f => f.id === id ? { ...f, reviewed: current } : f))
  }

  async function summarizeFeedback(scopeItems) {
    setAiSummary({ state: 'loading', text: '' })
    try {
      const items = scopeItems
        .map(f => ({ type: f.feedback_type, rating: f.overall_rating, recommend: f.would_recommend, comment: f.comment, missing: f.missing_topics, win: f.biggest_win }))
        .filter(x => x.comment || x.missing || x.win)
      if (!items.length) { setAiSummary({ state: 'done', text: 'No written feedback to summarize yet.' }); return }
      const res = await fetch('/api/admin/feedback-summary', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Summary failed')
      setAiSummary({ state: 'done', text: data.summary })
    } catch (e) {
      setAiSummary({ state: 'error', text: e.message })
    }
  }

  async function sendPasswordResetBlast() {
    setResetBlastState('sending')
    try {
      const targets = users.filter(u => !u.is_admin)
      for (const u of targets) {
        await supabase.auth.resetPasswordForEmail(u.email, {
          redirectTo: `${window.location.origin}/reset-password`
        })
      }
      setResetBlastState('done')
    } catch (e) {
      console.error('Reset blast error:', e)
      setResetBlastState('error')
    }
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

    // Auth check
    try {
      const start = Date.now()
      const { data: { session } } = await supabase.auth.getSession()
      results.auth = { ok: !!session, ms: Date.now() - start, label: 'Supabase Auth', detail: session ? 'Session valid' : 'No session' }
    } catch(e) {
      results.auth = { ok: false, ms: null, label: 'Supabase Auth', detail: e.message }
    }

    // Claude API + server env (via non-destructive /api/health probe).
    // NOTE: we intentionally do NOT ping the email senders — invoking them
    // actually sends reminder emails to users.
    try {
      const start = Date.now()
      const res = await fetch('/api/health')
      const h = await res.json()
      results.claude = {
        ok: !!h.claude?.ok,
        ms: h.claude?.ms ?? (Date.now() - start),
        label: 'Claude API · Deep Cut / Lock It In / On This Day',
        detail: h.claude?.ok ? 'Key valid, model reachable' : (h.claude?.error || 'Failed'),
      }
      results.serviceKey = {
        ok: !!h.env?.serviceKey,
        ms: null,
        label: 'Service-role key · On This Day cron',
        detail: h.env?.serviceKey ? 'Configured in Vercel' : "Missing — daily card cron can't persist",
      }
    } catch(e) {
      results.claude = { ok: false, ms: null, label: 'Claude API', detail: e.message }
    }

    setApiStatus(results)
    setApiChecking(false)
  }

  async function setBugStatus(id, status) {
    setBugs(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    const { error } = await supabase.from('bug_reports').update({ status }).eq('id', id)
    if (error) loadAll() // resync on failure
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

  async function loadAnalytics() {
    setAnalyticsLoading(true)
    setAnalyticsError(null)
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    // Queries run server-side via /api/admin/analytics (holds the PostHog
    // personal key; verifies this caller is an admin).
    async function phQuery(query) {
      const res = await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ query }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `Analytics ${res.status}`)
      return json.results || []
    }

    try {
      const [todayRows, funnelRows, promptRows, signalRows, entryPerfRows] = await Promise.all([
        // Today counts
        phQuery(`
          SELECT event, count() as n FROM events
          WHERE event IN ('entry_opened','entry_completed','quiz_submitted')
            AND toDate(timestamp) = today()
          GROUP BY event
        `),
        // 7-day funnel
        phQuery(`
          SELECT
            countIf(event = 'entry_opened') as opened,
            countIf(event = 'entry_tab_switched' AND JSONExtractString(properties,'to_tab') = 'midday') as to_midday,
            countIf(event = 'entry_tab_switched' AND JSONExtractString(properties,'to_tab') = 'evening') as to_evening,
            countIf(event = 'quiz_submitted') as quiz_done
          FROM events
          WHERE event IN ('entry_opened','entry_tab_switched','quiz_submitted')
            AND timestamp >= now() - INTERVAL 7 DAY
        `),
        // Top AI prompt copies
        phQuery(`
          SELECT JSONExtractString(properties,'concept') as concept,
                 JSONExtractString(properties,'entry_number') as entry_num,
                 count() as copies
          FROM events WHERE event = 'ai_prompt_copied'
          GROUP BY concept, entry_num ORDER BY copies DESC LIMIT 5
        `),
        // Engagement signals last 7 days
        phQuery(`
          SELECT event, count() as n FROM events
          WHERE event IN ('goal_committed','badge_earned','streak_updated','entry_feedback_submitted','ai_prompt_copied')
            AND timestamp >= now() - INTERVAL 7 DAY
          GROUP BY event
        `),
        // Per-entry quiz stats
        phQuery(`
          SELECT JSONExtractString(properties,'entry_number') as entry_num,
                 JSONExtractString(properties,'concept') as concept,
                 count() as submissions,
                 avg(JSONExtractFloat(properties,'score')) as avg_score,
                 countIf(JSONExtractBool(properties,'perfect') = true) as perfects
          FROM events WHERE event = 'quiz_submitted'
          GROUP BY entry_num, concept
          ORDER BY toInt32OrNull(entry_num) ASC LIMIT 40
        `),
      ])

      const todayMap = {}
      todayRows.forEach(([event, n]) => { todayMap[event] = n })

      const [opened=0, toMidday=0, toEvening=0, quizDone=0] = funnelRows[0] || []
      const funnel = [
        { label: 'OPENED', n: opened, pct: 100 },
        { label: 'IN THE WILD', n: toMidday, pct: opened > 0 ? Math.round((toMidday/opened)*100) : 0 },
        { label: 'LOCK IT IN', n: toEvening, pct: opened > 0 ? Math.round((toEvening/opened)*100) : 0 },
        { label: 'QUIZ DONE', n: quizDone, pct: opened > 0 ? Math.round((quizDone/opened)*100) : 0 },
      ]

      const signalMap = {}
      signalRows.forEach(([event, n]) => { signalMap[event] = n })

      const topPrompts = promptRows.map(([concept, entryNum, copies]) => ({ concept, entryNum, copies }))

      const entryPerf = entryPerfRows.map(([entryNum, concept, submissions, avgScore, perfects]) => ({
        entryNum, concept,
        submissions,
        avgScore: avgScore != null ? Math.round(avgScore * 10) / 10 : null,
        perfects,
        perfectPct: submissions > 0 ? Math.round((perfects/submissions)*100) : 0,
      }))

      setAnalyticsData({ todayMap, funnel, signalMap, topPrompts, entryPerf })
    } catch (e) {
      setAnalyticsError(e.message)
    }
    setAnalyticsLoading(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0e141c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: 'rgba(232,238,245,0.4)' }}>LOADING...</div>
    </div>
  )

  const nonAdminUsers = users.filter(u => !u.is_admin)
  const openBugs = bugs.filter(b => b.status === 'open' || !b.status)
  const resolvedBugs = bugs.filter(b => b.status === 'resolved')
  const wontFixBugs = bugs.filter(b => b.status === 'wont_fix')
  const displayedBugs = bugFilter === 'all' ? bugs
    : bugFilter === 'open' ? openBugs
    : bugFilter === 'resolved' ? resolvedBugs
    : wontFixBugs

  // Feedback by user
  const feedbackByUser = {}
  feedback.forEach(f => {
    const uid = f.user_id
    if (!feedbackByUser[uid]) feedbackByUser[uid] = { items: [], user: f.profiles }
    feedbackByUser[uid].items.push(f)
  })

  const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : null

  // Feedback summary + surveys (respects the active user filter)
  const SURVEY_TYPES = ['weekly', 'midpoint', 'final']
  const fbScope = feedbackUser ? feedback.filter(f => f.user_id === feedbackUser) : feedback
  const surveyItems = fbScope.filter(f => SURVEY_TYPES.includes(f.feedback_type))
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
  const userName = (uid) => {
    const u = users.find(x => x.id === uid)
    return u?.first_name || u?.email?.split('@')[0] || 'Unknown'
  }
  const fbSummary = {
    total: fbScope.length,
    byType: fbScope.reduce((acc, f) => { acc[f.feedback_type] = (acc[f.feedback_type] || 0) + 1; return acc }, {}),
    topic: avg(fbScope.map(f => f.topic_rating).filter(Boolean)),
    clarity: avg(fbScope.map(f => f.clarity_rating).filter(Boolean)),
    quiz: avg(fbScope.map(f => f.quiz_rating).filter(Boolean)),
    overall: avg(fbScope.map(f => f.overall_rating).filter(Boolean)),
    recommend: surveyItems.reduce((acc, f) => { if (f.would_recommend) acc[f.would_recommend] = (acc[f.would_recommend] || 0) + 1; return acc }, {}),
    missing: fbScope.map(f => f.missing_topics).filter(t => t && t.trim().length > 2),
    wins: fbScope.map(f => f.biggest_win).filter(t => t && t.trim().length > 2),
    addressed: fbScope.filter(f => f.reviewed).length,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0e141c', fontFamily: "'DM Sans', sans-serif", color: '#e8eef5' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .admin-tabs::-webkit-scrollbar{display:none;}
        .nudge-overlay{position:fixed;inset:0;background:rgba(10,14,22,0.6);backdrop-filter:blur(8px);display:flex;align-items:flex-end;justify-content:center;z-index:200;}
        textarea{resize:vertical;}
        /* KPI row */
        .admin-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}
        /* User card header */
        .au-head{display:flex;align-items:center;gap:14px;padding:16px 18px;cursor:pointer;}
        .au-id{display:flex;align-items:center;gap:12px;flex:1;min-width:0;}
        .au-stats{display:flex;gap:22px;align-items:center;flex-shrink:0;}
        .au-actions{display:flex;gap:8px;align-items:center;flex-shrink:0;}
        .au-stat{text-align:center;min-width:38px;}
        .au-ell{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        @media(max-width:640px){
          .admin-content{padding:16px 14px 60px!important;}
          .admin-header{padding:12px 14px!important;}
          .admin-kpis{grid-template-columns:repeat(2,1fr);}
          .au-head{flex-wrap:wrap;gap:10px 12px;}
          .au-id{order:1;}
          .au-actions{order:2;margin-left:auto;}
          .au-stats{order:3;flex-basis:100%;justify-content:space-between;gap:8px;border-top:1px solid rgba(232,238,245,0.07);padding-top:12px;}
        }
      `}</style>

      {/* NUDGE MODAL */}
      {nudgeUser && (
        <div className="nudge-overlay" onClick={e => e.target.className === 'nudge-overlay' && setNudgeUser(null)}>
          <div style={{ background: '#1a2a3a', width: '100%', maxWidth: 480, borderRadius: '20px 20px 0 0', padding: '24px 24px 48px' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(232,238,245,0.12)', margin: '0 auto 20px' }} />
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'rgba(232,238,245,0.4)', marginBottom: 6 }}>NUDGE</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: '#e8eef5', marginBottom: 4 }}>{nudgeUser.first_name || nudgeUser.email}</div>
            <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.5)', marginBottom: 20 }}>{nudgeUser.phone ? nudgeUser.phone : 'No phone number on file — SMS unavailable'}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', color: 'rgba(232,238,245,0.5)', marginBottom: 8 }}>MESSAGE</div>
            <textarea
              value={nudgeMsg}
              onChange={e => setNudgeMsg(e.target.value)}
              placeholder={`Hey ${nudgeUser.first_name || 'there'}, just checking in — how's One Percent going?`}
              style={{ width: '100%', background: 'rgba(232,238,245,0.04)', border: '1px solid rgba(232,238,245,0.12)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#e8eef5', minHeight: 100, outline: 'none', fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setNudgeUser(null)} style={{ flex: 1, padding: 12, background: 'transparent', border: '1px solid rgba(232,238,245,0.12)', borderRadius: 10, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.5)', cursor: 'pointer' }}>CANCEL</button>
              <button
                onClick={() => {
                  if (nudgeUser.phone) {
                    window.open(`sms:${nudgeUser.phone}?body=${encodeURIComponent(nudgeMsg)}`)
                  } else {
                    alert('No phone number on file. Add one in Supabase profiles table.')
                  }
                  setNudgeUser(null)
                }}
                style={{ flex: 2, padding: 12, background: '#33506e', border: 'none', borderRadius: 10, fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                {nudgeUser.phone ? 'SEND SMS →' : 'COPY MESSAGE →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="admin-header" style={{ background: 'rgba(14,20,28,0.9)', backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(232,238,245,0.07)', padding: '14px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, letterSpacing: '0.16em', color: '#e8eef5' }}>ONE PERCENT</span>
            <Chip label="ADMIN" color={CYAN} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={refreshAll} disabled={refreshing} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(232,238,245,0.12)', background: 'transparent', color: 'rgba(232,238,245,0.5)', cursor: 'pointer' }}>
              {refreshing ? 'REFRESHING…' : '↺ REFRESH'}
            </button>
            <button onClick={() => router.push('/')} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '6px 12px', borderRadius: 8, border: 'none', background: '#33506e', color: '#fff', cursor: 'pointer' }}>← APP</button>
          </div>
        </div>
      </div>

      <div className="admin-content" style={{ maxWidth: 960, margin: '0 auto', padding: '20px 24px 60px' }}>

        {/* QUICK KPI ROW */}
        <div className="admin-kpis" style={{ marginBottom: 24 }}>
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
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.4)', marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em', color: k.color, lineHeight: 1 }}>{k.val}</div>
            </Card>
          ))}
        </div>

        {/* SYSTEMS STRIP — Keep It Sharp + On This Day */}
        {systems && (
          <Card style={{ marginBottom: 24, padding: '14px 18px' }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.16em', color: 'rgba(232,238,245,0.4)', marginBottom: 12 }}>SYSTEMS</div>
            <div className="admin-kpis">
              {[
                { label: 'SHARP · ACTIVE', val: systems.lockinsActive, sub: `${systems.lockinsUsers} user${systems.lockinsUsers === 1 ? '' : 's'}`, color: CYAN },
                { label: 'SHARP · DUE NOW', val: systems.lockinsDue, sub: 'to review', color: systems.lockinsDue > 0 ? ORANGE : CYAN },
                { label: 'LOCK IT IN · CHATS', val: systems.chatLockins, sub: 'AI sessions', color: PURPLE },
                { label: 'ON THIS DAY', val: systems.otdCount, sub: systems.otdToday ? "today ✓" : 'today pending', color: systems.otdToday ? YELLOW : ORANGE },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.12em', color: 'rgba(232,238,245,0.4)', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.025em', color: s.color, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.06em', color: 'rgba(232,238,245,0.35)', marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* TAB NAV */}
        <div className="admin-tabs" style={{ display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none', background: 'rgba(232,238,245,0.05)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
          <TabBtn id="users" label="USERS" active={tab==='users'} onClick={setTab} />
          <TabBtn id="bugs" label="BUGS" active={tab==='bugs'} onClick={setTab} badge={openBugs.length} />
          <TabBtn id="feedback" label="FEEDBACK" active={tab==='feedback'} onClick={setTab} />
          <TabBtn id="analytics" label="ANALYTICS" active={tab==='analytics'} onClick={setTab} />
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
                  <div className="au-head" onClick={() => setExpandedUser(isExpanded ? null : u.id)}>
                    <div className="au-id">
                      <StatusDot color={dotColor} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <span className="au-ell" style={{ fontSize: 15, fontWeight: 600, color: '#e8eef5', maxWidth: '100%' }}>{name}</span>
                          {!u.onboarding_complete && <Chip label="ONBOARDING" color={ORANGE} />}
                        </div>
                        <div className="au-ell" style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.4)', letterSpacing: '0.05em' }}>{u.email}</div>
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="au-stats">
                      <div className="au-stat">
                        <div style={{ fontSize: 18, fontWeight: 700, color: CYAN, letterSpacing: '-0.02em' }}>{comp.count}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.35)' }}>DONE</div>
                      </div>
                      <div className="au-stat">
                        <div style={{ fontSize: 18, fontWeight: 700, color: YELLOW, letterSpacing: '-0.02em' }}>{u.current_streak || 0}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.35)' }}>STREAK</div>
                      </div>
                      <div className="au-stat">
                        <div style={{ fontSize: 13, fontWeight: 600, color: dotColor }}>{timeAgo(lastActive)}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.35)' }}>LAST SEEN</div>
                      </div>
                    </div>
                    {/* Nudge + expand */}
                    <div className="au-actions">
                      <button
                        onClick={e => { e.stopPropagation(); setNudgeMsg(''); setNudgeUser(u) }}
                        style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', padding: '7px 13px', borderRadius: 8, border: `1px solid ${CYAN}40`, background: `${CYAN}10`, color: CYAN, cursor: 'pointer', fontWeight: 600 }}
                      >NUDGE</button>
                      <span style={{ color: 'rgba(232,238,245,0.25)', fontSize: 16, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>⌄</span>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid rgba(232,238,245,0.07)', padding: '16px 18px', background: 'rgba(232,238,245,0.02)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
                        {[
                          { l: 'SIGNED UP', v: daysSinceSignup != null ? `${daysSinceSignup}d ago` : '—' },
                          { l: 'AVG SCORE', v: avgScore ? `${avgScore}/3` : '—' },
                          { l: 'BEST STREAK', v: `${u.longest_streak || 0}d` },
                        ].map(s => (
                          <div key={s.l} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(232,238,245,0.07)' }}>
                            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.35)', marginBottom: 5 }}>{s.l}</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: '#e8eef5' }}>{s.v}</div>
                          </div>
                        ))}
                      </div>
                      {/* Completion progress bar */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.4)' }}>PROGRESS</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(232,238,245,0.4)' }}>{comp.count}/{TOTAL_ENTRIES}</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(232,238,245,0.08)', borderRadius: 2 }}>
                          <div style={{ height: '100%', width: `${Math.round((comp.count / TOTAL_ENTRIES) * 100)}%`, background: CYAN, borderRadius: 2, transition: 'width 0.5s' }} />
                        </div>
                      </div>
                      {/* Feedback count */}
                      {feedbackByUser[u.id] && (
                        <div style={{ marginBottom: 16, fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.4)', letterSpacing: '0.08em', cursor: 'pointer' }}
                          onClick={() => { setFeedbackUser(u.id); setTab('feedback') }}>
                          {feedbackByUser[u.id].items.length} FEEDBACK ITEMS → VIEW
                        </div>
                      )}
                      {/* Phone — admin can add numbers collected off-platform */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.12em', color: 'rgba(232,238,245,0.4)', marginBottom: 6 }}>CELL PHONE {u.phone ? '· ON FILE' : '· NONE'}</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input
                            type="tel"
                            value={phoneEdits[u.id] ?? u.phone ?? ''}
                            onChange={e => setPhoneEdits(p => ({ ...p, [u.id]: e.target.value }))}
                            placeholder="+1 555 123 4567"
                            onClick={e => e.stopPropagation()}
                            style={{ flex: 1, minWidth: 0, padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(232,238,245,0.14)', background: 'rgba(255,255,255,0.05)', fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#e8eef5', outline: 'none' }}
                          />
                          <button
                            onClick={e => { e.stopPropagation(); saveUserPhone(u.id) }}
                            disabled={phoneSaving === u.id || (phoneEdits[u.id] ?? u.phone ?? '') === (u.phone ?? '')}
                            style={{ padding: '9px 16px', borderRadius: 8, border: 'none', background: CYAN, color: '#0a1420', fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.08em', fontWeight: 600, cursor: 'pointer', opacity: (phoneSaving === u.id || (phoneEdits[u.id] ?? u.phone ?? '') === (u.phone ?? '')) ? 0.4 : 1 }}
                          >{phoneSaving === u.id ? 'SAVING…' : 'SAVE'}</button>
                        </div>
                      </div>
                      {/* Reset actions */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        {resetConfirm === u.id + '-data' ? (
                          <>
                            <button onClick={() => resetUserData(u.id)} disabled={!!resetting} style={{ flex: 1, padding: '8px 12px', background: ORANGE, color: '#fff', border: 'none', borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', cursor: 'pointer', fontWeight: 600 }}>CONFIRM RESET DATA</button>
                            <button onClick={() => setResetConfirm(null)} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid rgba(232,238,245,0.12)', borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(232,238,245,0.5)', cursor: 'pointer' }}>CANCEL</button>
                          </>
                        ) : resetConfirm === u.id + '-hard' ? (
                          <>
                            <button onClick={() => hardResetUser(u.id)} disabled={!!resetting} style={{ flex: 1, padding: '8px 12px', background: PINK, color: '#fff', border: 'none', borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', cursor: 'pointer', fontWeight: 600 }}>CONFIRM HARD RESET</button>
                            <button onClick={() => setResetConfirm(null)} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid rgba(232,238,245,0.12)', borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(232,238,245,0.5)', cursor: 'pointer' }}>CANCEL</button>
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
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {[['open','OPEN',openBugs.length],['resolved','RESOLVED',resolvedBugs.length],['wont_fix',"WON'T FIX",wontFixBugs.length],['all','ALL',bugs.length]].map(([k,l,n]) => (
                <button key={k} onClick={() => setBugFilter(k)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '6px 14px', borderRadius: 8, border: 'none', background: bugFilter === k ? ACCENT : 'rgba(232,238,245,0.07)', color: bugFilter === k ? '#fff' : 'rgba(232,238,245,0.5)', cursor: 'pointer' }}>{l} ({n})</button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {displayedBugs.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'rgba(232,238,245,0.35)', fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.1em' }}>NO BUGS IN THIS FILTER</div>}
              {displayedBugs.map(b => {
                const status = b.status || 'open'
                const isOpen = status === 'open'
                const accent = status === 'resolved' ? CYAN : status === 'wont_fix' ? 'rgba(232,238,245,0.3)' : PINK
                return (
                <Card key={b.id} style={{ borderLeft: `3px solid ${accent}`, opacity: isOpen ? 1 : 0.72 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <Chip label={b.page || 'Unknown'} color={ORANGE} />
                    {!isOpen && <Chip label={status === 'resolved' ? 'RESOLVED' : "WON'T FIX"} color={status === 'resolved' ? CYAN : 'rgba(120,130,140,1)'} />}
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.35)' }}>{timeAgo(b.created_at)}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.35)' }}>{b.profiles?.first_name || b.profiles?.email || 'Unknown'}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#e8eef5', lineHeight: 1.5, marginBottom: b.browser_info ? 8 : 12 }}>{b.description}</div>
                  {b.browser_info && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(232,238,245,0.3)', marginTop: 6, marginBottom: 12, wordBreak: 'break-all' }}>{b.browser_info.slice(0, 120)}{b.browser_info.length > 120 ? '…' : ''}</div>}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {isOpen ? (
                      <>
                        <button onClick={() => setBugStatus(b.id, 'resolved')} style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', padding: '7px 14px', borderRadius: 8, border: `1px solid ${CYAN}40`, background: `${CYAN}10`, color: CYAN, cursor: 'pointer', fontWeight: 600 }}>✓ RESOLVE</button>
                        <button onClick={() => setBugStatus(b.id, 'wont_fix')} style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(232,238,245,0.18)', background: 'transparent', color: 'rgba(232,238,245,0.5)', cursor: 'pointer' }}>WON'T FIX</button>
                      </>
                    ) : (
                      <button onClick={() => setBugStatus(b.id, 'open')} style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', padding: '7px 14px', borderRadius: 8, border: `1px solid ${ORANGE}40`, background: `${ORANGE}10`, color: ORANGE, cursor: 'pointer', fontWeight: 600 }}>↺ REOPEN</button>
                    )}
                  </div>
                </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* ── FEEDBACK TAB ── */}
        {tab === 'feedback' && (
          <div>
            {/* User selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              <button onClick={() => setFeedbackUser(null)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '6px 14px', borderRadius: 8, border: 'none', background: !feedbackUser ? ACCENT : 'rgba(232,238,245,0.07)', color: !feedbackUser ? '#fff' : 'rgba(232,238,245,0.5)', cursor: 'pointer' }}>ALL</button>
              {Object.entries(feedbackByUser).map(([uid, { user }]) => {
                const u = users.find(x => x.id === uid)
                const name = u?.first_name || user?.first_name || user?.email?.split('@')[0] || 'Unknown'
                return (
                  <button key={uid} onClick={() => setFeedbackUser(uid)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '6px 14px', borderRadius: 8, border: 'none', background: feedbackUser === uid ? ACCENT : 'rgba(232,238,245,0.07)', color: feedbackUser === uid ? '#fff' : 'rgba(232,238,245,0.5)', cursor: 'pointer' }}>{name.toUpperCase()}</button>
                )
              })}
            </div>

            {/* SUMMARY */}
            <Card style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#e8eef5' }}>{feedbackUser ? userName(feedbackUser) : 'All testers'} · summary</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.35)', marginTop: 3 }}>
                    {Object.entries(fbSummary.byType).map(([t, n]) => `${n} ${t.replace('_', '-')}`).join(' · ') || 'no feedback yet'}
                  </div>
                  {fbSummary.total > 0 && (
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.04em', color: fbSummary.addressed === fbSummary.total ? CYAN : ORANGE, marginTop: 5 }}>
                      {fbSummary.addressed}/{fbSummary.total} addressed
                    </div>
                  )}
                </div>
                <button onClick={() => summarizeFeedback(fbScope)} disabled={aiSummary.state === 'loading'}
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '8px 14px', borderRadius: 8, border: 'none', background: aiSummary.state === 'loading' ? 'rgba(232,238,245,0.1)' : '#33506e', color: '#fff', cursor: aiSummary.state === 'loading' ? 'default' : 'pointer', fontWeight: 600, flexShrink: 0 }}>
                  {aiSummary.state === 'loading' ? 'SUMMARIZING…' : '✦ SUMMARIZE WITH AI'}
                </button>
              </div>

              <div className="admin-kpis">
                {[{ l: 'TOPIC', v: fbSummary.topic, c: YELLOW }, { l: 'CLARITY', v: fbSummary.clarity, c: CYAN }, { l: 'QUIZ', v: fbSummary.quiz, c: PURPLE }, { l: 'OVERALL', v: fbSummary.overall, c: ORANGE }].map(s => (
                  <div key={s.l} style={{ textAlign: 'center', background: 'rgba(232,238,245,0.03)', borderRadius: 10, padding: '10px 6px' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: s.v ? s.c : 'rgba(232,238,245,0.2)', letterSpacing: '-0.02em' }}>{s.v || '—'}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.35)', marginTop: 3 }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {Object.keys(fbSummary.recommend).length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.4)' }}>RECOMMEND:</span>
                  {[['Yes', CYAN], ['Not yet', YELLOW], ['No', PINK]].map(([k, c]) => fbSummary.recommend[k] ? <Chip key={k} label={`${k} · ${fbSummary.recommend[k]}`} color={c} /> : null)}
                </div>
              )}

              {aiSummary.state !== 'idle' && (
                <div style={{ marginTop: 16, borderTop: '1px solid rgba(232,238,245,0.07)', paddingTop: 14 }}>
                  {aiSummary.state === 'loading' && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(232,238,245,0.4)', letterSpacing: '0.1em' }}>READING {fbScope.length} ITEMS…</div>}
                  {aiSummary.state === 'error' && <div style={{ fontSize: 12, color: PINK }}>{aiSummary.text}</div>}
                  {aiSummary.state === 'done' && <div style={{ fontSize: 13, color: '#e8eef5', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{aiSummary.text}</div>}
                </div>
              )}
            </Card>

            {/* CHECK-IN SURVEYS — weekly / midpoint / final (the 7/14/21/30-day responses) */}
            {surveyItems.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <SectionLabel>CHECK-IN SURVEYS · {surveyItems.length}</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {surveyItems.map((f, i) => (
                    <Card key={f.id || i} style={{ borderLeft: `3px solid ${f.reviewed ? CYAN : YELLOW}`, opacity: f.reviewed ? 0.62 : 1, transition: 'opacity 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#e8eef5' }}>{userName(f.user_id)}</span>
                          <Chip label={(f.feedback_type || '').toUpperCase()} color={YELLOW} />
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.35)' }}>{timeAgo(f.created_at)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          {f.would_recommend && <Chip label={`REC: ${f.would_recommend}`} color={f.would_recommend === 'Yes' ? CYAN : f.would_recommend === 'No' ? PINK : YELLOW} />}
                          <ReviewToggle reviewed={f.reviewed} onToggle={() => toggleReviewed(f.id, f.reviewed)} />
                        </div>
                      </div>
                      {(f.topic_rating || f.clarity_rating || f.quiz_rating) && (
                        <div style={{ display: 'flex', gap: 16, marginBottom: (f.missing_topics || f.biggest_win || f.comment) ? 10 : 0, flexWrap: 'wrap' }}>
                          {[['TOPIC', f.topic_rating, YELLOW], ['CLARITY', f.clarity_rating, CYAN], ['QUIZ', f.quiz_rating, PURPLE]].map(([l, v, c]) => v ? (
                            <div key={l} style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 15, fontWeight: 700, color: c }}>{v}/5</div>
                              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: '0.08em', color: 'rgba(232,238,245,0.35)' }}>{l}</div>
                            </div>
                          ) : null)}
                        </div>
                      )}
                      {f.biggest_win && <div style={{ fontSize: 13, color: '#e8eef5', lineHeight: 1.6, marginBottom: f.missing_topics || f.comment ? 10 : 0 }}><span style={{ color: CYAN, fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', marginRight: 6 }}>WIN</span>"{f.biggest_win}"</div>}
                      {f.missing_topics && <div style={{ marginBottom: f.comment ? 10 : 0, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}><SurveyDetail text={f.missing_topics} /></div>}
                      {f.comment && <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.7)', lineHeight: 1.6 }}>{f.comment}</div>}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Per-user post-lesson feedback */}
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
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#e8eef5', marginBottom: 3 }}>{name}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.35)' }}>{items.length} ITEMS TOTAL · {postEntry.length} POST-LESSON</div>
                      </div>
                      {/* Score summary */}
                      {topicAvg && (
                        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                          {[{ l: 'TOPIC', v: topicAvg, c: YELLOW }, { l: 'CLARITY', v: clarityAvg, c: CYAN }, { l: 'QUIZ', v: quizAvg, c: PURPLE }].map(s => s.v ? (
                            <div key={s.l} style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 16, fontWeight: 700, color: s.c, letterSpacing: '-0.02em' }}>{s.v}</div>
                              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 7, color: 'rgba(232,238,245,0.35)', letterSpacing: '0.08em' }}>{s.l}</div>
                            </div>
                          ) : null)}
                        </div>
                      )}
                    </div>

                    {/* Comments (surveys have their own section above) */}
                    {items.filter(f => !SURVEY_TYPES.includes(f.feedback_type) && (f.comment || f.biggest_win || f.missing_topics)).slice(0, 5).map((f, i) => (
                      <div key={i} style={{ borderTop: '1px solid rgba(232,238,245,0.07)', paddingTop: 12, marginTop: 12, opacity: f.reviewed ? 0.6 : 1 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                          <Chip label={f.feedback_type?.replace('_', '-').toUpperCase() || 'FEEDBACK'} color={f.feedback_type === 'weekly' ? YELLOW : f.feedback_type === 'end_of_beta' ? PINK : CYAN} />
                          {f.entry_number && <Chip label={`ENTRY #${f.entry_number}`} color={PURPLE} />}
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.35)' }}>{timeAgo(f.created_at)}</span>
                          {f.overall_rating && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.35)' }}>{f.overall_rating}/5</span>}
                          <span style={{ marginLeft: 'auto' }}><ReviewToggle reviewed={f.reviewed} onToggle={() => toggleReviewed(f.id, f.reviewed)} /></span>
                        </div>
                        {f.comment && <div style={{ fontSize: 13, color: '#e8eef5', lineHeight: 1.6, marginBottom: f.biggest_win ? 6 : 0 }}>{f.comment}</div>}
                        {f.biggest_win && <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.7)', lineHeight: 1.6, fontStyle: 'italic' }}>"{f.biggest_win}"</div>}
                        {f.missing_topics && f.missing_topics.length > 20 && (
                          <div style={{ fontSize: 11, color: 'rgba(232,238,245,0.4)', fontFamily: "'DM Mono', monospace", letterSpacing: '0.04em', marginTop: 6, wordBreak: 'break-word' }}>{f.missing_topics.slice(0, 200)}{f.missing_topics.length > 200 ? '…' : ''}</div>
                        )}
                      </div>
                    ))}
                    {items.filter(f => !SURVEY_TYPES.includes(f.feedback_type) && (f.comment || f.biggest_win)).length > 5 && (
                      <div style={{ marginTop: 10, fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.35)', cursor: 'pointer' }}>+{items.filter(f => !SURVEY_TYPES.includes(f.feedback_type) && (f.comment || f.biggest_win)).length - 5} MORE</div>
                    )}
                  </Card>
                )
              })}
            {feedback.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'rgba(232,238,245,0.35)', fontFamily: "'DM Mono', monospace", fontSize: 10 }}>NO FEEDBACK YET</div>}
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
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.35)', marginBottom: 8 }}>NO RESULTS YET</div>
                <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.5)' }}>Run a health check to see API status.</div>
              </Card>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(apiStatus).map(([key, s]) => (
                <Card key={key} style={{ borderLeft: `3px solid ${s.ok ? CYAN : PINK}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <StatusDot color={s.ok ? CYAN : PINK} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#e8eef5', marginBottom: 3 }}>{s.label}</div>
                        <div style={{ fontSize: 12, color: 'rgba(232,238,245,0.5)' }}>{s.detail}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <Chip label={s.ok ? 'OK' : 'FAIL'} color={s.ok ? CYAN : PINK} />
                      {s.ms != null && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.35)', marginTop: 4 }}>{s.ms}ms</div>}
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
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eef5', marginBottom: 4 }}>Email isn't auto-pinged on purpose</div>
                  <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.6)', lineHeight: 1.6 }}>The email senders can't be tested without actually sending mail to users, so the health check no longer invokes them. To verify Resend, check a recent reminder landed (or the cron run logs). The RESEND_API_KEY secret lives in Supabase Edge Functions settings, set per function.</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {tab === 'analytics' && (
          <div>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <SectionLabel>POSTHOG — LIVE DATA</SectionLabel>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => { setAnalyticsData(null); loadAnalytics() }}
                  disabled={analyticsLoading}
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(232,238,245,0.12)', background: 'transparent', color: 'rgba(232,238,245,0.5)', cursor: 'pointer' }}
                >
                  {analyticsLoading ? 'LOADING…' : '↺ REFRESH'}
                </button>
                <a
                  href={`https://us.posthog.com/project/470392`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '6px 12px', borderRadius: 8, border: 'none', background: CYAN, color: '#0a1420', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 600 }}
                >
                  POSTHOG DASHBOARD ↗
                </a>
              </div>
            </div>

            {analyticsError && (
              <Card style={{ background: `${PINK}0d`, border: `1px solid ${PINK}30`, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: PINK, fontFamily: "'DM Mono', monospace", letterSpacing: '0.06em' }}>QUERY ERROR</div>
                <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.7)', marginTop: 6 }}>{analyticsError}</div>
              </Card>
            )}

            {analyticsLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ height: 80, borderRadius: 14, background: 'rgba(232,238,245,0.05)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
                <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
              </div>
            )}

            {analyticsData && !analyticsLoading && (() => {
              const { todayMap, funnel, signalMap, topPrompts, entryPerf } = analyticsData
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* TODAY */}
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'rgba(232,238,245,0.4)', marginBottom: 10 }}>TODAY</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                      {[
                        { label: 'OPENED', val: todayMap['entry_opened'] || 0, color: CYAN },
                        { label: 'COMPLETED', val: todayMap['entry_completed'] || 0, color: YELLOW },
                        { label: 'QUIZZES', val: todayMap['quiz_submitted'] || 0, color: PURPLE },
                      ].map(k => (
                        <Card key={k.label} style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.4)', marginBottom: 8 }}>{k.label}</div>
                          <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.025em', color: k.color, lineHeight: 1 }}>{k.val}</div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* FUNNEL */}
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'rgba(232,238,245,0.4)', marginBottom: 10 }}>7-DAY FUNNEL — ENTRY → QUIZ</div>
                    <Card>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {funnel.map((step, i) => (
                          <div key={step.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(232,238,245,0.4)', width: 16 }}>{i + 1}</span>
                                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', color: '#e8eef5' }}>{step.label}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                <span style={{ fontSize: 18, fontWeight: 700, color: '#e8eef5' }}>{step.n}</span>
                                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: step.pct < 50 ? PINK : step.pct < 75 ? ORANGE : CYAN }}>{step.pct}%</span>
                              </div>
                            </div>
                            <div style={{ height: 4, background: 'rgba(232,238,245,0.06)', borderRadius: 2 }}>
                              <div style={{ height: '100%', width: `${step.pct}%`, borderRadius: 2, background: step.pct < 50 ? PINK : step.pct < 75 ? ORANGE : CYAN, transition: 'width 0.6s ease' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* ENGAGEMENT SIGNALS */}
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'rgba(232,238,245,0.4)', marginBottom: 10 }}>ENGAGEMENT — LAST 7 DAYS</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
                      {[
                        { event: 'ai_prompt_copied',         label: 'AI PROMPTS COPIED',  color: CYAN },
                        { event: 'goal_committed',           label: 'GOALS COMMITTED',    color: YELLOW },
                        { event: 'badge_earned',             label: 'BADGES EARNED',      color: PURPLE },
                        { event: 'entry_feedback_submitted', label: 'FEEDBACK SUBMITTED', color: ORANGE },
                        { event: 'streak_updated',           label: 'STREAKS EXTENDED',   color: PINK },
                      ].map(s => (
                        <Card key={s.event} style={{ padding: '12px 14px' }}>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.4)', marginBottom: 6 }}>{s.label}</div>
                          <div style={{ fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{signalMap[s.event] || 0}</div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* ENTRY PERFORMANCE */}
                  {entryPerf.length > 0 && (
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'rgba(232,238,245,0.4)', marginBottom: 10 }}>ENTRY PERFORMANCE — QUIZ SUBMISSIONS</div>
                      <Card style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid rgba(232,238,245,0.08)' }}>
                                {['#', 'CONCEPT', 'SUBMITS', 'AVG SCORE', 'PERFECTS'].map(h => (
                                  <th key={h} style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.4)', padding: '10px 16px', textAlign: h === '#' || h === 'SUBMITS' || h === 'AVG SCORE' || h === 'PERFECTS' ? 'center' : 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {entryPerf.map((e, i) => (
                                <tr key={e.entryNum} style={{ borderBottom: i < entryPerf.length - 1 ? '1px solid rgba(232,238,245,0.05)' : 'none' }}>
                                  <td style={{ padding: '10px 16px', fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(232,238,245,0.35)', textAlign: 'center' }}>{String(e.entryNum).padStart(3,'0')}</td>
                                  <td style={{ padding: '10px 16px', fontWeight: 500, color: '#e8eef5', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.concept}</td>
                                  <td style={{ padding: '10px 16px', textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: CYAN }}>{e.submissions}</td>
                                  <td style={{ padding: '10px 16px', textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: e.avgScore >= 2.5 ? YELLOW : e.avgScore >= 1.5 ? ORANGE : PINK }}>{e.avgScore ?? '—'}<span style={{ fontSize: 9, color: 'rgba(232,238,245,0.35)' }}>/3</span></td>
                                  <td style={{ padding: '10px 16px', textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, color: e.perfectPct >= 50 ? YELLOW : 'rgba(232,238,245,0.4)' }}>{e.perfectPct}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* TOP AI PROMPT COPIES */}
                  {topPrompts.length > 0 && (
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'rgba(232,238,245,0.4)', marginBottom: 10 }}>TOP AI PROMPT COPIES — ALL TIME</div>
                      <Card style={{ padding: 0, overflow: 'hidden' }}>
                        {topPrompts.map((p, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < topPrompts.length - 1 ? '1px solid rgba(232,238,245,0.05)' : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.3)', width: 20 }}>#{i+1}</span>
                              <span style={{ fontSize: 13, fontWeight: 500, color: '#e8eef5' }}>{p.concept || `Entry ${p.entryNum}`}</span>
                            </div>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, color: CYAN }}>{p.copies}×</span>
                          </div>
                        ))}
                      </Card>
                    </div>
                  )}

                  {/* DEEP DIVE LINKS */}
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: 'rgba(232,238,245,0.4)', marginBottom: 10 }}>DIVE DEEPER</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[
                        { label: 'EVENTS EXPLORER', href: `https://us.posthog.com/project/470392/activity/explore` },
                        { label: 'SESSION REPLAY', href: `https://us.posthog.com/project/470392/replay` },
                        { label: 'FUNNELS', href: `https://us.posthog.com/project/470392/insights?insight=FUNNELS` },
                        { label: 'USER PATHS', href: `https://us.posthog.com/project/470392/insights?insight=PATHS` },
                        { label: 'RETENTION', href: `https://us.posthog.com/project/470392/insights?insight=RETENTION` },
                        { label: 'ALL PERSONS', href: `https://us.posthog.com/project/470392/persons` },
                      ].map(link => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 10, border: '1px solid rgba(232,238,245,0.08)', textDecoration: 'none', transition: 'border-color 0.15s' }}
                        >
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', color: '#e8eef5', fontWeight: 500 }}>{link.label}</span>
                          <span style={{ color: 'rgba(232,238,245,0.3)', fontSize: 12 }}>↗</span>
                        </a>
                      ))}
                    </div>
                  </div>

                </div>
              )
            })()}

          </div>
        )}

        {/* ── EMAIL TAB ── */}
        {tab === 'email' && (
          <div>

            {/* PASSWORD RESET BLAST */}
            <SectionLabel>AUTH MIGRATION</SectionLabel>
            <Card style={{ marginBottom: 20, borderTop: `3px solid ${CYAN}` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e8eef5', marginBottom: 6 }}>Send Password Reset to All Testers</div>
              <div style={{ fontSize: 13, color: 'rgba(232,238,245,0.6)', lineHeight: 1.6, marginBottom: 16 }}>
                Sends a Supabase password reset email to every non-admin user. Use this once after switching from magic link to password auth — testers need to set a password before they can sign in.
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.4)', letterSpacing: '0.08em', marginBottom: 14 }}>
                {nonAdminUsers.map(u => u.email).join(' · ')}
              </div>
              {resetBlastState === 'idle' && (
                <button
                  onClick={() => setResetBlastState('confirm')}
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', padding: '10px 20px', borderRadius: 8, border: `1px solid ${CYAN}40`, background: `${CYAN}12`, color: CYAN, cursor: 'pointer', fontWeight: 600 }}
                >
                  SEND RESET EMAILS → {nonAdminUsers.length} USERS
                </button>
              )}
              {resetBlastState === 'confirm' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={sendPasswordResetBlast}
                    style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', padding: '10px 20px', borderRadius: 8, border: 'none', background: CYAN, color: '#0a1420', cursor: 'pointer', fontWeight: 700 }}
                  >
                    CONFIRM — SEND TO ALL
                  </button>
                  <button
                    onClick={() => setResetBlastState('idle')}
                    style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(232,238,245,0.12)', background: 'transparent', color: 'rgba(232,238,245,0.5)', cursor: 'pointer' }}
                  >
                    CANCEL
                  </button>
                </div>
              )}
              {resetBlastState === 'sending' && (
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(232,238,245,0.4)', letterSpacing: '0.1em' }}>SENDING…</div>
              )}
              {resetBlastState === 'done' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Chip label="SENT" color={CYAN} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(232,238,245,0.5)', letterSpacing: '0.06em' }}>Reset emails delivered. Testers can now set passwords.</span>
                </div>
              )}
              {resetBlastState === 'error' && (
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: PINK, letterSpacing: '0.06em' }}>ERROR — check console</div>
              )}
            </Card>

            <SectionLabel>EDGE FUNCTIONS</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { name: 'send-daily-reminder', label: 'Daily Reminder', schedule: '12:00 UTC daily', color: CYAN },
                { name: 'send-practice-reminder', label: 'Practice Reminder', schedule: 'Every hour (6h post-completion)', color: YELLOW },
                { name: 'send-weekly-wrap', label: 'Weekly Wrap', schedule: '11:00 UTC daily', color: PURPLE },
              ].map(fn => (
                <Card key={fn.name} style={{ borderTop: `3px solid ${fn.color}` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eef5', marginBottom: 4 }}>{fn.label}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(232,238,245,0.4)', letterSpacing: '0.06em', marginBottom: 12 }}>{fn.schedule}</div>
                  <Chip label={fn.name} color={fn.color} />
                </Card>
              ))}
            </div>
            <Card style={{ background: `${PINK}0d`, border: `1px solid ${PINK}30` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e8eef5', marginBottom: 8 }}>If emails stop working</div>
              <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Check Supabase → Edge Functions → each function → Secrets', 'Verify RESEND_API_KEY is set and not expired', 'Go to resend.com → API Keys → confirm key is active', 'Check Resend dashboard for bounce/block events', 'Re-add the key to all three edge functions if rotated'].map((step, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'rgba(232,238,245,0.7)', lineHeight: 1.5 }}>{step}</li>
                ))}
              </ol>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}
