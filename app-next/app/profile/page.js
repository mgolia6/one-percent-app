'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Shield, Footprints, Target, Layers, Zap, Grid3X3, Flame, Gem, User, ChevronLeft, Trophy, Plus } from 'lucide-react'

const CATEGORY_COLORS = {
  'AI': '#47FFE8',
  'Sales Craft': '#E8FF47',
  'Vocab & Language': '#FF8C47',
  'Mental Models': '#C847FF',
  'Philosophy': '#FF4778',
  'Neuroscience & Cognition': '#47C8FF',
  'Communication': '#FF8C00',
}

const ENTRIES = [
  { entry: '001', category: 'AI' },
  { entry: '002', category: 'Vocab & Language' },
  { entry: '003', category: 'Sales Craft' },
  { entry: '004', category: 'Mental Models' },
  { entry: '005', category: 'Philosophy' },
  { entry: '006', category: 'AI' },
  { entry: '007', category: 'Sales Craft' },
  { entry: '008', category: 'AI' },
  { entry: '009', category: 'Mental Models' },
  { entry: '010', category: 'Communication' },
  { entry: '011', category: 'Philosophy' },
  { entry: '012', category: 'Communication' },
  { entry: '013', category: 'Neuroscience & Cognition' },
  { entry: '014', category: 'Vocab & Language' },
  { entry: '015', category: 'Sales Craft' },
  { entry: '016', category: 'Mental Models' },
  { entry: '017', category: 'AI' },
  { entry: '018', category: 'Philosophy' },
  { entry: '019', category: 'Neuroscience & Cognition' },
  { entry: '020', category: 'Sales Craft' },
  { entry: '021', category: 'Communication' },
  { entry: '022', category: 'Sales Craft' },
  { entry: '023', category: 'AI' },
  { entry: '024', category: 'Vocab & Language' },
  { entry: '025', category: 'Neuroscience & Cognition' },
]

const BADGES = [
  { id: 'founder', label: "Founder's Club", desc: 'Beta tester from day one', icon: 'Shield', color: '#E8FF47', check: ({ profile }) => !!profile?.onboarding_complete, progress: null },
  { id: 'first_entry', label: 'First Step', desc: 'Complete your first entry', icon: 'Footprints', color: '#47FFE8', check: ({ completedCount }) => completedCount >= 1, progress: ({ completedCount }) => ({ value: Math.min(completedCount, 1), max: 1 }) },
  { id: 'perfect_score', label: 'Perfect Score', desc: 'Get 3/3 on a quiz', icon: 'Target', color: '#47FFE8', check: ({ completions }) => Object.values(completions).some(c => c.score === 3), progress: null },
  { id: 'ten_entries', label: 'Ten Deep', desc: 'Complete 10 entries', icon: 'Layers', color: '#C847FF', check: ({ completedCount }) => completedCount >= 10, progress: ({ completedCount }) => ({ value: Math.min(completedCount, 10), max: 10 }) },
  { id: 'twenty_five', label: 'Quarter Century', desc: 'Complete 25 entries', icon: 'Zap', color: '#C847FF', check: ({ completedCount }) => completedCount >= 25, progress: ({ completedCount }) => ({ value: Math.min(completedCount, 25), max: 25 }) },
  { id: 'all_cats', label: 'Full Spectrum', desc: 'Complete at least one entry in every category', icon: 'Grid3X3', color: '#FF8C47', check: ({ catBreakdown }) => Object.keys(catBreakdown).length >= 7, progress: ({ catBreakdown }) => ({ value: Object.keys(catBreakdown).length, max: 7 }) },
  { id: 'streak_3', label: '3-Day Streak', desc: 'Keep a 3-day streak', icon: 'Flame', color: '#FF8C47', check: ({ profile }) => (profile?.longest_streak || 0) >= 3, progress: ({ profile }) => ({ value: Math.min(profile?.longest_streak || 0, 3), max: 3 }) },
  { id: 'streak_7', label: 'Week Strong', desc: 'Keep a 7-day streak', icon: 'Flame', color: '#FF4778', check: ({ profile }) => (profile?.longest_streak || 0) >= 7, progress: ({ profile }) => ({ value: Math.min(profile?.longest_streak || 0, 7), max: 7 }) },
  { id: 'streak_30', label: 'Monthly', desc: 'Keep a 30-day streak', icon: 'Flame', color: '#FF4778', check: ({ profile }) => (profile?.longest_streak || 0) >= 30, progress: ({ profile }) => ({ value: Math.min(profile?.longest_streak || 0, 30), max: 30 }) },
  { id: 'perfect_week', label: 'Perfect Week', desc: '7 entries in 7 days', icon: 'Gem', color: '#47C8FF', check: ({ completedCount }) => completedCount >= 7, progress: null },
]

