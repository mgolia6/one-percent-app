'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUnlockedCount } from '@/lib/unlock'

const TOTAL_ENTRIES = 16 // update as entries are added

const CATEGORY_COLORS = {
  'AI': '#47FFE8',
  'Sales Craft': '#E8FF47',
  'Vocab & Language': '#FF8C47',
  'Mental Models': '#C847FF',
  'Philosophy': '#FF4778',
  'Neuroscience & Cognition': '#47C8FF',
  'Communication': '#FF8C00',
}

// Entry manifest — lightweight, no full content loaded here
const ENTRIES = [
  { entry: '001', editionId: 'AI.1.1', concept: 'Context Window', category: 'AI' },
  { entry: '002', editionId: 'VL.1', concept: 'Framing Effect', category: 'Vocab & Language' },
  { entry: '003', editionId: 'SC.1.1', concept: 'Discovery Questions', category: 'Sales Craft' },
  { entry: '004', editionId: 'MM.1', concept: 'Inversion', category: 'Mental Models' },
  { entry: '005', editionId: 'PH.1', concept: 'Premeditatio Malorum', category: 'Philosophy' },
  { entry: '006', editionId: 'AI.1.2', concept: 'Prompt Sensitivity', category: 'AI' },
  { entry: '007', editionId: 'SC.1.2', concept: 'Talk/Listen Ratio', category: 'Sales Craft' },
  { entry: '008', editionId: 'VL.2', concept: 'Euphemism Treadmill', category: 'Vocab & Language' },
  { entry: '009', editionId: 'MM.2', concept: 'Second-Order Thinking', category: 'Mental Models' },
  { entry: '010', editionId: 'AI.2.1', concept: 'Chain-of-Thought Prompting', category: 'AI' },
  { entry: '011', editionId: 'SC.2.1', concept: 'Anchoring in Negotiation', category: 'Sales Craft' },
  { entry: '012', editionId: 'AI.2.2', concept: 'Hallucination / Confabulation', category: 'AI' },
  { entry: '013', editionId: 'PH.2', concept: 'Dichotomy of Control', category: 'Philosophy' },
  { entry: '014', editionId: 'NC.1', concept: 'Neuroplasticity', category: 'Neuroscience & Cognition' },
  { entry: '015', editionId: 'SC.2.2', concept: 'Tactical Empathy', category: 'Sales Craft' },
  { entry: '016', editionId: 'CM.1', concept: 'Active Listening', category: 'Communication' },
]

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [completions, setCompletions] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user)

      // Get or create user profile
      let { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (!prof) {
        const { data: newProf } = await supabase
          .from('profiles')
          .insert({ id: session.user.id, email: session.user.email, signup_date: new Date().toISOString() })
          .select()
          .single()
        prof = newProf
      }
      setProfile(prof)

      // Get completions
      const { data: comps } = await supabase
        .from('completions')
        .select('entry_number, score, time_to_quiz')
        .eq('user_id', session.user.id)

      const compMap = {}
      if (comps) comps.forEach(c => { compMap[c.entry_number] = c })
      setCompletions(compMap)
      setLoading(false)
    }
    init()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 11, color: '#333', letterSpacing: '0.2em', fontFamily: "'Inter',sans-serif" }}>LOADING...</div>
    </div>
  )

  const unlockedCount = profile ? getUnlockedCount(profile.signup_date) : 0
  const completedCount = Object.keys(completions).length
  const totalScore = Object.values(completions).reduce((a, c) => a + (c.score || 0), 0)
  const avgScore = completedCount > 0 ? (totalScore / completedCount).toFixed(1) : '—'

  // Calculate streak from completions
  const streak = profile?.current_streak || 0

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', fontFamily: "'Inter',sans-serif", color: '#fff' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #141414', maxWidth: 720, margin: '0 auto' }}>
        <span style={{ fontSize: 11, letterSpacing: '0.2em', fontWeight: 600 }}>ONE PERCENT</span>
        <button onClick={handleSignOut} style={{ background: 'none', border: '1px solid #222', borderRadius: 3, padding: '6px 12px', fontSize: 10, color: '#555', cursor: 'pointer', letterSpacing: '0.08em', fontFamily: "'Inter',sans-serif" }}>
          SIGN OUT
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 32 }}>
          {[
            { label: 'STREAK', value: streak > 0 ? `🔥 ${streak}` : '—' },
            { label: 'COMPLETED', value: `${completedCount}/${unlockedCount}` },
            { label: 'AVG SCORE', value: avgScore !== '—' ? `${avgScore}/3` : '—' },
            { label: 'UNLOCKED', value: `${unlockedCount}` },
          ].map(s => (
            <div key={s.label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 4, padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: '#fff', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 9, color: '#444', letterSpacing: '0.12em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Entry list */}
        <div style={{ fontSize: 10, color: '#333', letterSpacing: '0.15em', marginBottom: 16, fontWeight: 600 }}>YOUR LIBRARY</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ENTRIES.map((e, idx) => {
            const entryNum = idx + 1
            const unlocked = entryNum <= unlockedCount
            const completed = !!completions[e.entry]
            const accent = CATEGORY_COLORS[e.category] || '#fff'
            const comp = completions[e.entry]

            return (
              <div
                key={e.entry}
                onClick={() => unlocked && router.push(`/entry/${e.entry}`)}
                style={{
                  background: '#111', border: `1px solid ${unlocked ? '#1a1a1a' : '#111'}`,
                  borderRadius: 4, padding: '16px 18px', cursor: unlocked ? 'pointer' : 'default',
                  opacity: unlocked ? 1 : 0.35, transition: 'border-color 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: completed ? accent : '#333', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 14, color: unlocked ? '#fff' : '#555', fontWeight: 500, marginBottom: 2 }}>{e.concept}</div>
                    <div style={{ fontSize: 10, color: '#444', letterSpacing: '0.08em' }}>{e.editionId} · {e.category}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  {completed && (
                    <span style={{ fontSize: 11, color: accent, fontWeight: 600 }}>{comp.score}/3</span>
                  )}
                  {!unlocked && (
                    <span style={{ fontSize: 10, color: '#333' }}>🔒</span>
                  )}
                  {unlocked && !completed && (
                    <span style={{ fontSize: 10, color: accent, letterSpacing: '0.08em' }}>START →</span>
                  )}
                  {completed && (
                    <span style={{ fontSize: 10, color: '#444', letterSpacing: '0.08em' }}>REVIEW →</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
