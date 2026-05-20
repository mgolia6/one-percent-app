'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState([])
  const [bugs, setBugs] = useState([])
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('feedback')

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: prof } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
      if (!prof?.is_admin) { router.push('/'); return }

      const [{ data: fb }, { data: br }, { data: us }] = await Promise.all([
        supabase.from('feedback').select('*, profiles(email)').order('created_at', { ascending: false }),
        supabase.from('bug_reports').select('*, profiles(email)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('email, signup_date, current_streak, longest_streak, last_active_date, is_admin').order('signup_date', { ascending: false }),
      ])

      setFeedback(fb || [])
      setBugs(br || [])
      setUsers(us || [])
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 11, color: '#333', letterSpacing: '0.2em', fontFamily: "'Inter',sans-serif" }}>LOADING...</div>
    </div>
  )

  const stars = n => n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '—'
  const timeAgo = ts => {
    const diff = Date.now() - new Date(ts)
    const h = Math.floor(diff / 3600000)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  const dailyFb = feedback.filter(f => f.feedback_type === 'daily' || f.feedback_type === 'landing')
  const weeklyFb = feedback.filter(f => f.feedback_type === 'weekly')

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Inter',sans-serif", color: '#fff' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 24px', borderBottom: '1px solid #141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', fontWeight: 600 }}>ONE PERCENT</div>
          <div style={{ fontSize: 9, color: '#47FFE8', letterSpacing: '0.15em', marginTop: 2 }}>ADMIN DASHBOARD</div>
        </div>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #222', borderRadius: 3, padding: '6px 12px', fontSize: 10, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>← LIBRARY</button>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, padding: '24px 0' }}>
          {[
            { label: 'USERS', value: users.length },
            { label: 'FEEDBACK', value: feedback.length },
            { label: 'BUGS', value: bugs.length },
            { label: 'AVG RATING', value: dailyFb.length ? (dailyFb.reduce((a, f) => a + (f.rating || 0), 0) / dailyFb.filter(f => f.rating).length).toFixed(1) + '/5' : '—' },
          ].map(s => (
            <div key={s.label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 4, padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.12em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab row */}
        <div style={{ display: 'flex', borderBottom: '1px solid #141414', gap: 4, marginBottom: 24 }}>
          {[['feedback', 'FEEDBACK'], ['bugs', 'BUGS'], ['users', 'USERS']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ background: 'none', border: 'none', borderBottom: `2px solid ${tab === id ? '#47FFE8' : 'transparent'}`, padding: '10px 14px', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', color: tab === id ? '#47FFE8' : '#555', cursor: 'pointer', fontFamily: "'Inter',sans-serif" }}>{label}</button>
          ))}
        </div>

        {/* Feedback tab */}
        {tab === 'feedback' && (
          <div>
            {weeklyFb.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>WEEKLY DEEP FEEDBACK ({weeklyFb.length})</div>
                {weeklyFb.map(f => (
                  <div key={f.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: '20px', marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ fontSize: 11, color: '#555' }}>{f.profiles?.email || 'Unknown'}</span>
                      <span style={{ fontSize: 10, color: '#333' }}>{timeAgo(f.created_at)}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                      {[['Clarity', f.clarity_rating], ['Relevance', f.relevance_rating], ['Quiz', f.quiz_rating]].map(([l, r]) => (
                        <div key={l}>
                          <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', marginBottom: 4 }}>{l.toUpperCase()}</div>
                          <div style={{ fontSize: 13, color: '#47FFE8' }}>{stars(r)}</div>
                        </div>
                      ))}
                    </div>
                    {f.would_recommend && <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Recommend: <span style={{ color: '#fff' }}>{f.would_recommend}</span></div>}
                    {f.biggest_win && <div style={{ background: '#0a0a0a', borderRadius: 4, padding: '10px 12px', marginBottom: 8, fontSize: 13, color: '#bbb', lineHeight: 1.6 }}><span style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>BIGGEST WIN</span>{f.biggest_win}</div>}
                    {f.missing_topics && <div style={{ background: '#0a0a0a', borderRadius: 4, padding: '10px 12px', fontSize: 13, color: '#bbb', lineHeight: 1.6 }}><span style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>MISSING / CHANGE</span>{f.missing_topics}</div>}
                  </div>
                ))}
              </div>
            )}

            <div>
              <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>QUICK FEEDBACK ({dailyFb.length})</div>
              {dailyFb.length === 0 && <div style={{ fontSize: 13, color: '#333', padding: '24px 0' }}>No quick feedback yet.</div>}
              {dailyFb.map(f => (
                <div key={f.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: '16px 20px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: f.comment ? 8 : 0 }}>
                      <span style={{ fontSize: 11, color: '#555' }}>{f.profiles?.email || 'Unknown'}</span>
                      {f.rating && <span style={{ fontSize: 12, color: '#47FFE8' }}>{f.rating}/5</span>}
                      <span style={{ fontSize: 9, color: '#333', letterSpacing: '0.08em' }}>{f.feedback_type?.toUpperCase()}</span>
                    </div>
                    {f.comment && <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{f.comment}</div>}
                  </div>
                  <span style={{ fontSize: 10, color: '#333', flexShrink: 0 }}>{timeAgo(f.created_at)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bugs tab */}
        {tab === 'bugs' && (
          <div>
            <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>BUG REPORTS ({bugs.length})</div>
            {bugs.length === 0 && <div style={{ fontSize: 13, color: '#333', padding: '24px 0' }}>No bugs reported. 🎉</div>}
            {bugs.map(b => (
              <div key={b.id} style={{ background: '#111', border: '1px solid #FF417822', borderRadius: 6, padding: '16px 20px', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, background: '#FF417822', color: '#FF4778', padding: '2px 7px', borderRadius: 3, letterSpacing: '0.08em' }}>{b.page}</span>
                    <span style={{ fontSize: 11, color: '#555' }}>{b.profiles?.email || 'Unknown'}</span>
                  </div>
                  <span style={{ fontSize: 10, color: '#333' }}>{timeAgo(b.created_at)}</span>
                </div>
                <div style={{ fontSize: 13, color: '#bbb', lineHeight: 1.6 }}>{b.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div>
            <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>USERS ({users.length})</div>
            {users.map(u => (
              <div key={u.email} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: '16px 20px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 500, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {u.email}
                    {u.is_admin && <span style={{ fontSize: 9, background: '#47FFE822', color: '#47FFE8', border: '1px solid #47FFE844', borderRadius: 2, padding: '1px 5px', letterSpacing: '0.1em' }}>ADMIN</span>}
                  </div>
                  <div style={{ fontSize: 10, color: '#444', letterSpacing: '0.06em' }}>
                    Joined {new Date(u.signup_date).toLocaleDateString()} · Streak: {u.current_streak || 0} · Best: {u.longest_streak || 0}
                  </div>
                </div>
                <div style={{ fontSize: 10, color: '#333' }}>{u.last_active_date ? `Active ${u.last_active_date}` : 'Never active'}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  )
}