const ICONS = { Shield, Footprints, Target, Layers, Zap, Grid3X3, Flame, Gem }

// Design tokens
const BG = '#111'
const SURFACE = '#181818'
const BORDER = '#222'
const BORDER_FAINT = '#1a1a1a'
const T = { primary: '#ffffff', secondary: '#bbb', tertiary: '#777', faint: '#444' }

function BadgeRow({ badge, earned, progressData }) {
  const Icon = ICONS[badge.icon]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 0',
      borderBottom: `1px solid ${earned ? BORDER_FAINT : '#141414'}`,
      opacity: earned ? 1 : 0.4,
    }}>
      <div style={{ color: earned ? badge.color : '#555', flexShrink: 0, width: 20, display: 'flex', justifyContent: 'center' }}>
        {Icon && <Icon size={18} strokeWidth={1.5} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: earned ? T.primary : T.tertiary, marginBottom: 2 }}>{badge.label}</div>
        <div style={{ fontSize: 11, color: T.tertiary }}>{badge.desc}</div>
        {!earned && progressData && (
          <div style={{ marginTop: 8 }}>
            <div style={{ height: 2, background: '#1a1a1a', borderRadius: 1, marginBottom: 4 }}>
              <div style={{ height: '100%', width: `${(progressData.value / progressData.max) * 100}%`, background: '#333', borderRadius: 1 }} />
            </div>
            <div style={{ fontSize: 9, color: T.faint }}>{progressData.value}/{progressData.max}</div>
          </div>
        )}
      </div>
      {earned && (
        <div style={{ fontSize: 9, background: badge.color + '18', color: badge.color, borderRadius: 3, padding: '2px 7px', letterSpacing: '0.1em', fontWeight: 700, flexShrink: 0 }}>
          EARNED
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [completions, setCompletions] = useState({})
  const [rank, setRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [message, setMessage] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [tab, setTab] = useState('progress')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => { loadProfile() }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const [{ data }, { data: comps }, { data: allProfiles }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('completions').select('entry_number, score').eq('user_id', user.id),
      supabase.from('profiles').select('id, current_streak').order('current_streak', { ascending: false }),
    ])

    if (data) {
      setProfile(data)
      setFirstName(data.first_name || '')
      setLastName(data.last_name || '')
      setEmail(data.email || user.email || '')
      setAvatarUrl(data.avatar_url || null)
    }

    if (comps) {
      const map = {}
      comps.forEach(c => { map[c.entry_number] = c })
      setCompletions(map)
    }

    if (allProfiles && data) {
      const idx = allProfiles.findIndex(p => p.id === user.id)
      setRank(idx >= 0 ? idx + 1 : null)
    }

    setLoading(false)
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    setMessage(null)
    const { error } = await supabase.from('profiles').update({
      first_name: firstName.trim() || null,
      last_name: lastName.trim() || null,
    }).eq('id', profile.id)
    if (error) { setMessage({ type: 'error', text: 'Update failed — try again' }); setSaving(false); return }
    setMessage({ type: 'success', text: 'Saved' })
    setSaving(false)
    setTimeout(() => { loadProfile(); setMessage(null) }, 1500)
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return
    setUploadingAvatar(true)
    setMessage(null)
    const ext = file.name.split('.').pop()
    const path = `${profile.id}/avatar.${ext}`
    await supabase.storage.from('avatars').remove([path])
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type })
    if (uploadError) { setMessage({ type: 'error', text: 'Upload failed — try again' }); setUploadingAvatar(false); return }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    const urlWithBust = `${publicUrl}?t=${Date.now()}`
    await supabase.from('profiles').update({ avatar_url: urlWithBust }).eq('id', profile.id)
    setAvatarUrl(urlWithBust)
    setMessage({ type: 'success', text: 'Photo updated' })
    setUploadingAvatar(false)
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  // Derived
  const completedCount = Object.keys(completions).length
  const memberSince = profile?.signup_date ? new Date(profile.signup_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'
  const currentStreak = profile?.current_streak || 0
  const longestStreak = profile?.longest_streak || 0
  const catBreakdown = {}
  const catTotal = {}
  ENTRIES.forEach(e => {
    catTotal[e.category] = (catTotal[e.category] || 0) + 1
    if (completions[e.entry]) catBreakdown[e.category] = (catBreakdown[e.category] || 0) + 1
  })
  const badgeCtx = { profile, completions, completedCount, catBreakdown }
  const earnedBadges = BADGES.filter(b => b.check(badgeCtx))
  const lockedBadges = BADGES.filter(b => !b.check(badgeCtx))

  if (loading) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 13, color: T.tertiary, letterSpacing: '0.1em' }}>LOADING...</div>
    </div>
  )

  if (!profile) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ fontSize: 13, color: '#f87171', marginBottom: 20 }}>No profile found</div>
      <button onClick={() => router.push('/')} style={{ background: '#E8FF47', color: '#0A0A0A', border: 'none', borderRadius: 3, padding: '10px 20px', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', cursor: 'pointer' }}>BACK TO LIBRARY</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Inter',sans-serif", color: T.primary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '20px 20px 60px' }}>

        {/* Back */}
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.secondary, letterSpacing: '0.08em', padding: 0, marginBottom: 24 }}>
          <ChevronLeft size={13} strokeWidth={2} />
          LIBRARY
        </button>

        {/* Header — avatar/name left, rank right */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Avatar */}
            <label style={{ position: 'relative', flexShrink: 0, cursor: uploadingAvatar ? 'default' : 'pointer' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: SURFACE, border: `1px solid ${BORDER}`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <User size={20} strokeWidth={1} color={T.faint} />
                }
              </div>
              {/* + indicator */}
              {!uploadingAvatar && (
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderRadius: '50%', background: '#E8FF47', border: `2px solid ${BG}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={9} strokeWidth={3} color="#0A0A0A" />
                </div>
              )}
              {uploadingAvatar && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 14, height: 14, border: '2px solid #333', borderTopColor: '#E8FF47', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                </div>
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarUpload} disabled={uploadingAvatar} style={{ display: 'none' }} />
            </label>

            <div>
              <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.02em', color: T.primary, marginBottom: 3 }}>{profile.first_name || 'Beta Tester'}</div>
              <div style={{ fontSize: 11, color: T.tertiary, letterSpacing: '0.04em' }}>Since {memberSince}</div>
            </div>
          </div>

          {/* Rank */}
          {rank !== null && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              <Trophy size={15} strokeWidth={1.5} color='#E8FF47' />
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: T.primary, lineHeight: 1 }}>#{rank}</div>
              <div style={{ fontSize: 8, color: T.tertiary, letterSpacing: '0.12em', fontWeight: 600 }}>RANK</div>
            </div>
          )}
        </div>

        {/* Stats — single surface row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', background: SURFACE, borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 28, overflow: 'hidden' }}>
          {[
            { label: 'STREAK', value: `${currentStreak}d` },
            { label: 'LONGEST', value: `${longestStreak}d` },
            { label: 'DONE', value: completedCount },
            { label: 'BADGES', value: earnedBadges.length },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: '16px 0', textAlign: 'center', borderRight: i < 3 ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: T.primary, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 8, color: T.tertiary, letterSpacing: '0.14em', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs — PROGRESS | BADGES | PROFILE */}
        <div style={{ display: 'flex', marginBottom: 28, borderBottom: `1px solid ${BORDER_FAINT}` }}>
          {[
            { key: 'progress', label: 'PROGRESS' },
            { key: 'badges', label: 'BADGES' },
            { key: 'profile', label: 'PROFILE' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 20px 8px 0', fontSize: 11,
              fontWeight: tab === t.key ? 600 : 400,
              color: tab === t.key ? T.primary : T.tertiary,
              letterSpacing: '0.1em',
              borderBottom: tab === t.key ? `1px solid ${T.primary}` : '1px solid transparent',
              marginBottom: -1, fontFamily: "'Inter',sans-serif",
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* PROGRESS TAB */}
        {tab === 'progress' && (
          <div style={{ paddingBottom: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {Object.keys(catTotal).map(cat => {
                const color = CATEGORY_COLORS[cat] || '#fff'
                const done = catBreakdown[cat] || 0
                const total = catTotal[cat]
                const pct = Math.round((done / total) * 100)
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: done > 0 ? color : T.faint, flexShrink: 0 }} />
                        <div style={{ fontSize: 13, color: done > 0 ? T.secondary : T.faint, fontWeight: done > 0 ? 500 : 400 }}>{cat}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 10, color: done > 0 ? color : T.faint, fontWeight: 600, letterSpacing: '0.05em' }}>{pct}%</div>
                        <div style={{ fontSize: 11, color: T.faint }}>{done}/{total}</div>
                      </div>
                    </div>
                    <div style={{ height: 3, background: BORDER_FAINT, borderRadius: 2 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* BADGES TAB */}
        {tab === 'badges' && (
          <div style={{ paddingBottom: 40 }}>
            {earnedBadges.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 10, color: T.secondary, letterSpacing: '0.14em', fontWeight: 600, marginBottom: 4 }}>EARNED · {earnedBadges.length}</div>
                {earnedBadges.map(b => <BadgeRow key={b.id} badge={b} earned={true} progressData={null} />)}
              </div>
            )}
            {lockedBadges.length > 0 && (
              <div>
                <div style={{ fontSize: 10, color: T.tertiary, letterSpacing: '0.14em', fontWeight: 600, marginBottom: 4 }}>LOCKED · {lockedBadges.length}</div>
                {lockedBadges.map(b => {
                  const progressData = b.progress ? b.progress(badgeCtx) : null
                  return <BadgeRow key={b.id} badge={b} earned={false} progressData={progressData} />
                })}
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div style={{ paddingBottom: 40 }}>
            <div style={{ fontSize: 10, color: T.tertiary, letterSpacing: '0.14em', fontWeight: 600, marginBottom: 16 }}>ACCOUNT</div>
            {[
              { label: 'FIRST NAME', value: firstName, onChange: setFirstName, editable: true },
              { label: 'LAST NAME', value: lastName, onChange: setLastName, editable: true },
              { label: 'EMAIL', value: email, onChange: null, editable: false },
            ].map(field => (
              <div key={field.label} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9, color: T.tertiary, letterSpacing: '0.14em', marginBottom: 6, fontWeight: 600 }}>{field.label}</div>
                <input
                  type="text" value={field.value}
                  onChange={field.onChange ? e => field.onChange(e.target.value) : undefined}
                  readOnly={!field.editable}
                  style={{
                    width: '100%', background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${field.editable ? BORDER : BORDER_FAINT}`,
                    padding: '10px 0', fontSize: 14,
                    color: field.editable ? T.primary : T.faint,
                    fontFamily: "'Inter',sans-serif", outline: 'none',
                    cursor: field.editable ? 'text' : 'default',
                  }}
                />
                {!field.editable && <div style={{ fontSize: 10, color: T.faint, marginTop: 4 }}>Email cannot be changed</div>}
              </div>
            ))}

            {message && (
              <div style={{ fontSize: 12, color: message.type === 'success' ? '#4ade80' : '#f87171', textAlign: 'center', padding: '10px', background: message.type === 'success' ? '#4ade8011' : '#f8717111', borderRadius: 4, letterSpacing: '0.05em', marginBottom: 12 }}>
                {message.text}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
              <button onClick={handleSave} disabled={saving} style={{ width: '100%', background: '#E8FF47', color: '#0A0A0A', border: 'none', borderRadius: 4, padding: '13px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.5 : 1 }}>
                {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
              <button onClick={handleSignOut} disabled={signingOut} style={{ width: '100%', background: 'none', color: '#f87171', border: '1px solid #2a1a1e', borderRadius: 4, padding: '12px', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', cursor: signingOut ? 'default' : 'pointer', opacity: signingOut ? 0.5 : 1 }}>
                {signingOut ? 'SIGNING OUT...' : 'SIGN OUT'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
