'use client'
import React from 'react'
import { Flame, User, ChevronLeft, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const METRICS = [
  { id: 'overall',   label: 'OVERALL',     description: 'Normalized across all four metrics' },
  { id: 'completed', label: 'LESSONS',     description: 'Total entries completed' },
  { id: 'score',     label: 'QUIZ SCORE',  description: 'Total points earned across all quizzes' },
  { id: 'streak',    label: 'STREAK',      description: 'Current active daily streak' },
  { id: 'longest',   label: 'BEST STREAK', description: 'Longest streak ever achieved' },
]

const COLORS = {
  overall: '#E8FF47', score: '#47FFE8', completed: '#47C8FF',
  streak: '#FF8C47', longest: '#C847FF',
}

const CAT_COLORS = {
  'AI': '#47FFE8', 'Sales Craft': '#E8FF47', 'Vocab & Language': '#FF8C47',
  'Mental Models': '#C847FF', 'Philosophy': '#FF4778',
  'Neuroscience & Cognition': '#47C8FF', 'Communication': '#FF8C00',
}

function displayName(p, currentUserId) {
  const isYou = p.id === currentUserId
  let name = p.first_name && p.last_name ? `${p.first_name} ${p.last_name.charAt(0)}.`
    : p.first_name ? p.first_name
    : p.name ? p.name.split(' ')[0]
    : `User${p.id.slice(0, 4)}`
  return isYou ? `${name} (you)` : name
}

function normalize(value, min, max) {
  if (max === min) return 100
  return ((value - min) / (max - min)) * 100
}

function computeScores(users) {
  const metrics = users.map(u => ({
    id: u.id, score: u.total_score || 0, streak: u.current_streak || 0,
    longest: u.longest_streak || 0, completed: u.completed_count || 0,
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

export default function LeaderboardPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [metric, setMetric] = useState('overall')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { router.push('/login'); return }
        setCurrentUser(session.user)

        const { data: profiles } = await supabase
          .from('profiles').select('*').eq('is_admin', false)
        if (!profiles) return

        const enriched = await Promise.all(profiles.map(async p => {
          const { data: comps } = await supabase
            .from('completions').select('score, entry_number').eq('user_id', p.id)
          const total_score = comps ? comps.reduce((a, c) => a + (c.score || 0), 0) : 0
          const completed_count = comps ? comps.length : 0
          // Category breakdown
          const cats = {}
          if (comps) comps.forEach(c => {
            // We don't have category in completions, skip for now
          })
          return { ...p, total_score, completed_count }
        }))

        const scores = computeScores(enriched)
        const merged = enriched.map(u => ({
          ...u,
          _score: scores.find(s => s.id === u.id) || {},
        }))
        setUsers(merged)
      } catch(e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const getSorted = () => {
    return [...users].sort((a, b) => {
      const sa = a._score, sb = b._score
      if (!sa || !sb) return 0
      const vals = {
        overall: [sb.overall, sa.overall],
        score: [sb.score, sa.score],
        completed: [sb.completed, sa.completed],
        streak: [sb.streak, sa.streak],
        longest: [sb.longest, sa.longest],
      }
      const [bv, av] = vals[metric]
      const diff = bv - av
      return diff !== 0 ? diff : sb.score - sa.score
    })
  }

  const getDisplayValue = (s) => {
    if (!s) return '—'
    if (metric === 'overall')   return `${Math.round(s.overall || 0)}`
    if (metric === 'score')     return `${s.score || 0} pts`
    if (metric === 'streak')    return `${s.streak || 0}d`
    if (metric === 'longest')   return `${s.longest || 0}d`
    if (metric === 'completed') return `${s.completed || 0}`
    return '—'
  }

  const getBarValue = (s) => {
    if (!s) return 0
    if (metric === 'overall')   return s.overall || 0
    if (metric === 'score')     return s.norm?.score || 0
    if (metric === 'streak')    return s.norm?.streak || 0
    if (metric === 'longest')   return s.norm?.longest || 0
    if (metric === 'completed') return s.norm?.completed || 0
    return 0
  }

  const sorted = getSorted()
  const accentColor = COLORS[metric]
  const myRank = sorted.findIndex(u => u.id === currentUser?.id) + 1
  const me = sorted.find(u => u.id === currentUser?.id)

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f0f4f8 0%,#e8eef5 50%,#dde6f0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap: 5 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a2a3a', animation: `ld 1.2s ease-in-out ${i*0.2}s infinite` }} />)}
        <style>{`@keyframes ld{0%,80%,100%{opacity:.2;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f0f4f8 0%,#e8eef5 50%,#dde6f0 100%)', fontFamily: "'DM Sans', sans-serif", paddingBottom: 60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .metric-tabs::-webkit-scrollbar{display:none;}
        .lb-row{transition:background 0.15s;}
        .lb-row:active{background:rgba(26,42,58,0.04);}
      `}</style>

      {/* Header */}
      <div style={{ background: 'rgba(240,244,248,0.96)', backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(26,42,58,0.07)', padding: '14px 20px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(26,42,58,0.5)', letterSpacing: '0.12em', padding: 0 }}>
            <ChevronLeft size={13} strokeWidth={2} />BACK
          </button>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: '#1a2a3a' }}>LEADERBOARD</span>
          <div style={{ width: 48 }} />
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 18px' }}>

        {/* YOUR RANK HERO */}
        {myRank > 0 && me && (
          <div style={{ background: '#1a2a3a', borderRadius: 18, padding: '22px 22px', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accentColor, borderRadius: '18px 18px 0 0', transition: 'background 0.3s' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.18em', color: 'rgba(232,238,245,0.4)', marginBottom: 8 }}>YOUR STANDING</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 48, fontWeight: 700, color: accentColor, letterSpacing: '-0.03em', lineHeight: 1 }}>#{myRank}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'rgba(232,238,245,0.4)', letterSpacing: '0.08em', paddingBottom: 4 }}>OF {sorted.length}</span>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(232,238,245,0.3)', letterSpacing: '0.08em' }}>
                  {me._score?.completed || 0} LESSONS · {me._score?.streak || 0}d STREAK
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.14em', color: 'rgba(232,238,245,0.35)', marginBottom: 6 }}>
                  {METRICS.find(m => m.id === metric)?.label}
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.025em' }}>
                  {getDisplayValue(me._score)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* METRIC SWITCHER */}
        <div style={{ marginBottom: 20 }}>
          <div className="metric-tabs" style={{ background: '#1a2a3a', borderRadius: 12, padding: '4px', display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {METRICS.map(m => {
              const active = metric === m.id
              return (
                <button key={m.id} onClick={() => setMetric(m.id)} style={{
                  background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none', borderRadius: 8, padding: '8px 14px',
                  fontSize: 9, color: active ? COLORS[m.id] : 'rgba(232,238,245,0.4)',
                  cursor: 'pointer', letterSpacing: '0.1em',
                  fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap',
                  flexShrink: 0, fontWeight: active ? 700 : 400,
                  transition: 'all 0.15s',
                }}>{m.label}</button>
              )
            })}
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(26,42,58,0.4)', marginTop: 8, letterSpacing: '0.06em', paddingLeft: 4 }}>
            {METRICS.find(m => m.id === metric)?.description}
          </div>
        </div>

        {/* ROWS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sorted.map((u, i) => {
            const rank = i + 1
            const isYou = u.id === currentUser?.id
            const isExpanded = expandedId === u.id
            const s = u._score || {}
            const name = displayName(u, currentUser?.id)
            const rankColor = rank === 1 ? '#E8FF47' : rank === 2 ? '#c0c0c0' : rank === 3 ? '#FF8C47' : 'rgba(232,238,245,0.4)'

            const breakdown = [
              { label: 'Quiz Score',  value: `${s.score || 0} pts`, bar: s.norm?.score || 0,     color: COLORS.score },
              { label: 'Lessons',     value: `${s.completed || 0}`,  bar: s.norm?.completed || 0, color: COLORS.completed },
              { label: 'Streak',      value: `${s.streak || 0}d`,    bar: s.norm?.streak || 0,    color: COLORS.streak },
              { label: 'Best Streak', value: `${s.longest || 0}d`,   bar: s.norm?.longest || 0,   color: COLORS.longest },
            ]

            return (
              <div key={u.id} style={{ background: '#1a2a3a', borderRadius: 14, overflow: 'hidden', border: isYou ? `1px solid ${accentColor}33` : '1px solid transparent' }}>
                {/* Progress bar accent at top */}
                <div style={{ height: 2, background: 'rgba(255,255,255,0.05)' }}>
                  <div style={{ height: '100%', width: `${Math.max(getBarValue(s), 1)}%`, background: accentColor, transition: 'width 0.5s ease, background 0.3s' }} />
                </div>

                <div className="lb-row" onClick={() => setExpandedId(isExpanded ? null : u.id)} style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Rank */}
                  <div style={{ width: 32, flexShrink: 0, textAlign: 'center' }}>
                    <span style={{ fontSize: rank <= 3 ? 15 : 13, fontWeight: 700, color: rankColor, letterSpacing: '-0.01em', fontFamily: "'DM Mono', monospace" }}>#{rank}</span>
                  </div>

                  {/* Avatar */}
                  <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {u.avatar_url
                      ? <img src={u.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <User size={14} strokeWidth={1.5} color="rgba(232,238,245,0.3)" />
                    }
                  </div>

                  {/* Name + substats */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: isYou ? 700 : 500, color: isYou ? '#fff' : 'rgba(232,238,245,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>
                      {name}
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.35)', letterSpacing: '0.05em' }}>{s.completed || 0} lessons</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: "'DM Mono', monospace", fontSize: 9, color: 'rgba(232,238,245,0.35)' }}>
                        <Flame size={9} strokeWidth={1.5} />{s.streak || 0}d
                      </span>
                    </div>
                  </div>

                  {/* Value + chevron */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: accentColor, letterSpacing: '-0.01em', transition: 'color 0.2s' }}>
                      {getDisplayValue(s)}
                    </span>
                    <ChevronDown size={13} strokeWidth={1.5} color="rgba(232,238,245,0.25)" style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }} />
                  </div>
                </div>

                {/* Expanded breakdown */}
                {isExpanded && (
                  <div style={{ padding: '0 16px 18px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {breakdown.map(b => (
                        <div key={b.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.1em', color: 'rgba(232,238,245,0.4)' }}>{b.label.toUpperCase()}</span>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 700, color: b.color }}>{b.value}</span>
                          </div>
                          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                            <div style={{ height: '100%', width: `${Math.max(b.bar, 1)}%`, background: b.color, borderRadius: 2, transition: 'width 0.5s ease' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: '0.12em', color: 'rgba(232,238,245,0.3)', marginBottom: 2 }}>OVERALL</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(232,238,245,0.2)' }}>Normalized across all metrics</div>
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.overall, letterSpacing: '-0.02em' }}>{Math.round(s.overall || 0)}</div>
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
