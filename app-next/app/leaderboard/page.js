'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const METRICS = [
  { id: 'overall',   label: 'OVERALL',    description: 'Normalized rank across all categories' },
  { id: 'score',     label: 'QUIZ SCORE', description: 'Total points earned across all entries' },
  { id: 'streak',    label: 'STREAK',     description: 'Current active streak (days)' },
  { id: 'longest',   label: 'BEST STREAK',description: 'Longest streak ever achieved' },
  { id: 'completed', label: 'LESSONS',    description: 'Total lessons completed' },
  { id: 'comments',  label: 'COMMENTS',   description: 'Feedback comments submitted' },
  { id: 'speed',     label: 'SPEED',      description: 'Avg time-to-quiz (lower = faster)' },
]

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

function normalize(value, min, max, lowerIsBetter = false) {
  // Everyone tied — give everyone full credit rather than an arbitrary 50
  if (max === min) return 100
  const raw = (value - min) / (max - min) * 100
  return lowerIsBetter ? 100 - raw : raw
}

function computeScores(users) {
  const metrics = users.map(u => ({
    id: u.id,
    score: u.total_score || 0,
    streak: u.current_streak || 0,
    longest: u.longest_streak || 0,
    completed: u.completed_count || 0,
    comments: u.comment_count || 0,
    // Filter speeds under 20s (test runs) before averaging
    speed: u.avg_speed != null ? u.avg_speed : 99999,
  }))

  const fields = ['score', 'streak', 'longest', 'completed', 'comments']
  const mins = {}, maxs = {}
  fields.forEach(f => {
    mins[f] = Math.min(...metrics.map(m => m[f]))
    maxs[f] = Math.max(...metrics.map(m => m[f]))
  })
  // Speed: lower is better, exclude 99999 placeholders
  const realSpeeds = metrics.map(m => m.speed).filter(s => s < 99999)
  const speedMin = realSpeeds.length ? Math.min(...realSpeeds) : 0
  const speedMax = realSpeeds.length ? Math.max(...realSpeeds) : 1

  return metrics.map(m => {
    const norm = {
      score:     normalize(m.score,    mins.score,    maxs.score),
      streak:    normalize(m.streak,   mins.streak,   maxs.streak),
      longest:   normalize(m.longest,  mins.longest,  maxs.longest),
      completed: normalize(m.completed,mins.completed,maxs.completed),
      comments:  normalize(m.comments, mins.comments, maxs.comments),
      speed:     m.speed < 99999 ? normalize(m.speed, speedMin, speedMax, true) : 0,
    }
    const overall = (norm.score + norm.streak + norm.longest + norm.completed + norm.comments + norm.speed) / 6
    return { ...m, norm, overall }
  })
}

function Medal({ rank }) {
  if (rank === 1) return <span style={{ fontSize: 16 }}>🥇</span>
  if (rank === 2) return <span style={{ fontSize: 16 }}>🥈</span>
  if (rank === 3) return <span style={{ fontSize: 16 }}>🥉</span>
  return <span style={{ fontSize: 12, color: '#555', fontWeight: 600, minWidth: 20, textAlign: 'center' }}>#{rank}</span>
}

