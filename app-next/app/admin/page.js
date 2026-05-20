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
  const [resetting, setResetting] = useState(null)
  const [resetConfirm, setResetConfirm] = useState(null) // 'data' | 'hard' per email key: `${email}-data` | `${email}-hard`

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: prof, error: profError } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).maybeSingle()
      console.log('[admin] profile fetch:', prof, profError)
      if (profError || !prof?.is_admin) { router.push('/'); return }

      const [{ data: fb }, { data: br }, { data: us, error: usError }] = await Promise.all([
        supabase.from('feedback').select('*, profiles(email)').order('created_at', { ascending: false }),
        supabase.from('bug_reports').select('*, profiles(email)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, email, name, first_name, last_name, phone, signup_date, current_streak, longest_streak, last_active_date, onboarding_complete, is_admin').order('signup_date', { ascending: false }),
      ])

      console.log('[admin] users fetch:', us, usError)
      setFeedback(fb || [])
      setBugs(br || [])
      setUsers(us || [])
      setLoading(false)
    }
    init()
  }, [router])

  const refreshUsers = async () => {
    const { data: us } = await supabase.from('profiles').select('id, email, name, first_name, last_name, phone, signup_date, current_streak, longest_streak, last_active_date, onboarding_complete, is_admin').order('signup_date', { ascending: false })
    setUsers(us || [])
  }

  const [refreshing, setRefreshing] = useState(false)

  const refreshAll = async () => {
    setRefreshing(true)
    const [{ data: fb, error: e1 }, { data: br, error: e2 }, { data: us, error: e3 }] = await Promise.all([
      supabase.from('feedback').select('*, profiles(email)').order('created_at', { ascending: false }),
      supabase.from('bug_reports').select('*, profiles(email)').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, email, name, first_name, last_name, phone, signup_date, current_streak, longest_streak, last_active_date, onboarding_complete, is_admin').order('signup_date', { ascending: false }),
    ])
    if (e1) console.error('feedback fetch:', e1)
    if (e2) console.error('bug_reports fetch:', e2)
    if (e3) console.error('profiles fetch:', e3)
    setFeedback(fb || [])
    setBugs(br || [])
    setUsers(us || [])
    setRefreshing(false)
  }

  // Data reset: wipe completions + feedback + streak — keeps account + onboarding
  const resetUserData = async (userId, email) => {
    setResetting(`${email}-data`)
    await Promise.all([
      supabase.from('completions').delete().eq('user_id', userId),
      supabase.from('feedback').delete().eq('user_id', userId),
      supabase.from('profiles').update({
        current_streak: 0,
        longest_streak: 0,
        last_active_date: null,
      }).eq('id', userId),
    ])
    setResetting(null)
    setResetConfirm(null)
    await refreshUsers()
  }

  // Hard reset: everything above + onboarding_complete = false + name = null
  // User will go through onboarding again on next login
  const hardResetUser = async (userId, email) => {
    setResetting(`${email}-hard`)
    await Promise.all([
      supabase.from('completions').delete().eq('user_id', userId),
      supabase.from('feedback').delete().eq('user_id', userId),
      supabase.from('bug_reports').delete().eq('user_id', userId),
      supabase.from('profiles').update({
        current_streak: 0,
        longest_streak: 0,
        last_active_date: null,
        onboarding_complete: false,
        name: null,
      }).eq('id', userId),
    ])
    setResetting(null)
    setResetConfirm(null)
    await refreshUsers()
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 11, color: '#333', letterSpacing: '0.2em', fontFamily: "'Inter',sans-serif" }}>LOADING...</div>
    </div>
  )

  const stars = n => n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '—'
  const timeAgo = ts => {
    const diff = Date.now() - new Date(ts)
    const h = Math.floor(diff / 3600000)
    if (h < 1) return 'just now'
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  const postEntryFb = feedback.filter(f => f.feedback_type === 'post_entry')
  const weeklyFb = feedback.filter(f => f.feedback_type === 'weekly')
  const landingFb = feedback.filter(f => f.feedback_type === 'landing')
  const endOfBetaFb = feedback.filter(f => f.feedback_type === 'end_of_beta' || f.feedback_type === 'final')
  const entryNums = [...new Set(postEntryFb.map(f => f.entry_number))].sort()

  const avg = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '—'
  const bar = val => {
    if (!val || val === '—') return '—'
    const filled = Math.round(val)
    return '█'.repeat(filled) + '░'.repeat(5 - filled) + ' ' + val
  }

  const tabStyle = id => ({
    background: 'none', border: 'none',
    borderBottom: `2px solid ${tab === id ? '#47FFE8' : 'transparent'}`,
    padding: '10px 14px', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em',
    color: tab === id ? '#47FFE8' : '#555', cursor: 'pointer',
    fontFamily: "'Inter',sans-serif",
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Inter',sans-serif", color: '#fff' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 24px', borderBottom: '1px solid #141414', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', fontWeight: 600 }}>ONE PERCENT</div>
          <div style={{ fontSize: 9, color: '#47FFE8', letterSpacing: '0.15em', marginTop: 2 }}>ADMIN DASHBOARD</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={refreshAll} disabled={refreshing} style={{ background: 'none', border: '1px solid #47FFE822', borderRadius: 3, padding: '6px 12px', fontSize: 10, color: '#47FFE8', cursor: refreshing ? 'default' : 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", opacity: refreshing ? 0.5 : 1 }}>{refreshing ? '...' : '↻ REFRESH'}</button>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #222', borderRadius: 3, padding: '6px 12px', fontSize: 10, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>← LIBRARY</button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: 8, padding: '24px 0' }}>
          {[
            { label: 'USERS', value: users.length },
            { label: 'ENTRY FB', value: postEntryFb.length },
            { label: 'WEEKLY', value: weeklyFb.length },
            { label: 'END OF BETA', value: endOfBetaFb.length },
            { label: 'INSTANT', value: landingFb.length },
            { label: 'BUGS', value: bugs.length },
          ].map(s => (
            <div key={s.label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 4, padding: '14px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 8, color: '#444', letterSpacing: '0.1em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #141414', gap: 4, marginBottom: 24, overflowX: 'auto' }}>
          {[
            ['feedback', 'POST-LESSON'],
            ['weekly', 'WEEKLY'],
            ['endbeta', 'END OF BETA'],
            ['instant', 'INSTANT'],
            ['bugs', 'BUGS'],
            ['users', 'USERS'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={tabStyle(id)}>{label}</button>
          ))}
        </div>

        {/* Entry feedback tab */}
        {tab === 'feedback' && (
          <div>
            <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>
              POST-LESSON RATINGS — {postEntryFb.length} SUBMISSIONS ACROSS {entryNums.length} ENTRIES
            </div>
            {postEntryFb.length === 0 && <div style={{ fontSize: 13, color: '#333', padding: '24px 0' }}>No entry feedback yet.</div>}
            {entryNums.map(num => {
              const rows = postEntryFb.filter(f => f.entry_number === num)
              const comments = rows.map(r => r.comment).filter(Boolean)
              return (
                <div key={num} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: 20, marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: '#47FFE8', letterSpacing: '0.15em', marginBottom: 14, fontWeight: 600 }}>ENTRY {num} — {rows.length} RATING{rows.length !== 1 ? 'S' : ''}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: comments.length ? 16 : 0 }}>
                    {[
                      ['TOPIC', avg(rows.map(r => r.topic_rating).filter(Boolean))],
                      ['CONTENT', avg(rows.map(r => r.clarity_rating).filter(Boolean))],
                      ['QUIZ', avg(rows.map(r => r.quiz_rating).filter(Boolean))],
                    ].map(([l, v]) => (
                      <div key={l}>
                        <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', marginBottom: 4 }}>{l}</div>
                        <div style={{ fontSize: 13, color: '#47FFE8', fontFamily: 'monospace' }}>{bar(v)}</div>
                      </div>
                    ))}
                  </div>
                  {comments.length > 0 && (
                    <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 12 }}>
                      <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', marginBottom: 8 }}>COMMENTS</div>
                      {comments.map((c, i) => (
                        <div key={i} style={{ fontSize: 12, color: '#888', lineHeight: 1.7, marginBottom: i < comments.length - 1 ? 6 : 0, paddingLeft: 8, borderLeft: '2px solid #222' }}>{c}</div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Weekly tab */}
        {tab === 'weekly' && (
          <div>
            <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>WEEKLY CHECK-INS ({weeklyFb.length})</div>
            {weeklyFb.length === 0 && <div style={{ fontSize: 13, color: '#333', padding: '24px 0' }}>No weekly feedback yet.</div>}
            {weeklyFb.map(f => (
              <div key={f.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 11, color: '#555' }}>{f.profiles?.email || 'Unknown'}</span>
                  <span style={{ fontSize: 10, color: '#333' }}>{timeAgo(f.created_at)}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                  {[['Clarity', f.clarity_rating], ['Relevance', f.topic_rating], ['Quiz', f.quiz_rating]].map(([l, r]) => (
                    <div key={l}>
                      <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', marginBottom: 4 }}>{l.toUpperCase()}</div>
                      <div style={{ fontSize: 13, color: '#47FFE8' }}>{stars(r)}</div>
                    </div>
                  ))}
                </div>
                {f.would_recommend && <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Recommend: <span style={{ color: '#fff' }}>{f.would_recommend}</span></div>}
                {f.biggest_win && <div style={{ background: '#0a0a0a', borderRadius: 4, padding: '10px 12px', marginBottom: 8, fontSize: 12, color: '#bbb', lineHeight: 1.6 }}><span style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>BIGGEST WIN</span>{f.biggest_win}</div>}
                {f.missing_topics && <div style={{ background: '#0a0a0a', borderRadius: 4, padding: '10px 12px', fontSize: 12, color: '#bbb', lineHeight: 1.6 }}><span style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>MISSING / CHANGE</span>{f.missing_topics}</div>}
              </div>
            ))}
          </div>
        )}

        {/* End of beta tab */}
        {tab === 'endbeta' && (
          <div>
            <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>END OF BETA SURVEYS ({endOfBetaFb.length})</div>
            {endOfBetaFb.length === 0 && <div style={{ fontSize: 13, color: '#333', padding: '24px 0' }}>No end-of-beta feedback yet.</div>}
            {endOfBetaFb.map(f => (
              <div key={f.id} style={{ background: '#111', border: '1px solid #FF477822', borderRadius: 6, padding: 20, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 11, color: '#555' }}>{f.profiles?.email || 'Unknown'}</span>
                  <span style={{ fontSize: 10, color: '#333' }}>{timeAgo(f.created_at)}</span>
                </div>
                {f.overall_rating && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', marginBottom: 4 }}>OVERALL</div>
                    <div style={{ fontSize: 13, color: '#FF4778' }}>{stars(f.overall_rating)}</div>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                  {[['Clarity', f.clarity_rating], ['Relevance', f.topic_rating], ['Quiz', f.quiz_rating]].map(([l, r]) => r ? (
                    <div key={l}>
                      <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', marginBottom: 4 }}>{l.toUpperCase()}</div>
                      <div style={{ fontSize: 13, color: '#FF4778' }}>{stars(r)}</div>
                    </div>
                  ) : null)}
                </div>
                {f.would_recommend && <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Recommend: <span style={{ color: '#fff' }}>{f.would_recommend}</span></div>}
                {f.biggest_win && <div style={{ background: '#0a0a0a', borderRadius: 4, padding: '10px 12px', marginBottom: 8, fontSize: 12, color: '#bbb', lineHeight: 1.6 }}><span style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>BIGGEST WIN</span>{f.biggest_win}</div>}
                {f.missing_topics && <div style={{ background: '#0a0a0a', borderRadius: 4, padding: '10px 12px', marginBottom: 8, fontSize: 12, color: '#bbb', lineHeight: 1.6 }}><span style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>MISSING / CHANGE</span>{f.missing_topics}</div>}
                {f.comment && <div style={{ background: '#0a0a0a', borderRadius: 4, padding: '10px 12px', fontSize: 12, color: '#bbb', lineHeight: 1.6 }}><span style={{ fontSize: 9, color: '#444', letterSpacing: '0.1em', display: 'block', marginBottom: 4 }}>COMMENT</span>{f.comment}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Instant/landing feedback tab */}
        {tab === 'instant' && (
          <div>
            <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>INSTANT FEEDBACK ({landingFb.length})</div>
            {landingFb.length === 0 && <div style={{ fontSize: 13, color: '#333', padding: '24px 0' }}>No instant feedback yet.</div>}
            {landingFb.map(f => (
              <div key={f.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: '16px 20px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: f.comment ? 8 : 0 }}>
                    <span style={{ fontSize: 11, color: '#555' }}>{f.profiles?.email || 'Unknown'}</span>
                    {f.overall_rating && <span style={{ fontSize: 12, color: '#47FFE8' }}>{f.overall_rating}/5</span>}
                  </div>
                  {f.comment && <div style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>{f.comment}</div>}
                </div>
                <span style={{ fontSize: 10, color: '#333', flexShrink: 0 }}>{timeAgo(f.created_at)}</span>
              </div>
            ))}
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
              <div key={u.email} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: '16px 20px', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#fff', fontWeight: 500, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {u.first_name || u.last_name
                          ? <span>{u.first_name || ''}{u.first_name && u.last_name ? ' ' : ''}{u.last_name || ''}&nbsp;</span>
                          : u.name ? `${u.name} ` : ''
                        }<span style={{ color: '#555', fontWeight: 400 }}>{u.email}</span>
                      {u.is_admin && <span style={{ fontSize: 9, background: '#47FFE822', color: '#47FFE8', border: '1px solid #47FFE844', borderRadius: 2, padding: '1px 5px', letterSpacing: '0.1em' }}>ADMIN</span>}
                    </div>
                    <div style={{ fontSize: 10, color: '#444', letterSpacing: '0.06em' }}>
                      Joined {new Date(u.signup_date).toLocaleDateString()} · Streak: {u.current_streak || 0} · Best: {u.longest_streak || 0}
                      {' · '}
                      <span style={{ color: u.onboarding_complete ? '#555' : '#FF4778' }}>
                        {u.onboarding_complete ? 'Onboarded' : 'Not onboarded'}
                      </span>
                      {u.phone && <span style={{ color: '#444' }}>{' · '}{u.phone}</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: '#333', flexShrink: 0 }}>{u.last_active_date ? `Active ${u.last_active_date}` : 'Never active'}</div>
                </div>

                {/* Reset controls */}
                <div style={{ paddingTop: 12, borderTop: '1px solid #1a1a1a', display: 'flex', gap: 8, flexWrap: 'wrap' }}>

                  {/* Data reset confirm flow */}
                  {resetConfirm === `${u.email}-data` ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                      <span style={{ fontSize: 11, color: '#888', flex: 1 }}>Delete completions + feedback. Keeps account + onboarding.</span>
                      <button
                        onClick={() => resetUserData(u.id, u.email)}
                        disabled={resetting === `${u.email}-data`}
                        style={{ padding: '6px 14px', background: '#FF417822', border: '1px solid #FF417844', borderRadius: 3, fontSize: 10, color: '#FF4778', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", opacity: resetting === `${u.email}-data` ? 0.5 : 1 }}>
                        {resetting === `${u.email}-data` ? 'RESETTING...' : 'CONFIRM'}
                      </button>
                      <button onClick={() => setResetConfirm(null)} style={{ padding: '6px 12px', background: 'none', border: '1px solid #222', borderRadius: 3, fontSize: 10, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>CANCEL</button>
                    </div>
                  ) : resetConfirm === `${u.email}-hard` ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                      <span style={{ fontSize: 11, color: '#FF4778', flex: 1 }}>Wipe everything. User re-experiences onboarding on next login.</span>
                      <button
                        onClick={() => hardResetUser(u.id, u.email)}
                        disabled={resetting === `${u.email}-hard`}
                        style={{ padding: '6px 14px', background: '#FF417844', border: '1px solid #FF4778', borderRadius: 3, fontSize: 10, color: '#FF4778', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif", fontWeight: 600, opacity: resetting === `${u.email}-hard` ? 0.5 : 1 }}>
                        {resetting === `${u.email}-hard` ? 'RESETTING...' : 'CONFIRM HARD RESET'}
                      </button>
                      <button onClick={() => setResetConfirm(null)} style={{ padding: '6px 12px', background: 'none', border: '1px solid #222', borderRadius: 3, fontSize: 10, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>CANCEL</button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setResetConfirm(`${u.email}-data`)}
                        style={{ padding: '6px 14px', background: 'none', border: '1px solid #222', borderRadius: 3, fontSize: 10, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>
                        RESET DATA
                      </button>
                      <button
                        onClick={() => setResetConfirm(`${u.email}-hard`)}
                        style={{ padding: '6px 14px', background: 'none', border: '1px solid #FF417844', borderRadius: 3, fontSize: 10, color: '#FF4778', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>
                        HARD RESET
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  )
}
