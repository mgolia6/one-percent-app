'use client'
import { Flame, User, ChevronLeft, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// 4 clean metrics — all tied to learning behavior
const METRICS = [
  { id: 'overall',   label: 'OVERALL',     description: 'Normalized score across all four metrics' },
  { id: 'score',     label: 'QUIZ SCORE',  description: 'Total points earned across all quizzes' },
  { id: 'completed', label: 'LESSONS',     description: 'Total entries completed' },
  { id: 'streak',    label: 'STREAK',      description: 'Current active daily streak' },
  { id: 'longest',   label: 'BEST STREAK', description: 'Longest streak ever achieved' },
]

const COLORS = {
  overall: '#E8FF47', score: '#47FFE8', completed: '#47C8FF',
  streak: '#FF8C47', longest: '#C847FF',
}

function displayName(p, currentUserId) {
  const isYou = p.id === currentUserId
  let name
  if (p.first_name && p.last_name) {
    name = `${p.first_name} ${p.last_name.charAt(0)}.`
  } else if (p.first_name) {
    name = p.first_name
  } else if (p.name) {
    name = p.name.split(' ')[0]
  } else {
    name = `User${p.id.slice(0, 4)}`
  }
  return isYou ? `${name} (you)` : name
}

function normalize(value, min, max) {
  if (max === min) return 100
  return ((value - min) / (max - min)) * 100
}

function computeScores(users) {
  const metrics = users.map(u => ({
    id: u.id,
    score: u.total_score || 0,
    streak: u.current_streak || 0,
    longest: u.longest_streak || 0,
    completed: u.completed_count || 0,
  }))

  const fields = ['score', 'streak', 'longest', 'completed']
  const mins = {}, maxs = {}
  fields.forEach(f => {
    mins[f] = Math.min(...metrics.map(m => m[f]))
    maxs[f] = Math.max(...metrics.map(m => m[f]))
  })

  return metrics.map(m => {
    const norm = {
      score:     normalize(m.score,     mins.score,     maxs.score),
      streak:    normalize(m.streak,    mins.streak,    maxs.streak),
      longest:   normalize(m.longest,   mins.longest,   maxs.longest),
      completed: normalize(m.completed, mins.completed, maxs.completed),
    }
    const overall = (norm.score + norm.streak + norm.longest + norm.completed) / 4
    return { ...m, norm, overall }
  })
}

function RankLabel({ rank }) {
  const color = rank === 1 ? '#E8FF47' : rank === 2 ? '#aaa' : rank === 3 ? '#FF8C47' : '#555'
  return (
    <span style={{ fontSize: rank <= 3 ? 13 : 12, fontWeight: rank <= 3 ? 700 : 500, color, letterSpacing: '-0.01em', minWidth: 28, textAlign: 'center', display: 'block' }}>
      #{rank}
    </span>
  )
}

// Design tokens — match profile page
const BG = '#111'
const SURFACE = '#181818'
const BORDER = '#222'
const BORDER_FAINT = '#1a1a1a'
const T = { primary: '#ffffff', secondary: '#bbb', tertiary: '#777', faint: '#444' }

export default function LeaderboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [scores, setScores] = useState([])
  const [metric, setMetric] = useState('overall')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (!prof) { router.push('/'); return }
      setCurrentUser(prof)

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, name, current_streak, longest_streak, avatar_url')
        .eq('onboarding_complete', true)
        .eq('is_admin', false)

      const { data: completions } = await supabase
        .from('completions')
        .select('user_id, score')

      if (!profiles) { setLoading(false); return }

      const enriched = profiles.map(p => {
        const userComps = (completions || []).filter(c => c.user_id === p.id)
        const total_score = userComps.reduce((a, c) => a + (c.score || 0), 0)
        const completed_count = userComps.length
        return { ...p, total_score, completed_count }
      })

      setUsers(enriched)
      setScores(computeScores(enriched))
      setLoading(false)
    }
    init()
  }, [router])

  const getSorted = () => {
    if (!scores.length) return []
    const scoreMap = Object.fromEntries(scores.map(s => [s.id, s]))
    return [...users]
      .map(u => ({ ...u, _score: scoreMap[u.id] }))
      .filter(u => u._score)
      .sort((a, b) => {
        const sa = a._score, sb = b._score
        let diff = 0
        if (metric === 'overall')   diff = sb.overall - sa.overall
        if (metric === 'score')     diff = sb.score - sa.score
        if (metric === 'streak')    diff = sb.streak - sa.streak
        if (metric === 'longest')   diff = sb.longest - sa.longest
        if (metric === 'completed') diff = sb.completed - sa.completed
        if (diff !== 0) return diff
        return sb.score - sa.score // tiebreaker
      })
  }

  const getDisplayValue = (s) => {
    if (metric === 'overall')   return `${Math.round(s.overall)}`
    if (metric === 'score')     return `${s.score} pts`
    if (metric === 'streak')    return `${s.streak}d`
    if (metric === 'longest')   return `${s.longest}d`
    if (metric === 'completed') return `${s.completed}`
    return '—'
  }

  const getBarValue = (s) => {
    if (metric === 'overall')   return s.overall
    if (metric === 'score')     return s.norm.score
    if (metric === 'streak')    return s.norm.streak
    if (metric === 'longest')   return s.norm.longest
    if (metric === 'completed') return s.norm.completed
    return 0
  }

  const sorted = getSorted()
  const currentMetric = METRICS.find(m => m.id === metric)
  const myRank = sorted.findIndex(u => u.id === currentUser?.id) + 1
  const me = sorted.find(u => u.id === currentUser?.id)
  const accentColor = COLORS[metric]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap: 5 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#333', animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
        <style>{`@keyframes pulse{0%,80%,100%{opacity:.2;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Inter',sans-serif", color: T.primary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .metric-tabs::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Sticky back nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: BG, borderBottom: `1px solid ${BORDER_FAINT}` }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.secondary, letterSpacing: '0.08em', padding: 0 }}>
            <ChevronLeft size={13} strokeWidth={2} />
            LIBRARY
          </button>
          <span style={{ fontSize: 9, color: accentColor, border: `1px solid ${accentColor}44`, borderRadius: 3, padding: '3px 8px', letterSpacing: '0.12em', fontWeight: 600 }}>LEADERBOARD</span>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 20px 60px' }}>

        {/* Your rank callout */}
        {myRank > 0 && me && (
          <div style={{ background: SURFACE, border: `1px solid ${accentColor}33`, borderRadius: 8, padding: '16px 18px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 9, color: T.faint, letterSpacing: '0.15em', marginBottom: 5 }}>YOUR RANK</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: accentColor, letterSpacing: '-0.02em' }}>
                #{myRank} <span style={{ fontSize: 12, color: T.tertiary, fontWeight: 400 }}>of {sorted.length}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 9, color: T.faint, letterSpacing: '0.15em', marginBottom: 5 }}>{currentMetric.label}</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: T.primary }}>{getDisplayValue(me._score)}</div>
            </div>
          </div>
        )}

        {/* Metric switcher */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, color: T.tertiary, letterSpacing: '0.15em', marginBottom: 8, fontWeight: 600 }}>RANK BY</div>
          <div className="metric-tabs" style={{ background: SURFACE, borderRadius: 8, padding: '4px', display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {METRICS.map(m => {
              const active = metric === m.id
              return (
                <button key={m.id} onClick={() => setMetric(m.id)} style={{
                  background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                  border: 'none', borderRadius: 6, padding: '7px 12px',
                  fontSize: 9, color: active ? COLORS[m.id] : T.secondary,
                  cursor: 'pointer', letterSpacing: '0.08em',
                  fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap',
                  flexShrink: 0, fontWeight: active ? 700 : 400,
                  transition: 'all 0.15s ease',
                }}>{m.label}</button>
              )
            })}
          </div>
          <div style={{ fontSize: 11, color: T.tertiary, marginTop: 8 }}>{currentMetric.description}</div>
        </div>

        {/* Rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {sorted.map((u, i) => {
            const rank = i + 1
            const isYou = u.id === currentUser?.id
            const isExpanded = expandedId === u.id
            const s = u._score
            const name = displayName(u, currentUser?.id)

            const breakdown = [
              { label: 'Quiz Score',    value: `${s.score} pts`, bar: s.norm.score,     color: COLORS.score,     note: 'Total points across all quizzes' },
              { label: 'Lessons',       value: `${s.completed}`, bar: s.norm.completed, color: COLORS.completed, note: 'Entries completed' },
              { label: 'Streak',        value: `${s.streak}d`,   bar: s.norm.streak,    color: COLORS.streak,    note: 'Current active streak' },
              { label: 'Best Streak',   value: `${s.longest}d`,  bar: s.norm.longest,   color: COLORS.longest,   note: 'Longest streak ever' },
            ]

            return (
              <div key={u.id} style={{ borderBottom: `1px solid ${BORDER_FAINT}`, overflow: 'hidden' }}>
                {/* Main row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : u.id)}
                  style={{ padding: '14px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  {/* Rank */}
                  <div style={{ flexShrink: 0, width: 32 }}>
                    <RankLabel rank={rank} />
                  </div>

                  {/* Avatar */}
                  <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: SURFACE, border: `1px solid ${BORDER}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {u.avatar_url
                      ? <img src={u.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <User size={14} strokeWidth={1.5} color={T.faint} />
                    }
                  </div>

                  {/* Name + sub-stats */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: isYou ? 600 : 400, color: isYou ? T.primary : T.secondary, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3 }}>
                      {name}
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 10, color: T.tertiary }}>{s.completed} lessons</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 10, color: T.tertiary }}>
                        <Flame size={9} strokeWidth={1.5} />{s.streak}d
                      </span>
                    </div>
                  </div>

                  {/* Score + chevron */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: accentColor, letterSpacing: '-0.01em', transition: 'color 0.2s' }}>
                      {getDisplayValue(s)}
                    </div>
                    <ChevronDown size={13} strokeWidth={1.5} color={T.faint} style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>
                </div>

                {/* Progress bar — subtle, sits at bottom of row */}
                <div style={{ height: 2, background: BORDER_FAINT, marginBottom: isExpanded ? 0 : 0 }}>
                  <div style={{ height: '100%', width: `${Math.max(getBarValue(s), 1)}%`, background: accentColor, transition: 'width 0.4s ease, background 0.2s ease' }} />
                </div>

                {/* Expanded breakdown */}
                {isExpanded && (
                  <div style={{ padding: '16px 0 20px', borderTop: `1px solid ${BORDER_FAINT}` }}>
                    <div style={{ fontSize: 9, color: T.faint, letterSpacing: '0.15em', marginBottom: 14, fontWeight: 600 }}>BREAKDOWN</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {breakdown.map(b => (
                        <div key={b.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                            <div>
                              <span style={{ fontSize: 12, color: T.secondary, fontWeight: 500 }}>{b.label}</span>
                              <span style={{ fontSize: 10, color: T.faint, marginLeft: 8 }}>{b.note}</span>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: b.color, flexShrink: 0, marginLeft: 12 }}>{b.value}</span>
                          </div>
                          <div style={{ height: 2, background: BORDER_FAINT, borderRadius: 1 }}>
                            <div style={{ height: '100%', width: `${Math.max(b.bar, 1)}%`, background: b.color, borderRadius: 1, transition: 'width 0.5s ease' }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Overall */}
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${BORDER_FAINT}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 9, color: T.tertiary, letterSpacing: '0.12em', marginBottom: 2, fontWeight: 600 }}>OVERALL SCORE</div>
                        <div style={{ fontSize: 10, color: T.faint }}>Normalized across all 4 metrics</div>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.overall, letterSpacing: '-0.02em' }}>{Math.round(s.overall)}</div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