function formatSpeed(seconds) {
  if (!seconds || seconds >= 99999) return '—'
  if (seconds < 60) return `${Math.round(seconds)}s`
  return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [users, setUsers] = useState([])
  const [scores, setScores] = useState([])
  const [metric, setMetric] = useState('overall')

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      if (!prof) { router.push('/'); return }

      setCurrentUser(prof)
      setIsAdmin(prof.is_admin || false)

      // Fetch all profiles — exclude admins from user-facing view
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, name, current_streak, longest_streak, is_admin')
        .eq('onboarding_complete', true)
        .eq('is_admin', false)

      // Fetch all completions
      const { data: completions } = await supabase
        .from('completions')
        .select('user_id, score, time_to_quiz')

      // Fetch comment counts from feedback
      const { data: feedbackRaw } = await supabase
        .from('feedback')
        .select('user_id, comment')

      if (!profiles) { setLoading(false); return }

      // Aggregate per user
      const enriched = profiles.map(p => {
        const userComps = (completions || []).filter(c => c.user_id === p.id)
        const total_score = userComps.reduce((a, c) => a + (c.score || 0), 0)
        const completed_count = userComps.length
        const speeds = userComps.map(c => c.time_to_quiz).filter(t => t != null && t >= 20)
        const avg_speed = speeds.length ? speeds.reduce((a, b) => a + b, 0) / speeds.length : null

        const userFeedback = (feedbackRaw || []).filter(f => f.user_id === p.id)
        const comment_count = userFeedback.filter(f => f.comment && f.comment.trim().length > 0).length

        return { ...p, total_score, completed_count, avg_speed, comment_count }
      })

      setUsers(enriched)
      setScores(computeScores(enriched))
      setLoading(false)
    }
    init()
  }, [router])

  const getSortedUsers = () => {
    if (!scores.length) return []
    const scoreMap = Object.fromEntries(scores.map(s => [s.id, s]))

    return [...users]
      .map(u => ({ ...u, _score: scoreMap[u.id] }))
      .filter(u => u._score)
      .sort((a, b) => {
        const sa = a._score, sb = b._score

        let primary = 0
        if (metric === 'overall')   primary = sb.overall - sa.overall
        else if (metric === 'score')     primary = sb.score - sa.score
        else if (metric === 'streak')    primary = sb.streak - sa.streak
        else if (metric === 'longest')   primary = sb.longest - sa.longest
        else if (metric === 'completed') primary = sb.completed - sa.completed
        else if (metric === 'comments')  primary = sb.comments - sa.comments
        else if (metric === 'speed') {
          if (sa.speed >= 99999 && sb.speed >= 99999) primary = 0
          else if (sa.speed >= 99999) primary = 1
          else if (sb.speed >= 99999) primary = -1
          else primary = sa.speed - sb.speed
        }

        if (primary !== 0) return primary

        // Tiebreaker 1: score
        if (metric !== 'score') {
          const scoreDiff = sb.score - sa.score
          if (scoreDiff !== 0) return scoreDiff
        }
        // Tiebreaker 2: speed (lower wins; no-data goes last)
        if (metric !== 'speed') {
          if (sa.speed >= 99999 && sb.speed >= 99999) return 0
          if (sa.speed >= 99999) return 1
          if (sb.speed >= 99999) return -1
          return sa.speed - sb.speed
        }
        return 0
      })
  }

  const getDisplayValue = (u) => {
    const s = u._score
    if (metric === 'overall')   return `${Math.round(s.overall)}`
    if (metric === 'score')     return `${s.score} pts`
    if (metric === 'streak')    return `${s.streak} days`
    if (metric === 'longest')   return `${s.longest} days`
    if (metric === 'completed') return `${s.completed}`
    if (metric === 'comments')  return `${s.comments}`
    if (metric === 'speed')     return formatSpeed(s.speed)
    return '—'
  }

  const getBarValue = (u) => {
    const s = u._score
    if (metric === 'overall')   return s.overall
    if (metric === 'score')     return s.norm.score
    if (metric === 'streak')    return s.norm.streak
    if (metric === 'longest')   return s.norm.longest
    if (metric === 'completed') return s.norm.completed
    if (metric === 'comments')  return s.norm.comments
    if (metric === 'speed')     return s.norm.speed
    return 0
  }

  const currentMetric = METRICS.find(m => m.id === metric)
  const sorted = getSortedUsers()
  const myRank = sorted.findIndex(u => u.id === currentUser?.id) + 1
  const [expandedId, setExpandedId] = useState(null)

  const COLORS = {
    overall:'#E8FF47', score:'#47FFE8', streak:'#FF8C47',
    longest:'#C847FF', completed:'#47C8FF', comments:'#FF8C00', speed:'#FF4778',
  }

  const accentColor = COLORS[metric]

  const BREAKDOWN = (s) => [
    { id: 'score',     label: 'Quiz Score',   value: `${s.score} pts`,          bar: s.norm.score,     color: COLORS.score,     note: 'Total points earned across all quizzes' },
    { id: 'completed', label: 'Lessons Completed', value: `${s.completed}`,           bar: s.norm.completed, color: COLORS.completed, note: 'Number of lessons completed' },
    { id: 'streak',    label: 'Streak',       value: `${s.streak} days`,         bar: s.norm.streak,    color: COLORS.streak,    note: 'Current active daily streak' },
    { id: 'longest',   label: 'Best Streak',  value: `${s.longest} days`,        bar: s.norm.longest,   color: COLORS.longest,   note: 'Longest streak ever achieved' },
    { id: 'comments',  label: 'Comments',     value: `${s.comments}`,            bar: s.norm.comments,  color: COLORS.comments,  note: 'Feedback comments submitted' },
    { id: 'speed',     label: 'Avg Speed',    value: formatSpeed(s.speed),       bar: s.norm.speed,     color: COLORS.speed,     note: 'Avg time from open to quiz start — lower is faster' },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap: 5 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#333', animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
        <style>{`@keyframes pulse{0%,80%,100%{opacity:.2;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Inter',sans-serif", color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .metric-tabs::-webkit-scrollbar { display: none; }
        .lb-row { transition: background 0.15s ease; }
        .lb-row:hover { background: #111 !important; }
      `}</style>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ padding: '20px 0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, letterSpacing: '0.22em', fontWeight: 600, color: '#fff' }}>ONE PERCENT</span>
            <span style={{ fontSize: 9, background: '#1a1a1a', color: accentColor, border: `1px solid ${accentColor}44`, borderRadius: 3, padding: '2px 7px', letterSpacing: '0.1em', fontWeight: 600, transition: 'color 0.2s, border-color 0.2s' }}>LEADERBOARD</span>
          </div>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #1a1a1a', borderRadius: 6, padding: '6px 12px', fontSize: 9, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>← LIBRARY</button>
        </div>

        {/* Your rank callout */}
        {myRank > 0 && (
          <div style={{ background: '#111', border: `1px solid ${accentColor}33`, borderRadius: 8, padding: '14px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.2s' }}>
            <div>
              <div style={{ fontSize: 9, color: '#555', letterSpacing: '0.15em', marginBottom: 4 }}>YOUR RANK</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: accentColor, transition: 'color 0.2s' }}>#{myRank} <span style={{ fontSize: 12, color: '#666', fontWeight: 400 }}>of {sorted.length}</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 9, color: '#555', letterSpacing: '0.15em', marginBottom: 4 }}>{currentMetric.label}</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>
                {sorted.find(u => u.id === currentUser?.id) ? getDisplayValue(sorted.find(u => u.id === currentUser?.id)) : '—'}
              </div>
            </div>
          </div>
        )}

        {/* Metric switcher */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.15em', marginBottom: 8 }}>RANK BY</div>
          <div className="metric-tabs" style={{
            background: '#111', borderRadius: 8, padding: '4px',
            display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none',
          }}>
            {METRICS.map(m => {
              const active = metric === m.id
              const mColor = {
                overall:'#E8FF47',score:'#47FFE8',streak:'#FF8C47',
                longest:'#C847FF',completed:'#47C8FF',comments:'#FF8C00',speed:'#FF4778'
              }[m.id]
              return (
                <button key={m.id} onClick={() => setMetric(m.id)} style={{
                  background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                  border: 'none', borderRadius: 6, padding: '7px 11px',
                  fontSize: 9, color: active ? mColor : '#555',
                  cursor: 'pointer', letterSpacing: '0.08em',
                  fontFamily: "'Inter',sans-serif", whiteSpace: 'nowrap',
                  flexShrink: 0, fontWeight: active ? 600 : 400,
                  transition: 'all 0.15s ease',
                }}>{m.label}</button>
              )
            })}
          </div>
          <div style={{ fontSize: 11, color: '#444', marginTop: 8, letterSpacing: '0.02em' }}>{currentMetric.description}</div>
        </div>

        {/* Leaderboard rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 60 }}>
          {sorted.map((u, i) => {
            const rank = i + 1
            const isYou = u.id === currentUser?.id
            const barVal = getBarValue(u)
            const displayVal = getDisplayValue(u)
            const name = displayName(u, currentUser?.id)
            const isExpanded = expandedId === u.id
            const s = u._score
            const breakdown = BREAKDOWN(s)

            return (
              <div
                key={u.id}
                style={{
                  background: isYou ? '#0f0f0f' : '#0a0a0a',
                  border: `1px solid ${isExpanded ? accentColor + '44' : isYou ? accentColor + '22' : '#141414'}`,
                  borderRadius: 8,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Main row — tappable */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : u.id)}
                  style={{ padding: '14px 16px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Medal rank={rank} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: isYou ? 600 : 400, color: isYou ? '#fff' : '#ccc', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {name}
                      </div>
                      <div style={{ display: 'flex', gap: 10, marginTop: 3, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, color: '#444' }}>{s.completed} lessons</span>
                        {metric !== 'streak' && <span style={{ fontSize: 10, color: '#444' }}>🔥 {s.streak}</span>}
                        {metric !== 'score' && <span style={{ fontSize: 10, color: '#444' }}>{s.score} pts</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: accentColor, transition: 'color 0.2s' }}>
                        {displayVal}
                      </div>
                      <div style={{ fontSize: 10, color: '#444', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</div>
                    </div>
                  </div>

                  {/* Primary bar */}
                  <div style={{ height: 3, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${Math.max(barVal, 2)}%`,
                      background: accentColor, borderRadius: 2,
                      transition: 'width 0.4s ease, background 0.2s ease',
                    }} />
                  </div>
                </div>

                {/* Expanded breakdown */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #1a1a1a', padding: '16px 16px 20px' }}>
                    <div style={{ fontSize: 9, color: '#555', letterSpacing: '0.15em', marginBottom: 14, fontWeight: 600 }}>FULL BREAKDOWN</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {breakdown.map(b => (
                        <div key={b.id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                            <div>
                              <span style={{ fontSize: 11, color: '#bbb', fontWeight: 500 }}>{b.label}</span>
                              <span style={{ fontSize: 10, color: '#444', marginLeft: 8 }}>{b.note}</span>
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: b.color, flexShrink: 0, marginLeft: 12 }}>{b.value}</span>
                          </div>
                          <div style={{ height: 3, background: '#1a1a1a', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{
                              height: '100%',
                              width: `${Math.max(b.bar, 2)}%`,
                              background: b.color,
                              borderRadius: 2,
                              transition: 'width 0.5s ease',
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Overall score */}
                    <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 9, color: '#555', letterSpacing: '0.12em', marginBottom: 2 }}>OVERALL SCORE</div>
                        <div style={{ fontSize: 10, color: '#444' }}>Normalized rank across all 6 metrics</div>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 600, color: COLORS.overall }}>{Math.round(s.overall)}</div>
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
